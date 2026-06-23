(function initTeamsHelperAccountBootstrap(global) {
  "use strict";

  const DEFAULT_USERS_ME_URL = "https://teams.live.com/api/mt/beta/users/me/?skypeTeamsInfo=true&forceRefresh=true&ephemeralMeProfile=false&ggEnabled=true";
  const MSA_CONSUMER_TENANT_ID = "9188040d-6c67-4c5b-b112-36a304b66dad";
  const STORE_KEY = "th_browser_profile_account_state";

  function text(value) { return String(value == null ? "" : value); }
  function lower(value) { return text(value).trim().toLowerCase(); }
  function normalizeEmail(value) { return lower(value); }
  function safeObject(value) { return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
  function profileFromPropertyArray(value) {
    if (!Array.isArray(value)) return null;
    const mapped = {};
    for (const item of value) {
      if (!item || typeof item !== "object") continue;
      const key = text(item.key || item.name || item.propertyName || item.id).trim();
      if (!key) continue;
      const itemValue = item.value != null ? item.value : item.propertyValue != null ? item.propertyValue : item.data;
      if (itemValue != null && typeof itemValue !== "object") mapped[key] = itemValue;
    }
    return Object.keys(mapped).length ? mapped : null;
  }
  function profileFromUsersMePayload(payload, depth = 0) {
    if (!payload || depth > 5) return null;
    if (Array.isArray(payload)) {
      const mapped = profileFromPropertyArray(payload);
      if (mapped) {
        const mappedProfile = profileFromUsersMePayload(mapped, depth + 1);
        if (mappedProfile) return mappedProfile;
      }
      for (const item of payload) {
        const found = profileFromUsersMePayload(item, depth + 1);
        if (found) return found;
      }
      return null;
    }
    const root = safeObject(payload);
    if (root.email || root.mail || root.userPrincipalName || root.upn || root.preferred_username || root.mri || root.userMri || root.cid || root.objectId || root.oid || root.aadObjectId || root.tenantId || root.tid) return root;
    for (const key of ["value", "profile", "me", "user", "data", "body", "properties", "userDetails", "account", "result"]) {
      const found = profileFromUsersMePayload(root[key], depth + 1);
      if (found) return found;
    }
    return null;
  }
  function parseUsersMePayload(value) {
    if (!value) return null;
    if (typeof value === "string") {
      try { return JSON.parse(value); } catch { return null; }
    }
    return typeof value === "object" ? value : null;
  }

  function cleanBearerLikeToken(value) {
    let raw = text(value).trim();
    if (!raw) return "";
    try { raw = decodeURIComponent(raw); } catch {}
    raw = raw.replace(/(?:&|%26)Origin(?:=|%3D).*$/i, "");
    raw = raw.replace(/^(?:Bearer=|Bearer%3D)/i, "");
    raw = raw.replace(/^Bearer\s+/i, "");
    raw = raw.replace(/[;\r\n].*$/g, "").trim();
    return raw;
  }
  function base64UrlDecodeJsonPart(value) {
    try {
      const raw = text(value).trim();
      if (!raw) return null;
      const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized + (normalized.length % 4 ? "=".repeat(4 - normalized.length % 4) : "");
      const binary = typeof atob === "function" ? atob(padded) : "";
      if (!binary) return null;
      let decoded = "";
      for (let index = 0; index < binary.length; index += 1) decoded += String.fromCharCode(binary.charCodeAt(index));
      try { decoded = decodeURIComponent(escape(decoded)); } catch {}
      return JSON.parse(decoded);
    } catch { return null; }
  }
  function profileFromSkypeToken(value) {
    const token = cleanBearerLikeToken(value);
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = base64UrlDecodeJsonPart(parts[1]);
    if (!payload || typeof payload !== "object") return null;
    const skypeid = text(payload.skypeid || payload.skypeId || (payload.cid ? "live:.cid." + payload.cid : "")).trim();
    const cid = text(payload.cid || "").trim();
    const mri = /^8:/i.test(skypeid) ? skypeid : (skypeid ? "8:" + skypeid : (cid ? "8:live:.cid." + cid.toLowerCase() : ""));
    if (!mri && !cid) return null;
    return {
      email: "",
      userPrincipalName: skypeid || (cid ? "live:.cid." + cid.toLowerCase() : ""),
      mri,
      cid,
      objectId: cid ? "00000000-0000-0000-" + cid.slice(0, 4).toLowerCase() + "-" + cid.slice(4).toLowerCase() : "",
      displayName: skypeid || mri || cid,
      type: "TFLUser",
      consumerProfileType: "TFLAndSkypeUser",
      source: "skypetoken-fallback"
    };
  }

  function emailFromProfile(profile) {
    const value = safeObject(profile);
    const emailsInfo = Array.isArray(value.emailsInfo) ? value.emailsInfo : [];
    const emailInfo = emailsInfo.find((item) => item && item.address) || null;
    return normalizeEmail(value.email || value.mail || value.userPrincipalName || value.upn || value.uniqueName || value.unique_name || emailInfo && emailInfo.address || "");
  }
  function mriFromProfile(profile) {
    const value = safeObject(profile);
    const upn = text(value.userPrincipalName).trim();
    if (value.mri || value.userMri) return text(value.mri || value.userMri).trim();
    const objectId = text(value.objectId || value.oid || value.aadObjectId || value.id || "").trim();
    const tenantId = lower(value.tenantId || value.tid || value.aadTenantId || "");
    const rawType = lower(value.type || value.consumerProfileType || value.accountType || "");
    if (tenantId !== MSA_CONSUMER_TENANT_ID && objectId && (tenantId || /aad|org|enterprise|business|work|school/.test(rawType))) return "8:orgid:" + objectId;
    if (/^orgid:/i.test(upn) && tenantId !== MSA_CONSUMER_TENANT_ID) return "8:" + upn;
    if (/^live:/i.test(upn)) return "8:" + upn;
    if (value.cid) return "8:live:.cid." + text(value.cid).trim().toLowerCase();
    return "";
  }
  function typeFromProfile(profile, fallback) {
    const value = safeObject(profile);
    const rawType = lower(value.type || value.consumerProfileType || value.accountType || "");
    const tenantId = lower(value.tenantId || value.tid || value.aadTenantId || "");
    const homeAccountId = lower(value.homeAccountId || "");
    const homeTenantOffset = homeAccountId.lastIndexOf(".");
    const homeTenantCandidate = homeTenantOffset > 0 ? homeAccountId.slice(homeTenantOffset + 1) : "";
    const homeTenant = /^[0-9a-f-]{36}$/i.test(homeTenantCandidate) ? homeTenantCandidate : "";
    const accountEmail = emailFromProfile(value);
    const principal = lower(value.userPrincipalName || value.upn || value.preferred_username || "");
    const mri = lower(value.mri || value.userMri || value.skypeId || "");

    if (tenantId || homeTenant) return tenantId === MSA_CONSUMER_TENANT_ID || homeTenant === MSA_CONSUMER_TENANT_ID ? "personal" : "business";
    if (/@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(accountEmail) || /#ext#@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(principal) || /(?:^|:)orgid:/i.test(mri) || /^orgid:/i.test(principal)) return "business";
    if (value.cid || /(?:^|:)live:/i.test(mri) || /^live:/i.test(principal)) return "personal";
    if (/aad|org|enterprise|business|work|school|workplace/.test(rawType)) return "business";
    if (/(?:^|[-_\s])(tfl|skype|consumer|personal|msa|teams4life)(?:$|[-_\s])/.test(rawType)) return "personal";
    if (/@(?:outlook|hotmail|live|msn)\.[^@]+$/i.test(accountEmail)) return "personal";

    // A prior saved label may have been derived from the page host. Do not use
    // it as identity evidence when the live profile has no tenant/CID/MRI signal.
    return "unknown";
  }
  function displayNameFromProfile(profile) {
    const value = safeObject(profile);
    return text(value.displayName || value.display_name || value.name || value.skypeDisplayName || [value.givenName || value.skypeGivenName, value.surname || value.skypeSurname].filter(Boolean).join(" ")).trim();
  }
  function makeDefaultAccountKey(type, email, mri, id) {
    const baseType = lower(type || "unknown") || "unknown";
    const identity = normalizeEmail(email) || text(mri || id || "browser-users-me").trim().toLowerCase();
    return baseType + ":" + identity;
  }
  function profileToRuntimeState(payload, currentState, options) {
    const parsed = parseUsersMePayload(payload);
    const profile = profileFromUsersMePayload(parsed);
    if (!profile) return { ok: false, reason: "missing-users-me-profile" };
    const state = safeObject(currentState);
    const opts = safeObject(options);
    const email = emailFromProfile(profile);
    const mri = mriFromProfile(profile);
    let type = typeFromProfile(profile, state.targetAccountType || state.teamsType || "");
    const authoritativeType = lower(opts.authoritativeAccountType || opts.accountType || "");
    const hasProfileIdentity = !!(email || mri || profile.cid || profile.objectId || profile.oid || profile.aadObjectId || profile.tenantId || profile.tid);
    if (type === "unknown" && hasProfileIdentity && (authoritativeType === "personal" || authoritativeType === "business")) type = authoritativeType;
    if (type !== "personal" && type !== "business") return { ok: false, reason: "unresolved-users-me-account-type" };
    const tenantId = text(profile.tenantId || profile.tid || profile.aadTenantId || state.accountTid || state.oauthResolvedTid || "").trim().toLowerCase();
    const objectId = text(profile.objectId || profile.oid || profile.aadObjectId || profile.id || state.accountOid || state.oauthResolvedOid || "").trim().toLowerCase();
    const accountId = email || mri || text(profile.cid || objectId || "").trim();
    if (!accountId) return { ok: false, reason: "missing-users-me-account-id" };
    const identity = { accountTid: tenantId, accountOid: objectId, tenantId, objectId };
    const key = typeof opts.makeAccountKey === "function" ? opts.makeAccountKey(type, email, mri || profile.cid || objectId || "browser-users-me", identity) : (type === "business" && tenantId && objectId ? `business:${tenantId}:${objectId}` : makeDefaultAccountKey(type, email, mri, profile.cid || objectId));
    const defaultPageUrl = type === "business" ? "https://teams.cloud.microsoft/" : "https://teams.live.com/v2/";
    const defaultBaseUrl = type === "business" ? "https://teams.cloud.microsoft/ups/noam" : "https://teams.live.com/ups/global";
    const currentPageUrl = text(state.pageUrl || "");
    const currentBaseUrl = text(state.baseUrl || "");
    const pageUrlMatchesType = type === "personal" ? /^https:\/\/(?:[^/]+\.)?teams\.live\.com\//i.test(currentPageUrl) : /^https:\/\/(?:[^/]+\.)?(?:teams\.microsoft\.com|teams\.cloud\.microsoft)\//i.test(currentPageUrl);
    const baseUrlMatchesType = type === "personal" ? /^https:\/\/(?:[^/]+\.)?teams\.live\.com\/ups\//i.test(currentBaseUrl) : /^https:\/\/(?:[^/]+\.)?(?:teams\.microsoft\.com|teams\.cloud\.microsoft)\/ups\//i.test(currentBaseUrl);
    const pageUrl = pageUrlMatchesType ? currentPageUrl : defaultPageUrl;
    const baseUrl = baseUrlMatchesType ? currentBaseUrl : defaultBaseUrl;
    const contextMismatch = !!currentPageUrl && !pageUrlMatchesType || !!currentBaseUrl && !baseUrlMatchesType;
    const tabIdNumber = Number(state.tabId);
    const tabId = contextMismatch ? -1 : Number.isFinite(tabIdNumber) ? tabIdNumber : -1;
    const runtimeState = Object.assign({}, state, {
      tabId,
      pageUrl,
      baseUrl,
      accountKey: key,
      selectedAccountKey: key,
      targetAccountEmail: email,
      teamsAccountEmail: email,
      email,
      targetAccountType: type,
      teamsType: type,
      accountTid: tenantId,
      oauthResolvedTid: tenantId,
      accountOid: objectId,
      oauthResolvedOid: objectId,
      userMri: mri || (contextMismatch ? "" : text(state.userMri || "")),
      endpointId: contextMismatch ? "" : text(state.endpointId || profile.endpointId || ""),
      cid: text(profile.cid || ""),
      objectId: text(profile.objectId || ""),
      displayName: displayNameFromProfile(profile),
      reason: text(state.reason || "users-me-browser-profile")
    });
    return { ok: true, profile, state: runtimeState, email, mri, type, key, displayName: runtimeState.displayName };
  }
  async function fetchUsersMeAndSetAccount(options) {
    const opts = safeObject(options);
    const url = text(opts.usersMeUrl || DEFAULT_USERS_ME_URL);
    const requestInit = {
      method: "GET",
      headers: opts.headers || {},
      credentials: opts.credentials || "include",
      cache: "no-store"
    };
    let response;
    if (!opts.fetchImpl && global.TeamsHelperPacketTrace && typeof global.TeamsHelperPacketTrace.fetch === "function") {
      response = await global.TeamsHelperPacketTrace.fetch(url, requestInit, { context: "service-worker", transport: "fetch", caller: "TeamsHelperAccountBootstrap.fetchUsersMeAndSetAccount", label: "teams-users-me-account-bootstrap", reason: text(opts.reason || "users-me-browser-profile"), accountKey: text(opts.state && (opts.state.accountKey || opts.state.selectedAccountKey) || ""), targetEmail: text(opts.state && (opts.state.targetAccountEmail || opts.state.teamsAccountEmail) || "") });
    } else {
      const fetchImpl = opts.fetchImpl || global.fetch;
      if (typeof fetchImpl !== "function") throw new Error("fetch is unavailable");
      response = await fetchImpl(url, requestInit);
    }
    const responseText = await response.text();
    let json = null;
    try { json = responseText ? JSON.parse(responseText) : null; } catch {}
    const promoted = profileToRuntimeState(json || responseText, opts.state || {}, opts);
    if (!promoted.ok) return Object.assign({ ok: false, status: response.status, responseText, json }, promoted);
    const profileStore = {
      at: typeof opts.now === "function" ? opts.now() : Date.now(),
      reason: text(opts.reason || "users-me-browser-profile"),
      key: promoted.key,
      email: promoted.email,
      type: promoted.type,
      tabId: Number(promoted.state.tabId),
      pageUrl: text(promoted.state.pageUrl || "https://teams.live.com/v2/"),
      state: {
        accountKey: promoted.key,
        selectedAccountKey: promoted.key,
        targetAccountEmail: promoted.email,
        teamsAccountEmail: promoted.email,
        targetAccountType: promoted.type,
        teamsType: promoted.type,
        accountTid: text(promoted.state.accountTid || ""),
        oauthResolvedTid: text(promoted.state.oauthResolvedTid || promoted.state.accountTid || ""),
        accountOid: text(promoted.state.accountOid || ""),
        oauthResolvedOid: text(promoted.state.oauthResolvedOid || promoted.state.accountOid || ""),
        userMri: promoted.mri || "",
        endpointId: text(promoted.state.endpointId || ""),
        tabId: Number(promoted.state.tabId),
        pageUrl: text(promoted.state.pageUrl || "https://teams.live.com/v2/"),
        baseUrl: text(promoted.state.baseUrl || "https://teams.live.com/ups/global"),
        displayName: promoted.displayName || "",
        reason: text(opts.reason || "users-me-browser-profile")
      }
    };
    if (opts.storage && typeof opts.storage.set === "function") await opts.storage.set({ [STORE_KEY]: profileStore });
    if (typeof opts.onPromote === "function") await opts.onPromote(promoted.state, profileStore, { response, responseText, json });
    return { ok: response.ok, status: response.status, responseText, json, promoted: true, state: promoted.state, profileStore };
  }

  global.TeamsHelperAccountBootstrap = Object.assign({}, global.TeamsHelperAccountBootstrap || {}, {
    DEFAULT_USERS_ME_URL,
    STORE_KEY,
    parseUsersMePayload,
    profileFromUsersMePayload,
    profileFromSkypeToken,
    cleanBearerLikeToken,
    profileToRuntimeState,
    fetchUsersMeAndSetAccount
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
