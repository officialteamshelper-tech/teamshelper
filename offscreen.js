/* BEGIN merged source: src/shared/app_constants.js */
(function initialiseTeamsHelperSharedConstants(global) {
  "use strict";

  const freeze = Object.freeze;
  const teamsOrigins = freeze({
    personal: "https://teams.live.com",
    business: "https://teams.cloud.microsoft",
    legacyBusiness: "https://teams.microsoft.com",
    cloud: "https://teams.cloud.microsoft",
    account: "https://account.live.com",
    msaLogin: "https://login.live.com",
    aadLogin: "https://login.microsoftonline.com"
  });

  const teamsDefaults = freeze({
    personalPresenceBaseUrl: teamsOrigins.personal + "/ups/global",
    businessPresenceBaseUrl: teamsOrigins.business + "/ups/noam",
    cloudPresenceBaseUrl: teamsOrigins.cloud + "/ups/noam",
    personalPageUrl: teamsOrigins.personal + "/v2/",
    businessPageUrl: teamsOrigins.business + "/",
    cloudPageUrl: teamsOrigins.cloud + "/",
    workerReferrer: teamsOrigins.personal + "/v2/worker/precompiled-web-worker-1e7f103975435971.js"
  });

  const teamsContentMatches = freeze([
    teamsOrigins.personal + "/*",
    "https://*.teams.live.com/*",
    teamsOrigins.business + "/*",
    "https://*.teams.cloud.microsoft/*",
    teamsOrigins.legacyBusiness + "/*",
    "https://*.teams.microsoft.com/*"
  ]);

  const authWarmupUrls = freeze([
    teamsOrigins.personal + "/",
    teamsOrigins.business + "/",
    teamsOrigins.legacyBusiness + "/",
    teamsOrigins.msaLogin + "/",
    teamsOrigins.aadLogin + "/"
  ]);

  const cookieProbeUrls = freeze([
    teamsOrigins.personal + "/",
    teamsOrigins.business + "/",
    teamsOrigins.legacyBusiness + "/",
    teamsOrigins.msaLogin + "/",
    teamsOrigins.account + "/",
    teamsOrigins.aadLogin + "/"
  ]);

  const apiDefaults = freeze({
    apiBaseUrl: "https://teams-presence-keeper-api.officialteamshelper.workers.dev",
    workerAuthStartPath: "/auth/start",
    minRefreshMinutes: 60,
    betaLabel: "Public Beta",
    plans: freeze({ monthly: "monthly", annual: "annual" }),
    allowedExtensionId: "plolochjncialgjdmnlgendcoeglndla"
  });

  const storageKeys = freeze({
    presenceCapture: "th_pc",
    session: "th_ks",
    account: "th_ka",
    scheduleAlarm: "th_ka_schedule",
    scheduleHeartbeatAlarm: "th_schedule_heartbeat",
    cloudPollAlarm: "th_cloud_poll",
    cloudPollSettings: "th_cloud_poll_settings",
    presenceForceAlarm: "th_presence_force_queue",
    scheduleAfkReassertAlarm: "th_schedule_afk_reassert",
    scheduleDurableState: "th_schedule_runtime_durable",
    presenceForceQueue: "th_presence_force_queue_state",
    presenceCaptureDurable: "th_presence_capture_durable",
    scheduleStatusLog: "th_schedule_status_call_logs",
    packetExecutorState: "th_closed_tab_packet_executor",
    accountStatusState: "th_account_status_snapshot",
    autoSessionCreationSetting: "th_auto_session_creation_setting",
    headlessTeamsAuthCache: "th_headless_teams_auth_cache",
    tablessSessionMaintainer: "th_tabless_session_maintainer",
    tablessSessionMaintainerLegacy: "th_tabless_session_maintainer_3m_v226",
    tablessSessionMaintainerState: "th_tabless_session_maintainer_state",
    cookieSessionRemint: "th_cookie_session_remint_tick",
    cookieSessionRemintState: "th_cookie_session_remint_state"
  });

  const dnrRuleIds = freeze({
    noSeen: freeze([2173401, 2173402, 2173403]),
    packetCookie: 2173470,
    packetContext: 2173471,
    packetAuthHeader: 2173472,
    headlessTeamsContext: 2173482,
    headlessTeamsTokenContext: 2173483,
    headlessTeamsAuthorizeContext: 2173484,
    skypeTrapToken: 309216
  });

  const durationsMs = freeze({
    second: 1000,
    minute: 60 * 1000,
    pageForceBackoff: 30 * 1000,
    offscreenPacketTimeout: 15 * 1000,
    autoSigninBootstrapTimeout: 28 * 1000,
    offscreenSessionHydrationTimeout: 45 * 1000,
    autoSessionTabReadyTimeout: 70 * 1000,
    autoSessionTabRetry: 1200,
    autoSessionTabCloseDelay: 1800,
    nativeWebCaptureMaxAge: 4 * 60 * 60 * 1000,
    headlessTeamsAuthTimeout: 30 * 1000,
    tablessHeadlessRefreshCooldown: 3 * 60 * 1000,
    tablessHeadlessRefreshInterval: 3 * 60 * 1000,
    tablessForceCaptureStale: 4 * 60 * 1000,
    packetExecutorReadyTimeout: 30 * 1000,
    packetExecutorRetryDelay: 900,
    tablessMaintainInterval: 3 * 60 * 1000,
    tablessMaintainEarly: 15 * 1000,
    tablessMinAttemptGap: 25 * 1000,
    tablessFailureRetry: 30 * 1000,
    tablessStartupDelay: 3500,
    tablessCookieCache: 20 * 1000,
    cookieRemintTick: 10 * 1000
  });

  const client = freeze({
    version: "1415/26050100545",
    fallbackVersion: "1415/26041619448",
    caller: "presence-sync-strategy:TrouterStateChanged",
    userAgent: "Teams-V2-Web",
    type: "cdlworker",
    consumerType: "teams4life",
    authzType: "ExplicitLogin",
    behaviorOverride: "redirectAs404",
    msaConsumerTenantId: "9188040d-6c67-4c5b-b112-36a304b66dad"
  });

  function text(value) {
    return String(value == null ? "" : value);
  }

  function trimTrailingSlashes(value) {
    return text(value).replace(/\/+$/, "");
  }

  function normalizeTeamsType(type) {
    const value = text(type).toLowerCase();
    if (/personal|live|consumer|teams4life/.test(value)) return "personal";
    if (/business|work|school|enterprise|microsoft\.com|cloud\.microsoft/.test(value)) return "business";
    return "unknown";
  }

  function presenceBaseUrlForType(type) {
    const normalized = normalizeTeamsType(type);
    if (normalized === "personal") return teamsDefaults.personalPresenceBaseUrl;
    if (normalized === "business") return teamsDefaults.businessPresenceBaseUrl;
    return "";
  }

  function pageUrlForType(type) {
    const normalized = normalizeTeamsType(type);
    if (normalized === "personal") return teamsDefaults.personalPageUrl;
    if (normalized === "business") return teamsDefaults.businessPageUrl;
    return "";
  }

  function appendPath(baseUrl, path) {
    return trimTrailingSlashes(baseUrl) + (text(path).startsWith("/") ? text(path) : "/" + text(path));
  }

  global.TEAMS_HELPER_SHARED = freeze({
    apiDefaults,
    authWarmupUrls,
    client,
    cookieProbeUrls,
    dnrRuleIds,
    durationsMs,
    storageKeys,
    teamsContentMatches,
    teamsDefaults,
    teamsOrigins,
    appendPath,
    normalizeTeamsType,
    pageUrlForType,
    presenceBaseUrlForType,
    trimTrailingSlashes
  });
})(globalThis);
/* END merged source: src/shared/app_constants.js */

