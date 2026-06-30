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

/* BEGIN merged source: src/shared/config.js */
(function initialiseTeamsHelperConfig(global) {
  "use strict";

  const shared = global.TEAMS_HELPER_SHARED || {};
  const apiDefaults = shared.apiDefaults || {};
  const manifestVersion = (() => {
    try {
      return chrome && chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().version || "";
    } catch {
      return "";
    }
  })();

  const defaults = Object.freeze({
    extensionVersion: manifestVersion || "3.0",
    apiBaseUrl: apiDefaults.apiBaseUrl || "https://teams-presence-keeper-api.officialteamshelper.workers.dev",
    workerAuthStartPath: apiDefaults.workerAuthStartPath || "/auth/start",
    minRefreshMinutes: Number(apiDefaults.minRefreshMinutes) || 60,
    betaLabel: apiDefaults.betaLabel || "Public Beta",
    plans: Object.freeze(Object.assign({ monthly: "monthly", annual: "annual" }, apiDefaults.plans || {})),
    allowedExtensionId: apiDefaults.allowedExtensionId || "plolochjncialgjdmnlgendcoeglndla"
  });

  const configSchema = Object.freeze({
    source: "TEAMS_HELPER_CONFIG_OVERRIDES",
    fields: Object.freeze({
      extensionVersion: Object.freeze({ type: "string", fallback: defaults.extensionVersion }),
      apiBaseUrl: Object.freeze({ type: "url", fallback: defaults.apiBaseUrl, trimTrailingSlashes: true }),
      workerAuthStartPath: Object.freeze({ type: "path", fallback: defaults.workerAuthStartPath }),
      minRefreshMinutes: Object.freeze({ type: "positiveNumber", fallback: defaults.minRefreshMinutes }),
      betaLabel: Object.freeze({ type: "string", fallback: defaults.betaLabel }),
      plans: Object.freeze({
        type: "object",
        fields: Object.freeze({
          monthly: Object.freeze({ type: "string", fallback: defaults.plans.monthly }),
          annual: Object.freeze({ type: "string", fallback: defaults.plans.annual })
        })
      }),
      allowedExtensionId: Object.freeze({ type: "string", fallback: defaults.allowedExtensionId })
    })
  });

  function cleanString(value, fallback) {
    const text = String(value == null ? "" : value).trim();
    return text || fallback;
  }

  function cleanPositiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function fieldFallback(name) {
    return configSchema.fields[name] && configSchema.fields[name].fallback;
  }

  function planFieldFallback(name) {
    return configSchema.fields.plans.fields[name] && configSchema.fields.plans.fields[name].fallback;
  }

  function normalizePlans(input) {
    const plans = input && typeof input === "object" ? input : {};
    return Object.freeze({
      monthly: cleanString(plans.monthly, planFieldFallback("monthly")),
      annual: cleanString(plans.annual, planFieldFallback("annual"))
    });
  }

  function normalizeConfig(input) {
    const overrides = input && typeof input === "object" ? input : {};
    return Object.freeze({
      extensionVersion: cleanString(overrides.extensionVersion, fieldFallback("extensionVersion")),
      apiBaseUrl: cleanString(overrides.apiBaseUrl, fieldFallback("apiBaseUrl")).replace(/\/+$/, ""),
      workerAuthStartPath: cleanString(overrides.workerAuthStartPath, fieldFallback("workerAuthStartPath")),
      minRefreshMinutes: cleanPositiveNumber(overrides.minRefreshMinutes, fieldFallback("minRefreshMinutes")),
      betaLabel: cleanString(overrides.betaLabel, fieldFallback("betaLabel")),
      plans: normalizePlans(overrides.plans),
      allowedExtensionId: cleanString(overrides.allowedExtensionId, fieldFallback("allowedExtensionId"))
    });
  }

  const existing = global.TEAMS_HELPER_CONFIG && typeof global.TEAMS_HELPER_CONFIG === "object" ? global.TEAMS_HELPER_CONFIG : {};
  const overrides = global.TEAMS_HELPER_CONFIG_OVERRIDES && typeof global.TEAMS_HELPER_CONFIG_OVERRIDES === "object" ? global.TEAMS_HELPER_CONFIG_OVERRIDES : {};
  global.TEAMS_HELPER_CONFIG_DEFAULTS = defaults;
  global.TEAMS_HELPER_CONFIG_SCHEMA = configSchema;
  global.TEAMS_HELPER_CONFIG = normalizeConfig(Object.assign({}, existing, overrides));
})(globalThis);
/* END merged source: src/shared/config.js */


