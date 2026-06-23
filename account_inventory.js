(() => {
  'use strict';

  if (globalThis.__teamsHelperAccountInventoryInstalled) return;
  globalThis.__teamsHelperAccountInventoryInstalled = true;

  const host = String(location.hostname || '').toLowerCase();
  if (!/(^|\.)teams\.(?:live\.com|microsoft\.com|cloud\.microsoft)$/.test(host)) return;

  const source = 'teams-origin-storage';
  const MSA_CONSUMER_TENANT_ID = '9188040d-6c67-4c5b-b112-36a304b66dad';
  let timer = null;
  let lastSignature = '';

  function safeJson(value) {
    if (typeof value !== 'string' || !value) return null;
    try { return JSON.parse(value); } catch { return null; }
  }

  function text(value, max = 240) {
    const out = String(value == null ? '' : value).trim();
    return out.length > max ? out.slice(0, max) : out;
  }

  function email(value) {
    const out = text(value, 180).toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out) ? out : '';
  }

  function guid(value) {
    const out = text(value, 80).toLowerCase();
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(out) ? out : '';
  }

  function getStorageValue(key) {
    try {
      const local = localStorage.getItem(key);
      if (local != null) return local;
    } catch {}
    try {
      const session = sessionStorage.getItem(key);
      if (session != null) return session;
    } catch {}
    return null;
  }

  function storageKeys() {
    const keys = new Set();
    for (const area of [localStorage, sessionStorage]) {
      try {
        for (let i = 0; i < area.length; i += 1) {
          const key = area.key(i);
          if (key) keys.add(key);
        }
      } catch {}
    }
    return Array.from(keys);
  }

  function decodeJwtPayload(value) {
    const raw = text(value, 12000);
    if (!raw || raw.split('.').length < 2) return null;
    try {
      let body = raw.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (body.length % 4) body += '=';
      return safeJson(atob(body));
    } catch { return null; }
  }


  function personalCid(value) {
    const item = value && typeof value === 'object' ? value : {};
    const direct = text(item.cid || item.consumerCid || '', 80).toLowerCase();
    if (/^[0-9a-f]{8,64}$/.test(direct)) return direct;
    const mri = text(item.userMri || item.mri || item.skypeId || item.skypeid || '', 240).toLowerCase();
    const mriMatch = mri.match(/^(?:8:)?live:\.cid\.([0-9a-f]{8,64})$/i);
    if (mriMatch) return mriMatch[1].toLowerCase();
    const home = text(item.homeAccountId || '', 220).toLowerCase();
    const dot = home.lastIndexOf('.');
    if (dot > 0 && guid(home.slice(dot + 1)) === MSA_CONSUMER_TENANT_ID && /^[0-9a-f]{8,64}$/.test(home.slice(0, dot))) return home.slice(0, dot);
    const tid = guid(item.accountTid || item.tenantId || item.tid || '');
    const oid = guid(item.accountOid || item.objectId || item.oid || item.localAccountId || '');
    if (tid === MSA_CONSUMER_TENANT_ID && oid) {
      const compact = oid.replace(/-/g, '');
      if (/^0{16}[0-9a-f]{16}$/i.test(compact)) return compact.slice(-16).toLowerCase();
    }
    return '';
  }

  function accountIdentityKey(item) {
    const type = item.teamsType === 'business' ? 'business' : item.teamsType === 'personal' ? 'personal' : 'unknown';
    if (type === 'business' && item.accountTid && item.accountOid) return `${type}:${item.accountTid}:${item.accountOid}`;
    const cid = type === 'personal' ? personalCid(item) : '';
    if (cid) return `personal:cid.${cid}`;
    return `${type}:${item.email || item.homeAccountId || item.accountOid || item.accountTid || 'unknown'}`;
  }

  function identityTeamsType(value, extra = {}) {
    const input = value && typeof value === 'object' ? value : {};
    const explicit = String(extra.teamsType || input.teamsType || input.accountType || input.authorityType || input.type || '').trim().toLowerCase();
    const tenantId = guid(extra.accountTid || input.accountTid || input.tenantId || input.tid || input.realm || '');
    const homeAccountId = text(extra.homeAccountId || input.homeAccountId || '', 220).toLowerCase();
    const homeTenant = guid(homeAccountId.includes('.') ? homeAccountId.slice(homeAccountId.lastIndexOf('.') + 1) : '');
    const accountEmail = email(extra.email || input.email || input.username || input.loginHint || input.userPrincipalName || input.preferred_username || input.upn || input.mail || '');
    const principal = text(extra.userPrincipalName || input.userPrincipalName || input.upn || input.preferred_username || '', 260).toLowerCase();
    const mri = text(extra.userMri || input.userMri || input.mri || input.skypeId || '', 260).toLowerCase();

    // Tenant identity is authoritative. The Microsoft consumer tenant is the
    // only tenant GUID that maps to a personal Microsoft account.
    if (tenantId || homeTenant) return tenantId === MSA_CONSUMER_TENANT_ID || homeTenant === MSA_CONSUMER_TENANT_ID ? 'personal' : 'business';

    // *.onmicrosoft.com and orgid identifiers are organizational identities.
    // These signals override stale `personal:*` labels copied from a Teams Live tab.
    if (/@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(accountEmail) || /#ext#@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(principal) || /(?:^|:)orgid:/i.test(mri) || /^orgid:/i.test(principal)) return 'business';

    // Consumer identifiers are stronger than the current page host.
    if (input.cid || extra.cid || /(?:^|:)live:/i.test(mri) || /^live:/i.test(principal)) return 'personal';
    if (/aad|org|enterprise|business|work|school|workplace/.test(explicit)) return 'business';
    const sourceTag = String(extra.source || input.source || '').trim().toLowerCase();
    if (sourceTag !== 'teams-helper-origin-registry' && /(?:^|[-_\s])(msa|consumer|personal|microsoftaccount|tfl|teams4life)(?:$|[-_\s])/.test(explicit)) return 'personal';
    if (/@(?:outlook|hotmail|live|msn)\.[^@]+$/i.test(accountEmail)) return 'personal';

    // An unresolved identity stays unresolved. A tab's hostname is transport
    // context, not proof of the account authority.
    return 'unknown';
  }

  function scan(forcePublish = false) {
    const accounts = new Map();
    const rootEmails = new Set();
    const rootProfiles = [];

    function add(input, extra = {}) {
      const value = input && typeof input === 'object' ? input : {};
      const accountEmail = email(extra.email || value.email || value.username || value.loginHint || value.userPrincipalName || value.preferred_username || value.upn || value.mail || '');
      const accountTid = guid(extra.accountTid || value.accountTid || value.tenantId || value.tid || value.realm || '');
      const accountOid = guid(extra.accountOid || value.accountOid || value.localAccountId || value.objectId || value.oid || value.userId || '');
      const homeAccountId = text(extra.homeAccountId || value.homeAccountId || '', 220).toLowerCase();
      const oauthSid = text(extra.oauthSid || extra.sid || value.oauthSid || value.sid || '', 240);
      const userMri = text(extra.userMri || value.userMri || value.mri || value.skypeId || value.skypeid || '', 240);
      const cid = personalCid(Object.assign({}, value, extra, { accountTid, accountOid, homeAccountId, userMri }));
      const displayName = text(extra.displayName || extra.name || value.displayName || value.name || value.fullName || '', 160);
      const isActiveSession = extra.isActiveSession === true || value.isActiveSession === true;
      const teamsType = identityTeamsType(value, Object.assign({}, extra, { accountTid, homeAccountId, email: accountEmail }));
      if (teamsType === 'unknown' || !accountEmail && !accountTid && !accountOid && !homeAccountId) return;
      const item = {
        teamsType,
        email: accountEmail,
        loginHint: accountEmail,
        accountTid,
        accountOid,
        homeAccountId,
        oauthSid,
        cid,
        userMri,
        displayName,
        isActiveSession,
        source: text(extra.source || source, 80),
        pageUrl: teamsType === 'personal' ? 'https://teams.live.com/v2/' : 'https://teams.cloud.microsoft/',
        baseUrl: teamsType === 'personal' ? 'https://teams.live.com/ups/global' : 'https://teams.cloud.microsoft/ups/noam'
      };
      const key = accountIdentityKey(item);
      const current = accounts.get(key) || {};
      accounts.set(key, Object.assign({}, current, item, {
        email: item.email || current.email || '',
        accountTid: item.accountTid || current.accountTid || '',
        accountOid: item.accountOid || current.accountOid || '',
        homeAccountId: item.homeAccountId || current.homeAccountId || '',
        oauthSid: item.oauthSid || current.oauthSid || '',
        cid: item.cid || current.cid || '',
        userMri: item.userMri || current.userMri || '',
        displayName: item.displayName || current.displayName || '',
        source: current.source && current.source !== 'teams-helper-local-runtime-session' ? current.source : item.source,
        isActiveSession: !!(item.isActiveSession || current.isActiveSession)
      }));
      if (item.email) rootEmails.add(item.email);
    }

    function collectProfile(value, profileSource) {
      if (!value || typeof value !== 'object') return;
      const profile = value.profile && typeof value.profile === 'object' ? value.profile : value;
      const decoded = typeof profile.idToken === 'string' ? decodeJwtPayload(profile.idToken) : null;
      const merged = Object.assign({}, profile, decoded || {});
      rootProfiles.push(merged);
      add(merged, { source: profileSource });
    }

    const keys = storageKeys();

    // MSAL's explicit account index is the safest account roster available in Teams storage.
    const accountIndex = safeJson(getStorageValue('msal.2.account.keys'));
    if (Array.isArray(accountIndex)) {
      for (const entityKey of accountIndex.slice(0, 50)) {
        if (typeof entityKey !== 'string' || /(?:access|refresh|id)token/i.test(entityKey)) continue;
        const entity = safeJson(getStorageValue(entityKey));
        if (!entity || typeof entity !== 'object') continue;
        add(entity, { source: 'msal-account-index' });
        const profiles = Array.isArray(entity.tenantProfiles) ? entity.tenantProfiles : [];
        for (const profile of profiles.slice(0, 100)) add(profile, {
          email: profile && (profile.username || profile.loginHint || entity.username || entity.loginHint),
          accountTid: profile && (profile.tenantId || profile.tid || profile.realm),
          homeAccountId: profile && profile.homeAccountId || entity.homeAccountId || '',
          source: 'msal-tenant-profile'
        });
      }
    }

    for (const key of keys) {
      const raw = getStorageValue(key);
      const entity = safeJson(raw);
      const credentialType = text(entity && (entity.credentialType || entity.credential_type || entity.type) || '', 80).toLowerCase();
      if (/(?:^|[-_.])idtoken(?:$|[-_.])/i.test(key) || credentialType === 'idtoken' || credentialType === 'id_token') {
        const decoded = decodeJwtPayload(entity && (entity.secret || entity.idToken || entity.id_token || entity.credential || entity.value) || (typeof raw === 'string' ? raw : ''));
        if (decoded) add(decoded, {
          homeAccountId: entity && entity.homeAccountId || '',
          accountTid: decoded.tid || entity && (entity.realm || entity.tenantId) || '',
          accountOid: decoded.oid || entity && entity.localAccountId || '',
          oauthSid: decoded.sid || '',
          source: 'msal-id-token-cache'
        });
      }
    }

    for (const key of keys) {
      if (/^msal\..*\.active-account-filters$/i.test(key)) {
        const active = safeJson(getStorageValue(key));
        if (active) add(active, { source: 'msal-active-account', isActiveSession: true });
        continue;
      }
      if (/^tmp\.auth\.v1\..*\.User\.User$/i.test(key) || /^tmp\.auth\.v1\.GLOBAL\.User\.User$/i.test(key) || /^tmp\.react-web-client\.cachedPrimaryUser$/i.test(key)) {
        const wrapped = safeJson(getStorageValue(key));
        const profile = wrapped && wrapped.item && typeof wrapped.item === 'object' ? wrapped.item : wrapped;
        const isPrimary = /^tmp\.react-web-client\.cachedPrimaryUser$/i.test(key);
        if (profile && typeof profile === 'object') add(profile.profile && typeof profile.profile === 'object' ? profile.profile : profile, { source: 'teams-user-cache', isActiveSession: isPrimary });
        collectProfile(profile, 'teams-user-cache');
      }
    }

    function tenantRosterEmail(tenant) {
      const direct = email(tenant && (tenant.username || tenant.loginHint || tenant.userPrincipalName));
      if (direct) return direct;
      const tid = guid(tenant && (tenant.tenantId || tenant.tid || tenant.realm) || '');
      const oid = guid(tenant && (tenant.userId || tenant.objectId || tenant.oid) || '');
      const home = text(tenant && tenant.homeAccountId || '', 220).toLowerCase();
      const known = Array.from(accounts.values()).filter(item => item && item.email && (
        tid && oid && item.accountTid === tid && item.accountOid === oid ||
        home && item.homeAccountId === home
      ));
      if (known.length === 1) return known[0].email;
      const profiles = rootProfiles.filter(profile => {
        const ptid = guid(profile && (profile.tid || profile.tenantId || profile.realm) || '');
        const poid = guid(profile && (profile.oid || profile.objectId || profile.localAccountId) || '');
        return !!(tid && oid && ptid === tid && poid === oid);
      }).map(profile => email(profile && (profile.preferred_username || profile.upn || profile.email || profile.unique_name))).filter(Boolean);
      return profiles.length === 1 ? profiles[0] : '';
    }

    for (const key of keys) {
      if (!/^tmp\.auth\.v1\..*\.Tenants\.Tenants$/i.test(key)) continue;
      const wrapped = safeJson(getStorageValue(key));
      const rows = wrapped && Array.isArray(wrapped.item) ? wrapped.item : Array.isArray(wrapped) ? wrapped : [];
      for (const tenant of rows.slice(0, 100)) add(tenant, {
        email: tenantRosterEmail(tenant),
        accountTid: tenant && tenant.tenantId,
        accountOid: tenant && tenant.userId,
        homeAccountId: tenant && tenant.homeAccountId || '',
        oauthSid: tenant && tenant.sid || '',
        source: 'teams-tenant-roster'
      });
    }

    // Cloud configuration alone is not account-presence evidence. Runtime fields
    // such as endpointId, userMri, tabId, pageUrl, and baseUrl are deliberately
    // stripped before cloud serialization, however. A registry row carrying a
    // strong identity plus that complete local runtime binding can therefore be
    // admitted as browser-profile evidence without allowing cloud-only accounts.
    function addLocalRuntimeRegistryAccounts() {
      const registry = safeJson(getStorageValue('__teams_web_helper_accounts__'));
      const entries = registry && registry.accounts && typeof registry.accounts === 'object' ? Object.values(registry.accounts) : [];
      for (const entry of entries.slice(0, 100)) {
        if (!entry || typeof entry !== 'object') continue;
        const accountTid = guid(entry.accountTid || entry.oauthResolvedTid || entry.tenantId || entry.tid || '');
        const accountOid = guid(entry.accountOid || entry.oauthResolvedOid || entry.objectId || entry.oid || '');
        const homeAccountId = text(entry.homeAccountId || '', 220).toLowerCase();
        const userMri = text(entry.userMri || entry.mri || entry.skypeId || '', 240).toLowerCase();
        const cid = personalCid(Object.assign({}, entry, { accountTid, accountOid, homeAccountId, userMri }));
        const teamsType = identityTeamsType(entry, {
          source: 'teams-helper-local-runtime-session',
          accountTid,
          accountOid,
          homeAccountId,
          userMri,
          cid,
          email: entry.email || entry.loginHint || ''
        });
        const endpointId = text(entry.endpointId || '', 100).toLowerCase();
        const tabId = Number(entry.tabId);
        const pageUrl = text(entry.pageUrl || '', 300).toLowerCase();
        const baseUrl = text(entry.baseUrl || '', 300).toLowerCase();
        const endpointBound = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(endpointId);
        const tabBound = Number.isFinite(tabId) && tabId >= 0;
        const urlHost = value => {
          try { return new URL(value).hostname.toLowerCase(); } catch { return ''; }
        };
        const pageHost = urlHost(pageUrl);
        const baseHost = urlHost(baseUrl);
        const contextBound = teamsType === 'personal'
          ? /(?:^|\.)teams\.live\.com$/.test(pageHost) && /(?:^|\.)teams\.live\.com$/.test(baseHost)
          : teamsType === 'business'
            ? /(?:^|\.)teams\.(?:microsoft\.com|cloud\.microsoft)$/.test(pageHost) && /(?:^|\.)teams\.(?:microsoft\.com|cloud\.microsoft)$/.test(baseHost)
            : false;
        const strongIdentity = teamsType === 'personal' ? !!cid : teamsType === 'business' ? !!(accountTid && accountOid) : false;
        const personalMriMatches = teamsType !== 'personal' || !userMri || userMri === `8:live:.cid.${cid}` || userMri === `live:.cid.${cid}`;
        if (!strongIdentity || !endpointBound || !tabBound || !contextBound || !personalMriMatches) continue;
        add(entry, {
          source: 'teams-helper-local-runtime-session',
          accountTid,
          accountOid,
          homeAccountId,
          userMri,
          cid,
          isActiveSession: false
        });
      }
    }
    addLocalRuntimeRegistryAccounts();

    const rawRows = Array.from(accounts.values()).filter(item => item.email || item.cid || item.userMri || (item.accountTid && item.accountOid));
    const tenantRowsByEmail = new Map;
    const personalEmails = new Set(rawRows.filter(item => item && item.teamsType === 'personal' && item.email).map(item => item.email));
    for (const item of rawRows) {
      if (item && item.teamsType === 'business' && item.email && item.accountTid && item.accountOid) tenantRowsByEmail.set(item.email, item);
    }
    const rows = rawRows.filter(item => {
      if (!(item && item.teamsType === 'business' && item.email)) return true;
      if (!item.accountTid && !item.accountOid && tenantRowsByEmail.has(item.email)) return false;
      const home = text(item.homeAccountId || '', 220).toLowerCase();
      const homeTenant = guid(home.includes('.') ? home.slice(home.lastIndexOf('.') + 1) : '');
      const strongBusiness = !!(item.accountTid && item.accountTid !== MSA_CONSUMER_TENANT_ID) || !!(homeTenant && homeTenant !== MSA_CONSUMER_TENANT_ID) || /@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(item.email);
      return strongBusiness || !personalEmails.has(item.email);
    }).slice(0, 100);
    const signature = JSON.stringify(rows.map(item => [item.teamsType, item.cid || '', item.email, item.accountTid, item.accountOid, item.isActiveSession ? 1 : 0, item.oauthSid ? 1 : 0]).sort());
    const inventory = {
      version: 1,
      source,
      host,
      capturedAt: new Date().toISOString(),
      accounts: rows
    };
    if (rows.length && (forcePublish || signature !== lastSignature)) {
      lastSignature = signature;
      try {
        chrome.runtime.sendMessage({
          type: 'th_accountInventoryObserved',
          inventory
        }, () => void chrome.runtime.lastError);
      } catch {}
    }
    return inventory;
  }

  function schedule(delay = 100) {
    try { clearTimeout(timer); } catch {}
    timer = setTimeout(scan, delay);
  }


  try {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!message || message.type !== 'th_collectAccountInventory') return undefined;
      try {
        sendResponse({ ok: true, inventory: scan(true) });
      } catch (error) {
        sendResponse({ ok: false, error: text(error && (error.message || error.msg) || error, 300) });
      }
      return false;
    });
  } catch {}

  scan();
  setTimeout(scan, 1200);
  setTimeout(scan, 4500);
  setTimeout(scan, 9000);
  try { setInterval(scan, 5000); } catch {}
  window.addEventListener('storage', () => schedule(150), false);
  window.addEventListener('pageshow', () => schedule(100), false);
  window.addEventListener('focus', () => schedule(50), false);
  try { document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(50); }, false); } catch {}
})();