/* BEGIN merged source: src/shared/runtime_helpers.js */
(function initialiseTeamsHelperRuntimeHelpers(global) {
  "use strict";

  const shared = global.TEAMS_HELPER_SHARED || {};
  const freeze = Object.freeze;
  const STATUS_ALIASES = freeze({
    available: "available",
    avail: "available",
    active: "available",
    online: "available",
    free: "available",
    busy: "busy",
    occupied: "busy",
    dnd: "dnd",
    donotdisturb: "dnd",
    disturbed: "dnd",
    focus: "dnd",
    focusing: "dnd",
    brb: "brb",
    berightback: "brb",
    away: "away",
    idle: "away",
    offline: "offline",
    offwork: "offline",
    invisible: "offline"
  });

  const STATUS_PRESETS = freeze({
    available: freeze({ key: "available", availability: "Available", activity: "Available" }),
    busy: freeze({ key: "busy", availability: "Busy", activity: "Busy" }),
    dnd: freeze({ key: "dnd", availability: "DoNotDisturb", activity: "DoNotDisturb" }),
    brb: freeze({ key: "brb", availability: "BeRightBack", activity: "BeRightBack" }),
    away: freeze({ key: "away", availability: "Away", activity: "Away" }),
    offline: freeze({ key: "offline", availability: "Offline", activity: "OffWork" })
  });

  function text(value) {
    return String(value == null ? "" : value);
  }

  function lower(value) {
    return text(value).trim().toLowerCase();
  }

  function now() {
    return Date.now();
  }

  function iso(value) {
    const date = new Date(Number(value) || Date.now());
    return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
  }

  function slug(value, fallback = "teams-helper") {
    return text(value || fallback).replace(/[^a-z0-9_.:-]+/gi, "-").slice(0, 140) || fallback;
  }

  function uuid(prefix = "th") {
    try {
      if (global.crypto && typeof global.crypto.randomUUID === "function") return global.crypto.randomUUID();
    } catch {}
    try {
      if (typeof global.bgHeadlessTeamsUuid === "function") return global.bgHeadlessTeamsUuid();
    } catch {}
    return text(prefix || "th") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }

  function delay(ms) {
    return new Promise(resolve => global.setTimeout(resolve, Math.max(0, Number(ms) || 0)));
  }

  function safeText(value, max = 600) {
    return text(value)
      .replace(/(authorization|x-skypetoken|skypetoken|cookie|bearer|token|secret|password|session|sig|nonce)(=|:)?[^\s,;]*/ig, "$1$2[redacted]")
      .slice(0, Math.max(0, Number(max) || 0));
  }

  function parseJsonBody(value) {
    if (value == null) return null;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      try { return JSON.parse(trimmed); } catch { return null; }
    }
    if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) {
      const out = {};
      try { value.forEach((entry, name) => { out[name] = entry; }); } catch {}
      return out;
    }
    if (typeof Blob !== "undefined" && value instanceof Blob) return null;
    if (typeof ArrayBuffer !== "undefined" && (value instanceof ArrayBuffer || ArrayBuffer.isView(value))) return null;
    if (value && typeof value === "object") {
      try { return JSON.parse(JSON.stringify(value)); } catch { return Array.isArray(value) ? value.slice() : Object.assign({}, value); }
    }
    return null;
  }

  function isPlainObject(value) {
    return !!(value && typeof value === "object" && !Array.isArray(value));
  }

  function normalizeRuntimeState(state, normalizer) {
    try {
      const fn = typeof normalizer === "function" ? normalizer : typeof global.h === "function" ? global.h : null;
      return fn ? fn(state || null, state && state.tabId) : (state || {});
    } catch {
      return state || {};
    }
  }

  function normalizeStatusKey(value, options = {}) {
    const aliases = options.aliases || STATUS_ALIASES;
    const presets = options.presets || STATUS_PRESETS;
    const defaultKey = Object.prototype.hasOwnProperty.call(options, "defaultKey") ? options.defaultKey : "available";
    const rawText = text(value).trim();
    if (!rawText) return defaultKey;
    const raw = rawText.toLowerCase().replace(/[\s_-]+/g, "");
    if (Object.prototype.hasOwnProperty.call(aliases, raw)) return aliases[raw];
    if (presets && Object.prototype.hasOwnProperty.call(presets, raw)) return raw;
    return options.preserveUnknown ? raw : defaultKey;
  }

  function statusPresetForKey(statusKey, options = {}) {
    const presets = options.presets || STATUS_PRESETS;
    const key = normalizeStatusKey(statusKey, Object.assign({}, options, { presets }));
    if (key && presets && presets[key]) return presets[key];
    if (Object.prototype.hasOwnProperty.call(options, "fallbackPreset")) return options.fallbackPreset;
    return null;
  }

  function stripAccountKeyPrefixes(value) {
    return text(value).trim().toLowerCase().replace(/^(?:(?:personal|business|unknown):)+/i, "");
  }

  function normalizeAccountEmail(value) {
    const stripped = stripAccountKeyPrefixes(value);
    if (!stripped || stripped.length > 160 || /^https?:\/\//i.test(stripped) || /[\s{}[\]<>"'`]/.test(stripped)) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stripped) ? stripped : "";
  }

  function normalizeTeamsAccountType(value) {
    try {
      if (shared && typeof shared.normalizeTeamsType === "function") {
        const sharedType = shared.normalizeTeamsType(value || "");
        if (sharedType === "personal" || sharedType === "business") return sharedType;
      }
    } catch {}
    const raw = text(value).trim().toLowerCase();
    if (!raw) return "unknown";
    const consumerTenant = "9188040d-6c67-4c5b-b112-36a304b66dad";
    if (raw.includes(consumerTenant)) return "personal";
    if (/@(?:[^@\s]+\.)*onmicrosoft\.com(?:$|[^a-z0-9.-])/i.test(raw) || /(?:^|:)orgid:/i.test(raw)) return "business";
    if (/^(?:personal|consumer|life|msa|microsoft-account|tfl)$/.test(raw) || /^personal:/.test(raw) || /teams\.live\.com|(?:^|:)live:|8:live:|cid\./.test(raw)) return "personal";
    if (/^(?:business|work|school|enterprise|commercial|org|aad)$/.test(raw) || /^business:/.test(raw) || /teams\.(?:cloud\.microsoft|microsoft\.com)|login\.microsoftonline\.com|(?:^|:)28:|(?:^|:)29:/.test(raw)) return "business";
    if (/^unknown:/.test(raw)) return "unknown";
    return "unknown";
  }

  function accountFallbackId(value, fallback = "default") {
    const stripped = stripAccountKeyPrefixes(value || fallback || "default");
    return (stripped || "default").slice(0, 180);
  }

  function makeAccountKey(type, email, fallback = "default") {
    const normalizedType = normalizeTeamsAccountType(type);
    const normalizedEmail = normalizeAccountEmail(email);
    return normalizedType + ":" + (normalizedEmail || accountFallbackId(fallback));
  }

  function accountKeyEmail(value) {
    return normalizeAccountEmail(stripAccountKeyPrefixes(value));
  }

  function storageArea() {
    try {
      return global.chrome && global.chrome.storage && global.chrome.storage.local || null;
    } catch {
      return null;
    }
  }

  function storageGet(keys) {
    return new Promise(resolve => {
      try {
        const area = storageArea();
        if (!area || !area.get) return resolve({});
        area.get(keys, value => resolve(value || {}));
      } catch {
        resolve({});
      }
    });
  }

  function storageSet(values) {
    return new Promise(resolve => {
      try {
        const area = storageArea();
        if (!area || !area.set) return resolve(false);
        area.set(values || {}, () => resolve(true));
      } catch {
        resolve(false);
      }
    });
  }

  function storageRemove(keys) {
    return new Promise(resolve => {
      try {
        const area = storageArea();
        if (!area || !area.remove) return resolve(false);
        area.remove(keys, () => resolve(true));
      } catch {
        resolve(false);
      }
    });
  }

  function callFirst(functions, args = [], fallback) {
    for (const fn of functions || []) {
      if (typeof fn !== "function") continue;
      try {
        const result = fn.apply(global, args);
        if (result !== undefined && result !== null) return result;
      } catch {}
    }
    return typeof fallback === "function" ? fallback.apply(global, args) : fallback;
  }

  function createDynamicFunctions(definitions) {
    const out = {};
    const entries = definitions && typeof definitions === "object" ? definitions : {};
    for (const [name, definition] of Object.entries(entries)) {
      const chain = Array.isArray(definition) ? definition : definition && definition.chain || [];
      const fallback = definition && definition.fallback;
      out[name] = function teamsHelperDynamicFunction(...args) {
        return callFirst(chain.map(entry => typeof entry === "string" ? global[entry] : entry), args, fallback);
      };
    }
    return freeze(out);
  }

  global.TEAMS_HELPER_RUNTIME_HELPERS = freeze({
    STATUS_ALIASES,
    STATUS_PRESETS,
    accountFallbackId,
    accountKeyEmail,
    callFirst,
    createDynamicFunctions,
    delay,
    isPlainObject,
    iso,
    lower,
    makeAccountKey,
    normalizeAccountEmail,
    normalizeRuntimeState,
    normalizeStatusKey,
    normalizeTeamsAccountType,
    now,
    parseJsonBody,
    safeText,
    slug,
    statusPresetForKey,
    storageGet,
    storageRemove,
    storageSet,
    stripAccountKeyPrefixes,
    text,
    uuid
  });
})(globalThis);
/* END merged source: src/shared/runtime_helpers.js */