/* BEGIN production GUI flow controller */
(() => {
  'use strict';

  const shared = globalThis.TEAMS_HELPER_SHARED || {};
  const config = globalThis.TEAMS_HELPER_CONFIG || {};
  const helpers = globalThis.TEAMS_HELPER_RUNTIME_HELPERS || {};
  const appendPath = shared.appendPath || ((base, path) => String(base || '').replace(/\/+$/, '') + String(path || ''));
  const CLOUD_CONFIG_EDIT_URL = appendPath(config.apiBaseUrl || '', '/edit');
  const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const DAY_NUMBER = Object.freeze({ sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 });
  const DAY_NAME = Object.freeze({ sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' });
  const STATUS_NAMES = Object.freeze({
    available: 'Available',
    busy: 'Busy',
    dnd: 'Do not disturb',
    brb: 'Be right back',
    away: 'Away',
    offline: 'Appear offline'
  });
  const STATUS_SHORT = Object.freeze({ available: 'Available', busy: 'Busy', dnd: 'DND', brb: 'BRB', away: 'Away', offline: 'Offline' });
  const STATUS_KEYS = Object.freeze(Object.keys(STATUS_NAMES));
  const ZOOM_LEVELS = Object.freeze([12, 24, 36, 48, 64]);
  const DAY_MINUTES = 1440;
  const MIN_DURATION = 1;
  const TIMELINE_AXIS_HEIGHT = 27;
  const TIMELINE_LANE_MIN_HEIGHT = 50;
  const TIMELINE_BLOCK_TOP = 9;
  const TIMELINE_BLOCK_HEIGHT = 31;
  const TIMELINE_BLOCK_GAP = 5;
  const TIMELINE_ROW_STRIDE = TIMELINE_BLOCK_HEIGHT + TIMELINE_BLOCK_GAP;
  const MAX_RULES_PER_ACCOUNT = 56;
  const UI_STATE_KEY = 'th_popup_gui_flow_v2';
  const EMAIL_LINK_POLL_DELAY_MS = 1200;
  const CONSUMER_TENANT = '9188040d-6c67-4c5b-b112-36a304b66dad';
  const LEGAL_ORIGIN = 'https://home.officialteamshelper.workers.dev';
  const LEGAL_CACHE_KEY = 'th_popup_legal_documents_v1';
  const LEGAL_FETCH_TIMEOUT_MS = 12000;
  const LEGAL_MAX_HTML_BYTES = 300000;
  const LEGAL_DOCUMENTS = Object.freeze({
    privacy: Object.freeze({ kind: 'privacy', title: 'Privacy Policy', url: `${LEGAL_ORIGIN}/privacy`, path: '/privacy', titlePattern: /privacy/i }),
    terms: Object.freeze({ kind: 'terms', title: 'Terms', url: `${LEGAL_ORIGIN}/terms`, path: '/terms', titlePattern: /terms/i })
  });

  const state = {
    status: null,
    runtime: null,
    discoveryAccounts: [],
    screen: 'login',
    busy: false,
    selectedDay: currentDayKey(),
    zoomIndex: 1,
    timelineFit: false,
    selectedBlock: null,
    contextBlock: null,
    contextMenuTarget: null,
    accountOrder: [],
    mutationQueue: Promise.resolve(),
    mutationSequence: 0,
    activeMutationCount: 0,
    pendingAccountMutations: Object.create(null),
    refreshTimer: null,
    noteTimer: null,
    toastTimer: null,
    drag: null,
    billingPeriod: 'monthly',
    flowPlan: 'beta',
    scheduleLogRows: [],
    settingsLoaded: false,
    autoSessionSettings: null,
    renderedAccountSignature: '',
    renderedTimelineSignature: '',
    packageState: null,
    authMode: 'login',
    captchaIdentifier: '',
    emailLinkWaiting: false,
    accountRemoveResolver: null,
    accountRemoveFocus: null,
    accountRemovalInFlight: '',
    legalKind: 'privacy',
    legalRequestId: 0,
    settingsLogResize: null,
    timePickerField: '',
    timePickerAnchor: null,
    timePickerDraft: null,
    suppressEscapeKeyup: false,
    noteSelection: null,
    noteClipboardText: '',
    noteClipboardRequest: 0,
    uiStateScope: ''
  };

  const refs = Object.create(null);

  const customScrollbarControllers = [];
  let timelineFitResizeObserver = null;
  let emptyLanePositionFrame = 0;

  function updateEmptyLaneLabelPositions() {
    emptyLanePositionFrame = 0;
    if (!refs.timelineScroll || !refs.timelineGrid) return;
    const viewportWidth = Math.max(0, refs.timelineScroll.clientWidth);
    const contentWidth = Math.max(viewportWidth, refs.timelineGrid.scrollWidth, timelinePixelWidth());
    const maxScroll = Math.max(0, contentWidth - viewportWidth);
    const visibleLeft = Math.max(0, Math.min(maxScroll, refs.timelineScroll.scrollLeft));
    const centerX = Math.max(0, Math.min(contentWidth, visibleLeft + viewportWidth / 2));
    refs.timelineGrid.style.setProperty('--lane-empty-center-x', `${Math.round(centerX)}px`);
  }

  function requestEmptyLaneLabelPositionUpdate() {
    if (!emptyLanePositionFrame) emptyLanePositionFrame = requestAnimationFrame(updateEmptyLaneLabelPositions);
  }

  function updateCustomScrollbars() {
    customScrollbarControllers.forEach(controller => controller.update());
  }

  function installChordForgeScrollbar(scroller, host, orientation = 'vertical') {
    if (!scroller || !host) return { update() {} };
    const horizontal = orientation === 'horizontal';
    const bar = document.createElement('div');
    bar.className = `terminal-scrollbar${horizontal ? ' horizontal' : ''} hidden`;
    bar.setAttribute('aria-hidden', 'true');
    const thumb = document.createElement('div');
    thumb.className = 'terminal-scrollbar-thumb';
    bar.appendChild(thumb);
    host.appendChild(bar);

    let drag = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      const unavailable = host.hidden || (host.tagName === 'DIALOG' && !host.open) || !host.isConnected;
      const scrollSize = horizontal ? scroller.scrollWidth : scroller.scrollHeight;
      const clientSize = horizontal ? scroller.clientWidth : scroller.clientHeight;
      const overflow = scrollSize - clientSize;
      const trackSize = Math.max(0, (horizontal ? bar.clientWidth : bar.clientHeight) - 2);
      const hidden = unavailable || overflow <= 1 || trackSize <= 0;
      if (horizontal) host.classList.toggle('has-horizontal-scrollbar', !hidden);
      if (hidden) {
        bar.classList.add('hidden');
        if (horizontal) {
          thumb.style.width = '0px';
          thumb.style.transform = 'translateX(0)';
        } else {
          thumb.style.height = '0px';
          thumb.style.transform = 'translateY(0)';
        }
        return;
      }
      bar.classList.remove('hidden');
      const thumbSize = Math.max(24, Math.floor(trackSize * (clientSize / scrollSize)));
      const travel = Math.max(0, trackSize - thumbSize);
      const scrollPosition = horizontal ? scroller.scrollLeft : scroller.scrollTop;
      const offset = travel * (scrollPosition / overflow);
      if (horizontal) {
        thumb.style.width = `${thumbSize}px`;
        thumb.style.transform = `translateX(${Math.round(offset)}px)`;
      } else {
        thumb.style.height = `${thumbSize}px`;
        thumb.style.transform = `translateY(${Math.round(offset)}px)`;
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    scroller.addEventListener('scroll', requestUpdate, { passive: true });
    const contentObserver = new MutationObserver(requestUpdate);
    contentObserver.observe(scroller, { subtree: true, childList: true, attributes: true, characterData: true });
    const hostObserver = new MutationObserver(requestUpdate);
    hostObserver.observe(host, { attributes: true, attributeFilter: ['hidden', 'open', 'class', 'style'] });
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(requestUpdate) : null;
    resizeObserver?.observe(scroller);
    resizeObserver?.observe(host);

    const setScrollFromPointer = event => {
      const barRect = bar.getBoundingClientRect();
      const trackSize = Math.max(1, (horizontal ? bar.clientWidth : bar.clientHeight) - 2);
      const thumbSize = Math.max(1, horizontal ? thumb.offsetWidth : thumb.offsetHeight);
      const travel = Math.max(1, trackSize - thumbSize);
      const pointerPosition = horizontal ? event.clientX - barRect.left : event.clientY - barRect.top;
      const offset = Math.max(0, Math.min(travel, pointerPosition - 1 - drag.grabOffset));
      const overflow = Math.max(0, (horizontal ? scroller.scrollWidth - scroller.clientWidth : scroller.scrollHeight - scroller.clientHeight));
      if (horizontal) scroller.scrollLeft = overflow * (offset / travel);
      else scroller.scrollTop = overflow * (offset / travel);
    };
    const startDrag = event => {
      if (event.button !== 0) return;
      const thumbRect = thumb.getBoundingClientRect();
      const clickedThumb = event.target === thumb || thumb.contains(event.target);
      drag = {
        pointerId: event.pointerId,
        grabOffset: clickedThumb
          ? (horizontal ? event.clientX - thumbRect.left : event.clientY - thumbRect.top)
          : Math.max(1, (horizontal ? thumb.offsetWidth : thumb.offsetHeight) / 2)
      };
      bar.classList.add('dragging');
      bar.setPointerCapture(event.pointerId);
      if (!clickedThumb) setScrollFromPointer(event);
      event.preventDefault();
      event.stopPropagation();
    };
    bar.addEventListener('pointerdown', startDrag);
    bar.addEventListener('pointermove', event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      setScrollFromPointer(event);
      event.preventDefault();
    });
    const stopDrag = event => {
      if (!drag || (event && drag.pointerId !== event.pointerId)) return;
      const pointerId = drag.pointerId;
      drag = null;
      bar.classList.remove('dragging');
      if (bar.hasPointerCapture?.(pointerId)) {
        try { bar.releasePointerCapture(pointerId); } catch {}
      }
    };
    bar.addEventListener('pointerup', stopDrag);
    bar.addEventListener('pointercancel', stopDrag);
    bar.addEventListener('lostpointercapture', () => {
      drag = null;
      bar.classList.remove('dragging');
    });

    bar.addEventListener('wheel', event => {
      const delta = horizontal
        ? (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY)
        : event.deltaY;
      if (!delta) return;
      if (horizontal) scroller.scrollLeft += delta;
      else scroller.scrollTop += delta;
      event.preventDefault();
    }, { passive: false });

    const controller = { update: requestUpdate, orientation };
    customScrollbarControllers.push(controller);
    requestUpdate();
    return controller;
  }

  function installCustomScrollbars() {
    document.querySelectorAll('body > .flow-screen').forEach(screen => {
      if (screen.querySelector(':scope > .th-scroll-viewport')) return;
      const header = screen.querySelector(':scope > header');
      const viewport = document.createElement('div');
      viewport.className = 'th-scroll-viewport';
      let node = header ? header.nextSibling : screen.firstChild;
      while (node) {
        const next = node.nextSibling;
        viewport.appendChild(node);
        node = next;
      }
      screen.appendChild(viewport);
      installChordForgeScrollbar(viewport, screen);
    });

    document.querySelectorAll('.faq-dialog > .faq-body').forEach(scroller => {
      const dialog = scroller.closest('.faq-dialog');
      if (dialog && !dialog.querySelector(':scope > .terminal-scrollbar')) installChordForgeScrollbar(scroller, dialog);
    });

    const timelineScroll = document.getElementById('timelineScroll');
    const timelineShell = timelineScroll && timelineScroll.closest('.timeline-shell');
    if (timelineScroll && timelineShell && !timelineShell.querySelector(':scope > .terminal-scrollbar.horizontal')) {
      installChordForgeScrollbar(timelineScroll, timelineShell, 'horizontal');
    }
    if (timelineScroll && timelineScroll.dataset.emptyLaneSync !== 'true') {
      timelineScroll.dataset.emptyLaneSync = 'true';
      timelineScroll.addEventListener('scroll', requestEmptyLaneLabelPositionUpdate, { passive: true });
    }

    if (timelineScroll && 'ResizeObserver' in window && !timelineFitResizeObserver) {
      let previousWidth = timelineScroll.clientWidth;
      timelineFitResizeObserver = new ResizeObserver(() => {
        const width = timelineScroll.clientWidth;
        if (Math.abs(width - previousWidth) < 1) return;
        previousWidth = width;
        if (!state.timelineFit) return;
        document.documentElement.style.setProperty('--timeline-width', '100%');
        requestAnimationFrame(() => {
          renderTimelineBlocks();
          updateCustomScrollbars();
        });
      });
      timelineFitResizeObserver.observe(timelineScroll);
    }

    window.addEventListener('resize', () => { updateCustomScrollbars(); requestEmptyLaneLabelPositionUpdate(); }, { passive: true });
    globalThis.__TEAMS_HELPER_SCROLLBARS__ = Object.freeze({ update: updateCustomScrollbars });
  }

  function byId(id) { return document.getElementById(id); }
  function text(value) { return String(value == null ? '' : value); }
  function lower(value) { return text(value).trim().toLowerCase(); }
  function deepClone(value) {
    try { return structuredClone(value); } catch {}
    try { return JSON.parse(JSON.stringify(value)); } catch { return value; }
  }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, Number(value) || 0)); }
  function uniqueId(prefix = 'rule') {
    try { return `${prefix}-${crypto.randomUUID()}`; } catch {}
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }
  function currentDayKey() { return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()]; }
  function currentDayNumber() { return DAY_NUMBER[currentDayKey()]; }
  function dayNumber(key) { return Object.prototype.hasOwnProperty.call(DAY_NUMBER, key) ? DAY_NUMBER[key] : 1; }
  function normalizePriority(value) {
    if (value === 'high') return 1;
    if (value === 'normal' || value === '' || value == null) return 0;
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(50, Math.trunc(number))) : 0;
  }
  function normalizeStatus(value) {
    const raw = lower(value).replace(/[^a-z]/g, '');
    const aliases = {
      available: 'available', avail: 'available', online: 'available', active: 'available',
      busy: 'busy', dnd: 'dnd', donotdisturb: 'dnd', focus: 'dnd',
      brb: 'brb', berightback: 'brb', away: 'away', idle: 'away',
      offline: 'offline', invisible: 'offline', offwork: 'offline'
    };
    return aliases[raw] || 'available';
  }
  function normalizeDays(value) {
    const source = Array.isArray(value) ? value : value == null ? [] : [value];
    const days = source.map(item => {
      if (typeof item === 'number' && Number.isFinite(item)) return Math.max(0, Math.min(6, Math.trunc(item)));
      const raw = lower(item).slice(0, 3);
      return Object.prototype.hasOwnProperty.call(DAY_NUMBER, raw) ? DAY_NUMBER[raw] : null;
    }).filter(item => item != null);
    return Array.from(new Set(days)).sort((a, b) => a - b);
  }
  function normalizeTime(value, fallback = '09:00') {
    const match = /^(\d{1,2}):(\d{2})$/.exec(text(value).trim());
    if (!match) return fallback;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return fallback;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  function parseTime(value, fallback = 0) {
    const normalized = normalizeTime(value, '');
    if (!normalized) return fallback;
    const [hours, minutes] = normalized.split(':').map(Number);
    return hours * 60 + minutes;
  }
  function formatMinutes(value) {
    const minutes = Math.max(0, Math.min(1439, Math.round(Number(value) || 0)));
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }
  function normalizeRule(rule, index = 0, mode = 'weekly') {
    const source = rule && typeof rule === 'object' ? deepClone(rule) : {};
    const start = normalizeTime(source.start, '09:00');
    let end = normalizeTime(source.end, '17:00');
    if (parseTime(end) <= parseTime(start)) end = formatMinutes(Math.min(1439, parseTime(start) + 60));
    const out = Object.assign({}, source, {
      id: text(source.id || `${mode}-${index}-${uniqueId('r')}`),
      enabled: source.enabled !== false,
      start,
      end,
      statusKey: normalizeStatus(source.statusKey || source.status || source.availability),
      priority: normalizePriority(source.priority),
      note: text(source.note || '').slice(0, 80),
      allowAvailableDuringCalls: !!(source.allowAvailableDuringCalls || source.allowCalls)
    });
    if (mode === 'exception' || source.mode === 'exception' || source.date) {
      out.mode = 'exception';
      out.date = text(source.date || '').slice(0, 10);
    } else {
      out.days = normalizeDays(source.days).length ? normalizeDays(source.days) : [1, 2, 3, 4, 5];
      if (out.mode === 'exception') delete out.mode;
    }
    return out;
  }
  function normalizeManager(manager) {
    const source = manager && typeof manager === 'object' ? deepClone(manager) : {};
    return Object.assign({}, source, {
      manualStatusKey: normalizeStatus(source.manualStatusKey || source.statusKey || 'available'),
      allowAvailableDuringCalls: !!source.allowAvailableDuringCalls,
      notSeenMode: source.notSeenMode !== false,
      scheduleEnabled: !!source.scheduleEnabled,
      scheduleRules: Array.isArray(source.scheduleRules)
        ? source.scheduleRules.slice(0, MAX_RULES_PER_ACCOUNT).map((rule, index) => normalizeRule(rule, index, 'weekly')).filter(rule => rule.days && rule.days.length)
        : [],
      scheduleExceptions: Array.isArray(source.scheduleExceptions)
        ? source.scheduleExceptions.slice(0, MAX_RULES_PER_ACCOUNT).map((rule, index) => normalizeRule(rule, index, 'exception')).filter(rule => rule.date)
        : []
    });
  }
  function stripAccountKeyPrefixes(value) {
    if (helpers.stripAccountKeyPrefixes) return helpers.stripAccountKeyPrefixes(value);
    return text(value).trim().toLowerCase().replace(/^(?:(?:personal|business|unknown):)+/i, '');
  }
  function accountEmail(account) {
    const rawEmail = text(account && (account.email || account.targetAccountEmail || account.teamsAccountEmail)).trim();
    const strippedEmail = stripAccountKeyPrefixes(rawEmail);
    if (strippedEmail && strippedEmail.includes('@')) return strippedEmail;
    if (rawEmail && rawEmail.includes('@')) return rawEmail;
    const userMri = text(account && (account.userMri || account.mri || account.skypeId)).trim();
    if (userMri) return userMri;
    const rawKey = text(account && account.key).trim();
    const strippedKey = stripAccountKeyPrefixes(rawKey);
    if (strippedKey && strippedKey !== 'default' && !/^unknown(?::|$)/i.test(rawKey)) return strippedKey;
    return 'Identity unavailable';
  }
  function accountType(account) {
    const raw = lower(account && (account.teamsType || account.targetAccountType || account.key));
    const email = lower(accountEmail(account));
    const tenantId = lower(account && (account.accountTid || account.oauthResolvedTid || account.tenantId));
    const homeAccountId = lower(account && account.homeAccountId);
    const homeTenant = homeAccountId.includes('.') ? homeAccountId.slice(homeAccountId.lastIndexOf('.') + 1) : '';
    if (tenantId || /^[0-9a-f-]{36}$/i.test(homeTenant)) return tenantId === CONSUMER_TENANT || homeTenant === CONSUMER_TENANT ? 'personal' : 'business';
    if (/@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(email)) return 'business';
    if (raw === 'business' || raw.startsWith('business:')) return 'business';
    if (raw === 'personal' || raw.startsWith('personal:')) return 'personal';
    if (/@(?:outlook|hotmail|live|msn)\.[^@]+$/i.test(email)) return 'personal';
    return 'unknown';
  }
  function accountTypeLabel(account) {
    const type = accountType(account);
    return type === 'business' ? 'Business' : type === 'personal' ? 'Personal' : 'Unknown';
  }
  function preferredAccountName(value) {
    const candidate = text(value).trim();
    if (!candidate) return '';
    const normalized = lower(candidate);
    if (['personal microsoft account', 'work or school account', 'business account', 'business', 'personal', 'unknown', 'identity unavailable'].includes(normalized)) return '';
    if (/^(?:8:)?(?:live|orgid|skype):/i.test(candidate)) return '';
    return candidate;
  }
  function discoveryAccountFor(account) {
    const key = accountKey(account);
    return state.discoveryAccounts.find(candidate => sameConfiguredIdentity(candidate, account, key)) || null;
  }
  function statusSnapshotDisplayName(account) {
    const snapshot = accountStatusSnapshotForAccount(account);
    if (!snapshot || typeof snapshot !== 'object') return '';
    const profile = snapshot.profile && typeof snapshot.profile === 'object' ? snapshot.profile : {};
    const sources = [
      snapshot.displayName,
      snapshot.name,
      snapshot.accountName,
      snapshot.userDisplayName,
      snapshot.targetAccountName,
      profile.displayName,
      profile.display_name,
      profile.name,
      profile.fullName,
      profile.givenName && profile.surname ? `${profile.givenName} ${profile.surname}` : ''
    ];
    for (const source of sources) {
      const resolved = preferredAccountName(source);
      if (resolved) return resolved;
    }
    return '';
  }
  function accountName(account) {
    const resolvedName = preferredAccountName(account && (account.displayName || account.name || account.fullName));
    if (resolvedName) return resolvedName;
    const discovered = discoveryAccountFor(account);
    const discoveredName = preferredAccountName(discovered && (discovered.displayName || discovered.name || discovered.fullName));
    if (discoveredName) return discoveredName;
    const snapshotName = statusSnapshotDisplayName(account);
    if (snapshotName) return snapshotName;
    const identity = accountEmail(account);
    if (identity.includes('@')) return identity.slice(0, identity.indexOf('@')) || identity;
    const mriName = identity.replace(/^\d+:/, '').replace(/^(?:live|orgid):/i, '').trim();
    return mriName && mriName !== 'Identity unavailable' ? mriName : accountTypeLabel(account);
  }
  function initials(account) {
    const name = accountName(account).replace(/[^a-z0-9]+/gi, ' ').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (!parts.length) return 'TH';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  function accountKey(account) { return text(account && account.key).trim(); }
  function registryFromRuntime(runtime = state.runtime) {
    const registry = runtime && runtime.accountRegistry && typeof runtime.accountRegistry === 'object' ? runtime.accountRegistry : null;
    if (!registry || !registry.accounts || typeof registry.accounts !== 'object') return { activeAccountKey: '', accounts: {} };
    return registry;
  }
  function runtimeAccounts(runtime = state.runtime) {
    const registry = registryFromRuntime(runtime);
    const map = new Map();
    Object.values(registry.accounts || {}).forEach(account => {
      const key = accountKey(account);
      if (key) map.set(key, account);
    });
    const known = new Set(state.accountOrder);
    const additions = Array.from(map.keys()).filter(key => !known.has(key)).sort((left, right) => {
      const a = map.get(left), b = map.get(right);
      return `${accountType(a)}|${lower(accountEmail(a))}|${left}`.localeCompare(`${accountType(b)}|${lower(accountEmail(b))}|${right}`);
    });
    state.accountOrder = state.accountOrder.filter(key => map.has(key)).concat(additions);
    return state.accountOrder.map(key => map.get(key)).filter(Boolean);
  }
  function runtimeEligibleKeySet(runtime = state.runtime) {
    const keys = runtime && Array.isArray(runtime.runtimeEligibleAccountKeys) ? runtime.runtimeEligibleAccountKeys : null;
    return keys ? new Set(keys.map(value => text(value).trim()).filter(Boolean)) : null;
  }
  function runtimeEligibleAccounts(runtime = state.runtime) {
    const accounts = runtimeAccounts(runtime);
    const eligible = runtimeEligibleKeySet(runtime);
    return eligible ? accounts.filter(account => eligible.has(accountKey(account))) : accounts;
  }
  function activeAccountKey(runtime = state.runtime) {
    const registry = registryFromRuntime(runtime);
    const raw = text(registry.activeAccountKey || runtime && (runtime.selectedAccountKey || runtime.accountKey)).trim();
    const eligible = runtimeEligibleKeySet(runtime);
    if (!eligible || eligible.has(raw)) return raw;
    const first = runtimeEligibleAccounts(runtime)[0];
    return first ? accountKey(first) : raw;
  }
  function findAccount(key, runtime = state.runtime) {
    const normalizedKey = text(key).trim();
    const eligible = runtimeEligibleKeySet(runtime);
    if (eligible && !eligible.has(normalizedKey)) return null;
    const registry = registryFromRuntime(runtime);
    return registry.accounts && registry.accounts[normalizedKey] || runtimeEligibleAccounts(runtime).find(account => accountKey(account) === normalizedKey) || null;
  }
  function activeAccount(runtime = state.runtime) {
    return findAccount(activeAccountKey(runtime), runtime) || runtimeEligibleAccounts(runtime)[0] || null;
  }

  function accountMutationConfig(account) {
    const source = account && typeof account === 'object' ? account : {};
    return {
      enabled: !!source.enabled,
      savedManualEnabled: source.savedManualEnabled == null ? null : !!source.savedManualEnabled,
      savedScheduleEnabled: source.savedScheduleEnabled == null ? null : !!source.savedScheduleEnabled,
      manager: normalizeManager(source.manager),
      updatedAt: text(source.updatedAt || '').trim()
    };
  }
  function managerMutationSignature(manager) {
    const normalized = normalizeManager(manager);
    return JSON.stringify({
      manualStatusKey: normalized.manualStatusKey,
      allowAvailableDuringCalls: !!normalized.allowAvailableDuringCalls,
      notSeenMode: normalized.notSeenMode !== false,
      scheduleEnabled: !!normalized.scheduleEnabled,
      scheduleRules: normalized.scheduleRules,
      scheduleExceptions: normalized.scheduleExceptions
    });
  }
  function accountMatchesPendingMutation(account, pending) {
    if (!account || !pending || !pending.account) return false;
    const current = accountMutationConfig(account);
    const desired = accountMutationConfig(pending.account);
    return current.enabled === desired.enabled
      && current.savedManualEnabled === desired.savedManualEnabled
      && current.savedScheduleEnabled === desired.savedScheduleEnabled
      && managerMutationSignature(current.manager) === managerMutationSignature(desired.manager);
  }
  function latestPendingMutationKey(pendingMap = state.pendingAccountMutations) {
    let latestKey = '';
    let latestRevision = -1;
    Object.entries(pendingMap || {}).forEach(([key, pending]) => {
      const revision = Number(pending && pending.revision || 0);
      if (revision > latestRevision) { latestRevision = revision; latestKey = key; }
    });
    return latestKey;
  }
  function mergeRuntimeWithPendingMutations(runtime, pendingMap = state.pendingAccountMutations) {
    const next = deepClone(runtime || {});
    const registry = deepClone(registryFromRuntime(next));
    if (!registry.accounts || typeof registry.accounts !== 'object') registry.accounts = {};
    let changed = false;
    for (const [key, pending] of Object.entries(pendingMap || {})) {
      if (!pending || !pending.account) continue;
      const remote = registry.accounts[key];
      if (pending.committed && remote && accountMatchesPendingMutation(remote, pending)) {
        if (pendingMap === state.pendingAccountMutations && state.pendingAccountMutations[key] === pending) delete state.pendingAccountMutations[key];
        continue;
      }
      if (!remote) continue;
      const desired = accountMutationConfig(pending.account);
      registry.accounts[key] = Object.assign({}, remote, {
        enabled: desired.enabled,
        savedManualEnabled: desired.savedManualEnabled == null ? remote.savedManualEnabled : desired.savedManualEnabled,
        savedScheduleEnabled: desired.savedScheduleEnabled == null ? remote.savedScheduleEnabled : desired.savedScheduleEnabled,
        manager: deepClone(desired.manager),
        updatedAt: desired.updatedAt || remote.updatedAt
      });
      changed = true;
    }
    const pendingFocusKey = latestPendingMutationKey(pendingMap);
    if (pendingFocusKey && registry.accounts[pendingFocusKey]) {
      registry.activeAccountKey = pendingFocusKey;
      next.selectedAccountKey = pendingFocusKey;
      next.accountKey = pendingFocusKey;
      const focused = registry.accounts[pendingFocusKey];
      next.enabled = !!focused.enabled;
      next.manualOverrideEnabled = !!focused.enabled;
      next.manager = deepClone(focused.manager);
      next.targetAccountEmail = focused.email || next.targetAccountEmail || '';
      next.targetAccountType = focused.teamsType || next.targetAccountType || 'unknown';
      changed = true;
    }
    if (changed || next.accountRegistry) next.accountRegistry = registry;
    return next;
  }
  function markPendingMutationCommitted(key, revision) {
    const pending = state.pendingAccountMutations[key];
    if (pending && pending.revision === revision) pending.committed = true;
  }
  function clearPendingMutation(key, revision) {
    const pending = state.pendingAccountMutations[key];
    if (pending && pending.revision === revision) delete state.pendingAccountMutations[key];
  }
  function hasSession(status = state.status) { return !!(status && status.session && status.user); }
  function registeredUserUiScope(status = state.status) {
    const source = status && typeof status === 'object' ? status : {};
    const sessionScope = text(source.session && source.session.registeredUserScope || '').trim().toLowerCase();
    if (sessionScope) return sessionScope;
    const user = source.user && typeof source.user === 'object' ? source.user : {};
    const identity = text(user.id || user.uid || user.userId || user.sub || user.email || user.identifier || '').trim().toLowerCase();
    if (!identity || !hasSession(source)) return 'signed-out';
    let hash = 2166136261;
    for (let index = 0; index < identity.length; index += 1) {
      hash ^= identity.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `u.${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }
  function uiStateStorageKey(scope = registeredUserUiScope()) {
    return `${UI_STATE_KEY}:${text(scope || 'signed-out').trim().toLowerCase() || 'signed-out'}`;
  }
  function runtimeOwnedByRegisteredUser(runtime, scope = registeredUserUiScope()) {
    const source = runtime && typeof runtime === 'object' ? runtime : {};
    const registry = source.accountRegistry && typeof source.accountRegistry === 'object' ? source.accountRegistry : {};
    const owner = text(source.teamsHelperUserScope || source.registeredUserScope || registry.teamsHelperUserScope || registry.registeredUserScope || '').trim().toLowerCase();
    return !!owner && owner === scope;
  }
  function resetPopupRuntimeForRegisteredUserChange() {
    state.runtime = null;
    state.discoveryAccounts = [];
    state.selectedBlock = null;
    state.contextBlock = null;
    state.contextMenuTarget = null;
    state.pendingAccountMutations = Object.create(null);
    state.activeMutationCount = 0;
    state.renderedAccountSignature = '';
    state.renderedTimelineSignature = '';
    state.accountOrder = [];
  }
  function runtimePolicy(status = state.status) { return status && status.runtimePolicy && typeof status.runtimePolicy === 'object' ? status.runtimePolicy : {}; }
  function hasRuntimeAccess(status = state.status) {
    const policy = runtimePolicy(status);
    const entitlement = lower(policy.entitlement || 'none');
    const beta = lower(policy.betaStatus || 'none');
    const subscription = lower(policy.subscriptionStatus || 'none');
    return entitlement === 'paid' || entitlement === 'beta' || entitlement === 'beta-approved' || beta === 'approved'
      || ['active', 'trialing', 'past_due', 'unpaid', 'incomplete'].includes(subscription);
  }
  function settingsAndDiagnosticsUnlocked(status = state.status) {
    return state.screen === 'app' && hasSession(status) && hasRuntimeAccess(status);
  }
  function settingsAccessBlockedMessage(status = state.status) {
    if (!hasSession(status)) return 'Sign in before opening settings and diagnostics.';
    if (!hasRuntimeAccess(status)) return 'Complete beta or subscription access before opening settings and diagnostics.';
    return 'Open the control center before using settings and diagnostics.';
  }
  function syncSettingsAndDiagnosticsAccess() {
    const unlocked = settingsAndDiagnosticsUnlocked();
    if (refs.appMenuSettings) {
      refs.appMenuSettings.hidden = !unlocked;
      refs.appMenuSettings.disabled = !unlocked;
      refs.appMenuSettings.setAttribute('aria-hidden', String(!unlocked));
      refs.appMenuSettings.setAttribute('aria-disabled', String(!unlocked));
    }
    if (refs.settingsBtn) {
      refs.settingsBtn.disabled = !unlocked;
      refs.settingsBtn.setAttribute('aria-disabled', String(!unlocked));
    }
    if (!unlocked && refs.settingsDialog && refs.settingsDialog.open) refs.settingsDialog.close();
    return unlocked;
  }
  function subscriptionActive() {
    const policy = runtimePolicy();
    return lower(policy.entitlement) === 'paid' || ['active', 'trialing', 'past_due', 'unpaid', 'incomplete'].includes(lower(policy.subscriptionStatus));
  }
  function betaRequestPending(status = state.status) {
    const policy = runtimePolicy(status);
    const betaStatus = lower(policy.betaStatus || 'none');
    return betaStatus === 'pending' || (betaStatus === 'none' && policy.betaRequested === true);
  }

  function send(type, payload) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(Object.assign({ type }, payload || {}), response => {
          const error = chrome.runtime.lastError;
          if (error) return reject(new Error(error.message || String(error)));
          if (!response || response.ok === false) {
            const failure = new Error(response && response.error || 'Request failed');
            if (response && response.status != null) failure.status = response.status;
            if (response && response.code) failure.code = response.code;
            if (response && response.payload) failure.payload = response.payload;
            if (response && response.path) failure.path = response.path;
            return reject(failure);
          }
          resolve(response);
        });
      } catch (error) { reject(error); }
    });
  }
  async function openTab(url) {
    if (!url) return;
    if (chrome.tabs && chrome.tabs.create) await chrome.tabs.create({ url });
    else window.open(url, '_blank', 'noopener');
  }

  function showToast(message, tone = '', timeout = 4200) {
    if (!refs.appToast) return;
    clearTimeout(state.toastTimer);
    refs.appToast.textContent = text(message);
    refs.appToast.className = `app-toast ${tone || ''}`.trim();
    refs.appToast.hidden = !message;
    if (message && timeout > 0) state.toastTimer = window.setTimeout(() => { refs.appToast.hidden = true; }, timeout);
  }
  function setFlowMessage(element, message, tone = '') {
    if (!element) return;
    element.textContent = text(message);
    element.className = `flow-status ${tone || ''}`.trim();
  }
  function setBusy(busy, screen = null) {
    state.busy = !!busy;
    document.querySelectorAll('.flow-screen').forEach(node => node.setAttribute('aria-busy', String(!!busy)));
    if (screen) screen.setAttribute('aria-busy', String(!!busy));
    document.querySelectorAll('[data-disable-while-busy]').forEach(node => { node.disabled = !!busy; });
  }
  function setScreen(name) {
    const map = { login: refs.loginScreen, access: refs.accessScreen, discovery: refs.discoveryScreen, app: refs.appScreen };
    if (!map[name]) name = 'login';
    state.screen = name;
    Object.entries(map).forEach(([key, node]) => { if (node) node.hidden = key !== name; });
    if (name !== 'app') hideAppMenu();
    syncSettingsAndDiagnosticsAccess();
    requestAnimationFrame(updateCustomScrollbars);
    document.dispatchEvent(new CustomEvent('teamshelper:flowstate', { detail: { screen: name, signedIn: hasSession(), access: hasRuntimeAccess() } }));
  }

  function statusIcon(status) {
    const key = normalizeStatus(status);
    if (key === 'available') return '<svg fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle></svg>';
    if (key === 'busy') return '<svg fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle><rect fill="#101216" height="2" rx="1" width="8" x="8" y="11"></rect></svg>';
    if (key === 'dnd') return '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle><path d="M8.5 12h7"></path></svg>';
    if (key === 'away' || key === 'brb') return '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle><path d="M12 8v4l2.6 1.6"></path></svg>';
    return '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle></svg>';
  }
  function accountStatusSnapshotForAccount(account) {
    const key = accountKey(account);
    const email = lower(accountEmail(account));
    const type = accountType(account);
    const byAccount = state.runtime && state.runtime.accountStatuses || {};
    const belongsToAccount = snapshot => {
      if (!snapshot || typeof snapshot !== 'object') return false;
      const snapshotKey = text(snapshot.accountKey || '').trim();
      if (key && snapshotKey) return snapshotKey === key;
      const snapshotEmail = lower(snapshot.accountEmail || '');
      const snapshotType = lower(snapshot.accountType || '');
      return !!(email && snapshotEmail && email === snapshotEmail && (!snapshotType || snapshotType === type));
    };

    const direct = key && byAccount[key] && typeof byAccount[key] === 'object' ? byAccount[key] : null;
    if (direct && belongsToAccount(direct)) return direct;

    const matches = Object.values(byAccount).filter(belongsToAccount);
    if (matches.length === 1) return matches[0];
    return null;
  }
  function confirmationStateForAccount(account) {
    const manager = normalizeManager(account && account.manager);
    const statusSnapshot = accountStatusSnapshotForAccount(account);
    if (statusSnapshot && statusSnapshot.statusKey) {
      const snapshotState = lower(statusSnapshot.state);
      const visualState = /error|fail|sign-in-required|verification-failed/.test(snapshotState)
        ? 'error'
        : /retry|connecting|pending|queued|running|applying|verifying|repair/.test(snapshotState)
          ? 'pending'
          : /connected|maintained|succeeded|ready/.test(snapshotState) || statusSnapshot.lastSuccessAt
            ? 'confirmed'
            : 'idle';
      return { status: normalizeStatus(statusSnapshot.statusKey), state: visualState, snapshot: statusSnapshot };
    }
    const scheduled = resolveScheduleStatus(manager, new Date());
    return { status: normalizeStatus(account && account.enabled ? manager.manualStatusKey : scheduled && scheduled.statusKey || manager.manualStatusKey), state: 'idle', snapshot: null };
  }
  function resolveScheduleStatus(managerInput, date) {
    const manager = normalizeManager(managerInput);
    if (!manager.scheduleEnabled) return null;
    const day = date.getDay();
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const minute = date.getHours() * 60 + date.getMinutes();
    const candidates = [];
    for (const rule of manager.scheduleExceptions) {
      if (rule.enabled !== false && rule.date === dateKey && minute >= parseTime(rule.start) && minute < parseTime(rule.end)) candidates.push(Object.assign({ exception: true }, rule));
    }
    for (const rule of manager.scheduleRules) {
      if (rule.enabled !== false && normalizeDays(rule.days).includes(day) && minute >= parseTime(rule.start) && minute < parseTime(rule.end)) candidates.push(Object.assign({ exception: false }, rule));
    }
    candidates.sort((a, b) => Number(b.exception) - Number(a.exception) || normalizePriority(b.priority) - normalizePriority(a.priority));
    return candidates[0] || null;
  }

  function renderAuthMode(options = {}) {
    const creating = state.authMode === 'create';
    if (refs.flowAuthKicker) refs.flowAuthKicker.textContent = creating ? 'New account' : 'Account access';
    if (refs.flowAuthTitle) refs.flowAuthTitle.textContent = creating ? 'Create your account.' : 'Welcome back.';
    if (refs.flowAuthCopy) refs.flowAuthCopy.textContent = creating
      ? 'Create an account here, then continue directly to access setup.'
      : 'Sign in here to discover your Teams accounts and manage presence schedules.';
    if (refs.flowLoginSubmit) refs.flowLoginSubmit.innerHTML = creating ? 'Create account <span aria-hidden="true">→</span>' : 'Log in <span aria-hidden="true">→</span>';
    if (refs.flowCreate) refs.flowCreate.textContent = creating ? 'Back to login' : 'Create account';
    if (refs.flowForgot) refs.flowForgot.hidden = creating;
    const rememberLabel = refs.flowRemember && refs.flowRemember.closest('.flow-check');
    if (rememberLabel) rememberLabel.hidden = creating;
    if (refs.flowPassword) refs.flowPassword.autocomplete = creating ? 'new-password' : 'current-password';
    if (options.focus && refs.flowIdentity) refs.flowIdentity.focus();
  }

  function renderLogin() {
    const status = state.status;
    const user = status && status.user;
    if (user && refs.flowIdentity && !refs.flowIdentity.value) refs.flowIdentity.value = user.email || user.username || '';
    renderAuthMode();
    if (!hasSession(status) && refs.flowLoginStatus && !refs.flowLoginStatus.textContent) {
      setFlowMessage(refs.flowLoginStatus, 'Enter your username or email and password.');
    }
  }
  function renderAccess() {
    const policy = runtimePolicy();
    const user = state.status && state.status.user;
    const active = hasRuntimeAccess();
    const pending = betaRequestPending() && !active;
    if (refs.flowAccessIdentity) refs.flowAccessIdentity.textContent = user ? (user.email || user.username || user.name || 'Signed in') : 'Signed in account';
    if (refs.flowAccessTitle) refs.flowAccessTitle.textContent = pending ? 'Pending beta request.' : 'Choose access.';
    if (refs.flowAccessCopy) refs.flowAccessCopy.textContent = pending
      ? 'Your beta request is waiting for review. You can keep waiting or purchase a subscription for immediate access.'
      : 'Select how this account should enter the Teams Helper control center.';

    const betaInput = document.querySelector('input[name="flowPlan"][value="beta"]');
    const subscriptionInput = document.querySelector('input[name="flowPlan"][value="subscription"]');
    if (subscriptionActive() || pending) state.flowPlan = 'subscription';
    else if (lower(policy.betaStatus) === 'approved' || lower(policy.entitlement).includes('beta')) state.flowPlan = 'beta';

    if (betaInput) {
      betaInput.checked = state.flowPlan === 'beta';
      betaInput.disabled = pending;
    }
    if (subscriptionInput) subscriptionInput.checked = state.flowPlan === 'subscription';
    if (refs.flowPendingBeta) refs.flowPendingBeta.hidden = !pending;
    if (refs.flowBetaPlan) refs.flowBetaPlan.hidden = pending;
    if (refs.flowBilling) refs.flowBilling.classList.toggle('visible', state.flowPlan === 'subscription' && !subscriptionActive());
    if (refs.flowBetaNoteField) refs.flowBetaNoteField.hidden = pending || state.flowPlan !== 'beta';
    document.querySelectorAll('[data-flow-period]').forEach(button => button.classList.toggle('active', button.dataset.flowPeriod === state.billingPeriod));

    const betaPlan = refs.flowBetaPlan || betaInput && betaInput.closest('.flow-plan');
    const subscriptionPlan = refs.flowSubscriptionPlan || subscriptionInput && subscriptionInput.closest('.flow-plan');
    if (betaPlan) {
      const copy = betaPlan.querySelector('.flow-plan-copy');
      if (copy) copy.textContent = lower(policy.betaStatus) === 'approved' ? 'Approved for this account.' : 'Early access while testing continues.';
    }
    if (subscriptionPlan) {
      const copy = subscriptionPlan.querySelector('.flow-plan-copy');
      if (copy) copy.textContent = subscriptionActive()
        ? `Subscription ${policy.subscriptionStatus || 'active'}.`
        : pending
          ? 'Purchase access now while your beta request remains pending.'
          : 'Ongoing access and cloud-backed settings.';
    }
    if (refs.flowAccessSubmit) refs.flowAccessSubmit.innerHTML = pending
      ? 'Buy subscription <span aria-hidden="true">→</span>'
      : 'Continue <span aria-hidden="true">→</span>';

    if (active) setFlowMessage(refs.flowAccessStatus, 'Access is active. Continue to account discovery.', 'good');
    else if (pending) setFlowMessage(refs.flowAccessStatus, 'Your beta request remains pending while you consider a subscription.');
    else setFlowMessage(refs.flowAccessStatus, 'Choose beta access or a subscription plan.');
  }

  function discoveryCheckIcon() {
    return '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="m8.5 12 2.2 2.2 4.8-5"></path></svg>';
  }
  function renderDiscovery(accounts = state.discoveryAccounts) {
    if (!refs.flowDiscoveryList) return;
    accounts = Array.isArray(accounts) ? accounts.filter(account => account && account.source !== 'teams-helper-origin-registry') : [];
    refs.flowDiscoveryList.textContent = '';
    if (!accounts.length) {
      const placeholder = document.createElement('div');
      placeholder.className = 'flow-discovery-placeholder';
      placeholder.textContent = 'No signed-in Teams identity could be resolved yet.';
      refs.flowDiscoveryList.appendChild(placeholder);
    } else {
      accounts.forEach(account => {
        const row = document.createElement('div');
        row.className = 'flow-discovery-row';
        const avatar = document.createElement('div');
        avatar.className = 'flow-discovery-avatar';
        avatar.textContent = initials(account);
        const copy = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'flow-discovery-name';
        name.textContent = accountName(account);
        const id = document.createElement('div');
        id.className = 'flow-discovery-id';
        id.textContent = `${accountTypeLabel(account)} · ${accountEmail(account)}`;
        copy.append(name, id);
        const confirm = document.createElement('div');
        confirm.className = 'flow-confirm-icon';
        confirm.setAttribute('aria-label', 'Account confirmed');
        confirm.innerHTML = discoveryCheckIcon();
        row.append(avatar, copy, confirm);
        refs.flowDiscoveryList.appendChild(row);
      });
    }
    if (refs.flowOpenControl) refs.flowOpenControl.disabled = !accounts.length;
    if (refs.flowDiscoveryProgress) refs.flowDiscoveryProgress.classList.toggle('complete', !!accounts.length);
    if (refs.flowDiscoveryStatus) refs.flowDiscoveryStatus.textContent = accounts.length
      ? `${accounts.length} Teams account${accounts.length === 1 ? '' : 's'} identified without opening Teams.`
      : 'No signed-in Teams identity could be resolved. Sign in to Teams in this browser, then retry; no Teams tab needs to stay open.';
  }

  function renderNoSeen(accounts) {
    if (!refs.noSeenToggle) return;
    const enabledCount = accounts.filter(account => normalizeManager(account.manager).notSeenMode !== false).length;
    const allEnabled = accounts.length > 0 && enabledCount === accounts.length;
    const mixed = enabledCount > 0 && enabledCount < accounts.length;
    refs.noSeenToggle.setAttribute('aria-checked', mixed ? 'mixed' : String(allEnabled));
    refs.noSeenToggle.dataset.mixed = String(mixed);
    refs.noSeenToggle.title = mixed ? 'No Seen mixed across accounts' : `No Seen ${allEnabled ? 'on' : 'off'}`;
    refs.noSeenToggle.setAttribute('aria-label', refs.noSeenToggle.title);
    refs.noSeenToggle.classList.toggle('mixed', mixed);
  }

  function renderAccounts() {
    const accounts = runtimeEligibleAccounts();
    if (refs.accountCount) refs.accountCount.textContent = `${accounts.length} confirmed`;
    if (!refs.accountsList) return;
    const accountStatus = state.runtime && state.runtime.accountStatus || null;
    const accountStatuses = state.runtime && state.runtime.accountStatuses || {};
    const confirmationSignature = [
      accountStatus ? [accountStatus.accountEmail, accountStatus.accountType, accountStatus.statusKey, accountStatus.state, accountStatus.updatedAt] : [],
      Object.entries(accountStatuses).map(([statusKey, status]) => [statusKey, status && status.accountEmail, status && status.accountType, status && status.statusKey, status && status.state, status && status.updatedAt])
    ];
    const signature = JSON.stringify([activeAccountKey(), accounts.map(account => [accountKey(account), account.enabled, normalizeManager(account.manager).manualStatusKey, normalizeManager(account.manager).scheduleEnabled, normalizeManager(account.manager).notSeenMode, account.updatedAt, account.displayName, account.name, account.fullName, accountName(account)]), confirmationSignature]);
    if (signature === state.renderedAccountSignature && refs.accountsList.querySelector('.account-card')) {
      renderNoSeen(accounts);
      return;
    }
    state.renderedAccountSignature = signature;
    refs.accountsList.textContent = '';
    if (!accounts.length) {
      const empty = document.createElement('div');
      empty.className = 'accounts-empty';
      empty.textContent = 'No signed-in Teams account has been identified yet. Use refresh to retry.';
      refs.accountsList.appendChild(empty);
      renderNoSeen(accounts);
      return;
    }
    accounts.forEach(account => {
      const key = accountKey(account);
      const manager = normalizeManager(account.manager);
      const mode = account.enabled ? 'manual' : 'schedule';
      const confirmation = confirmationStateForAccount(account);
      const card = document.createElement('article');
      card.className = 'account-card';
      card.dataset.accountKey = key;
      card.dataset.accountName = accountName(account);
      card.dataset.presenceMode = mode;

      const head = document.createElement('div');
      head.className = 'account-head';
      const identity = document.createElement('div');
      identity.className = 'identity';
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = initials(account);
      const identityCopy = document.createElement('div');
      identityCopy.className = 'identity-copy';
      const name = document.createElement('div');
      name.className = 'account-name';
      name.textContent = accountName(account);
      name.title = accountEmail(account);
      const id = document.createElement('div');
      id.className = 'account-id';
      const typeBadge = document.createElement('span');
      typeBadge.className = 'account-type-badge';
      typeBadge.textContent = accountTypeLabel(account);
      const email = document.createElement('span');
      email.className = 'account-email';
      email.textContent = accountEmail(account);
      id.append(typeBadge, email);
      identityCopy.append(name, id);
      identity.append(avatar, identityCopy);

      const modes = document.createElement('div');
      modes.className = 'account-mode';
      modes.setAttribute('role', 'group');
      modes.setAttribute('aria-label', `Presence source for ${accountName(account)}`);
      ['schedule', 'manual'].forEach(value => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'account-mode-button';
        button.dataset.accountMode = value;
        button.setAttribute('aria-pressed', String(mode === value));
        button.setAttribute('aria-label', `Use ${value === 'manual' ? 'manual override' : 'schedule'} for ${accountName(account)}`);
        button.textContent = value === 'manual' ? 'Manual' : 'Schedule';
        button.addEventListener('click', () => setAccountMode(key, value));
        modes.appendChild(button);
      });

      const confirm = document.createElement('div');
      confirm.className = 'status-confirm';
      confirm.dataset.confirm = confirmation.status;
      confirm.dataset.state = confirmation.state;
      confirm.innerHTML = statusIcon(confirmation.status);
      confirm.setAttribute('role', 'status');
      confirm.setAttribute('aria-live', 'polite');
      const confirmationLabel = confirmation.state === 'confirmed' ? 'Confirmed' : confirmation.state === 'pending' ? 'Pending' : confirmation.state === 'error' ? 'Failed' : 'Unverified';
      confirm.setAttribute('aria-label', `${confirmationLabel} ${STATUS_NAMES[confirmation.status].toLowerCase()}`);
      confirm.title = confirm.getAttribute('aria-label');
      head.append(identity, modes, confirm);

      const controls = document.createElement('div');
      controls.className = 'account-controls';
      const options = document.createElement('div');
      options.className = 'status-options';
      options.classList.toggle('is-disabled', mode !== 'manual');
      options.setAttribute('role', 'group');
      options.setAttribute('aria-label', mode === 'manual' ? `Manual status for ${accountName(account)}` : `Manual status unavailable while ${accountName(account)} uses Schedule`);
      options.setAttribute('aria-disabled', String(mode !== 'manual'));
      ['available', 'busy', 'dnd', 'away', 'offline'].forEach(status => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'status-button';
        button.dataset.status = status;
        button.title = STATUS_NAMES[status];
        button.setAttribute('aria-label', STATUS_NAMES[status]);
        button.setAttribute('aria-pressed', String(manager.manualStatusKey === status));
        button.disabled = mode !== 'manual';
        button.setAttribute('aria-disabled', String(mode !== 'manual'));
        button.innerHTML = statusIcon(status);
        button.addEventListener('click', () => setManualStatus(key, status));
        options.appendChild(button);
      });
      controls.appendChild(options);
      card.append(head, controls);
      refs.accountsList.appendChild(card);
    });
    renderNoSeen(accounts);
  }

  function ruleRange(rule) {
    const start = parseTime(rule && rule.start, 540);
    let end = parseTime(rule && rule.end, 1020);
    if (end <= start) end = Math.min(1439, start + MIN_DURATION);
    return { start, end, duration: Math.max(MIN_DURATION, end - start) };
  }
  function blockToken(accountKeyValue, ruleId, day) { return `${accountKeyValue}::${ruleId}::${day}`; }
  function parseBlockToken(token) {
    const parts = text(token).split('::');
    return parts.length >= 3 ? { accountKey: parts[0], ruleId: parts.slice(1, -1).join('::'), day: Number(parts[parts.length - 1]) } : null;
  }
  function blocksForSelectedDay(runtime = state.runtime) {
    const day = dayNumber(state.selectedDay);
    const blocks = [];
    runtimeAccounts(runtime).forEach(account => {
      const key = accountKey(account);
      const manager = normalizeManager(account.manager);
      manager.scheduleRules.forEach(rule => {
        if (rule.enabled !== false && normalizeDays(rule.days).includes(day)) {
          const range = ruleRange(rule);
          blocks.push({ token: blockToken(key, rule.id, day), accountKey: key, ruleId: rule.id, day, rule, ...range });
        }
      });
    });
    return blocks.sort((a, b) => state.accountOrder.indexOf(a.accountKey) - state.accountOrder.indexOf(b.accountKey) || a.start - b.start || a.end - b.end || normalizePriority(b.rule.priority) - normalizePriority(a.rule.priority));
  }
  function selectedBlockData() {
    if (!state.selectedBlock) return null;
    return blocksForSelectedDay().find(block => block.token === state.selectedBlock.token) || null;
  }
  function renderAxis() {
    if (!refs.axisTrack) return;
    refs.axisTrack.textContent = '';
    for (let hour = 0; hour <= 24; hour += 3) {
      const tick = document.createElement('span');
      tick.className = 'axis-tick';
      tick.style.left = `${(hour / 24) * 100}%`;
      tick.textContent = hour === 24 ? '24:00' : `${String(hour).padStart(2, '0')}:00`;
      refs.axisTrack.appendChild(tick);
    }
  }
  function timelinePixelWidth() {
    if (state.timelineFit && refs.timelineScroll && refs.timelineScroll.clientWidth > 0) {
      return refs.timelineScroll.clientWidth;
    }
    return ZOOM_LEVELS[state.zoomIndex] * 24;
  }
  function applyTimelineWidth() {
    const width = timelinePixelWidth();
    document.documentElement.style.setProperty('--timeline-width', state.timelineFit ? '100%' : `${width}px`);
    return width;
  }
  function setZoom(index, keepCenter = true, preserveFit = false) {
    const oldWidth = timelinePixelWidth();
    const viewport = refs.timelineScroll ? refs.timelineScroll.clientWidth : 0;
    const oldCenterMinute = refs.timelineScroll ? ((refs.timelineScroll.scrollLeft + viewport / 2) / Math.max(1, oldWidth)) * DAY_MINUTES : 720;
    state.zoomIndex = clamp(index, 0, ZOOM_LEVELS.length - 1);
    if (!preserveFit) state.timelineFit = false;
    const width = applyTimelineWidth();
    if (refs.zoomRange) refs.zoomRange.value = String(state.zoomIndex);
    if (refs.timelineScroll) requestAnimationFrame(() => {
      if (keepCenter) refs.timelineScroll.scrollLeft = Math.max(0, (oldCenterMinute / DAY_MINUTES) * width - viewport / 2);
      else if (state.timelineFit) refs.timelineScroll.scrollLeft = 0;
      renderTimelineBlocks();
      updateCustomScrollbars();
    });
    saveUiState();
  }
  function fit24Hours() {
    if (!refs.timelineScroll) return;
    state.timelineFit = true;
    applyTimelineWidth();
    refs.timelineScroll.scrollLeft = 0;
    requestAnimationFrame(() => {
      renderTimelineBlocks();
      updateCustomScrollbars();
    });
    saveUiState();
  }
  function renderTimelineStructure() {
    const accounts = runtimeAccounts();
    if (refs.scheduleSection) refs.scheduleSection.hidden = !accounts.length;
    document.documentElement.style.setProperty('--account-count', String(Math.max(1, accounts.length)));
    if (!refs.timelineLabels || !refs.timelineGrid) return;
    refs.timelineLabels.querySelectorAll('.lane-label').forEach(node => node.remove());
    refs.timelineGrid.querySelectorAll('.lane-track').forEach(node => node.remove());
    accounts.forEach(account => {
      const key = accountKey(account);
      const label = document.createElement('div');
      label.className = 'lane-label';
      label.dataset.accountLabel = key;
      label.title = `${accountTypeLabel(account)} · ${accountEmail(account)}`;
      label.textContent = accountName(account);
      label.classList.toggle('manual-source', !!account.enabled);
      refs.timelineLabels.appendChild(label);
      const lane = document.createElement('div');
      lane.className = 'lane-track';
      lane.dataset.account = key;
      lane.setAttribute('aria-label', `${accountName(account)} schedule lane`);
      lane.classList.toggle('manual-source', !!account.enabled);
      const emptyCopy = document.createElement('div');
      emptyCopy.className = 'lane-empty-copy';
      emptyCopy.textContent = 'No blocks';
      lane.appendChild(emptyCopy);
      lane.addEventListener('dblclick', event => {
        if (event.target !== lane) return;
        const rect = lane.getBoundingClientRect();
        const minute = clamp(((event.clientX - rect.left) / Math.max(1, rect.width)) * DAY_MINUTES, 0, 1439);
        addBlock(key, minute);
      });
      refs.timelineGrid.appendChild(lane);
    });
    renderAxis();
    populateAccountField(accounts);
  }
  function assignTimelineRows(blocks) {
    const rowEnds = [];
    return blocks.slice().sort((a, b) => a.start - b.start || a.end - b.end || normalizePriority(b.rule && b.rule.priority) - normalizePriority(a.rule && a.rule.priority) || text(a.ruleId).localeCompare(text(b.ruleId))).map(block => {
      let row = rowEnds.findIndex(end => block.start >= end);
      if (row < 0) row = rowEnds.length;
      rowEnds[row] = block.end;
      return Object.assign({}, block, { stackRow: row });
    });
  }
  function effectiveTimelineBlocks(blocks = blocksForSelectedDay(), drag = null) {
    if (!drag || !drag.original || !drag.preview) return blocks;
    const previewToken = blockToken(drag.preview.accountKey, drag.original.ruleId, drag.original.day);
    return blocks.map(block => block.token === drag.original.token ? Object.assign({}, block, drag.preview, {
      accountKey: drag.preview.accountKey,
      start: drag.preview.start,
      end: drag.preview.end,
      duration: drag.preview.duration,
      token: previewToken
    }) : block);
  }
  function timelineLaneHeight(rowCount) {
    return Math.max(TIMELINE_LANE_MIN_HEIGHT, TIMELINE_BLOCK_TOP + Math.max(1, rowCount) * TIMELINE_BLOCK_HEIGHT + Math.max(0, rowCount - 1) * TIMELINE_BLOCK_GAP + 10);
  }
  function layoutTimelineRows(blocks = blocksForSelectedDay(), drag = null) {
    if (!refs.timelineGrid || !refs.timelineLabels) return;
    const accounts = runtimeAccounts();
    const effectiveBlocks = effectiveTimelineBlocks(blocks, drag);
    const rowsByAccount = new Map();
    effectiveBlocks.forEach(block => {
      if (!rowsByAccount.has(block.accountKey)) rowsByAccount.set(block.accountKey, []);
      rowsByAccount.get(block.accountKey).push(block);
    });
    const heights = [];
    accounts.forEach(account => {
      const key = accountKey(account);
      const assigned = assignTimelineRows(rowsByAccount.get(key) || []);
      const rowCount = Math.max(1, assigned.reduce((max, block) => Math.max(max, Number(block.stackRow) + 1), 0));
      const startingRowCount = drag && drag.baseRowCounts ? Math.max(1, Number(drag.baseRowCounts[key]) || 1) : 1;
      const layoutRowCount = drag ? Math.max(rowCount, startingRowCount) : rowCount;
      const laneHeight = timelineLaneHeight(layoutRowCount);
      heights.push(laneHeight);
      const lane = Array.from(refs.timelineGrid.querySelectorAll('.lane-track')).find(node => node.dataset.account === key);
      const label = Array.from(refs.timelineLabels.querySelectorAll('.lane-label')).find(node => node.dataset.accountLabel === key);
      if (lane) {
        lane.style.height = `${laneHeight}px`;
        lane.dataset.stackRows = String(rowCount);
        lane.dataset.layoutRows = String(layoutRowCount);
      }
      if (label) label.style.height = `${laneHeight}px`;
      assigned.forEach(block => {
        const element = Array.from(refs.timelineGrid.querySelectorAll('.schedule-block')).find(node => node.dataset.token === block.token || node.dataset.ruleId === block.ruleId && Number(node.dataset.day) === Number(block.day) && node.dataset.accountKey === block.accountKey);
        if (!element) return;
        element.style.top = `${TIMELINE_BLOCK_TOP + Number(block.stackRow) * TIMELINE_ROW_STRIDE}px`;
        element.dataset.stackRow = String(block.stackRow);
      });
    });
    const rowTemplate = `${TIMELINE_AXIS_HEIGHT}px ${heights.map(height => `${height}px`).join(' ')}`.trim();
    refs.timelineGrid.style.gridTemplateRows = rowTemplate;
    refs.timelineLabels.style.gridTemplateRows = rowTemplate;
  }

  function populateAccountField(accounts = runtimeAccounts()) {
    if (!refs.accountField) return;
    const prior = refs.accountField.value;
    refs.accountField.textContent = '';
    accounts.forEach(account => {
      const option = document.createElement('option');
      option.value = accountKey(account);
      option.textContent = `${accountName(account)} · ${accountTypeLabel(account)}`;
      refs.accountField.appendChild(option);
    });
    if (accounts.some(account => accountKey(account) === prior)) refs.accountField.value = prior;
  }
  function syncBlockElement(element, block) {
    const width = timelinePixelWidth();
    const left = (block.start / DAY_MINUTES) * width;
    const blockWidth = Math.max(7, (block.duration / DAY_MINUTES) * width);
    element.style.left = `${left}px`;
    element.style.width = `${blockWidth}px`;
    element.dataset.tone = normalizeStatus(block.rule.statusKey);
    element.dataset.token = block.token;
    element.dataset.accountKey = block.accountKey;
    element.dataset.ruleId = block.ruleId;
    element.dataset.day = String(block.day);
    element.setAttribute('aria-selected', String(state.selectedBlock && state.selectedBlock.token === block.token));
    element.title = `${STATUS_NAMES[normalizeStatus(block.rule.statusKey)]} · ${formatMinutes(block.start)}–${formatMinutes(block.end)} · priority ${normalizePriority(block.rule.priority)}`;
    const label = element.querySelector('.block-label');
    if (label) label.textContent = blockWidth < 54 ? STATUS_SHORT[normalizeStatus(block.rule.statusKey)] : `${STATUS_SHORT[normalizeStatus(block.rule.statusKey)]} ${formatMinutes(block.start)}–${formatMinutes(block.end)}`;
  }
  function renderTimelineBlocks() {
    if (!refs.timelineGrid || state.drag) return;
    const accounts = runtimeAccounts();
    const structureSignature = accounts.map(account => `${accountKey(account)}:${!!account.enabled}:${accountName(account)}`).join('|');
    if (refs.timelineGrid.dataset.structureSignature !== structureSignature) {
      refs.timelineGrid.dataset.structureSignature = structureSignature;
      renderTimelineStructure();
    }
    refs.timelineGrid.querySelectorAll('.schedule-block').forEach(node => node.remove());
    const blocks = blocksForSelectedDay();
    const counts = new Map();
    blocks.forEach(block => counts.set(block.accountKey, (counts.get(block.accountKey) || 0) + 1));
    refs.timelineGrid.querySelectorAll('.lane-track').forEach(lane => lane.classList.toggle('empty', !counts.get(lane.dataset.account)));
    blocks.forEach(block => {
      const lane = Array.from(refs.timelineGrid.querySelectorAll('.lane-track')).find(node => node.dataset.account === block.accountKey);
      if (!lane) return;
      const element = document.createElement('div');
      element.className = 'schedule-block';
      element.tabIndex = 0;
      element.innerHTML = '<span class="resize-handle start" data-resize="start"></span><span class="block-label"></span><span class="resize-handle end" data-resize="end"></span>';
      syncBlockElement(element, block);
      attachBlockEvents(element);
      lane.appendChild(element);
    });
    layoutTimelineRows(blocks);
    if (refs.blockCount) refs.blockCount.textContent = `${blocks.length} total block${blocks.length === 1 ? '' : 's'}`;
    updateEditor();
    requestEmptyLaneLabelPositionUpdate();
  }
  function renderTimeline() {
    renderTimelineBlocks();
  }
  function attachBlockEvents(element) {
    element.addEventListener('click', event => {
      event.stopPropagation();
      selectBlock(element.dataset.token, true);
    });
    element.addEventListener('contextmenu', event => {
      event.preventDefault();
      event.stopPropagation();
      selectBlock(element.dataset.token, false);
      openAppMenu(event.clientX, event.clientY, { kind: 'block', token: element.dataset.token }, event.target);
    });
    element.addEventListener('keydown', event => {
      if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); deleteSelectedBlock(); }
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectBlock(element.dataset.token, true); }
    });
    element.addEventListener('pointerdown', beginBlockDrag);
  }
  function selectBlock(token, revealEditor = true) {
    const parsed = parseBlockToken(token);
    state.selectedBlock = parsed ? { token, ...parsed } : null;
    renderTimelineBlocks();
    if (revealEditor && refs.editorPanel && state.selectedBlock) refs.editorPanel.open = true;
  }
  function setEditorDisabled(disabled) {
    const isDisabled = !!disabled;
    [refs.accountField, refs.statusField, refs.startField, refs.endField, refs.priorityField, refs.callsField, refs.noteField, refs.deleteBtn, refs.startFieldButton, refs.endFieldButton].forEach(control => {
      if (!control) return;
      control.disabled = isDisabled;
      if (control === refs.startFieldButton || control === refs.endFieldButton) control.setAttribute('aria-disabled', String(isDisabled));
    });
    if (disabled && state.timePickerField) closeTimePicker();
  }
  function syncPriorityReadout() {
    if (refs.priorityValue && refs.priorityField) refs.priorityValue.textContent = String(normalizePriority(refs.priorityField.value));
  }
  function timePickerPartsFromMinutes(value) {
    const minutes = Math.max(0, Math.min(1439, Math.round(Number(value) || 0)));
    const rawHour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const meridiem = rawHour >= 12 ? 'PM' : 'AM';
    const hour = rawHour % 12 || 12;
    return { hour, minute, meridiem };
  }
  function timePickerPartsFromFieldValue(value, fallback = 540) {
    return timePickerPartsFromMinutes(parseTime(value, fallback));
  }
  function timePickerMinutesFromParts(parts) {
    const minute = Math.max(0, Math.min(59, Number(parts && parts.minute) || 0));
    const meridiem = text(parts && parts.meridiem).toUpperCase() === 'PM' ? 'PM' : 'AM';
    let hour = Math.max(1, Math.min(12, Number(parts && parts.hour) || 12));
    let rawHour = hour % 12;
    if (meridiem === 'PM') rawHour += 12;
    return rawHour * 60 + minute;
  }
  function formatTimePickerParts(parts) {
    return `${String(Math.max(1, Math.min(12, Number(parts && parts.hour) || 12))).padStart(2, '0')}:${String(Math.max(0, Math.min(59, Number(parts && parts.minute) || 0))).padStart(2, '0')} ${text(parts && parts.meridiem).toUpperCase() === 'PM' ? 'PM' : 'AM'}`;
  }
  function syncTimeFieldDisplays() {
    if (refs.startFieldDisplay && refs.startField) refs.startFieldDisplay.textContent = formatTimePickerParts(timePickerPartsFromFieldValue(refs.startField.value, 540));
    if (refs.endFieldDisplay && refs.endField) refs.endFieldDisplay.textContent = formatTimePickerParts(timePickerPartsFromFieldValue(refs.endField.value, 600));
  }
  function ensureTimePickerOptions() {
    const build = (container, kind, values) => {
      if (!container) return;
      if (!container.childElementCount) {
        const fragment = document.createDocumentFragment();
        values.forEach(value => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'time-picker-option';
          button.dataset.kind = kind;
          button.dataset.value = String(value);
          button.textContent = kind === 'meridiem' ? String(value) : String(value).padStart(2, '0');
          fragment.appendChild(button);
        });
        container.appendChild(fragment);
      }
      if (container.dataset.customScrollbar !== 'true') {
        const host = container.closest('.time-picker-scroll-host');
        if (host) {
          installChordForgeScrollbar(container, host);
          container.dataset.customScrollbar = 'true';
        }
      }
    };
    build(refs.timePickerHours, 'hour', Array.from({ length: 12 }, (_, index) => index + 1));
    build(refs.timePickerMinutes, 'minute', Array.from({ length: 60 }, (_, index) => index));
    build(refs.timePickerMeridiem, 'meridiem', ['AM', 'PM']);
    requestAnimationFrame(updateCustomScrollbars);
  }
  function updateTimePickerSelection() {
    if (!refs.timePicker || refs.timePicker.hidden || !state.timePickerDraft) return;
    ensureTimePickerOptions();
    const { hour, minute, meridiem } = state.timePickerDraft;
    [refs.timePickerHours, refs.timePickerMinutes, refs.timePickerMeridiem].forEach(container => {
      if (!container) return;
      container.querySelectorAll('.time-picker-option').forEach(option => {
        const kind = option.dataset.kind;
        const raw = option.dataset.value;
        const selected = (kind === 'hour' && Number(raw) === hour) || (kind === 'minute' && Number(raw) === minute) || (kind === 'meridiem' && raw === meridiem);
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
    });
    if (refs.timePickerPreview) refs.timePickerPreview.textContent = formatTimePickerParts(state.timePickerDraft);
  }
  function revealTimePickerSelection() {
    if (!state.timePickerDraft) return;
    const map = [
      [refs.timePickerHours, `.time-picker-option[data-kind="hour"][data-value="${state.timePickerDraft.hour}"]`],
      [refs.timePickerMinutes, `.time-picker-option[data-kind="minute"][data-value="${state.timePickerDraft.minute}"]`],
      [refs.timePickerMeridiem, `.time-picker-option[data-kind="meridiem"][data-value="${state.timePickerDraft.meridiem}"]`]
    ];
    map.forEach(([container, selector]) => {
      const target = container && container.querySelector(selector);
      if (target) target.scrollIntoView({ block: 'center', inline: 'nearest' });
    });
  }
  function timeFieldButtonFor(fieldId) {
    return fieldId === 'endField' ? refs.endFieldButton : refs.startFieldButton;
  }
  function positionTimePicker() {
    if (!refs.timePicker || refs.timePicker.hidden || !state.timePickerAnchor) return;
    const rect = state.timePickerAnchor.getBoundingClientRect();
    const width = refs.timePicker.offsetWidth || 172;
    const height = refs.timePicker.offsetHeight || 286;
    const margin = 8;
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + width > window.innerWidth - margin) left = Math.max(margin, window.innerWidth - width - margin);
    if (top + height > window.innerHeight - margin) top = Math.max(margin, rect.top - height - 6);
    refs.timePicker.style.left = `${Math.round(left)}px`;
    refs.timePicker.style.top = `${Math.round(top)}px`;
  }
  function applyTimePickerDraft() {
    const fieldId = state.timePickerField;
    const field = fieldId && refs[fieldId];
    if (!field || !state.timePickerDraft) return;
    const nextValue = formatMinutes(timePickerMinutesFromParts(state.timePickerDraft));
    if (field.value !== nextValue) {
      field.value = nextValue;
      syncTimeFieldDisplays();
      field.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      syncTimeFieldDisplays();
    }
  }
  function closeTimePicker() {
    if (!state.timePickerField) return;
    applyTimePickerDraft();
    const button = timeFieldButtonFor(state.timePickerField);
    if (button) {
      button.dataset.open = 'false';
      button.setAttribute('aria-expanded', 'false');
    }
    if (refs.timePicker) refs.timePicker.hidden = true;
    state.timePickerField = '';
    state.timePickerAnchor = null;
    state.timePickerDraft = null;
  }
  function openTimePicker(fieldId) {
    const field = refs[fieldId];
    const button = timeFieldButtonFor(fieldId);
    if (!selectedBlockData()) {
      if (state.timePickerField) closeTimePicker();
      return;
    }
    if (!field || !button || field.disabled || button.disabled) return;
    if (state.timePickerField && state.timePickerField !== fieldId) closeTimePicker();
    if (state.timePickerField === fieldId && refs.timePicker && !refs.timePicker.hidden) {
      closeTimePicker();
      return;
    }
    ensureTimePickerOptions();
    state.timePickerField = fieldId;
    state.timePickerAnchor = button;
    state.timePickerDraft = timePickerPartsFromFieldValue(field.value, fieldId === 'endField' ? 600 : 540);
    if (refs.timePickerTitle) refs.timePickerTitle.textContent = fieldId === 'endField' ? 'End time' : 'Start time';
    if (refs.timePicker) refs.timePicker.hidden = false;
    button.dataset.open = 'true';
    button.setAttribute('aria-expanded', 'true');
    updateTimePickerSelection();
    positionTimePicker();
    requestAnimationFrame(() => {
      positionTimePicker();
      revealTimePickerSelection();
      updateCustomScrollbars();
    });
  }
  function currentNoteSelection() {
    if (!refs.noteField) return { start: 0, end: 0, direction: 'none' };
    const length = text(refs.noteField.value).length;
    const start = Math.max(0, Math.min(length, Number(refs.noteField.selectionStart) || 0));
    const end = Math.max(start, Math.min(length, Number(refs.noteField.selectionEnd) || start));
    return { start, end, direction: refs.noteField.selectionDirection || 'none' };
  }
  function restoreNoteSelection(selection = state.noteSelection, focus = true) {
    if (!refs.noteField || !selection) return;
    const length = text(refs.noteField.value).length;
    const start = Math.max(0, Math.min(length, Number(selection.start) || 0));
    const end = Math.max(start, Math.min(length, Number(selection.end) || start));
    if (focus) refs.noteField.focus({ preventScroll: true });
    try { refs.noteField.setSelectionRange(start, end, selection.direction || 'none'); } catch {}
    state.noteSelection = { start, end, direction: selection.direction || 'none' };
  }
  function selectedNoteText(selection = state.noteSelection || currentNoteSelection()) {
    if (!refs.noteField || !selection || selection.end <= selection.start) return '';
    return text(refs.noteField.value).slice(selection.start, selection.end);
  }
  async function readNoteClipboardText() {
    if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') return '';
    try { return text(await navigator.clipboard.readText()); } catch { return ''; }
  }
  async function writeNoteClipboardText(value) {
    const content = text(value);
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(content);
      return;
    }
    restoreNoteSelection(state.noteSelection || currentNoteSelection());
    document.execCommand('copy');
  }
  function hideNoteContextMenu({ restore = false } = {}) {
    if (!refs.noteContextMenu) return;
    refs.noteContextMenu.hidden = true;
    refs.noteContextMenu.style.left = '';
    refs.noteContextMenu.style.top = '';
    state.noteClipboardText = '';
    state.noteClipboardRequest += 1;
    if (restore && state.noteSelection) restoreNoteSelection(state.noteSelection);
  }
  function positionNoteContextMenu(clientX, clientY) {
    if (!refs.noteContextMenu) return;
    refs.noteContextMenu.style.left = '0px';
    refs.noteContextMenu.style.top = '0px';
    refs.noteContextMenu.hidden = false;
    const rect = refs.noteContextMenu.getBoundingClientRect();
    const margin = 8;
    const left = Math.max(margin, Math.min(clientX, window.innerWidth - rect.width - margin));
    const top = Math.max(margin, Math.min(clientY, window.innerHeight - rect.height - margin));
    refs.noteContextMenu.style.left = `${Math.round(left)}px`;
    refs.noteContextMenu.style.top = `${Math.round(top)}px`;
  }
  async function openNoteContextMenu(clientX, clientY) {
    if (!refs.noteField || refs.noteField.disabled || !refs.noteContextMenu) return;
    hideAppMenu();
    const selection = state.noteSelection || currentNoteSelection();
    state.noteSelection = selection;
    restoreNoteSelection(selection);
    const selected = selectedNoteText(selection);
    refs.noteMenuCopy.hidden = !selected;
    refs.noteMenuPaste.hidden = true;
    refs.noteMenuHint.textContent = selected ? 'Selection preserved.' : 'Select text to copy.';
    positionNoteContextMenu(clientX, clientY);
    const request = ++state.noteClipboardRequest;
    const clipboardText = await readNoteClipboardText();
    if (request !== state.noteClipboardRequest || refs.noteContextMenu.hidden) return;
    state.noteClipboardText = clipboardText;
    refs.noteMenuPaste.hidden = !clipboardText;
    if (selected && clipboardText) refs.noteMenuHint.textContent = 'Copy selection or paste from clipboard.';
    else if (clipboardText) refs.noteMenuHint.textContent = 'Paste at the current selection.';
    else if (selected) refs.noteMenuHint.textContent = 'Copy selected text.';
    else refs.noteMenuHint.textContent = 'Clipboard is empty.';
    positionNoteContextMenu(clientX, clientY);
    restoreNoteSelection(selection);
  }
  async function copyBlockNote(selectionOnly = false) {
    if (!refs.noteField || refs.noteField.disabled) return;
    const selection = state.noteSelection || currentNoteSelection();
    const selected = selectedNoteText(selection);
    const value = selectionOnly ? selected : (selected || text(refs.noteField.value));
    if (!value) return;
    await writeNoteClipboardText(value);
    restoreNoteSelection(selection);
    showToast(selected ? 'Selected note text copied.' : 'Block note copied.', 'good');
  }
  async function pasteBlockNote(clipboardValue = null) {
    if (!refs.noteField || refs.noteField.disabled) return;
    const pasted = clipboardValue == null ? await readNoteClipboardText() : text(clipboardValue);
    if (!pasted) return;
    const selection = state.noteSelection || currentNoteSelection();
    const value = text(refs.noteField.value);
    const selectedLength = selection.end - selection.start;
    const available = Math.max(0, 80 - (value.length - selectedLength));
    const insertion = pasted.slice(0, available);
    restoreNoteSelection(selection);
    refs.noteField.setRangeText(insertion, selection.start, selection.end, 'end');
    state.noteSelection = currentNoteSelection();
    refs.noteField.dispatchEvent(new Event('input', { bubbles: true }));
    await applyEditorFields();
    restoreNoteSelection(state.noteSelection);
    showToast('Block note pasted.', 'good');
  }
  function updateEditor() {
    const block = selectedBlockData();
    if (!block) {
      setEditorDisabled(true);
      syncPriorityReadout();
      syncTimeFieldDisplays();
      if (refs.editorSummary) refs.editorSummary.textContent = 'Select a block to edit';
      if (refs.selectionReadout) refs.selectionReadout.innerHTML = '<span>Select a block</span><strong>0 selected</strong>';
      return;
    }
    setEditorDisabled(false);
    if (refs.accountField) refs.accountField.value = block.accountKey;
    if (refs.statusField) refs.statusField.value = normalizeStatus(block.rule.statusKey);
    if (refs.startField) refs.startField.value = formatMinutes(block.start);
    if (refs.endField) refs.endField.value = formatMinutes(block.end);
    if (refs.priorityField) refs.priorityField.value = String(normalizePriority(block.rule.priority));
    if (refs.callsField) refs.callsField.checked = !!block.rule.allowAvailableDuringCalls;
    if (refs.noteField && document.activeElement !== refs.noteField) refs.noteField.value = text(block.rule.note || '');
    syncPriorityReadout();
    syncTimeFieldDisplays();
    const account = findAccount(block.accountKey);
    const summary = `${account ? accountName(account) : block.accountKey} · ${STATUS_NAMES[normalizeStatus(block.rule.statusKey)]} · ${formatMinutes(block.start)}–${formatMinutes(block.end)}`;
    if (refs.editorSummary) refs.editorSummary.textContent = summary;
    if (refs.selectionReadout) refs.selectionReadout.innerHTML = `<span>${summary}</span><strong>1 selected</strong>`;
  }

  function buildRuntimePayload(runtime, reason, focusKey) {
    const registry = deepClone(registryFromRuntime(runtime));
    let key = text(focusKey || registry.activeAccountKey || activeAccountKey(runtime)).trim();
    if (!registry.accounts[key]) key = Object.keys(registry.accounts || {})[0] || '';
    registry.activeAccountKey = key;
    const account = registry.accounts[key];
    if (!account) throw new Error('No Teams account is available for this update.');
    account.manager = normalizeManager(account.manager);
    const scheduleActive = account.manager.scheduleEnabled && account.manager.scheduleRules.some(rule => rule.enabled !== false);
    return {
      enabled: !!account.enabled,
      runtimeEnabled: !!account.enabled || !!scheduleActive,
      manualOverrideEnabled: !!account.enabled,
      reason: reason || 'popup-gui-update',
      at: new Date().toISOString(),
      pageUrl: account.pageUrl || runtime && runtime.pageUrl || (shared.pageUrlForType ? shared.pageUrlForType(account.teamsType) : ''),
      baseUrl: account.baseUrl || runtime && runtime.baseUrl || (shared.presenceBaseUrlForType ? shared.presenceBaseUrlForType(account.teamsType) : ''),
      endpointId: account.endpointId || runtime && runtime.endpointId || '',
      headers: deepClone(account.headers || {}),
      endpointBody: deepClone(account.endpointBody || null),
      forceBody: deepClone(account.forceBody || null),
      activityBody: deepClone(account.activityBody || null),
      manager: deepClone(account.manager),
      cloudEnabled: !!(runtime && typeof runtime.cloudEnabled === 'boolean' ? runtime.cloudEnabled : registry.cloudEnabled),
      accountRegistry: registry,
      selectedAccountKey: key,
      accountKey: key,
      sourceAccountKey: key,
      forceAccountKey: key,
      teamsAccountEmail: account.email || '',
      targetAccountEmail: account.email || '',
      targetAccountType: account.teamsType || 'unknown',
      userMri: account.userMri || null,
      lastCallState: deepClone(runtime && runtime.lastCallState || null)
    };
  }
  function mutateRegistry(reason, focusKey, mutator, successMessage = 'Saved.') {
    if (!hasRuntimeAccess()) {
      const denied = Promise.resolve(null);
      showToast('Active beta or subscription access is required.', 'error', 7000);
      return denied;
    }
    let prepared;
    try {
      const nextRuntime = mergeRuntimeWithPendingMutations(deepClone(state.runtime || {}));
      const registry = deepClone(registryFromRuntime(nextRuntime));
      if (!registry.accounts || typeof registry.accounts !== 'object') throw new Error('No Teams accounts are available.');
      const key = text(focusKey || registry.activeAccountKey || Object.keys(registry.accounts)[0]).trim();
      if (!registry.accounts[key]) throw new Error('The selected Teams account is no longer available.');
      mutator(registry, key);
      registry.activeAccountKey = key;
      nextRuntime.accountRegistry = registry;
      nextRuntime.selectedAccountKey = key;
      nextRuntime.accountKey = key;
      const active = registry.accounts[key];
      active.manager = normalizeManager(active.manager);
      nextRuntime.manager = deepClone(active.manager);
      nextRuntime.manualOverrideEnabled = !!active.enabled;
      nextRuntime.enabled = !!active.enabled;
      nextRuntime.targetAccountEmail = active.email || '';
      nextRuntime.targetAccountType = active.teamsType || 'unknown';
      const revision = ++state.mutationSequence;
      const mutationId = `popup-${Date.now().toString(36)}-${revision.toString(36)}`;
      state.pendingAccountMutations[key] = {
        revision,
        mutationId,
        reason: reason || 'popup-gui-update',
        account: deepClone(active),
        committed: false,
        createdAt: Date.now()
      };
      state.runtime = nextRuntime;
      state.renderedAccountSignature = '';
      if (refs.saveState) refs.saveState.textContent = 'Saving…';
      renderApp();
      prepared = { key, revision, mutationId, nextRuntime: deepClone(nextRuntime), payload: buildRuntimePayload(nextRuntime, reason, key) };
    } catch (error) {
      if (refs.saveState) refs.saveState.textContent = 'Save failed';
      showToast(error && error.message || error, 'error', 7000);
      return Promise.resolve(null);
    }

    const operation = async () => {
      state.activeMutationCount += 1;
      try {
        const response = await send('th_kaUpdate', { config: prepared.payload, clientMutationId: prepared.mutationId });
        markPendingMutationCommitted(prepared.key, prepared.revision);
        let confirmedRuntime = response && response.state || null;
        if (!confirmedRuntime) {
          const fallback = await send('th_getState', { forceCloud: false });
          confirmedRuntime = fallback && fallback.state || prepared.nextRuntime;
        }
        state.runtime = mergeRuntimeWithPendingMutations(confirmedRuntime);
        state.renderedAccountSignature = '';
        renderApp();
        const stillPending = state.pendingAccountMutations[prepared.key];
        if (refs.saveState) refs.saveState.textContent = stillPending ? 'Saving latest…' : 'Saved';
        if (!stillPending || stillPending.revision === prepared.revision) showToast(successMessage, 'good');
        return state.runtime;
      } catch (error) {
        clearPendingMutation(prepared.key, prepared.revision);
        if (refs.saveState) refs.saveState.textContent = 'Save failed';
        showToast(error && error.message || error, 'error', 7000);
        try {
          const response = await send('th_getState', { forceCloud: false });
          state.runtime = mergeRuntimeWithPendingMutations(response && response.state || prepared.nextRuntime);
          state.renderedAccountSignature = '';
          renderApp();
        } catch {}
        return state.runtime;
      } finally {
        state.activeMutationCount = Math.max(0, state.activeMutationCount - 1);
      }
    };

    state.mutationQueue = state.mutationQueue.then(operation, operation);
    return state.mutationQueue;
  }
  function setAccountMode(key, mode) {
    return mutateRegistry(mode === 'manual' ? 'manager-manual-toggle' : 'manager-schedule-toggle', key, registry => {
      const account = registry.accounts[key];
      const manager = normalizeManager(account.manager);
      if (mode === 'manual') {
        account.enabled = true;
        account.savedManualEnabled = true;
      } else {
        account.enabled = false;
        account.savedManualEnabled = false;
        manager.scheduleEnabled = true;
        account.savedScheduleEnabled = true;
      }
      account.manager = manager;
      account.updatedAt = new Date().toISOString();
    }, `${mode === 'manual' ? 'Manual override' : 'Schedule'} selected for ${accountName(findAccount(key))}.`);
  }
  function setManualStatus(key, status) {
    const current = findAccount(key);
    if (!current || !current.enabled) {
      showToast('Switch this account to Manual before choosing a status.', 'warn');
      return Promise.resolve(null);
    }
    const normalized = normalizeStatus(status);
    return mutateRegistry('manager-presence-status', key, registry => {
      const account = registry.accounts[key];
      if (!account || !account.enabled) throw new Error('Manual mode is not enabled for this account.');
      const manager = normalizeManager(account.manager);
      manager.manualStatusKey = normalized;
      account.manager = manager;
      account.savedManualEnabled = true;
      account.updatedAt = new Date().toISOString();
    }, `${STATUS_NAMES[normalized]} queued for ${accountName(findAccount(key))}.`);
  }
  async function toggleNoSeen() {
    const accounts = runtimeAccounts();
    if (!accounts.length) return;
    const allEnabled = accounts.every(account => normalizeManager(account.manager).notSeenMode !== false);
    setBusy(true, refs.appScreen);
    try {
      const response = await send('th_setNoSeenMode', { enabled: !allEnabled, accountKeys: accounts.map(accountKey) });
      state.runtime = response.state || state.runtime;
      state.renderedAccountSignature = '';
      renderApp();
      showToast(`No Seen turned ${!allEnabled ? 'on' : 'off'} for all discovered accounts.`, 'good');
    } catch (error) { showToast(error.message || error, 'error'); }
    finally { setBusy(false, refs.appScreen); }
  }

  function runtimeWithoutAccount(runtime, key) {
    const targetKey = text(key).trim();
    const next = runtime && typeof runtime === 'object' ? deepClone(runtime) : runtime;
    if (!next || !targetKey) return next;
    const registry = next.accountRegistry && typeof next.accountRegistry === 'object'
      ? next.accountRegistry
      : { activeAccountKey: '', accounts: {} };
    registry.accounts = registry.accounts && typeof registry.accounts === 'object' ? registry.accounts : {};
    delete registry.accounts[targetKey];
    const remainingKeys = Object.keys(registry.accounts);
    if (!remainingKeys.includes(registry.activeAccountKey)) registry.activeAccountKey = remainingKeys[0] || '';
    next.accountRegistry = registry;
    next.selectedAccountKey = registry.activeAccountKey || null;
    next.accountKey = registry.activeAccountKey || null;
    if (Array.isArray(next.runtimeEligibleAccountKeys)) next.runtimeEligibleAccountKeys = next.runtimeEligibleAccountKeys.filter(value => text(value).trim() !== targetKey);
    if (next.accountStatuses && typeof next.accountStatuses === 'object') {
      next.accountStatuses = Object.assign({}, next.accountStatuses);
      delete next.accountStatuses[targetKey];
    }
    if (next.accountStatus && text(next.accountStatus.accountKey).trim() === targetKey) {
      next.accountStatus = registry.activeAccountKey && next.accountStatuses && next.accountStatuses[registry.activeAccountKey] || null;
    }
    return next;
  }

  function personalStableIdentity(account, fallbackKey = '') {
    if (!account || accountType(account) !== 'personal') return '';
    const key = lower(accountKey(account) || fallbackKey);
    const cidKey = key.match(/^personal:cid\.([0-9a-f]{8,64})$/i);
    if (cidKey) return `cid:${cidKey[1]}`;
    const directCid = lower(account.cid || account.consumerCid || '');
    if (/^[0-9a-f]{8,64}$/i.test(directCid)) return `cid:${directCid}`;
    const mri = lower(account.userMri || account.mri || account.skypeId || '');
    const mriCid = mri.match(/^(?:8:)?live:\.cid\.([0-9a-f]{8,64})$/i);
    if (mriCid) return `cid:${mriCid[1]}`;
    const home = lower(account.homeAccountId || '');
    return home ? `home:${home}` : '';
  }
  function sameConfiguredIdentity(candidate, removed, key) {
    if (!candidate || !removed) return false;
    if (accountKey(candidate) === text(key).trim()) return true;
    if (accountType(candidate) !== accountType(removed)) return false;
    const candidateStable = personalStableIdentity(candidate);
    const removedStable = personalStableIdentity(removed, key);
    if (candidateStable || removedStable) return !!candidateStable && !!removedStable && candidateStable === removedStable;
    const candidateEmail = lower(accountEmail(candidate));
    const removedEmail = lower(accountEmail(removed));
    if (candidateEmail && removedEmail && candidateEmail !== 'identity unavailable' && candidateEmail === removedEmail) return true;
    const identityFields = ['accountOid', 'oauthResolvedOid'];
    return identityFields.some(field => {
      const left = lower(candidate[field]);
      const right = lower(removed[field]);
      return !!left && !!right && left === right;
    });
  }

  function applyLocalAccountRemoval(key, account, runtime = state.runtime) {
    state.runtime = runtimeWithoutAccount(runtime, key);
    state.discoveryAccounts = state.discoveryAccounts.filter(candidate => !sameConfiguredIdentity(candidate, account, key));
    state.accountOrder = state.accountOrder.filter(value => value !== key);
    if (state.selectedBlock && state.selectedBlock.accountKey === key) state.selectedBlock = null;
    if (state.contextMenuTarget && state.contextMenuTarget.accountKey === key) state.contextMenuTarget = null;
    state.renderedAccountSignature = '';
    state.renderedTimelineSignature = '';
    renderApp();
  }

  function settleAccountRemoveDialog(confirmed) {
    const resolve = state.accountRemoveResolver;
    state.accountRemoveResolver = null;
    const focus = state.accountRemoveFocus;
    state.accountRemoveFocus = null;
    if (refs.accountRemoveDialog && refs.accountRemoveDialog.open) refs.accountRemoveDialog.close(confirmed ? 'remove' : 'cancel');
    if (resolve) resolve(!!confirmed);
    if (focus && typeof focus.focus === 'function' && document.contains(focus)) window.setTimeout(() => focus.focus(), 0);
  }

  function confirmAccountRemoval(account) {
    if (!refs.accountRemoveDialog || typeof refs.accountRemoveDialog.showModal !== 'function') {
      return Promise.reject(new Error('The account removal dialog is unavailable.'));
    }
    if (state.accountRemoveResolver) settleAccountRemoveDialog(false);
    if (refs.accountRemoveName) refs.accountRemoveName.textContent = accountName(account);
    if (refs.accountRemoveIdentity) refs.accountRemoveIdentity.textContent = `${accountTypeLabel(account)} · ${accountEmail(account)}`;
    state.accountRemoveFocus = document.activeElement;
    return new Promise(resolve => {
      state.accountRemoveResolver = resolve;
      refs.accountRemoveDialog.showModal();
      window.setTimeout(() => refs.accountRemoveCancel && refs.accountRemoveCancel.focus(), 0);
    });
  }

  async function removeConfiguredAccount(key) {
    if (state.accountRemovalInFlight) return;
    const account = findAccount(key);
    if (!account) throw new Error('The selected account is no longer configured.');
    if (!(await confirmAccountRemoval(account))) return;
    const previous = {
      runtime: deepClone(state.runtime),
      discoveryAccounts: deepClone(state.discoveryAccounts),
      accountOrder: state.accountOrder.slice(),
      selectedBlock: deepClone(state.selectedBlock)
    };
    state.accountRemovalInFlight = key;
    setBusy(true, refs.appScreen);
    applyLocalAccountRemoval(key, account);
    showToast(`Removing ${accountName(account)}…`, 'warn', 0);
    try {
      const response = await send('th_removeAccount', { accountKey: key });
      applyLocalAccountRemoval(key, account, response.state || state.runtime);
      showToast(`${accountName(account)} removed. Scan again to add it back.`, 'good');
    } catch (error) {
      state.runtime = previous.runtime;
      state.discoveryAccounts = previous.discoveryAccounts;
      state.accountOrder = previous.accountOrder;
      state.selectedBlock = previous.selectedBlock;
      state.renderedAccountSignature = '';
      state.renderedTimelineSignature = '';
      renderApp();
      showToast(`Could not remove ${accountName(account)}: ${error && error.message || error}`, 'error', 7000);
      return false;
    } finally {
      state.accountRemovalInFlight = '';
      setBusy(false, refs.appScreen);
    }
  }

  function findRule(registry, accountKeyValue, ruleId) {
    const account = registry.accounts[accountKeyValue];
    if (!account) return null;
    const manager = normalizeManager(account.manager);
    const index = manager.scheduleRules.findIndex(rule => rule.id === ruleId);
    return index >= 0 ? { account, manager, index, rule: manager.scheduleRules[index] } : null;
  }
  function ensureSingleDayRule(registry, accountKeyValue, ruleId, day) {
    const found = findRule(registry, accountKeyValue, ruleId);
    if (!found) return null;
    const days = normalizeDays(found.rule.days);
    if (days.length === 1 && days[0] === day) return { ...found, ruleId };
    const remaining = days.filter(item => item !== day);
    const clone = normalizeRule(Object.assign({}, found.rule, { id: uniqueId('rule'), days: [day] }), found.manager.scheduleRules.length, 'weekly');
    if (remaining.length) {
      found.manager.scheduleRules[found.index] = Object.assign({}, found.rule, { days: remaining });
      found.manager.scheduleRules.push(clone);
    } else {
      found.manager.scheduleRules[found.index] = clone;
    }
    found.account.manager = found.manager;
    return { account: found.account, manager: found.manager, index: found.manager.scheduleRules.findIndex(rule => rule.id === clone.id), rule: clone, ruleId: clone.id };
  }
  function removeRuleDay(registry, accountKeyValue, ruleId, day) {
    const found = findRule(registry, accountKeyValue, ruleId);
    if (!found) return null;
    const remaining = normalizeDays(found.rule.days).filter(item => item !== day);
    if (remaining.length) found.manager.scheduleRules[found.index] = Object.assign({}, found.rule, { days: remaining });
    else found.manager.scheduleRules.splice(found.index, 1);
    found.account.manager = found.manager;
    return found.rule;
  }
  function applyBlockPatch(patch, reason = 'manager-rule-update') {
    const selected = selectedBlockData();
    if (!selected) return Promise.resolve();
    const sourceKey = selected.accountKey;
    const targetKey = text(patch.accountKey || sourceKey);
    const day = selected.day;
    return mutateRegistry(reason, targetKey, registry => {
      if (targetKey !== sourceKey) {
        const original = removeRuleDay(registry, sourceKey, selected.ruleId, day);
        if (!original) throw new Error('The selected schedule block no longer exists.');
        const target = registry.accounts[targetKey];
        if (!target) throw new Error('The target Teams account is no longer available.');
        const manager = normalizeManager(target.manager);
        const moved = normalizeRule(Object.assign({}, original, patch, { id: uniqueId('rule'), days: [day] }), manager.scheduleRules.length, 'weekly');
        delete moved.accountKey;
        manager.scheduleRules.push(moved);
        manager.scheduleEnabled = true;
        target.manager = manager;
        target.updatedAt = new Date().toISOString();
        state.selectedBlock = { token: blockToken(targetKey, moved.id, day), accountKey: targetKey, ruleId: moved.id, day };
      } else {
        const single = ensureSingleDayRule(registry, sourceKey, selected.ruleId, day);
        if (!single) throw new Error('The selected schedule block no longer exists.');
        const next = normalizeRule(Object.assign({}, single.rule, patch, { id: single.ruleId, days: [day] }), single.index, 'weekly');
        delete next.accountKey;
        single.manager.scheduleRules[single.index] = next;
        single.manager.scheduleEnabled = true;
        single.account.manager = single.manager;
        single.account.updatedAt = new Date().toISOString();
        state.selectedBlock = { token: blockToken(sourceKey, next.id, day), accountKey: sourceKey, ruleId: next.id, day };
      }
    }, 'Schedule block saved.');
  }
  function nextPriorityForRange(managerInput, day, start, end) {
    const priorities = normalizeManager(managerInput).scheduleRules.filter(rule => normalizeDays(rule.days).includes(day)).filter(rule => {
      const range = ruleRange(rule);
      return start < range.end && end > range.start;
    }).map(rule => normalizePriority(rule.priority));
    return priorities.length ? Math.max(...priorities) + 1 : 0;
  }
  function addBlock(key = activeAccountKey(), minute = 540) {
    const account = findAccount(key);
    if (!account) return;
    const day = dayNumber(state.selectedDay);
    const start = Math.min(1380, Math.max(0, Math.round(Number(minute) || 540)));
    const end = Math.min(1439, start + 60);
    let newRuleId = '';
    return mutateRegistry('manager-rule-add-timeline', key, registry => {
      const target = registry.accounts[key];
      const manager = normalizeManager(target.manager);
      if (manager.scheduleRules.length >= MAX_RULES_PER_ACCOUNT) throw new Error('This account already has the maximum number of schedule rules.');
      newRuleId = uniqueId('rule');
      const rule = normalizeRule({
        id: newRuleId,
        enabled: true,
        start: formatMinutes(start),
        end: formatMinutes(end),
        statusKey: manager.manualStatusKey,
        days: [day],
        note: '',
        priority: nextPriorityForRange(manager, day, start, end),
        allowAvailableDuringCalls: !!manager.allowAvailableDuringCalls
      }, manager.scheduleRules.length, 'weekly');
      manager.scheduleRules.push(rule);
      manager.scheduleEnabled = true;
      target.manager = manager;
      target.updatedAt = new Date().toISOString();
      state.selectedBlock = { token: blockToken(key, newRuleId, day), accountKey: key, ruleId: newRuleId, day };
    }, `Schedule block added for ${accountName(account)}.`).then(() => { if (refs.editorPanel) refs.editorPanel.open = true; });
  }
  function deleteSelectedBlock() {
    const selected = selectedBlockData();
    if (!selected) return Promise.resolve();
    return mutateRegistry('manager-rule-delete', selected.accountKey, registry => {
      removeRuleDay(registry, selected.accountKey, selected.ruleId, selected.day);
      const account = registry.accounts[selected.accountKey];
      if (account) account.updatedAt = new Date().toISOString();
      state.selectedBlock = null;
    }, 'Schedule block removed.').then(() => { if (refs.editorPanel) refs.editorPanel.open = false; });
  }
  function applyEditorFields() {
    const selected = selectedBlockData();
    if (!selected) return;
    const start = parseTime(refs.startField && refs.startField.value, selected.start);
    let end = parseTime(refs.endField && refs.endField.value, selected.end);
    if (end <= start) end = Math.min(1439, start + MIN_DURATION);
    return applyBlockPatch({
      accountKey: refs.accountField && refs.accountField.value || selected.accountKey,
      statusKey: refs.statusField && refs.statusField.value || selected.rule.statusKey,
      start: formatMinutes(start),
      end: formatMinutes(end),
      priority: normalizePriority(refs.priorityField && refs.priorityField.value),
      allowAvailableDuringCalls: !!(refs.callsField && refs.callsField.checked),
      note: refs.noteField ? text(refs.noteField.value).slice(0, 80) : selected.rule.note
    }, 'manager-rule-update');
  }

  function beginBlockDrag(event) {
    if (event.button !== 0 || state.busy) return;
    const element = event.currentTarget;
    const block = blocksForSelectedDay().find(item => item.token === element.dataset.token);
    if (!block) return;
    const handle = event.target && event.target.dataset && event.target.dataset.resize;
    state.drag = {
      pointerId: event.pointerId,
      element,
      token: block.token,
      mode: handle === 'start' || handle === 'end' ? handle : 'move',
      startX: event.clientX,
      startY: event.clientY,
      original: block,
      preview: Object.assign({}, block),
      baseRowCounts: Object.fromEntries(Array.from(refs.timelineGrid.querySelectorAll('.lane-track')).map(lane => [lane.dataset.account, Math.max(1, Number(lane.dataset.stackRows) || 1)]))
    };
    element.classList.add('dragging');
    element.setPointerCapture(event.pointerId);
    const parsed = parseBlockToken(block.token);
    state.selectedBlock = parsed ? { token: block.token, ...parsed } : null;
    refs.timelineGrid.querySelectorAll('.schedule-block').forEach(node => node.setAttribute('aria-selected', String(node === element)));
    updateEditor();
    event.preventDefault();
  }
  function laneFromPoint(clientX, clientY) {
    const lanes = Array.from(refs.timelineGrid.querySelectorAll('.lane-track'));
    return lanes.find(lane => {
      const rect = lane.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }) || null;
  }
  function moveBlockDrag(event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const width = refs.timelineGrid ? refs.timelineGrid.getBoundingClientRect().width : timelinePixelWidth();
    const delta = Math.round(((event.clientX - drag.startX) / Math.max(1, width)) * DAY_MINUTES);
    const duration = drag.original.duration;
    let start = drag.original.start;
    let end = drag.original.end;
    if (drag.mode === 'move') {
      start = clamp(drag.original.start + delta, 0, 1439 - duration);
      end = start + duration;
      const lane = laneFromPoint(event.clientX, event.clientY);
      if (lane) drag.preview.accountKey = lane.dataset.account;
    } else if (drag.mode === 'start') {
      start = clamp(drag.original.start + delta, 0, drag.original.end - MIN_DURATION);
    } else {
      end = clamp(drag.original.end + delta, drag.original.start + MIN_DURATION, 1439);
    }
    drag.preview.start = Math.round(start);
    drag.preview.end = Math.round(end);
    drag.preview.duration = Math.max(MIN_DURATION, drag.preview.end - drag.preview.start);
    const lane = Array.from(refs.timelineGrid.querySelectorAll('.lane-track')).find(node => node.dataset.account === drag.preview.accountKey);
    if (lane && drag.element.parentElement !== lane) lane.appendChild(drag.element);
    syncBlockElement(drag.element, Object.assign({}, drag.original, drag.preview, { token: blockToken(drag.preview.accountKey, drag.original.ruleId, drag.original.day) }));
    layoutTimelineRows(blocksForSelectedDay(), drag);
    if (refs.selectionReadout) refs.selectionReadout.innerHTML = `<span>${formatMinutes(drag.preview.start)}–${formatMinutes(drag.preview.end)}</span><strong>dragging</strong>`;
    event.preventDefault();
  }
  function finishBlockDrag(event, canceled = false) {
    const drag = state.drag;
    if (!drag || event && event.pointerId !== drag.pointerId) return;
    state.drag = null;
    drag.element.classList.remove('dragging');
    try { if (drag.element.hasPointerCapture(drag.pointerId)) drag.element.releasePointerCapture(drag.pointerId); } catch {}
    if (canceled) { renderTimelineBlocks(); return; }
    const changed = drag.preview.start !== drag.original.start || drag.preview.end !== drag.original.end || drag.preview.accountKey !== drag.original.accountKey;
    if (!changed) { selectBlock(drag.original.token, true); return; }
    applyBlockPatch({ accountKey: drag.preview.accountKey, start: formatMinutes(drag.preview.start), end: formatMinutes(drag.preview.end) }, drag.preview.accountKey !== drag.original.accountKey ? 'manager-rule-drag-account' : drag.mode === 'move' ? 'manager-rule-drag' : 'manager-rule-resize');
  }

  function hideBlockMenu() {
    state.contextBlock = null;
  }
  function contextMenuHost() {
    return document.body || document.documentElement;
  }
  function hideAppMenu() {
    if (!refs.appContextMenu) return;
    refs.appContextMenu.hidden = true;
    refs.appContextMenu.style.left = '';
    refs.appContextMenu.style.top = '';
    state.contextMenuTarget = null;
    if (refs.appContextMenu.parentElement !== document.body) document.body.appendChild(refs.appContextMenu);
  }
  function timelineContextFromEvent(event) {
    if (!refs.timelineGrid || !refs.timelineGrid.contains(event.target)) return null;
    const lane = event.target.closest && event.target.closest('.lane-track');
    const track = lane || refs.axisTrack || refs.timelineGrid;
    const rect = track.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
    return {
      kind: 'timeline',
      accountKey: lane && lane.dataset.account || activeAccountKey(),
      minute: Math.min(1439, Math.max(0, Math.round(ratio * DAY_MINUTES)))
    };
  }
  function openAppMenu(clientX, clientY, context = { kind: 'app' }, target = null) {
    if (!refs.appContextMenu) return;
    hideNoteContextMenu();
    const settingsUnlocked = syncSettingsAndDiagnosticsAccess();
    state.contextMenuTarget = context && typeof context === 'object' ? context : { kind: 'app' };
    const block = state.contextMenuTarget.kind === 'block'
      ? blocksForSelectedDay().find(item => item.token === state.contextMenuTarget.token)
      : null;
    const account = state.contextMenuTarget.kind === 'account'
      ? findAccount(state.contextMenuTarget.accountKey)
      : null;
    if (refs.appMenuHeader) refs.appMenuHeader.textContent = block
      ? `${STATUS_NAMES[normalizeStatus(block.rule.statusKey)]} · ${formatMinutes(block.start)}–${formatMinutes(block.end)}`
      : account
        ? `${accountName(account)} · ${accountTypeLabel(account)}`
        : state.contextMenuTarget.kind === 'timeline'
          ? `Timeline · ${formatMinutes(state.contextMenuTarget.minute)}`
          : 'Teams Helper';
    if (refs.appMenuAddBlock) refs.appMenuAddBlock.hidden = state.contextMenuTarget.kind !== 'timeline' || !state.contextMenuTarget.accountKey;
    if (refs.appMenuRemoveBlock) refs.appMenuRemoveBlock.hidden = !block;
    if (refs.appMenuRemoveAccount) refs.appMenuRemoveAccount.hidden = !account;
    if (refs.appMenuContextSeparator) refs.appMenuContextSeparator.hidden = !(block || account || state.contextMenuTarget.kind === 'timeline');
    if (refs.appMenuHint) refs.appMenuHint.textContent = block
      ? 'Block actions and Teams Helper shortcuts.'
      : account
        ? 'Remove this configured account. Discovery may add it again later.'
        : state.contextMenuTarget.kind === 'timeline'
          ? `Add a block at ${formatMinutes(state.contextMenuTarget.minute)} on ${DAY_NAME[state.selectedDay]}.`
          : settingsUnlocked
            ? 'Teams Helper actions are available everywhere.'
            : settingsAccessBlockedMessage();
    const host = contextMenuHost(target);
    if (refs.appContextMenu.parentElement !== host) host.appendChild(refs.appContextMenu);
    refs.appContextMenu.hidden = false;
    const rect = refs.appContextMenu.getBoundingClientRect();
    refs.appContextMenu.style.left = `${Math.max(8, Math.min(clientX, window.innerWidth - rect.width - 8))}px`;
    refs.appContextMenu.style.top = `${Math.max(8, Math.min(clientY, window.innerHeight - rect.height - 8))}px`;
    const first = refs.appMenuAddBlock && !refs.appMenuAddBlock.hidden ? refs.appMenuAddBlock
      : refs.appMenuRemoveBlock && !refs.appMenuRemoveBlock.hidden ? refs.appMenuRemoveBlock
        : refs.appMenuRemoveAccount && !refs.appMenuRemoveAccount.hidden ? refs.appMenuRemoveAccount
          : settingsUnlocked && refs.appMenuSettings && !refs.appMenuSettings.hidden ? refs.appMenuSettings
            : refs.appMenuFaq;
    if (first) first.focus({ preventScroll: true });
  }
  function openFaq() {
    hideAppMenu();
    if (refs.faqDialog && !refs.faqDialog.open) refs.faqDialog.showModal();
  }

  function normalizeLegalText(value) {
    return text(value).replace(/\u00a0/g, ' ').replace(/[\s\u200b]+/g, ' ').trim();
  }
  function legalDocumentConfig(kind) {
    return LEGAL_DOCUMENTS[lower(kind)] || LEGAL_DOCUMENTS.privacy;
  }
  function isExcludedLegalElement(element) {
    return !!(element && element.closest && element.closest('nav,header,footer,aside,[aria-hidden="true"]'));
  }
  function legalBlockFromElement(element) {
    if (!element || isExcludedLegalElement(element)) return null;
    const tag = lower(element.tagName);
    if ((tag === 'p' || tag === 'h3' || tag === 'blockquote') && element.closest('li')) return null;
    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(element.children || [])
        .filter(child => lower(child.tagName) === 'li')
        .map(child => normalizeLegalText(child.textContent))
        .filter(Boolean)
        .slice(0, 100);
      return items.length ? { type: 'list', ordered: tag === 'ol', items } : null;
    }
    const value = normalizeLegalText(element.textContent);
    if (!value) return null;
    if (tag === 'h3') return { type: 'subheading', text: value };
    if (tag === 'blockquote') return { type: 'quote', text: value };
    if (tag === 'p') return { type: 'paragraph', text: value };
    return null;
  }
  function parseLegalDocument(htmlText, kind, sourceUrl) {
    const configEntry = legalDocumentConfig(kind);
    const source = text(htmlText);
    if (!source || source.length > LEGAL_MAX_HTML_BYTES) throw new Error('Published document is empty or too large.');
    const parsed = new DOMParser().parseFromString(source, 'text/html');
    const headings = Array.from(parsed.querySelectorAll('h1')).filter(element => !isExcludedLegalElement(element));
    const titleElement = headings.find(element => configEntry.titlePattern.test(normalizeLegalText(element.textContent))) || headings[0];
    if (!titleElement) throw new Error('Published document title was not found.');
    const title = normalizeLegalText(titleElement.textContent);
    if (!configEntry.titlePattern.test(title)) throw new Error('Published document did not match the requested legal page.');
    const root = titleElement.closest('article,main,[role="main"]') || parsed.body;
    const elements = Array.from(root.querySelectorAll('h1,h2,h3,p,ul,ol,blockquote'));
    const startIndex = elements.indexOf(titleElement);
    if (startIndex < 0) throw new Error('Published document structure was not recognized.');
    let updated = '';
    const intro = [];
    const sections = [];
    let section = null;
    for (const element of elements.slice(startIndex + 1)) {
      if (isExcludedLegalElement(element)) continue;
      const tag = lower(element.tagName);
      const value = normalizeLegalText(element.textContent);
      if (!value) continue;
      if (tag === 'h1') break;
      if (tag === 'h2') {
        section = { title: value, blocks: [] };
        sections.push(section);
        if (sections.length >= 60) break;
        continue;
      }
      if (!updated && tag === 'p' && /^last\s+updated\s*:/i.test(value)) {
        updated = value;
        continue;
      }
      const block = legalBlockFromElement(element);
      if (!block) continue;
      if (section) {
        if (section.blocks.length < 120) section.blocks.push(block);
      } else if (block.type === 'paragraph' || block.type === 'quote') {
        if (intro.length < 12) intro.push(block.text);
      }
    }
    const cleanSections = sections.filter(item => item.title && item.blocks.length);
    const contentLength = intro.join(' ').length + cleanSections.reduce((total, item) => total + item.title.length + item.blocks.reduce((sum, block) => sum + (block.text || '').length + (block.items || []).join(' ').length, 0), 0);
    if (!cleanSections.length || contentLength < 80) throw new Error('Published document did not contain enough legal content.');
    return {
      schemaVersion: 1,
      kind: configEntry.kind,
      title,
      updated,
      intro,
      sections: cleanSections,
      sourceUrl: sourceUrl || configEntry.url
    };
  }
  function validCachedLegalDocument(value, kind) {
    const configEntry = legalDocumentConfig(kind);
    return !!(value && value.schemaVersion === 1 && value.kind === configEntry.kind && configEntry.titlePattern.test(text(value.title)) && Array.isArray(value.sections) && value.sections.length);
  }
  async function readLegalCache(kind) {
    try {
      let cache = null;
      if (chrome.storage && chrome.storage.local) {
        const stored = await chrome.storage.local.get([LEGAL_CACHE_KEY]);
        cache = stored && stored[LEGAL_CACHE_KEY];
      } else cache = JSON.parse(localStorage.getItem(LEGAL_CACHE_KEY) || 'null');
      const entry = cache && cache[legalDocumentConfig(kind).kind];
      return entry && validCachedLegalDocument(entry.document, kind) ? entry : null;
    } catch { return null; }
  }
  async function writeLegalCache(kind, documentValue) {
    if (!validCachedLegalDocument(documentValue, kind)) return;
    try {
      let cache = {};
      if (chrome.storage && chrome.storage.local) {
        const stored = await chrome.storage.local.get([LEGAL_CACHE_KEY]);
        cache = stored && stored[LEGAL_CACHE_KEY] && typeof stored[LEGAL_CACHE_KEY] === 'object' ? stored[LEGAL_CACHE_KEY] : {};
        cache = Object.assign({}, cache, { [documentValue.kind]: { fetchedAt: Date.now(), document: documentValue } });
        await chrome.storage.local.set({ [LEGAL_CACHE_KEY]: cache });
      } else {
        try { cache = JSON.parse(localStorage.getItem(LEGAL_CACHE_KEY) || '{}') || {}; } catch { cache = {}; }
        cache[documentValue.kind] = { fetchedAt: Date.now(), document: documentValue };
        localStorage.setItem(LEGAL_CACHE_KEY, JSON.stringify(cache));
      }
    } catch {}
  }
  function legalCacheTime(value) {
    const timestamp = Number(value || 0);
    if (!Number.isFinite(timestamp) || timestamp <= 0) return '';
    try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp)); }
    catch { return new Date(timestamp).toLocaleString(); }
  }
  function setLegalStatus(message, tone = '') {
    if (!refs.legalStatus) return;
    refs.legalStatus.textContent = text(message);
    refs.legalStatus.className = `faq-intro legal-status ${tone || ''}`.trim();
  }
  function setLegalControls(kind, busy = false) {
    const configEntry = legalDocumentConfig(kind);
    state.legalKind = configEntry.kind;
    if (refs.legalTitle) refs.legalTitle.textContent = `Teams Helper ${configEntry.title}`;
    if (refs.legalPrivacyTab) refs.legalPrivacyTab.setAttribute('aria-pressed', String(configEntry.kind === 'privacy'));
    if (refs.legalTermsTab) refs.legalTermsTab.setAttribute('aria-pressed', String(configEntry.kind === 'terms'));
    if (refs.legalRefresh) {
      refs.legalRefresh.disabled = !!busy;
      refs.legalRefresh.setAttribute('aria-busy', String(!!busy));
    }
    if (refs.legalOpenExternal) refs.legalOpenExternal.href = configEntry.url;
  }
  function legalTextElement(tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text(value);
    return element;
  }
  function appendLegalBlock(container, block) {
    if (!container || !block) return;
    if (block.type === 'list') {
      const list = document.createElement(block.ordered ? 'ol' : 'ul');
      for (const item of block.items || []) list.appendChild(legalTextElement('li', '', item));
      container.appendChild(list);
      return;
    }
    if (block.type === 'subheading') {
      container.appendChild(legalTextElement('h4', '', block.text));
      return;
    }
    const paragraph = legalTextElement('p', block.type === 'quote' ? 'legal-quote' : '', block.text);
    container.appendChild(paragraph);
  }
  function renderLegalPlaceholder(message) {
    if (!refs.legalContent) return;
    refs.legalContent.replaceChildren(legalTextElement('div', 'legal-placeholder', message));
  }
  function renderLegalDocument(documentValue) {
    if (!refs.legalContent || !validCachedLegalDocument(documentValue, documentValue && documentValue.kind)) return false;
    const fragment = document.createDocumentFragment();
    const head = document.createElement('section');
    head.className = 'legal-document-head';
    head.appendChild(legalTextElement('h2', '', documentValue.title));
    if (documentValue.updated) head.appendChild(legalTextElement('p', 'legal-updated', documentValue.updated));
    for (const paragraph of documentValue.intro || []) head.appendChild(legalTextElement('p', 'legal-intro', paragraph));
    fragment.appendChild(head);
    documentValue.sections.forEach((item, index) => {
      const details = document.createElement('details');
      details.className = 'faq-item';
      if (index === 0) details.open = true;
      details.appendChild(legalTextElement('summary', '', item.title));
      const body = document.createElement('div');
      body.className = 'faq-answer legal-section-body';
      for (const block of item.blocks || []) appendLegalBlock(body, block);
      details.appendChild(body);
      fragment.appendChild(details);
    });
    refs.legalContent.replaceChildren(fragment);
    return true;
  }
  async function fetchLegalDocument(kind) {
    const configEntry = legalDocumentConfig(kind);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), LEGAL_FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(configEntry.url, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'omit',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: { accept: 'text/html,application/xhtml+xml' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Published page returned HTTP ${response.status}.`);
      const contentType = lower(response.headers.get('content-type') || '');
      if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) throw new Error('Published page did not return HTML.');
      const contentLength = Number(response.headers.get('content-length') || 0);
      if (contentLength > LEGAL_MAX_HTML_BYTES) throw new Error('Published document is too large.');
      const finalUrl = new URL(response.url || configEntry.url);
      if (finalUrl.origin !== LEGAL_ORIGIN || finalUrl.pathname.replace(/\/+$/, '') !== configEntry.path) throw new Error('Published document redirected to an unexpected location.');
      const body = await response.text();
      return parseLegalDocument(body, configEntry.kind, finalUrl.href);
    } catch (error) {
      if (error && error.name === 'AbortError') throw new Error('The published document took too long to load.');
      throw error;
    } finally { clearTimeout(timeout); }
  }
  async function refreshLegalDocument(kind = state.legalKind, cachedEntry = null) {
    const configEntry = legalDocumentConfig(kind);
    const requestId = ++state.legalRequestId;
    setLegalControls(configEntry.kind, true);
    setLegalStatus(cachedEntry ? `Showing saved copy from ${legalCacheTime(cachedEntry.fetchedAt)} while checking for updates…` : 'Loading the current published copy…');
    if (!cachedEntry) renderLegalPlaceholder('Loading the current published document…');
    try {
      const documentValue = await fetchLegalDocument(configEntry.kind);
      if (requestId !== state.legalRequestId || state.legalKind !== configEntry.kind) return;
      renderLegalDocument(documentValue);
      setLegalStatus('Live published copy loaded.', 'good');
      await writeLegalCache(configEntry.kind, documentValue);
    } catch (error) {
      if (requestId !== state.legalRequestId || state.legalKind !== configEntry.kind) return;
      if (cachedEntry && renderLegalDocument(cachedEntry.document)) {
        setLegalStatus(`Live update failed. Showing saved copy from ${legalCacheTime(cachedEntry.fetchedAt)}.`, 'error');
      } else {
        renderLegalPlaceholder('The published document could not be loaded. Use “Open published page” below or try refresh again.');
        setLegalStatus(error && error.message || 'The published document could not be loaded.', 'error');
      }
    } finally {
      if (requestId === state.legalRequestId && state.legalKind === configEntry.kind) setLegalControls(configEntry.kind, false);
    }
  }
  async function openLegalDocument(kind) {
    const configEntry = legalDocumentConfig(kind);
    hideAppMenu();
    setLegalControls(configEntry.kind, false);
    if (refs.legalDialog && !refs.legalDialog.open) refs.legalDialog.showModal();
    const cachedEntry = await readLegalCache(configEntry.kind);
    if (state.legalKind !== configEntry.kind) return;
    if (cachedEntry) renderLegalDocument(cachedEntry.document);
    await refreshLegalDocument(configEntry.kind, cachedEntry);
  }
  async function openSettings() {
    hideAppMenu();
    if (!syncSettingsAndDiagnosticsAccess()) {
      const message = settingsAccessBlockedMessage();
      const statusTarget = !hasSession() ? refs.flowLoginStatus : !hasRuntimeAccess() ? refs.flowAccessStatus : refs.flowDiscoveryStatus;
      setFlowMessage(statusTarget, message, 'error');
      return false;
    }
    await loadSettings().catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error'));
    if (!settingsAndDiagnosticsUnlocked()) return false;
    if (refs.settingsDialog && !refs.settingsDialog.open) refs.settingsDialog.showModal();
    requestAnimationFrame(updateCustomScrollbars);
    return true;
  }

  function normalizePollSeconds(value, fallback = 30) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.max(15, Math.min(600, Math.round(number))) : fallback;
  }
  function renderPackageState(packageState = state.packageState) {
    state.packageState = packageState && typeof packageState === 'object' ? packageState : null;
    if (!refs.settingsPackageStatus) return;
    const value = state.packageState;
    refs.settingsPackageStatus.className = 'settings-package-status';
    if (!value) { refs.settingsPackageStatus.textContent = 'Manifest cache status is not available yet.'; return; }
    let installedVersion = 'unknown';
    try { installedVersion = text(globalThis.chrome?.runtime?.getManifest?.().version || 'unknown'); } catch {}
    const version = text(value.version || installedVersion || 'unknown');
    const manifestVersion = Number(value.manifestVersion || 0);
    const cacheText = value.cacheHit ? `cache hit${Number.isFinite(Number(value.cacheAgeMs)) ? ` · ${Math.round(Number(value.cacheAgeMs) / 1000)}s old` : ''}` : 'cache refreshed';
    refs.settingsPackageStatus.textContent = `Manifest V${manifestVersion || '?'} · ${version} · ${cacheText}`;
    refs.settingsPackageStatus.classList.add(value.ok === false ? 'error' : 'good');
  }
  function renderSettings() {
    const accounts = runtimeEligibleAccounts();
    const activeKey = activeAccountKey();
    const account = activeAccount();
    if (refs.settingsAccountSelect) {
      const prior = refs.settingsAccountSelect.value;
      refs.settingsAccountSelect.textContent = '';
      if (!accounts.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No account available';
        refs.settingsAccountSelect.appendChild(option);
      } else {
        accounts.forEach(item => {
          const option = document.createElement('option');
          option.value = accountKey(item);
          option.textContent = `${accountName(item)} · ${accountTypeLabel(item)} · ${accountEmail(item)}`;
          refs.settingsAccountSelect.appendChild(option);
        });
        refs.settingsAccountSelect.value = accounts.some(item => accountKey(item) === activeKey) ? activeKey : (accounts.some(item => accountKey(item) === prior) ? prior : accountKey(accounts[0]));
      }
      refs.settingsAccountSelect.disabled = !accounts.length || !hasRuntimeAccess();
    }
    if (refs.settingsCloudToggle) {
      const registry = registryFromRuntime();
      refs.settingsCloudToggle.checked = !!(state.runtime && typeof state.runtime.cloudEnabled === 'boolean' ? state.runtime.cloudEnabled : registry.cloudEnabled);
      refs.settingsCloudToggle.disabled = !hasRuntimeAccess();
    }
    const auto = state.autoSessionSettings || state.runtime && (state.runtime.automaticSessionCreation || {}) || {};
    if (refs.settingsAutoSessionToggle) {
      refs.settingsAutoSessionToggle.checked = !!(auto.enabled || state.runtime && state.runtime.automaticSessionCreationEnabled);
      refs.settingsAutoSessionToggle.disabled = !hasSession() || auto.signedIn === false;
    }
    const poll = state.runtime && state.runtime.cloudPollSettings || {};
    if (refs.settingsPollInterval) refs.settingsPollInterval.value = String(normalizePollSeconds(poll.intervalSeconds || state.runtime && state.runtime.cloudPollIntervalSeconds, 30));
    if (refs.settingsManageBilling) refs.settingsManageBilling.disabled = !hasSession();
    if (refs.settingsFeedbackSend) refs.settingsFeedbackSend.disabled = !hasSession();
    if (refs.settingsFeedbackSendLogs) refs.settingsFeedbackSendLogs.disabled = !hasSession();
    if (refs.appMenuCloud) refs.appMenuCloud.hidden = !hasSession();
    syncSettingsAndDiagnosticsAccess();
    renderPackageState();
    updateFeedbackCounter();
  }
  async function loadSettings() {
    const [autoResult, statusResult, logsResult, packageResult] = await Promise.allSettled([
      send('th_getAutomaticSessionSettings'),
      send('th_getAccountStatus', { accountKey: activeAccountKey() }),
      refreshScheduleLogs(),
      send('th_runtime_package_status', { reason: 'popup-settings-open' })
    ]);
    if (autoResult.status === 'fulfilled') state.autoSessionSettings = autoResult.value.settings || autoResult.value || null;
    if (statusResult.status === 'fulfilled' && statusResult.value.accountStatus && state.runtime) {
      const statusKey = text(statusResult.value.accountKey || activeAccountKey()).trim();
      const accountStatuses = Object.assign({}, state.runtime.accountStatuses || {});
      if (statusKey) accountStatuses[statusKey] = statusResult.value.accountStatus;
      state.runtime = Object.assign({}, state.runtime, { accountStatus: statusResult.value.accountStatus, accountStatuses });
      state.renderedAccountSignature = '';
    }
    if (packageResult.status === 'fulfilled') renderPackageState(packageResult.value.packageState || packageResult.value);
    else renderPackageState(null);
    renderApp();
    renderSettings();
    if (logsResult.status === 'rejected') throw logsResult.reason;
    state.settingsLoaded = true;
  }
  async function selectSettingsAccount() {
    const key = text(refs.settingsAccountSelect && refs.settingsAccountSelect.value).trim();
    if (!key || key === activeAccountKey()) return;
    setFlowMessage(refs.settingsStatus, 'Selecting Teams account…');
    const response = await send('th_selectAccount', { accountKey: key });
    state.runtime = response.state || state.runtime;
    state.renderedAccountSignature = '';
    state.renderedTimelineSignature = '';
    renderApp();
    renderSettings();
    const selected = findAccount(key);
    setFlowMessage(refs.settingsStatus, `Selected ${selected ? accountName(selected) : key}.`, 'good');
  }

  async function setCloudEnabled(enabled) {
    setFlowMessage(refs.settingsStatus, 'Saving global Cloud Edit setting…');
    const response = await send('th_setCloudConfigEnabled', { enabled: !!enabled });
    state.runtime = response.state || state.runtime;
    renderApp(); renderSettings();
    setFlowMessage(refs.settingsStatus, `Cloud Edit ${enabled ? 'enabled' : 'paused'} for all accounts.`, 'good');
  }
  async function setAutomaticSession(enabled) {
    setFlowMessage(refs.settingsStatus, 'Saving background session setting…');
    const response = await send('th_setAutomaticSessionCreationEnabled', { enabled: !!enabled, reason: 'popup-new-gui-toggle' });
    if (response.state) state.runtime = response.state;
    state.autoSessionSettings = response.settings || { enabled: !!enabled, signedIn: hasSession() };
    renderSettings();
    setFlowMessage(refs.settingsStatus, enabled ? 'Schedules may run while Teams is closed.' : 'Closed-Teams schedule support is off.', 'good');
  }
  async function savePollInterval() {
    const seconds = normalizePollSeconds(refs.settingsPollInterval && refs.settingsPollInterval.value, 30);
    if (refs.settingsPollInterval) refs.settingsPollInterval.value = String(seconds);
    const response = await send('th_setCloudPollInterval', { seconds });
    if (response.state) state.runtime = response.state;
    renderSettings();
    setFlowMessage(refs.settingsStatus, `Cloud refresh saved at ${seconds} seconds.`, 'good');
  }
  function formatLogEntry(entry) {
    if (!entry || typeof entry !== 'object') return '';
    const when = entry.at ? new Date(entry.at).toLocaleTimeString() : '--:--:--';
    const level = text(entry.level || 'info').toUpperCase();
    let extra = '';
    try { extra = entry.extra ? ` ${JSON.stringify(entry.extra)}` : ''; } catch {}
    return `[${when}] ${level}: ${text(entry.message)}${extra}`;
  }
  function renderScheduleLogs(rows) {
    state.scheduleLogRows = Array.isArray(rows) ? rows.slice(-120) : [];
    if (refs.settingsLogViewer) refs.settingsLogViewer.value = state.scheduleLogRows.length ? state.scheduleLogRows.map(formatLogEntry).join('\n') : 'No schedule updates recorded yet.';
    if (refs.settingsLogMeta) refs.settingsLogMeta.textContent = state.scheduleLogRows.length ? `${state.scheduleLogRows.length} entries` : 'No entries';
    requestAnimationFrame(updateCustomScrollbars);
  }
  async function refreshScheduleLogs() {
    const response = await send('th_getScheduleStatusLogs');
    renderScheduleLogs(response.logs || []);
    return response.logs || [];
  }
  async function copyScheduleLogs() {
    const value = refs.settingsLogViewer ? refs.settingsLogViewer.value : '';
    if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(value);
    else { refs.settingsLogViewer.select(); document.execCommand('copy'); }
    setFlowMessage(refs.settingsStatus, 'Schedule history copied.', 'good');
  }
  async function clearScheduleLogs() {
    const response = await send('th_clearScheduleStatusLogs');
    renderScheduleLogs(response.logs || []);
    setFlowMessage(refs.settingsStatus, 'Schedule history cleared.', 'good');
  }
  function updateFeedbackCounter() {
    if (!refs.settingsFeedbackCount) return;
    refs.settingsFeedbackCount.textContent = `${text(refs.settingsFeedbackText && refs.settingsFeedbackText.value).length} / 600`;
  }
  async function collectFeedbackLogs(source = 'feedback-logs') {
    const entries = await refreshScheduleLogs().catch(() => state.scheduleLogRows || []);
    const rendered = refs.settingsLogViewer ? text(refs.settingsLogViewer.value) : '';
    return {
      attachedAt: new Date().toISOString(),
      source,
      count: Array.isArray(entries) ? entries.length : 0,
      entries: Array.isArray(entries) ? entries.slice(-120) : [],
      text: rendered.slice(-30000)
    };
  }
  async function submitFeedback(logsOnly = false) {
    if (!hasSession()) throw new Error('Sign in before sending feedback.');
    const message = logsOnly
      ? `History attached from popup at ${new Date().toISOString()}.`
      : text(refs.settingsFeedbackText && refs.settingsFeedbackText.value).trim();
    if (!message) throw new Error('Enter feedback before sending it.');
    const attachLogs = logsOnly || !!(refs.settingsFeedbackAttachLogs && refs.settingsFeedbackAttachLogs.checked);
    if (refs.settingsFeedbackSend) refs.settingsFeedbackSend.disabled = true;
    if (refs.settingsFeedbackSendLogs) refs.settingsFeedbackSendLogs.disabled = true;
    setFlowMessage(refs.settingsFeedbackStatus, attachLogs ? 'Collecting history and sending…' : 'Sending feedback…');
    try {
      const logs = attachLogs ? await collectFeedbackLogs(logsOnly ? 'send-logs' : 'feedback-attach') : null;
      const response = await send('pbf', { message, attachLogs, logsOnly: !!logsOnly, logs });
      if (!logsOnly && refs.settingsFeedbackText) refs.settingsFeedbackText.value = '';
      if (refs.settingsFeedbackAttachLogs) refs.settingsFeedbackAttachLogs.checked = false;
      updateFeedbackCounter();
      const remaining = response && response.rate && response.rate.remainingDay;
      const suffix = remaining !== undefined ? ` ${remaining} submission${remaining === 1 ? '' : 's'} left today.` : '';
      setFlowMessage(refs.settingsFeedbackStatus, `${logsOnly ? 'History' : attachLogs ? 'Feedback and history' : 'Feedback'} sent.${suffix}`, 'good');
    } finally {
      if (refs.settingsFeedbackSend) refs.settingsFeedbackSend.disabled = !hasSession();
      if (refs.settingsFeedbackSendLogs) refs.settingsFeedbackSendLogs.disabled = !hasSession();
    }
  }

  function authIdentifier() {
    const identifier = text(refs.flowIdentity && refs.flowIdentity.value).trim();
    if (!identifier) throw new Error('Enter your username or email address.');
    return identifier;
  }

  function authCaptchaRequest() {
    const id = text(refs.flowCaptchaId && refs.flowCaptchaId.value).trim();
    if (!id) return undefined;
    return { id, answer: text(refs.flowCaptchaInput && refs.flowCaptchaInput.value).trim() };
  }

  function clearAuthCaptcha() {
    state.captchaIdentifier = '';
    if (refs.flowCaptchaPanel) refs.flowCaptchaPanel.hidden = true;
    if (refs.flowCaptchaId) refs.flowCaptchaId.value = '';
    if (refs.flowCaptchaInput) refs.flowCaptchaInput.value = '';
    if (refs.flowCaptchaImage) refs.flowCaptchaImage.removeAttribute('src');
  }

  function showAuthCaptcha(challenge, identifier = '') {
    if (!challenge || !challenge.id || !challenge.image) return false;
    state.captchaIdentifier = lower(identifier || authIdentifier());
    refs.flowCaptchaId.value = text(challenge.id);
    refs.flowCaptchaImage.src = text(challenge.image);
    refs.flowCaptchaInput.value = '';
    refs.flowCaptchaPanel.hidden = false;
    refs.flowCaptchaInput.focus();
    return true;
  }

  function applyInlineAuthError(error, identifier = '') {
    const payload = error && error.payload;
    if (payload && payload.captchaRequired && payload.captcha) {
      showAuthCaptcha(payload.captcha, identifier || text(refs.flowIdentity && refs.flowIdentity.value));
      return true;
    }
    return false;
  }

  async function refreshInlineAuthCaptcha() {
    if (state.busy) return;
    let identifier = '';
    setBusy(true, refs.loginScreen);
    try {
      identifier = authIdentifier();
      setFlowMessage(refs.flowLoginStatus, 'Refreshing security check…');
      const response = await send('pwa', { action: 'captcha', identifier });
      if (response.captchaRequired && response.captcha) {
        showAuthCaptcha(response.captcha, identifier);
        setFlowMessage(refs.flowLoginStatus, 'Enter the code shown, then continue.');
      } else {
        clearAuthCaptcha();
        setFlowMessage(refs.flowLoginStatus, 'No security check is currently required.', 'good');
      }
    } catch (error) {
      applyInlineAuthError(error, identifier);
      setFlowMessage(refs.flowLoginStatus, error.message || error, 'error');
    } finally {
      setBusy(false, refs.loginScreen);
    }
  }

  async function completeInlinePasswordAuth() {
    if (state.busy) return;
    let identifier = '';
    setBusy(true, refs.loginScreen);
    try {
      identifier = authIdentifier();
      const password = text(refs.flowPassword && refs.flowPassword.value);
      if (!password) throw new Error('Enter your password.');
      if (state.authMode === 'create' && password.length < 6) throw new Error('Password must be at least 6 characters.');
      const action = state.authMode === 'create' ? 'register' : 'login';
      setFlowMessage(refs.flowLoginStatus, action === 'register' ? 'Creating account…' : 'Signing in…');
      const response = await send('pwa', { action, identifier, password, captcha: authCaptchaRequest() });
      if (response.emailVerificationRequired) {
        clearAuthCaptcha();
        refs.flowPassword.value = '';
        state.authMode = 'login';
        renderAuthMode();
        setFlowMessage(refs.flowLoginStatus, response.message || 'Account created. Check your email for the verification link, then sign in.', 'good');
        return;
      }
      state.status = response.status || null;
      clearAuthCaptcha();
      if (!hasSession()) throw new Error('Authentication completed without a validated extension session.');
      renderLogin();
      renderAccess();
      if (hasRuntimeAccess()) await startDiscovery();
      else setScreen('access');
    } catch (error) {
      applyInlineAuthError(error, identifier);
      setFlowMessage(refs.flowLoginStatus, error.message || error, 'error');
    } finally {
      setBusy(false, refs.loginScreen);
    }
  }

  async function resetInlinePassword() {
    if (state.busy) return;
    setBusy(true, refs.loginScreen);
    try {
      const email = authIdentifier();
      if (!email.includes('@')) throw new Error('Password reset needs the email address used for the account. Username-only accounts do not have email delivery.');
      setFlowMessage(refs.flowLoginStatus, 'Sending password reset…');
      const response = await send('pwa', { action: 'reset', email, captcha: authCaptchaRequest() });
      setFlowMessage(refs.flowLoginStatus, response.message || 'Password reset email sent if this account exists.', 'good');
    } catch (error) {
      applyInlineAuthError(error, text(refs.flowIdentity && refs.flowIdentity.value));
      setFlowMessage(refs.flowLoginStatus, error.message || error, 'error');
    } finally {
      setBusy(false, refs.loginScreen);
    }
  }

  async function finishAuthenticatedFlow(response = {}) {
    let status = response.status || null;
    if (!status || !status.session || !status.user) {
      const refreshed = await send('pgs', { force: false });
      status = refreshed.status || status;
    }
    state.status = status;
    if (!hasSession()) throw new Error('Sign-in completed without a validated extension session.');
    renderLogin();
    renderAccess();
    if (hasRuntimeAccess()) await startDiscovery();
    else setScreen('access');
  }

  async function waitForEmailLinkCompletion(initialResponse = null) {
    state.emailLinkWaiting = true;
    let response = initialResponse;
    let expiresAt = text(response && response.emailLinkTransactionExpiresAt).trim();
    try {
      while (state.emailLinkWaiting) {
        if (response && response.emailLinkState === 'complete') {
          await finishAuthenticatedFlow(response);
          return true;
        }
        if (response && response.emailLinkState === 'idle') {
          const refreshed = await send('pgs', { force: false });
          if (refreshed.status && refreshed.status.session && refreshed.status.user) {
            await finishAuthenticatedFlow(refreshed);
            return true;
          }
          if (expiresAt && Date.parse(expiresAt) <= Date.now()) throw new Error('The email sign-in request expired. Request a new link.');
          return false;
        }
        if (response && response.emailLinkTransactionExpiresAt) expiresAt = text(response.emailLinkTransactionExpiresAt).trim();
        if (expiresAt && Date.parse(expiresAt) <= Date.now()) throw new Error('The email sign-in request expired. Request a new link.');
        setFlowMessage(refs.flowLoginStatus, 'Check your email and open the sign-in link. Teams Helper is waiting…', 'good');
        await new Promise(resolve => window.setTimeout(resolve, EMAIL_LINK_POLL_DELAY_MS));
        response = await send('pelp');
      }
      return false;
    } finally {
      state.emailLinkWaiting = false;
    }
  }

  async function startEmailLinkAuth() {
    if (state.busy || state.emailLinkWaiting) return;
    let email = '';
    setBusy(true, refs.loginScreen);
    try {
      email = lower(authIdentifier());
      if (!email.includes('@') || email.length > 320) throw new Error('Enter the email address that should receive the sign-in link.');
      setFlowMessage(refs.flowLoginStatus, 'Sending sign-in link…');
      const response = await send('pels', { email, captcha: authCaptchaRequest() });
      clearAuthCaptcha();
      setFlowMessage(refs.flowLoginStatus, response.message || 'Sign-in link sent. Open it and Teams Helper will finish automatically.', 'good');
      await waitForEmailLinkCompletion(response);
    } catch (error) {
      applyInlineAuthError(error, email || text(refs.flowIdentity && refs.flowIdentity.value));
      setFlowMessage(refs.flowLoginStatus, error.message || error, 'error');
    } finally {
      setBusy(false, refs.loginScreen);
    }
  }

  async function resumeEmailLinkAuth() {
    if (state.busy || state.emailLinkWaiting || hasSession()) return;
    try {
      const response = await send('pelp');
      if (!response || response.emailLinkState === 'idle') return;
      setBusy(true, refs.loginScreen);
      await waitForEmailLinkCompletion(response);
    } catch (error) {
      setFlowMessage(refs.flowLoginStatus, error.message || error, 'error');
    } finally {
      setBusy(false, refs.loginScreen);
    }
  }

  async function startAuth(method) {
    if (state.busy) return;
    setBusy(true, refs.loginScreen);
    setFlowMessage(refs.flowLoginStatus, method === 'google' ? 'Opening Google sign-in…' : 'Opening secure sign-in…');
    try {
      const response = await send('psa', { method });
      await finishAuthenticatedFlow(response);
    } catch (error) { setFlowMessage(refs.flowLoginStatus, error.message || error, 'error'); }
    finally { setBusy(false, refs.loginScreen); }
  }
  async function signOut() {
    if (state.busy) return;
    setBusy(true);
    try {
      await send('pso');
      state.status = null;
      state.runtime = null;
      state.accountOrder = [];
      state.discoveryAccounts = [];
      state.selectedBlock = null;
      state.renderedAccountSignature = '';
      setScreen('login');
      setFlowMessage(refs.flowLoginStatus, 'Signed out.', 'good');
    } catch (error) { showToast(error.message || error, 'error'); }
    finally { setBusy(false); }
  }
  async function handleAccessSubmit(event) {
    event.preventDefault();
    if (state.busy) return;
    setBusy(true, refs.accessScreen);
    try {
      const refreshed = await send('pgs', { force: true });
      state.status = refreshed.status || state.status;
      renderAccess();
      if (hasRuntimeAccess()) { await startDiscovery(); return; }
      const pending = betaRequestPending();
      if (pending) state.flowPlan = 'subscription';
      if (state.flowPlan === 'subscription') {
        const response = await send('pcc', { plan: state.billingPeriod });
        if (response.url) await openTab(response.url);
        setFlowMessage(refs.flowAccessStatus, pending
          ? 'Checkout opened. Your beta request remains pending until subscription access activates.'
          : 'Checkout opened. Complete it, then press Continue again.', 'good');
      } else {
        if (betaRequestPending()) {
          renderAccess();
          setFlowMessage(refs.flowAccessStatus, 'Your beta request is already pending. You can purchase a subscription instead.');
          return;
        }
        const user = state.status && state.status.user || {};
        const betaNote = text(refs.flowBetaNote && refs.flowBetaNote.value || '').trim().slice(0, 500);
        const response = await send('prb', { email: user.email || refs.flowIdentity && refs.flowIdentity.value || '', note: betaNote || 'Requested from the redesigned extension onboarding flow.' });
        if (response.status) state.status = response.status;
        renderAccess();
        if (hasRuntimeAccess()) await startDiscovery();
        else setFlowMessage(refs.flowAccessStatus, 'Beta request submitted and pending review.', 'good');
      }
    } catch (error) { setFlowMessage(refs.flowAccessStatus, error.message || error, 'error'); }
    finally { setBusy(false, refs.accessScreen); }
  }
  async function startDiscovery() {
    if (!hasRuntimeAccess()) { setScreen('access'); return; }
    setScreen('discovery');
    setBusy(true, refs.discoveryScreen);
    if (refs.flowDiscoveryProgress) refs.flowDiscoveryProgress.classList.remove('complete');
    if (refs.flowDiscoveryStatus) refs.flowDiscoveryStatus.textContent = 'Checking sessions…';
    try {
      const response = await send('th_discoverTeamsAccounts', {});
      state.runtime = response.state || state.runtime;
      const discovered = response && response.discovery && (response.discovery.accounts || response.discovery.browserAccounts);
      state.discoveryAccounts = Array.isArray(discovered)
        ? discovered.filter(account => account && account.source !== 'teams-helper-origin-registry')
        : [];
      if (!state.runtime) state.runtime = (await send('th_getState', { forceCloud: false })).state || null;
      renderDiscovery(state.discoveryAccounts);
    } catch (error) {
      state.discoveryAccounts = [];
      try { state.runtime = (await send('th_getState', { forceCloud: false })).state || state.runtime; } catch {}
      renderDiscovery(state.discoveryAccounts);
      if (refs.flowDiscoveryStatus) refs.flowDiscoveryStatus.textContent = `Scan could not finish: ${error.message || error}`;
    } finally { setBusy(false, refs.discoveryScreen); }
  }

  async function refreshRuntime(forceCloud = false, options = {}) {
    if (!hasRuntimeAccess()) { state.runtime = null; return null; }
    const response = await send('th_getState', { forceCloud: !!forceCloud });
    const responseRuntime = response.state || null;
    if (responseRuntime && !runtimeOwnedByRegisteredUser(responseRuntime)) throw new Error('Ignored runtime state from a different Teams Helper registered user.');
    state.runtime = mergeRuntimeWithPendingMutations(responseRuntime);
    const activeKey = activeAccountKey();
    const activeSnapshot = activeKey && state.runtime && state.runtime.accountStatuses && state.runtime.accountStatuses[activeKey] || state.runtime && state.runtime.accountStatus;
    const snapshotState = lower(activeSnapshot && activeSnapshot.state);
    if (state.runtime && activeKey && (!activeSnapshot || !snapshotState || snapshotState === 'unknown')) {
      try {
        const statusResponse = await send('th_getAccountStatus', { accountKey: activeKey });
        if (statusResponse.accountStatus) {
          const statusKey = text(statusResponse.accountKey || activeKey).trim();
          const accountStatuses = Object.assign({}, state.runtime.accountStatuses || {});
          if (statusKey) accountStatuses[statusKey] = statusResponse.accountStatus;
          state.runtime = Object.assign({}, state.runtime, { accountStatus: statusResponse.accountStatus, accountStatuses });
        }
      } catch {}
    }
    if (!options.silent) {
      state.renderedAccountSignature = '';
      renderApp();
    }
    return state.runtime;
  }
  async function refreshAll(options = {}) {
    if (state.activeMutationCount > 0 && !options.allowDuringMutation) return state.runtime;
    const response = await send('pgs', { force: !!options.forceStatus });
    state.status = response.status || null;
    await loadUiState();
    renderLogin(); renderAccess();
    if (!hasSession()) { resetPopupRuntimeForRegisteredUserChange(); setScreen('login'); return; }
    if (!hasRuntimeAccess()) { setScreen('access'); return; }
    await refreshRuntime(!!options.forceCloud, { silent: true });
    if (runtimeAccounts().length) { setScreen('app'); renderApp(); }
    else { setScreen('discovery'); renderDiscovery(state.discoveryAccounts); if (options.autoDiscover !== false) await startDiscovery(); }
  }
  function renderApp() {
    if (!hasRuntimeAccess()) { setScreen(hasSession() ? 'access' : 'login'); return; }
    renderAccounts();
    renderTimeline();
    renderSettings();
    if (refs.scheduleTitle) refs.scheduleTitle.textContent = `Weekly timeline · ${DAY_NAME[state.selectedDay]}`;
    if (refs.saveState && refs.saveState.textContent === 'Waiting for state') refs.saveState.textContent = 'Synced';
  }

  function saveUiState() {
    const scope = registeredUserUiScope();
    const key = uiStateStorageKey(scope);
    const value = { registeredUserScope: scope, selectedDay: state.selectedDay, zoomIndex: state.zoomIndex, timelineFit: state.timelineFit };
    state.uiStateScope = scope;
    try {
      if (chrome.storage && chrome.storage.local) chrome.storage.local.set({ [key]: value });
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
  async function loadUiState(force = false) {
    const scope = registeredUserUiScope();
    if (!force && state.uiStateScope === scope) return false;
    const previousScope = state.uiStateScope;
    if (previousScope && previousScope !== scope) resetPopupRuntimeForRegisteredUserChange();
    const key = uiStateStorageKey(scope);
    try {
      let value = null;
      if (chrome.storage && chrome.storage.local) {
        const stored = await chrome.storage.local.get([key]);
        value = stored && stored[key];
        if (scope !== 'signed-out') chrome.storage.local.remove([UI_STATE_KEY]).catch(() => null);
      } else value = JSON.parse(localStorage.getItem(key) || 'null');
      if (value && text(value.registeredUserScope || scope).trim().toLowerCase() !== scope) value = null;
      if (value && DAY_ORDER.includes(value.selectedDay)) state.selectedDay = value.selectedDay;
      if (value && Number.isFinite(Number(value.zoomIndex))) state.zoomIndex = clamp(value.zoomIndex, 0, ZOOM_LEVELS.length - 1);
      if (value && typeof value.timelineFit === 'boolean') state.timelineFit = value.timelineFit;
      state.uiStateScope = scope;
      if (refs.daySelect) refs.daySelect.value = state.selectedDay;
      setZoom(state.zoomIndex, false, state.timelineFit);
      return true;
    } catch {
      state.uiStateScope = scope;
      return false;
    }
  }

  function bindEvents() {
    refs.flowLoginForm.addEventListener('submit', event => { event.preventDefault(); completeInlinePasswordAuth(); });
    refs.flowGoogle.addEventListener('click', () => startAuth('google'));
    refs.flowEmailLink.addEventListener('click', startEmailLinkAuth);
    refs.flowCreate.addEventListener('click', () => {
      state.authMode = state.authMode === 'create' ? 'login' : 'create';
      clearAuthCaptcha();
      setFlowMessage(refs.flowLoginStatus, '');
      renderAuthMode({ focus: true });
    });
    refs.flowForgot.addEventListener('click', resetInlinePassword);
    refs.flowCaptchaRefresh.addEventListener('click', refreshInlineAuthCaptcha);
    refs.flowCaptchaInput.addEventListener('input', () => {
      refs.flowCaptchaInput.value = text(refs.flowCaptchaInput.value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    });
    refs.flowIdentity.addEventListener('input', () => {
      const identifier = lower(refs.flowIdentity.value);
      if (state.captchaIdentifier && identifier !== state.captchaIdentifier) clearAuthCaptcha();
    });
    refs.flowPasswordToggle.addEventListener('click', () => {
      const show = refs.flowPassword.type === 'password';
      refs.flowPassword.type = show ? 'text' : 'password';
      refs.flowPasswordToggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
    refs.accessBack.addEventListener('click', () => setScreen('login'));
    refs.flowAccessForm.addEventListener('submit', handleAccessSubmit);
    document.querySelectorAll('input[name="flowPlan"]').forEach(input => input.addEventListener('change', () => {
      state.flowPlan = input.value;
      renderAccess();
    }));
    document.querySelectorAll('[data-flow-period]').forEach(button => button.addEventListener('click', () => {
      state.billingPeriod = button.dataset.flowPeriod === 'annual' ? 'annual' : 'monthly';
      renderAccess();
    }));
    refs.flowOpenControl.addEventListener('click', () => { setScreen('app'); renderApp(); });
    refs.footerFaq.addEventListener('click', () => { hideNoteContextMenu(); openFaq(); });
    refs.flowSignOut.addEventListener('click', signOut);
    refs.noSeenToggle.addEventListener('click', toggleNoSeen);
    refs.refreshBtn.addEventListener('click', async () => {
      refs.refreshBtn.setAttribute('aria-busy', 'true');
      try { await startDiscovery(); } finally { refs.refreshBtn.removeAttribute('aria-busy'); }
    });
    refs.settingsBtn.addEventListener('click', openSettings);
    refs.daySelect.addEventListener('change', () => {
      state.selectedDay = DAY_ORDER.includes(refs.daySelect.value) ? refs.daySelect.value : 'mon';
      state.selectedBlock = null;
      if (refs.scheduleTitle) refs.scheduleTitle.textContent = `Weekly timeline · ${DAY_NAME[state.selectedDay]}`;
      renderTimelineBlocks();
      saveUiState();
    });
    refs.addBtn.addEventListener('click', () => addBlock(activeAccountKey() || accountKey(runtimeAccounts()[0]), 540));
    refs.zoomRange.addEventListener('input', () => setZoom(Number(refs.zoomRange.value)));
    refs.fitBtn.addEventListener('click', () => { fit24Hours(); if (refs.timelineMenu) refs.timelineMenu.open = false; });
    refs.deleteBtn.addEventListener('click', deleteSelectedBlock);
    [refs.accountField, refs.statusField, refs.startField, refs.endField, refs.priorityField, refs.callsField].forEach(control => control.addEventListener('change', applyEditorFields));
    refs.priorityField.addEventListener('input', syncPriorityReadout);
    refs.startFieldButton.addEventListener('click', event => { event.stopPropagation(); openTimePicker('startField'); });
    refs.endFieldButton.addEventListener('click', event => { event.stopPropagation(); openTimePicker('endField'); });
    refs.timePicker.addEventListener('click', event => {
      const option = event.target.closest('.time-picker-option');
      if (!option || !state.timePickerDraft) return;
      const kind = option.dataset.kind;
      const raw = option.dataset.value;
      if (kind === 'hour') state.timePickerDraft.hour = Math.max(1, Math.min(12, Number(raw) || 12));
      else if (kind === 'minute') state.timePickerDraft.minute = Math.max(0, Math.min(59, Number(raw) || 0));
      else if (kind === 'meridiem') state.timePickerDraft.meridiem = raw === 'PM' ? 'PM' : 'AM';
      updateTimePickerSelection();
      if (kind === 'meridiem') closeTimePicker();
    });
    refs.noteContextMenu.addEventListener('pointerdown', event => event.preventDefault());
    refs.noteMenuCopy.addEventListener('click', () => copyBlockNote(true).then(() => hideNoteContextMenu({ restore: true })).catch(error => showToast(error.message || error, 'error')));
    refs.noteMenuPaste.addEventListener('click', () => pasteBlockNote(state.noteClipboardText).then(() => hideNoteContextMenu({ restore: true })).catch(error => showToast(error.message || error, 'error')));
    refs.noteField.addEventListener('pointerdown', event => {
      if (event.button === 2) state.noteSelection = currentNoteSelection();
    }, true);
    refs.noteField.addEventListener('select', () => { state.noteSelection = currentNoteSelection(); });
    refs.noteField.addEventListener('keyup', () => { state.noteSelection = currentNoteSelection(); });
    refs.noteField.addEventListener('input', () => {
      state.noteSelection = currentNoteSelection();
      clearTimeout(state.noteTimer);
      state.noteTimer = window.setTimeout(applyEditorFields, 420);
    });
    refs.appMenuAddBlock.addEventListener('click', () => {
      const target = state.contextMenuTarget;
      hideAppMenu();
      if (target && target.kind === 'timeline' && target.accountKey) addBlock(target.accountKey, target.minute).catch(error => showToast(error.message || error, 'error'));
    });
    refs.appMenuRemoveBlock.addEventListener('click', () => {
      const target = state.contextMenuTarget;
      if (target && target.kind === 'block' && target.token) selectBlock(target.token, false);
      hideAppMenu();
      deleteSelectedBlock().catch(error => showToast(error.message || error, 'error'));
    });
    refs.appMenuRemoveAccount.addEventListener('click', () => {
      const target = state.contextMenuTarget;
      hideAppMenu();
      if (target && target.kind === 'account' && target.accountKey) removeConfiguredAccount(target.accountKey).catch(error => showToast(error.message || error, 'error', 7000));
    });
    refs.appMenuFaq.addEventListener('click', openFaq);
    refs.appMenuSettings.addEventListener('click', openSettings);
    refs.accountRemoveCancel.addEventListener('click', () => settleAccountRemoveDialog(false));
    refs.accountRemoveConfirm.addEventListener('click', () => settleAccountRemoveDialog(true));
    refs.accountRemoveDialog.addEventListener('cancel', event => { event.preventDefault(); settleAccountRemoveDialog(false); });
    refs.accountRemoveDialog.addEventListener('click', event => { if (event.target === refs.accountRemoveDialog) settleAccountRemoveDialog(false); });
    refs.accountRemoveDialog.addEventListener('close', () => { if (state.accountRemoveResolver) settleAccountRemoveDialog(false); });
    refs.faqClose.addEventListener('click', () => refs.faqDialog.close());
    refs.faqDialog.addEventListener('click', event => { if (event.target === refs.faqDialog) refs.faqDialog.close(); });
    document.querySelectorAll('[data-legal-doc]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      openLegalDocument(link.dataset.legalDoc).catch(error => {
        setLegalStatus(error.message || error, 'error');
        renderLegalPlaceholder('The published document could not be loaded.');
      });
    }));
    refs.legalPrivacyTab.addEventListener('click', () => openLegalDocument('privacy').catch(error => setLegalStatus(error.message || error, 'error')));
    refs.legalTermsTab.addEventListener('click', () => openLegalDocument('terms').catch(error => setLegalStatus(error.message || error, 'error')));
    refs.legalRefresh.addEventListener('click', () => refreshLegalDocument(state.legalKind, null).catch(error => setLegalStatus(error.message || error, 'error')));
    refs.legalOpenExternal.addEventListener('click', event => { event.preventDefault(); openTab(legalDocumentConfig(state.legalKind).url).catch(error => setLegalStatus(error.message || error, 'error')); });
    refs.legalClose.addEventListener('click', () => refs.legalDialog.close());
    refs.legalDialog.addEventListener('cancel', () => { state.legalRequestId += 1; });
    refs.legalDialog.addEventListener('click', event => { if (event.target === refs.legalDialog) refs.legalDialog.close(); });
    refs.legalDialog.addEventListener('close', () => { state.legalRequestId += 1; });
    refs.settingsClose.addEventListener('click', () => refs.settingsDialog.close());
    refs.settingsDialog.addEventListener('click', event => { if (event.target === refs.settingsDialog) refs.settingsDialog.close(); });
    if (refs.settingsAccountSelect) refs.settingsAccountSelect.addEventListener('change', () => selectSettingsAccount().catch(error => { renderSettings(); setFlowMessage(refs.settingsStatus, error.message || error, 'error'); }));
    refs.settingsCloudToggle.addEventListener('change', () => setCloudEnabled(refs.settingsCloudToggle.checked).catch(error => { refs.settingsCloudToggle.checked = !refs.settingsCloudToggle.checked; setFlowMessage(refs.settingsStatus, error.message || error, 'error'); }));
    refs.settingsAutoSessionToggle.addEventListener('change', () => setAutomaticSession(refs.settingsAutoSessionToggle.checked).catch(error => { refs.settingsAutoSessionToggle.checked = !refs.settingsAutoSessionToggle.checked; setFlowMessage(refs.settingsStatus, error.message || error, 'error'); }));
    refs.settingsPollSave.addEventListener('click', () => savePollInterval().catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsOpenPanel.addEventListener('click', () => send('pto').then(response => setFlowMessage(refs.settingsStatus, response.opened || response.created ? 'Teams panel opened.' : 'No Teams tab was available.', response.opened || response.created ? 'good' : '')).catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsReloadTeams.addEventListener('click', () => send('prt').then(() => setFlowMessage(refs.settingsStatus, 'Teams tabs reloaded.', 'good')).catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsIntegrityRefresh.addEventListener('click', () => send('th_runtime_package_status', { reason: 'popup-settings-refresh', force: true }).then(response => {
      renderPackageState(response.packageState || response);
      setFlowMessage(refs.settingsStatus, 'Installed manifest cache refreshed.', 'good');
    }).catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsManageBilling.addEventListener('click', () => send('pob').then(response => response.url && openTab(response.url)).then(() => setFlowMessage(refs.settingsStatus, 'Billing portal opened.', 'good')).catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsLogRefresh.addEventListener('click', () => refreshScheduleLogs().catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsLogCopy.addEventListener('click', () => copyScheduleLogs().catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsLogClear.addEventListener('click', () => clearScheduleLogs().catch(error => setFlowMessage(refs.settingsStatus, error.message || error, 'error')));
    refs.settingsFeedbackText.addEventListener('input', updateFeedbackCounter);
    refs.settingsFeedbackSend.addEventListener('click', () => submitFeedback(false).catch(error => setFlowMessage(refs.settingsFeedbackStatus, error.message || error, 'error')));
    refs.settingsFeedbackSendLogs.addEventListener('click', () => submitFeedback(true).catch(error => setFlowMessage(refs.settingsFeedbackStatus, error.message || error, 'error')));
    document.querySelectorAll('[data-cloud-settings="true"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); hideAppMenu(); openTab(CLOUD_CONFIG_EDIT_URL).catch(error => showToast(error.message || error, 'error')); }));
    window.addEventListener('pointermove', moveBlockDrag);
    window.addEventListener('pointerup', event => finishBlockDrag(event, false));
    window.addEventListener('pointercancel', event => finishBlockDrag(event, true));
    document.addEventListener('pointerdown', event => {
      const target = event.target;
      if (refs.appContextMenu && !refs.appContextMenu.hidden && !refs.appContextMenu.contains(target)) hideAppMenu();
      if (refs.noteContextMenu && !refs.noteContextMenu.hidden && !refs.noteContextMenu.contains(target)) hideNoteContextMenu();
      if (!state.timePickerField || !refs.timePicker || refs.timePicker.hidden) return;
      const insidePicker = refs.timePicker.contains(target);
      const insideTrigger = refs.startFieldButton.contains(target) || refs.endFieldButton.contains(target);
      if (!insidePicker && !insideTrigger) closeTimePicker();
    }, true);
    document.addEventListener('contextmenu', event => {
      const target = event.target;
      if (target === refs.noteField) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const selection = state.noteSelection || currentNoteSelection();
        state.noteSelection = selection;
        restoreNoteSelection(selection);
        openNoteContextMenu(event.clientX, event.clientY).catch(error => showToast(error.message || error, 'error'));
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      hideNoteContextMenu();
      if (refs.appContextMenu && refs.appContextMenu.contains(event.target)) return;
      const block = event.target.closest && event.target.closest('.schedule-block');
      if (block) {
        selectBlock(block.dataset.token, false);
        openAppMenu(event.clientX, event.clientY, { kind: 'block', token: block.dataset.token }, event.target);
        return;
      }
      const accountCard = event.target.closest && event.target.closest('.account-card');
      if (accountCard && accountCard.dataset.accountKey) {
        openAppMenu(event.clientX, event.clientY, { kind: 'account', accountKey: accountCard.dataset.accountKey }, event.target);
        return;
      }
      const timeline = timelineContextFromEvent(event);
      openAppMenu(event.clientX, event.clientY, timeline || { kind: 'app' }, event.target);
    }, true);
    window.addEventListener('keydown', event => {
      if (!state.timePickerField || !refs.timePicker || refs.timePicker.hidden) return;
      if (event.key !== 'Escape' && event.key !== 'Enter') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.key === 'Escape') {
        state.suppressEscapeKeyup = true;
        window.setTimeout(() => { state.suppressEscapeKeyup = false; }, 500);
      }
      closeTimePicker();
    }, true);
    window.addEventListener('keyup', event => {
      if (event.key !== 'Escape' || !state.suppressEscapeKeyup) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      state.suppressEscapeKeyup = false;
    }, true);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') { hideNoteContextMenu({ restore: true }); hideAppMenu(); }
      if ((event.key === 'Delete' || event.key === 'Backspace') && state.selectedBlock && !event.target.matches('input,textarea,select')) deleteSelectedBlock();
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !state.busy && state.activeMutationCount === 0) refreshAll({ autoDiscover: false }).catch(() => null); });
    window.addEventListener('resize', positionTimePicker);
    window.addEventListener('scroll', positionTimePicker, true);
    window.addEventListener('beforeunload', () => { if (state.refreshTimer) clearInterval(state.refreshTimer); });
  }

  function cacheRefs() {
    [
      'loginScreen', 'flowAuthKicker', 'flowAuthTitle', 'flowAuthCopy', 'flowLoginForm', 'flowIdentity', 'flowPassword', 'flowPasswordToggle', 'flowRemember', 'flowForgot', 'flowLoginSubmit', 'flowEmailLink', 'flowGoogle', 'flowCreate', 'flowLoginStatus', 'flowCaptchaPanel', 'flowCaptchaRefresh', 'flowCaptchaImage', 'flowCaptchaInput', 'flowCaptchaId',
      'accessScreen', 'accessBack', 'flowAccessTitle', 'flowAccessCopy', 'flowAccessIdentity', 'flowAccessForm', 'flowPendingBeta', 'flowBetaNoteField', 'flowBetaNote', 'flowBetaPlan', 'flowSubscriptionPlan', 'flowBilling', 'flowAccessSubmit', 'flowAccessStatus',
      'discoveryScreen', 'flowDiscoveryCopy', 'flowDiscoveryList', 'flowDiscoveryProgress', 'flowDiscoveryStatus', 'flowOpenControl',
      'appScreen', 'noSeenToggle', 'refreshBtn', 'settingsBtn', 'accountCount', 'accountsList', 'scheduleSection', 'scheduleTitle', 'saveState', 'daySelect', 'addBtn', 'timelineMenu', 'zoomRange', 'fitBtn', 'timelineLabels', 'timelineScroll', 'timelineGrid', 'axisTrack', 'selectionReadout', 'editorPanel', 'editorSummary', 'deleteBtn', 'accountField', 'statusField', 'startField', 'endField', 'startFieldButton', 'endFieldButton', 'startFieldDisplay', 'endFieldDisplay', 'timePicker', 'timePickerTitle', 'timePickerPreview', 'timePickerHours', 'timePickerMinutes', 'timePickerMeridiem', 'priorityField', 'priorityValue', 'callsField', 'noteField', 'blockCount', 'footerFaq', 'flowSignOut',
      'appContextMenu', 'appMenuHeader', 'appMenuAddBlock', 'appMenuRemoveBlock', 'appMenuRemoveAccount', 'appMenuContextSeparator', 'appMenuHint', 'appMenuSettings', 'appMenuFaq', 'appMenuCloud', 'noteContextMenu', 'noteMenuCopy', 'noteMenuPaste', 'noteMenuHint',
      'accountRemoveDialog', 'accountRemoveTitle', 'accountRemoveName', 'accountRemoveIdentity', 'accountRemoveCancel', 'accountRemoveConfirm',
      'faqDialog', 'faqClose', 'legalDialog', 'legalTitle', 'legalClose', 'legalPrivacyTab', 'legalTermsTab', 'legalRefresh', 'legalStatus', 'legalContent', 'legalOpenExternal', 'settingsDialog', 'settingsClose', 'settingsAccountSelect', 'settingsCloudToggle', 'settingsAutoSessionToggle', 'settingsPollInterval', 'settingsPollSave', 'settingsOpenPanel', 'settingsReloadTeams', 'settingsIntegrityRefresh', 'settingsManageBilling', 'settingsPackageStatus', 'settingsStatus', 'settingsFeedbackText', 'settingsFeedbackCount', 'settingsFeedbackAttachLogs', 'settingsFeedbackSend', 'settingsFeedbackSendLogs', 'settingsFeedbackStatus', 'settingsLogShell', 'settingsLogViewer', 'settingsLogMeta', 'settingsLogRefresh', 'settingsLogCopy', 'settingsLogClear', 'appToast'
    ].forEach(id => { refs[id] = byId(id); });
  }

  function installSettingsLogShell() {
    if (!refs.settingsLogShell || !refs.settingsLogViewer) return;
    refs.settingsLogShell.querySelectorAll(':scope > .settings-log-resize, :scope > [data-log-resize]').forEach(handle => handle.remove());
    refs.settingsLogViewer.style.resize = 'none';
    refs.settingsLogViewer.setAttribute('readonly', '');
    state.settingsLogResize = null;
    refs.settingsLogShell.classList.remove('resizing');
    refs.settingsLogShell.style.removeProperty('width');
    refs.settingsLogShell.style.removeProperty('height');
    const existingBars = Array.from(refs.settingsLogShell.querySelectorAll(':scope > .terminal-scrollbar:not(.horizontal)'));
    existingBars.slice(1).forEach(bar => bar.remove());
    if (refs.settingsLogShell.dataset.enhanced === 'true' && existingBars[0]) return;
    refs.settingsLogShell.dataset.enhanced = 'true';
    if (!existingBars[0]) installChordForgeScrollbar(refs.settingsLogViewer, refs.settingsLogShell);
  }
  async function initialize() {
    cacheRefs();
    installCustomScrollbars();
    installSettingsLogShell();
    refs.daySelect.value = state.selectedDay;
    setZoom(state.zoomIndex, false, true);
    bindEvents();
    try { await refreshAll({ forceStatus: false, forceCloud: false, autoDiscover: true }); }
    catch (error) { setScreen('login'); setFlowMessage(refs.flowLoginStatus, error.message || error, 'error'); }
    if (!hasSession()) void resumeEmailLinkAuth();
    state.refreshTimer = window.setInterval(() => {
      if (document.hidden || state.busy || state.activeMutationCount > 0 || state.drag || document.activeElement && document.activeElement.matches('input,textarea,select')) return;
      refreshAll({ forceStatus: false, forceCloud: false, autoDiscover: false }).catch(() => null);
    }, 5000);
  }

  const testApi = Object.freeze({
    normalizeStatus,
    normalizeDays,
    normalizeRule,
    normalizeManager,
    accountEmail,
    accountType,
    buildRuntimePayload,
    ruleRange,
    parseTime,
    formatMinutes,
    blockToken,
    parseBlockToken,
    resolveScheduleStatus,
    accountStatusSnapshotForAccount,
    confirmationStateForAccount,
    runtimeEligibleAccounts,
    runtimeWithoutAccount,
    timelineContextFromEvent,
    accountMutationConfig,
    accountMatchesPendingMutation,
    mergeRuntimeWithPendingMutations
  });
  globalThis.__TEAMS_HELPER_POPUP_TEST__ = testApi;

  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', initialize, { once: true });
})();
/* END production GUI flow controller */