/* BEGIN merged source: src/offscreen/offscreen.js */
(() => {
  const shared = globalThis.TEAMS_HELPER_SHARED || {};
  const teamsDefaults = shared.teamsDefaults || {};
  const teamsOrigins = shared.teamsOrigins || {};
  const client = shared.client || {};
  const runtimeHelpers = globalThis.TEAMS_HELPER_RUNTIME_HELPERS || {};
  const MAX_BODY = 2000;
  const offscreenNativeFetch = typeof globalThis.fetch === "function" ? globalThis.fetch.bind(globalThis) : null;
  let offscreenPacketTraceSequence = 0;

  // Packet executor functions are grouped by flow: utility, URL/header normalization, bootstrap, hydration, and packet fetch.

  // Redaction, timing, fetch, and list utilities
  function safeText(value, max = MAX_BODY) {
    return runtimeHelpers.safeText ? runtimeHelpers.safeText(value, max) : String(value == null ? "" : value).replace(/(authorization|skypetoken|cookie|bearer|token|secret|password|session|sig|nonce)=[^\s,;]+/ig, "$1=[redacted]").slice(0, Math.max(0, Number(max) || 0));
  }

  function delay(ms) {
    return runtimeHelpers.delay ? runtimeHelpers.delay(ms) : new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
  }

  function offscreenTraceUrlInfo(value) {
    try {
      const parsed = new URL(String(value && value.url || value || ""));
      return { url: parsed.origin + parsed.pathname, origin: parsed.origin, path: parsed.pathname, queryKeys: Array.from(new Set(Array.from(parsed.searchParams.keys()))).slice(0, 40) };
    } catch { return { url: String(value || "").split(/[?#]/, 1)[0], origin: null, path: null, queryKeys: [] }; }
  }
  function offscreenTraceHeaderNames(headers) {
    const names = [];
    try { new Headers(headers || {}).forEach((_, name) => names.push(String(name).toLowerCase())); }
    catch { try { names.push(...Object.keys(headers || {}).map(name => String(name).toLowerCase())); } catch {} }
    return Array.from(new Set(names)).sort().slice(0, 80);
  }
  function offscreenTraceBodyMeta(body) {
    if (body == null) return null;
    try {
      if (typeof body === "string") return { type: "string", bytes: new TextEncoder().encode(body).byteLength };
      if (body instanceof URLSearchParams) return { type: "url-search-params", keys: Array.from(new Set(Array.from(body.keys()))).slice(0, 40) };
      if (typeof Blob !== "undefined" && body instanceof Blob) return { type: "blob", bytes: Number(body.size || 0), mime: String(body.type || "") || null };
      if (body instanceof ArrayBuffer) return { type: "array-buffer", bytes: Number(body.byteLength || 0) };
      if (ArrayBuffer.isView(body)) return { type: "typed-array", bytes: Number(body.byteLength || 0) };
      return { type: typeof body };
    } catch { return { type: typeof body }; }
  }
  function offscreenTraceCallsite() {
    try { return String(new Error().stack || "").split("\n").slice(2).map(line => line.trim()).filter(line => line && !/offscreenTrace|fetchWithTimeout/i.test(line)).slice(0, 4); }
    catch { return []; }
  }
  function offscreenTraceEmit(phase, detail, level = "info") {
    try {
      const input = detail && typeof detail === "object" ? detail : {};
      const phaseName = String(phase || "event");
      const info = offscreenTraceUrlInfo(input.url || input.finalUrl || "internal://offscreen");
      const method = String(input.method || "EVENT").toUpperCase();
      let label = String(input.label || "");
      if (!label) {
        if (/\/api\/auth\/v\d+(?:\.\d+)?\/authz\/consumer/i.test(info.url)) label = "teams-authz-consumer";
        else if (/\/api\/mt\/beta\/users\/me\//i.test(info.url)) label = "teams-users-me";
        else if (/\/ups\/global\/v1\/me\/endpoints/i.test(info.url)) label = "ups-endpoint-register";
        else if (/\/ups\/global\/v1\/presence\/getpresence/i.test(info.url)) label = "ups-getpresence";
        else if (/\/ups\/global\/v1\/me\/forceavailability/i.test(info.url)) label = "ups-forceavailability";
        else if (/\/v2\/?$/i.test(info.url)) label = "teams-v2-shell";
        else label = "offscreen-runtime";
      }
      const step = /authz-consumer/.test(label) ? 6 : /users-me/.test(label) ? 7 : /endpoint/.test(label) ? 9 : /getpresence/.test(label) ? 10 : /forceavailability/.test(label) ? 11 : /v2-shell/.test(label) ? 2 : 0;
      console.info(`[Teams Helper][NET] ${JSON.stringify({
        phase: phaseName,
        flow: input.flow || input.packetManagerId || input.id || "offscreen-runtime",
        step,
        label,
        method,
        url: info.url || "internal://offscreen",
        status: input.status == null ? (/^(?:send|start)$/i.test(phaseName) ? "pending" : "not-applicable") : Number(input.status),
        ms: input.elapsedMs == null ? 0 : Number(input.elapsedMs),
        caller: input.caller || "offscreen-document",
        reason: input.reason || input.error || phaseName,
        account: input.accountKey || "unresolved",
        requestId: input.id || "not-applicable",
        context: "offscreen-document"
      })}`);
    } catch {}
  }
  function offscreenTraceStart(url, init = {}, meta = {}) {
    const info = offscreenTraceUrlInfo(url);
    const trace = {
      id: String(meta.traceId || `off_${Date.now().toString(36)}_${(++offscreenPacketTraceSequence).toString(36)}_${Math.random().toString(36).slice(2, 7)}`),
      startedAt: Date.now(),
      context: "offscreen-document",
      transport: String(meta.transport || "fetch"),
      caller: String(meta.caller || "offscreen"),
      label: meta.label ? String(meta.label) : null,
      reason: meta.reason ? String(meta.reason) : null,
      accountKey: meta.accountKey ? String(meta.accountKey) : null,
      packetManagerId: meta.packetManagerId ? String(meta.packetManagerId) : null,
      sequence: meta.sequence == null ? null : Number(meta.sequence),
      method: String(init && init.method || "GET").toUpperCase(),
      url: info.url,
      origin: info.origin,
      path: info.path,
      queryKeys: info.queryKeys,
      headerNames: offscreenTraceHeaderNames(init && init.headers),
      body: offscreenTraceBodyMeta(init && init.body),
      callsite: offscreenTraceCallsite()
    };
    if (info.origin) offscreenTraceEmit("send", trace, "info");
    return trace;
  }
  function offscreenTraceFinish(trace, response, extra = {}) {
    const result = Object.assign({}, trace || {}, {
      completedAt: Date.now(),
      elapsedMs: Math.max(0, Date.now() - Number(trace && trace.startedAt || Date.now())),
      ok: !!(response && response.ok),
      status: response && response.status != null ? Number(response.status) : null,
      redirected: !!(response && response.redirected),
      finalUrl: offscreenTraceUrlInfo(response && response.url || trace && trace.url || "").url
    }, extra || {});
    if (trace && trace.origin) offscreenTraceEmit("response", result, result.ok ? "info" : "warn");
    return result;
  }
  function offscreenTraceFail(trace, error, extra = {}) {
    const result = Object.assign({}, trace || {}, {
      completedAt: Date.now(),
      elapsedMs: Math.max(0, Date.now() - Number(trace && trace.startedAt || Date.now())),
      ok: false,
      status: null,
      error: safeText(error && (error.message || error.msg) || error, 500)
    }, extra || {});
    if (trace && trace.origin) offscreenTraceEmit("error", result, "error");
    return result;
  }

  function fetchWithTimeout(url, init, timeoutMs = 25000, traceMeta = {}) {
    if (!offscreenNativeFetch) return Promise.reject(new Error("fetch is unavailable"));
    const controller = new AbortController();
    const timer = setTimeout(() => { try { controller.abort(new Error("teams-helper-fetch-timeout")); } catch { try { controller.abort(); } catch {} } }, Math.max(1000, Number(timeoutMs) || 25000));
    const next = Object.assign({}, init || {}, { signal: controller.signal });
    const trace = offscreenTraceStart(url, next, traceMeta);
    return offscreenNativeFetch(url, next).then(response => {
      offscreenTraceFinish(trace, response);
      return response;
    }).catch(error => {
      offscreenTraceFail(trace, error);
      throw error;
    }).finally(() => { try { clearTimeout(timer); } catch {} });
  }

  function uniqueUrls(values) {
    const out = [];
    const seen = new Set();
    for (const value of values || []) {
      try {
        const parsed = new URL(String(value || ""));
        if (parsed.protocol !== "https:") continue;
        const key = parsed.toString();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(key);
      } catch {}
    }
    return out.slice(0, 8);
  }

  // Teams and Microsoft URL classifiers
  function isTeamsUrl(value) {
    try {
      const parsed = new URL(String(value || ""));
      const host = parsed.hostname.toLowerCase();
      return parsed.protocol === "https:" && (host === "teams.live.com" || host.endsWith(".teams.live.com") || host === "teams.microsoft.com" || host.endsWith(".teams.microsoft.com") || host === "teams.cloud.microsoft" || host.endsWith(".teams.cloud.microsoft"));
    } catch { return false }
  }

  function isPresenceUrl(value) {
    try {
      const parsed = new URL(String(value || ""));
      return isTeamsUrl(parsed.toString()) && /\/ups\/[^/]+\/v1\/(?:me\/forceavailability|me\/endpoints|presence\/getpresence)\/?/i.test(parsed.pathname);
    } catch { return false }
  }

  function isMicrosoftSigninUrl(value) {
    try {
      const parsed = new URL(String(value || ""));
      const host = parsed.hostname.toLowerCase();
      return host === "login.live.com" || host.endsWith(".login.live.com") || host === "account.live.com" || host.endsWith(".account.live.com") || host === "login.microsoftonline.com" || host.endsWith(".login.microsoftonline.com") || host.endsWith(".microsoftonline.com");
    } catch { return false }
  }

  function isTeamsApiProbeUrl(value) {
    try {
      const parsed = new URL(String(value || ""));
      return isTeamsUrl(parsed.toString()) && /\/ups\/[^/]+\/v1\/(?:presence\/getpresence|me\/forceavailability)\/?/i.test(parsed.pathname);
    } catch { return false }
  }

  // Header normalization helpers
  function headersObject(headers) {
    const out = {};
    const input = headers && typeof headers === "object" ? headers : {};
    for (const [name, value] of Object.entries(input)) {
      const key = String(name || "").toLowerCase();
      if (!key) continue;
      if (/cookie|secret|password/i.test(key)) continue;
      if (/^(?:origin|referer|referrer|host|connection|content-length|accept-encoding|sec-|proxy-|te|trailer|transfer-encoding|upgrade)$/i.test(key)) continue;
      out[key] = String(value == null ? "" : value);
    }
    return out;
  }

  function normalizePacketHeadersForTeams(url, method, headers) {
    const out = headers && typeof headers === "object" ? headers : {};
    if (isPresenceUrl(url)) {
      out["behavioroverride"] = out["behavioroverride"] || client.behaviorOverride || "redirectAs404";
      let consumerHost = false;
      try { const host = new URL(String(url || "")).hostname.toLowerCase(); consumerHost = host === "teams.live.com" || host.endsWith(".teams.live.com") } catch {}
      if (consumerHost) out["x-ms-client-consumer-type"] = out["x-ms-client-consumer-type"] || client.consumerType || "teams4life";
      else delete out["x-ms-client-consumer-type"];
      out["x-ms-client-type"] = out["x-ms-client-type"] || client.type || "cdlworker";
      out["x-ms-client-user-agent"] = out["x-ms-client-user-agent"] || client.userAgent || "Teams-V2-Web";
      out["x-ms-client-version"] = out["x-ms-client-version"] || client.fallbackVersion || "1415/26041619448";
      out["x-ms-request-id"] = out["x-ms-request-id"] || "";
      out["x-ms-object-id"] = out["x-ms-object-id"] || "";
      const path = (() => { try { return new URL(String(url || "")).pathname; } catch { return ""; } })();
      if (!out["x-ms-client-caller"]) {
        if (/\/presence\/getpresence\/?/i.test(path)) out["x-ms-client-caller"] = "user-presence-worker-resolver:DataViewSchemaCdlSingleMeQuery";
        else if (/\/me\/endpoints\/?/i.test(path)) out["x-ms-client-caller"] = client.caller || "presence-sync-strategy:TrouterStateChanged";
        else out["x-ms-client-caller"] = "presence.forceavailability:headless";
      }
      if (/^(?:PUT|POST|PATCH)$/i.test(String(method || ""))) out["content-type"] = out["content-type"] || "application/json";
    }
    return out;
  }

  // Automatic sign-in bootstrap flow
  async function probeSigninUrl(url, opts = {}) {
    const apiProbe = isTeamsApiProbeUrl(url);
    const isPresenceProbe = apiProbe && /\/presence\/getpresence\/?/i.test((() => { try { return new URL(String(url || "")).pathname; } catch { return ""; } })());
    const headers = normalizePacketHeadersForTeams(url, isPresenceProbe ? "POST" : "GET", headersObject(opts.headers || {}));
    const init = { method: isPresenceProbe ? "POST" : "GET", headers, credentials: "include", cache: "no-store", redirect: "follow", referrerPolicy: "strict-origin-when-cross-origin" };
    if (opts.referrer) init.referrer = String(opts.referrer);
    if (isPresenceProbe) {
      const mri = String(opts.userMri || "").trim();
      init.body = JSON.stringify(mri ? [{ mri, source: "ups" }] : []);
    }
    const response = await fetchWithTimeout(url, init, 25000, { caller: "probeSigninUrl", label: apiProbe ? "offscreen-api-probe" : "offscreen-shell-probe", reason: opts.reason || "session-probe" });
    let text = "";
    try { text = await response.clone().text(); } catch {}
    const finalUrl = response && response.url || url;
    const looksSignin = isMicrosoftSigninUrl(finalUrl) || /signs*in|login|password|oauth|authorize/i.test(String(text || "").slice(0, 1200));
    return { url, finalUrl, apiProbe, ok: !!response.ok && !looksSignin, status: response.status, signInRequired: looksSignin || response.status === 401 || response.status === 403, textHint: safeText(text, 400), method: init.method };
  }

  async function runSigninBootstrap(request) {
    return { ok: false, status: null, skipped: true, signInRequired: false, reason: "ordered-background-owner", detail: "Offscreen probing is disabled. The background ordered flow owns OAuth, config, trouter, consumer authz, identity, and UPS packets.", attempts: [] };
  }

  // Background session hydration flow
  function pageUrlCandidates(req) {
    const base = String(req && req.baseUrl || "").replace(/\/+$/, "");
    const urls = uniqueUrls([].concat(req && req.pageUrl || [], req && req.urls || [], base && base.replace(/\/ups\/global$/i, "/v2/"), teamsDefaults.personalPageUrl || "https://teams.live.com/v2/"));
    return urls.filter(url => isTeamsUrl(url) && !isTeamsApiProbeUrl(url)).slice(0, 4);
  }

  function apiProbeCandidates(req) {
    const base = String(req && req.baseUrl || "").replace(/\/+$/, "");
    const urls = uniqueUrls([].concat(req && req.packetUrl || [], req && req.urls || [], base && base + "/v1/presence/getpresence/", (teamsDefaults.personalPresenceBaseUrl || "https://teams.live.com/ups/global") + "/v1/presence/getpresence/"));
    return urls.filter(url => isTeamsApiProbeUrl(url)).slice(0, 6);
  }

  async function probeApiCandidates(urls, req = {}) {
    const attempts = [];
    let confirmed = null;
    let authFailure = null;
    for (const url of urls || []) {
      try {
        const attempt = await probeSigninUrl(url, { userMri: req.userMri || "", referrer: req.pageUrl || teamsDefaults.workerReferrer || "https://teams.live.com/v2/worker/precompiled-web-worker-1e7f103975435971.js" });
        attempts.push(attempt);
        if (attempt.apiProbe && attempt.ok && !attempt.signInRequired) { confirmed = attempt; break; }
        if (!authFailure && attempt.signInRequired) authFailure = attempt;
      } catch (error) {
        attempts.push({ url, ok: false, status: null, signInRequired: false, apiProbe: isTeamsApiProbeUrl(url), error: safeText(error && (error.message || error.msg) || error, 400) });
      }
    }
    const chosen = confirmed || authFailure || attempts[attempts.length - 1] || null;
    return { ok: !!confirmed, status: chosen && chosen.status == null ? null : chosen && chosen.status, signInRequired: !!(!confirmed && authFailure), finalUrl: chosen && chosen.finalUrl || null, attempts: attempts.map(a => ({ url: a.url, finalUrl: a.finalUrl || null, status: a.status == null ? null : a.status, ok: !!a.ok, apiProbe: !!a.apiProbe, signInRequired: !!a.signInRequired, error: a.error || null })) };
  }

  function attachHiddenFrame(url) {
    return Promise.resolve({ iframe: null, loaded: false, blocked: false, skipped: true, reason: "ordered-background-owner" });
  }

  async function runBackgroundSessionHydration(request) {
    return { ok: false, status: null, skipped: true, signInRequired: false, reason: "ordered-background-owner", detail: "Offscreen hydration is disabled because it cannot establish the required first-party packet order.", frameAttempted: false, frameLoaded: false, frameBlocked: false, attempts: [] };
  }

  // Offscreen packet execution
  function offscreenPacketPresenceWriteKind(url, method) {
    try {
      const parsed = new URL(String(url || ""));
      const host = parsed.hostname.toLowerCase();
      const path = String(parsed.pathname || "").toLowerCase();
      const verb = String(method || "GET").toUpperCase();
      const teamsHost = host === "teams.live.com" || host.endsWith(".teams.live.com") || host === "teams.microsoft.com" || host.endsWith(".teams.microsoft.com") || host === "teams.cloud.microsoft" || host.endsWith(".teams.cloud.microsoft");
      if (!teamsHost || !/^(?:PUT|POST|PATCH|DELETE)$/i.test(verb)) return "";
      if (/\/ups\/[^/]+\/v1\/me\/forceavailability\/?$/.test(path)) return "forceavailability";
      if (/\/ups\/[^/]+\/v1\/me\/endpoints\/?$/.test(path)) return "endpoints";
      if (/\/ups\/[^/]+\/v1\/me\/reportmyactivity\/?$/.test(path)) return "reportmyactivity";
    } catch {}
    return "";
  }

  function offscreenPacketManagerForRequest(request, url, method) {
    const input = request && request.packetManager && typeof request.packetManager === "object" ? request.packetManager : {};
    return Object.assign({}, input, {
      id: String(input.id || "offscreen-standalone-" + Date.now().toString(36)),
      offscreenStage: "packet-fetch",
      offscreenUrl: String(url || ""),
      offscreenMethod: String(method || "GET").toUpperCase(),
      offscreenAt: Date.now()
    });
  }

  async function offscreenPacketManagerFetch(url, init, manager) {
    try { if (manager) manager.fetchStartedAt = Date.now(); } catch {}
    return fetchWithTimeout(url, init, 25000, { caller: "offscreenPacketManagerFetch", label: manager && manager.label || manager && manager.presenceKind || "offscreen-packet", reason: manager && manager.reason || "packet-fetch", accountKey: manager && manager.accountKey || null, packetManagerId: manager && manager.id || null, sequence: manager && manager.sequence });
  }

  async function runPacket(packet) {
    const request = packet && typeof packet === "object" ? packet : {};
    const url = String(request.url || "");
    const method = String(request.method || "GET").toUpperCase();
    const packetManager = offscreenPacketManagerForRequest(request, url, method);
    if (!isTeamsUrl(url)) {
      offscreenTraceEmit("blocked", { context: "offscreen-document", transport: "packet-fetch", caller: "runPacket", label: packetManager.label || "offscreen-packet", reason: "non-teams-url", accountKey: packetManager.accountKey || null, packetManagerId: packetManager.id || null, sequence: packetManager.sequence == null ? null : Number(packetManager.sequence), method, url: offscreenTraceUrlInfo(url).url, sent: false }, "warn");
      return { ok: false, status: null, responseText: "blocked non-Teams packet", transport: "extension-offscreen-packet", packetManager };
    }
    let isUpsPacket = false;
    try { isUpsPacket = /\/ups\/[^/]+\/v1\//i.test(new URL(url).pathname || ""); } catch {}
    const requestHeaders = headersObject(request.headers || {});
    const authorization = String(requestHeaders.authorization || requestHeaders.Authorization || "");
    const skypeToken = String(requestHeaders["x-skypetoken"] || requestHeaders["X-Skypetoken"] || "");
    const routineDirect = !!request.allowRoutinePresencePacket && !!request.endpointId && /^Bearer\s+\S+/i.test(authorization) && !!skypeToken.trim();
    const orderedLifecycle = !!(request.forceOrderedStartup || request.endpointRegistrationRequired || request.endpointPreflightPacket);
    if (isUpsPacket && orderedLifecycle && !routineDirect) {
      offscreenTraceEmit("blocked", { context: "offscreen-document", transport: "packet-fetch", caller: "runPacket", label: packetManager.label || "ordered-background-owner", reason: "ordered-background-owner", accountKey: packetManager.accountKey || null, packetManagerId: packetManager.id || null, method, url: offscreenTraceUrlInfo(url).url, sent: false }, "info");
      return { ok: false, status: null, skipped: true, reason: "ordered-background-owner", responseText: "UPS lifecycle packet was not sent from offscreen; the background ordered flow owns this request.", transport: "extension-offscreen-packet", url, packetManager };
    }
    const writeKind = offscreenPacketPresenceWriteKind(url, method);
    if (writeKind && !routineDirect && (!packetManager.startupBeforePresenceAttempted || !packetManager.startupPrerequisitesBeforePresenceOk)) {
      offscreenTraceEmit("blocked", { context: "offscreen-document", transport: "packet-fetch", caller: "runPacket", label: packetManager.label || writeKind, reason: "missing-startup-prerequisite-packet-manager", accountKey: packetManager.accountKey || null, packetManagerId: packetManager.id || null, sequence: packetManager.sequence == null ? null : Number(packetManager.sequence), method, url: offscreenTraceUrlInfo(url).url, sent: false, presenceKind: writeKind, requiredPrerequisites: ["headless-oauth-token-authz-bundle", "teams-users-me", "teams-user-aggregate-settings"] }, "warn");
      return { ok: false, status: null, skipped: true, reason: "missing-startup-prerequisite-packet-manager", responseText: "Blocked " + writeKind + " packet because OAuth/token/authz, users/me, and aggregate prerequisite packets did not complete before this presence write.", transport: "extension-offscreen-packet", url, packetManager: Object.assign({}, packetManager, { presenceKind: writeKind, blockedBeforeFetch: true, requiredPrerequisites: ["headless-oauth-token-authz-bundle", "teams-users-me", "teams-user-aggregate-settings"] }) };
    }
    const packetHeaders = normalizePacketHeadersForTeams(url, method, headersObject(request.headers || {}));
    const init = { method, headers: packetHeaders, credentials: "include", cache: "no-store", redirect: "follow" };
    const fetchOptions = request.fetchOptions && typeof request.fetchOptions === "object" ? request.fetchOptions : {};
    for (const key of ["credentials", "cache", "redirect", "mode", "keepalive", "referrerPolicy", "referrer"]) {
      if (Object.prototype.hasOwnProperty.call(fetchOptions, key) && fetchOptions[key] != null) init[key] = fetchOptions[key];
    }
    if (method !== "GET" && method !== "HEAD" && request.body != null) init.body = String(request.body);
    const response = await offscreenPacketManagerFetch(url, init, packetManager);
    let responseText = "";
    try { responseText = await response.text() } catch {}
    return { ok: !!response.ok, status: response.status, responseText: safeText(responseText), transport: "extension-offscreen-packet", url, packetManager: Object.assign({}, packetManager, { completedAt: Date.now(), ok: !!response.ok, status: response.status }) };
  }

  const oauthFrames = new Map();

  function removeOAuthFrame(id, removalReason = "removed") {
    const key = String(id || "");
    const entry = oauthFrames.get(key);
    if (!entry) return { ok: true, removed: false };
    oauthFrames.delete(key);
    try { clearTimeout(entry.timer); } catch {}
    if (entry.trace && !entry.traceCompleted) {
      entry.traceCompleted = true;
      offscreenTraceEmit("cancel", Object.assign({}, entry.trace, {
        completedAt: Date.now(),
        elapsedMs: Math.max(0, Date.now() - Number(entry.trace.startedAt || Date.now())),
        ok: false,
        status: null,
        navigation: true,
        removed: true,
        removalReason: String(removalReason || "removed")
      }), "info");
    }
    try { entry.iframe && entry.iframe.remove && entry.iframe.remove(); } catch {}
    return { ok: true, removed: true };
  }

  function startOAuthFrame(request) {
    return { ok: false, skipped: true, error: "ordered-background-owner", transport: "extension-offscreen-oauth" };
  }

  const accountInventoryFrames = new Map();

  function accountInventoryUrl(value) {
    try {
      const url = new URL(String(value || ""));
      url.searchParams.set("th_account_inventory_only", "1");
      url.searchParams.set("th_account_inventory_nonce", Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
      return url.toString();
    } catch { return ""; }
  }

  function removeAccountInventoryFrame(id) {
    const key = String(id || "");
    const entry = accountInventoryFrames.get(key);
    if (!entry) return false;
    accountInventoryFrames.delete(key);
    try { clearTimeout(entry.timer); } catch {}
    try { entry.iframe.remove(); } catch {}
    return true;
  }

  function openAccountInventoryFrame(url, timeoutMs = 9000) {
    return new Promise(resolve => {
      const target = accountInventoryUrl(url);
      if (!target) return resolve({ ok: false, url: String(url || ""), reason: "invalid-url" });
      const id = "inventory-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
      const iframe = document.createElement("iframe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("tabindex", "-1");
      iframe.style.cssText = "position:fixed!important;left:-10000px!important;top:-10000px!important;width:2px!important;height:2px!important;opacity:0!important;pointer-events:none!important;border:0!important";
      let settled = false;
      const finish = result => {
        if (settled) return;
        settled = true;
        removeAccountInventoryFrame(id);
        resolve(Object.assign({ url: target }, result || {}));
      };
      const timer = setTimeout(() => finish({ ok: true, loaded: false, timedOut: true }), Math.max(2500, Number(timeoutMs) || 9000));
      accountInventoryFrames.set(id, { iframe, timer });
      iframe.addEventListener("load", () => setTimeout(() => finish({ ok: true, loaded: true, timedOut: false }), 1800), { once: true });
      iframe.addEventListener("error", () => finish({ ok: false, loaded: false, reason: "frame-load-error" }), { once: true });
      iframe.src = target;
      try { document.documentElement.appendChild(iframe); }
      catch (error) { finish({ ok: false, loaded: false, reason: safeText(error && (error.message || error.msg) || error, 220) }); }
    });
  }

    async function runAccountInventoryScan(request = {}) {
    return {
      ok: true,
      skipped: true,
      reason: "existing-teams-tab-inventory-owner",
      tabless: true,
      opensTab: false,
      attempted: 0,
      loaded: 0,
      results: []
    };
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message) return undefined;
    if (message.type === "th_offscreen_account_inventory_scan") {
      runAccountInventoryScan(message.request || {})
        .then(result => sendResponse({ ok: true, id: message.id || null, result }))
        .catch(error => sendResponse({ ok: false, id: message.id || null, result: { ok: false, error: safeText(error && (error.message || error.msg) || error), tabless: true, opensTab: false } }));
      return true;
    }
    if (message.type === "th_offscreen_auto_signin_bootstrap") {
      runSigninBootstrap(message.request || {})
        .then(result => sendResponse({ ok: true, id: message.id || null, result }))
        .catch(error => sendResponse({ ok: false, id: message.id || null, result: { ok: false, status: null, signInRequired: false, responseText: safeText(error && (error.message || error.msg) || error), transport: "extension-offscreen-signin-bootstrap" } }));
      return true;
    }
    if (message.type === "th_offscreen_background_session_hydration") {
      runBackgroundSessionHydration(message.request || {})
        .then(result => sendResponse({ ok: true, id: message.id || null, result }))
        .catch(error => sendResponse({ ok: false, id: message.id || null, result: { ok: false, status: null, responseText: safeText(error && (error.message || error.msg) || error), transport: "extension-offscreen-background-hydration" } }));
      return true;
    }
    if (message.type === "th_offscreen_oauth_authorize_start") {
      Promise.resolve(startOAuthFrame(Object.assign({}, message, message.request || {})))
        .then(result => sendResponse({ ok: true, id: message.id || null, result }))
        .catch(error => sendResponse({ ok: false, id: message.id || null, result: { ok: false, error: safeText(error && (error.message || error.msg) || error), transport: "extension-offscreen-oauth" } }));
      return true;
    }
    if (message.type === "th_offscreen_oauth_authorize_stop") {
      Promise.resolve(removeOAuthFrame(message.id || "", "requested"))
        .then(result => sendResponse({ ok: true, id: message.id || null, result }))
        .catch(error => sendResponse({ ok: false, id: message.id || null, result: { ok: false, error: safeText(error && (error.message || error.msg) || error), transport: "extension-offscreen-oauth" } }));
      return true;
    }
    if (message.type !== "th_offscreen_packet_fetch") return undefined;
    runPacket(message.packet || {})
      .then(result => sendResponse({ ok: true, id: message.id || null, result }))
      .catch(error => sendResponse({ ok: false, id: message.id || null, result: { ok: false, status: null, responseText: safeText(error && (error.message || error.msg) || error), transport: "extension-offscreen-packet" } }));
    return true;
  });
})();


/*
 * Runtime lifeline for the MV3 offscreen document.
 *
 * The background service worker owns all presence decisions.  This page only
 * keeps the worker reachable, gently touches Teams cookies, and emits the
 * tabless-maintainer heartbeat.
 */
;(() => {
  "use strict";

  
async function th147EnsureCloudAuthorityBeforeForcePacket(packet, reason) {
  try {
    if (globalThis.th147CloudAuthorityBeforeForce && globalThis.th147CloudScheduleForceGuard && globalThis.th147CloudScheduleForceGuard.isForceAvailabilityPacket(packet)) {
      await globalThis.th147CloudAuthorityBeforeForce(packet, { reason: reason || 'forceavailability' });
    }
  } catch (error) {
    try { console.warn('[th147-cloud-schedule-force-guard] pre-force authority failed', error); } catch (_) {}
  }
  return packet;
}
const lifelineShared = globalThis.TEAMS_HELPER_SHARED || {};
  const lifelineOrigins = lifelineShared.teamsOrigins || {};
  const KEEPALIVE_MS = 20 * 1000;
  const STATUS_REASSERT_MS = 60 * 1000;
  const TABLESS_TICK_MS = 30 * 1000;

  const TEAMS_TOUCH_URLS = Object.freeze([
    (lifelineOrigins.personal || "https://teams.live.com") + "/api/mt/emea/beta/users/ME/properties",
    (lifelineOrigins.business || "https://teams.cloud.microsoft") + "/api/mt/part/amer-01/beta/me",
    (lifelineOrigins.personal || "https://teams.live.com") + "/"
  ]);

  let keepalivePort = null;
  let keepaliveTimer = null;

  function sendRuntimeMessage(message) {
    try {
      chrome.runtime.sendMessage(Object.assign({ t: Date.now() }, message || {}), () => {
        void (chrome.runtime && chrome.runtime.lastError);
      });
    } catch {}
  }


  function connectKeepalivePort() {
    try {
      if (keepalivePort) {
        try { keepalivePort.disconnect(); } catch {}
      }

      keepalivePort = chrome.runtime.connect({ name: "teams-helper-keepalive" });
      try {
        keepalivePort.onDisconnect.addListener(() => setTimeout(connectKeepalivePort, 1000));
      } catch {}

      if (keepaliveTimer) clearInterval(keepaliveTimer);
      keepaliveTimer = setInterval(() => {
        try { keepalivePort.postMessage({ type: "keepalive", t: Date.now() }); } catch {}
        sendRuntimeMessage({ type: "keepalive-ping" });
      }, KEEPALIVE_MS);
    } catch (error) {
      try { console.warn("Teams Helper keepalive connect failed", error); } catch {}
      setTimeout(connectKeepalivePort, 3000);
    }
  }

  async function touchTeamsCookieScope() {
    return { ok: true, skipped: true, reason: "ordered-background-owner" };
  }

  async function requestAssignedStatusReassert() {
    sendRuntimeMessage({
      type: "th_force_status_tick",
      reason: "offscreen-60s-status-loop"
    });
  }

  async function requestTablessMaintenance(force = false) {
    sendRuntimeMessage({
      type: "th_tabless_session_tick",
      reason: force ? "offscreen-tabless-session-startup" : "offscreen-tabless-session-30s",
      force: !!force
    });
  }

  function install() {
    connectKeepalivePort();

    // The background alarm is the sole periodic scheduler. Keeping status and
    // maintenance intervals here produced duplicate full transactions whenever
    // the service worker was already awake. Offscreen now only owns transport
    // execution and the keepalive port.
  }

  install();
})();
/* END merged source: src/offscreen/offscreen.js */
