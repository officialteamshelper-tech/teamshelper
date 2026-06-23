/* BEGIN merged source: src/page/modules/ui.js */
/*
 * Teams Helper page UI module.
 * Split from page.js to keep the injected page runtime easier to navigate.
 */
(function(global) {
    "use strict";
    const modules = global.__TWH_PAGE_MODULES__ = global.__TWH_PAGE_MODULES__ || {};

    modules.ui = {
        create(deps) {
            const {
                k, C, isFeedbackTabAllowed, T, B, N, STATUS_PRESET_KEYS, getStatusPreset, normalizeManagerState, normalizeTeamsAccountType, accountKeyEmail, normalizeAccountRegistry, getCurrentAccountMeta, persistSelectedAccountState, applyAccountSelection, hasEnabledScheduleRules, managerTargetDescriptionForUi, isRuntimePolicyAllowed, resolveManagedStatus, describeManagerTarget, L, D, U, Y, q, formatLogLine, renderLogsPanel, scheduleLightUiRefresh, scheduleFullUiRefresh, scheduleRuntimeSync, copyLogs, livePresenceHeaders, bridgeUiRequest, requestCapturedPresenceHeaders, formatCallStateForUi, describeBackendPresence, resetScheduleTransitionTimer, Te, Ae, Ee, Oe, Be, je, Ne, Me, $e, liveWorkerFields, Ze, et, rt, at, lt, requestPresenceForce, persistManagerState, forceImmediateScheduleTimelineRefresh, renderManagerRules, stopRuntimeTimersForPolicy, removeTeamsHelperGui
            } = deps;

    // UI-only feature switch: keep Teams runtime/auth/presence code active while
    // preventing the optional in-page control panel from being mounted.
    const TEAMS_HELPER_PAGE_PANEL_UI_ENABLED = false;

    function ut() {
        if (!TEAMS_HELPER_PAGE_PANEL_UI_ENABLED) {
            L.guiClosed = true;
            try { removeTeamsHelperGui("panel-ui-disabled"); } catch {}
            return null;
        }
        if (L.guiClosed) return null;
        if (!isRuntimePolicyAllowed()) return removeTeamsHelperGui(L.policyBlockReason || "controls-unavailable"), null;
        if (L.gui && L.gui.host && document.documentElement && document.documentElement.contains(L.gui.host)) return L.gui;
        if (L.gui && "function" == typeof L.gui.dispose) {
            try { L.gui.dispose("replace"); } catch {}
        }
        const root = document.body || document.documentElement;
        if (!root || !document.createElement) return null;
        try {
            const existing = document.getElementById("teams-helper-control-panel");
            existing && existing.remove && existing.remove();
        } catch {}
        const host = Oe("div", {
            id: "teams-helper-control-panel",
            attrs: {
                "data-teams-helper": "presence-gui"
            }
        });
        const teamsHelperLogoUrl = "data:image/png;base64,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";
        const style = Oe("style", {
            text: `
#teams-helper-control-panel{position:fixed;right:18px;bottom:18px;width:min(520px,calc(100vw - 32px));z-index:2147483647;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#eef5ff;pointer-events:auto}
#teams-helper-control-panel *{box-sizing:border-box}
#teams-helper-control-panel .th-card{overflow:hidden;border:1px solid rgba(92,143,255,.34);border-radius:22px;background:linear-gradient(180deg,rgba(5,23,52,.96),rgba(2,10,25,.96));box-shadow:0 22px 70px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(16px)}
#teams-helper-control-panel .th-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(92,143,255,.22);background:linear-gradient(180deg,rgba(18,52,108,.76),rgba(9,30,66,.5))}
#teams-helper-control-panel .th-brand{display:flex;align-items:center;gap:10px;min-width:0}
#teams-helper-control-panel .th-mark{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(180deg,#1f75ff,#1553cf);box-shadow:0 10px 28px rgba(22,98,255,.34)}
#teams-helper-control-panel .th-mark:before{content:'';display:none}
#teams-helper-control-panel .th-title{font-size:14px;font-weight:850;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#teams-helper-control-panel .th-sub{font-size:12px;color:#9fb7e9;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#teams-helper-control-panel .th-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
#teams-helper-control-panel button,#teams-helper-control-panel select,#teams-helper-control-panel input,#teams-helper-control-panel textarea{font:inherit}
#teams-helper-control-panel button{border:1px solid rgba(107,157,255,.28);border-radius:12px;background:rgba(15,43,89,.72);color:#eef5ff;padding:8px 11px;font-weight:750;cursor:pointer;box-shadow:none}
#teams-helper-control-panel button:hover{background:rgba(27,69,136,.86)}
#teams-helper-control-panel button.active{background:rgba(31,112,255,.32);border-color:rgba(115,170,255,.52)}
#teams-helper-control-panel .th-primary{background:linear-gradient(180deg,#1e72ff,#1557dc);border-color:rgba(122,174,255,.5)}
#teams-helper-control-panel .th-ghost{padding:8px 10px;min-width:36px}
#teams-helper-control-panel .th-body{display:grid;gap:12px;padding:14px 16px 16px;max-height:min(68vh,720px);overflow:auto}
#teams-helper-control-panel .th-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
#teams-helper-control-panel .th-stat{border:1px solid rgba(107,157,255,.18);border-radius:14px;background:rgba(7,28,61,.68);padding:10px;min-width:0}
#teams-helper-control-panel .th-label{font-size:10px;color:#9fb7e9;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}
#teams-helper-control-panel .th-value{font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#teams-helper-control-panel .th-row{display:grid;grid-template-columns:minmax(130px,.62fr) minmax(0,1fr);align-items:center;gap:10px;border:1px solid rgba(107,157,255,.16);border-radius:14px;background:rgba(7,28,61,.48);padding:10px}
#teams-helper-control-panel .th-row span:first-child{color:#b8caef;font-size:12px;font-weight:700}
#teams-helper-control-panel .th-switch{position:relative;display:inline-flex;width:48px;height:28px;align-items:center;flex:0 0 auto;cursor:pointer}
#teams-helper-control-panel .th-switch input{position:absolute;inset:0;opacity:0;width:100%;height:100%;margin:0;cursor:pointer;z-index:2}
#teams-helper-control-panel .th-track{position:absolute;inset:0;border-radius:999px;background:rgba(160,178,210,.18);border:1px solid rgba(107,157,255,.24);pointer-events:none}
#teams-helper-control-panel .th-track:after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:999px;background:#eaf2ff;transition:transform .18s ease;box-shadow:0 4px 10px rgba(0,0,0,.35)}
#teams-helper-control-panel .th-switch input:checked+.th-track{background:#1e72ff}
#teams-helper-control-panel .th-switch input:checked+.th-track:after{transform:translateX(20px)}
#teams-helper-control-panel .th-select,#teams-helper-control-panel .th-input,#teams-helper-control-panel textarea{width:100%;border:1px solid rgba(107,157,255,.22);border-radius:12px;background:rgba(9,31,69,.9);color:#eef5ff;padding:9px 10px;outline:none}
#teams-helper-control-panel .th-select{appearance:auto}
#teams-helper-control-panel .th-tabs{display:flex;gap:6px;overflow:auto;padding-bottom:2px}
#teams-helper-control-panel .th-tab{font-size:11px;padding:7px 9px;white-space:nowrap;background:rgba(7,28,61,.55)}
#teams-helper-control-panel .th-tab.active{background:rgba(31,112,255,.28);border-color:rgba(115,170,255,.5)}
#teams-helper-control-panel .th-panel{display:none;gap:10px}
#teams-helper-control-panel .th-panel.active{display:grid}
#teams-helper-control-panel .buttons{display:flex;flex-wrap:wrap;gap:7px}
#teams-helper-control-panel .buttons button.active{background:rgba(31,112,255,.32);border-color:rgba(115,170,255,.52)}
#teams-helper-control-panel .manager-rule{display:grid;gap:8px;border:1px solid rgba(107,157,255,.16);border-radius:14px;background:rgba(7,28,61,.46);padding:10px}
#teams-helper-control-panel .manager-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
#teams-helper-control-panel .manager-grid .row{display:grid;gap:4px;color:#b8caef;font-size:11px}
#teams-helper-control-panel .manager-grid input,#teams-helper-control-panel .manager-grid select{width:100%;border:1px solid rgba(107,157,255,.22);border-radius:10px;background:rgba(9,31,69,.9);color:#eef5ff;padding:7px}
#teams-helper-control-panel textarea{min-height:150px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;resize:vertical}
#teams-helper-control-panel .th-logbox{min-height:160px;white-space:pre;overflow:auto}
#teams-helper-control-panel .th-section-title{font-size:13px;font-weight:850;letter-spacing:.01em;color:#eef5ff}
#teams-helper-control-panel .th-log-intro{display:grid;gap:3px;border:1px solid rgba(107,157,255,.16);border-radius:14px;background:rgba(7,28,61,.44);padding:12px}
#teams-helper-control-panel .th-log-heading{display:inline-flex;align-items:center;gap:8px;justify-content:flex-start;width:max-content;max-width:100%;border:1px solid rgba(107,157,255,.16);border-radius:999px;background:rgba(7,28,61,.46);padding:7px 9px;color:#b8caef;font-size:12px;font-weight:750}
#teams-helper-control-panel .th-feedback-card{display:grid;gap:10px;border:1px solid rgba(107,157,255,.16);border-radius:16px;background:rgba(7,28,61,.46);padding:12px}
#teams-helper-control-panel .th-panel[hidden],#teams-helper-control-panel .th-tab[hidden]{display:none!important}
#teams-helper-control-panel .muted{color:#9fb7e9;font-size:12px}
#teams-helper-control-panel .th-warning{border:1px solid rgba(255,199,87,.28);border-radius:12px;background:rgba(255,190,70,.10);color:#ffe0a3;font-size:12px;line-height:1.35;padding:9px 10px}
#teams-helper-control-panel .th-warning[hidden]{display:none!important}
#teams-helper-control-panel .pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 8px;font-size:11px;font-weight:800;border:1px solid rgba(107,157,255,.22);background:rgba(7,28,61,.7)}
#teams-helper-control-panel .pill-on{color:#78f0a0;border-color:rgba(83,221,124,.35);background:rgba(39,160,83,.14)}
#teams-helper-control-panel .pill-off{color:#ffb0aa;border-color:rgba(255,103,99,.38);background:rgba(255,81,74,.12)}
#teams-helper-control-panel.th-collapsed .th-body{display:none}
#teams-helper-control-panel.th-collapsed{width:auto;min-width:360px}
#teams-helper-control-panel .th-lite-spacious-override{display:none}
#teams-helper-control-panel{width:min(600px,calc(100vw - 32px))}
#teams-helper-control-panel .th-card{background:rgba(10,18,34,.94);border-color:rgba(255,255,255,.10);box-shadow:0 18px 44px rgba(0,0,0,.34)}
#teams-helper-control-panel .th-head{background:rgba(18,36,72,.55);padding:16px 18px}
#teams-helper-control-panel .th-body{gap:16px;padding:16px 18px 18px;max-height:min(74vh,760px)}
#teams-helper-control-panel .th-stat,#teams-helper-control-panel .th-row,#teams-helper-control-panel .manager-rule{background:rgba(255,255,255,.045);border-color:rgba(255,255,255,.09)}
#teams-helper-control-panel .th-panel{gap:12px}
#teams-helper-control-panel .th-grid{gap:10px}
#teams-helper-control-panel .buttons{gap:9px}
#teams-helper-control-panel button,#teams-helper-control-panel .th-select,#teams-helper-control-panel .th-input,#teams-helper-control-panel textarea{border-radius:14px}
#teams-helper-control-panel .th-row{padding:12px}

#teams-helper-control-panel .schedule-timeline-editor{display:grid;gap:10px;min-width:0}
#teams-helper-control-panel .schedule-timeline-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
#teams-helper-control-panel .schedule-zoom-controls{display:flex;gap:6px}
#teams-helper-control-panel .schedule-zoom-controls button{min-width:34px;padding:6px 9px}
#teams-helper-control-panel .schedule-timeline-hint{font-size:11px;color:#9fb7e9;line-height:1.35}
#teams-helper-control-panel .schedule-day-row{display:grid;grid-template-columns:54px minmax(0,1fr);gap:8px;align-items:start;border:1px solid rgba(107,157,255,.14);border-radius:14px;background:rgba(7,28,61,.36);padding:8px}
#teams-helper-control-panel .schedule-day-label{display:grid;gap:3px;justify-items:start;position:sticky;left:0;z-index:2}
#teams-helper-control-panel .schedule-day-label strong{font-size:12px;letter-spacing:.04em}
#teams-helper-control-panel .schedule-day-label span{font-size:10px;color:#9fb7e9}
#teams-helper-control-panel .schedule-time-wrap{min-width:0;overflow-x:auto;overflow-y:hidden;border:1px solid rgba(107,157,255,.14);border-radius:12px;background:linear-gradient(180deg,rgba(4,18,41,.78),rgba(3,12,29,.78));touch-action:pan-x}
#teams-helper-control-panel .schedule-time-strip{position:relative;min-height:72px}
#teams-helper-control-panel .schedule-axis{position:relative;height:20px;border-bottom:1px solid rgba(107,157,255,.13)}
#teams-helper-control-panel .schedule-axis-tick{position:absolute;top:3px;transform:translateX(-1px);font-size:9px;color:#7fa3df;white-space:nowrap}
#teams-helper-control-panel .schedule-lanes{position:relative;min-height:42px}
#teams-helper-control-panel .schedule-grid{position:absolute;top:0;bottom:0;width:1px;background:rgba(107,157,255,.08);pointer-events:none}
#teams-helper-control-panel .schedule-grid.major{background:rgba(107,157,255,.16)}
#teams-helper-control-panel .schedule-block{position:absolute;height:28px;display:flex;align-items:center;justify-content:space-between;gap:3px;min-width:26px;overflow:hidden;border-radius:999px;border:1px solid rgba(255,255,255,.30);padding:0 8px;background:#2e72ff;color:white;font-size:10px;font-weight:850;text-shadow:0 1px 1px rgba(0,0,0,.28);box-shadow:0 6px 18px rgba(0,0,0,.26);cursor:grab;touch-action:none}
#teams-helper-control-panel .schedule-block:active{cursor:grabbing}
#teams-helper-control-panel .schedule-block.selected{outline:2px solid rgba(255,255,255,.82);outline-offset:2px}
#teams-helper-control-panel .schedule-block[data-tone=available]{background:#2fb66d}
#teams-helper-control-panel .schedule-block[data-tone=busy]{background:#b85f2d}
#teams-helper-control-panel .schedule-block[data-tone=dnd]{background:#bd2d4e}
#teams-helper-control-panel .schedule-block[data-tone=brb]{background:#9a6fdb}
#teams-helper-control-panel .schedule-block[data-tone=away]{background:#8b97a8}
#teams-helper-control-panel .schedule-block[data-tone=offline]{background:#596171}
#teams-helper-control-panel .schedule-block-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;pointer-events:none}
#teams-helper-control-panel .schedule-resize-handle{flex:0 0 12px;width:12px;height:24px;border-radius:999px;background:rgba(255,255,255,.72);opacity:.88;cursor:ew-resize;touch-action:none;user-select:none}
#teams-helper-control-panel .schedule-resize-handle.left{margin-left:-4px}
#teams-helper-control-panel .schedule-resize-handle.right{margin-right:-4px}
#teams-helper-control-panel .schedule-detail-editor{grid-column:2;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:2px;border-top:1px solid rgba(107,157,255,.13);padding-top:8px}
#teams-helper-control-panel .schedule-detail-editor label{display:grid;gap:4px;color:#b8caef;font-size:10px;font-weight:700}
#teams-helper-control-panel .schedule-detail-input{width:100%;border:1px solid rgba(107,157,255,.22);border-radius:10px;background:rgba(9,31,69,.9);color:#eef5ff;padding:7px;min-width:0}
#teams-helper-control-panel .schedule-detail-check{display:flex!important;align-items:center;gap:6px;grid-template-columns:none!important}
#teams-helper-control-panel .schedule-detail-check input{width:auto}
@media(max-width:520px){#teams-helper-control-panel{right:10px;bottom:10px;width:calc(100vw - 20px)}#teams-helper-control-panel .th-grid{grid-template-columns:1fr 1fr}#teams-helper-control-panel .manager-grid{grid-template-columns:1fr}#teams-helper-control-panel .th-row{grid-template-columns:1fr}#teams-helper-control-panel .schedule-day-row{grid-template-columns:42px minmax(0,1fr);padding:7px}#teams-helper-control-panel .schedule-detail-editor{grid-template-columns:1fr 1fr;grid-column:1 / -1}}
#teams-helper-control-panel{--th-bg:#050816;--th-surface:rgba(15,23,42,.88);--th-surface-strong:rgba(17,29,52,.95);--th-border:rgba(148,163,184,.18);--th-border-strong:rgba(110,231,183,.34);--th-text:#eef6ff;--th-muted:#9fb0ca;--th-accent:#6ee7b7;--th-accent-2:#60a5fa;right:18px;bottom:18px;width:min(600px,calc(100vw - 32px));min-width:360px;min-height:156px;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px);resize:both;overflow:auto;color:var(--th-text)}
#teams-helper-control-panel.th-dragging,#teams-helper-control-panel.th-dragging *{user-select:none!important}
#teams-helper-control-panel .th-card{height:100%;display:flex;flex-direction:column;background:radial-gradient(circle at 8% 0,rgba(96,165,250,.22),transparent 36%),radial-gradient(circle at 94% 6%,rgba(110,231,183,.14),transparent 32%),linear-gradient(180deg,var(--th-surface-strong),var(--th-surface));border-color:var(--th-border);border-radius:24px;box-shadow:0 24px 72px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(18px)}
#teams-helper-control-panel .th-head{cursor:move;background:linear-gradient(135deg,rgba(15,23,42,.94),rgba(8,18,34,.88));border-bottom-color:var(--th-border);padding:14px 16px}
#teams-helper-control-panel .th-body{flex:1;max-height:none;gap:14px;padding:16px}
#teams-helper-control-panel .th-mark{width:42px;height:42px;border-radius:14px;background:linear-gradient(180deg,#1f75ff,#1553cf);border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 26px rgba(0,0,0,.35)}
#teams-helper-control-panel .th-mark:before{content:''!important;display:none!important}
#teams-helper-control-panel .th-title{font-size:15px;font-weight:900;letter-spacing:-.015em;color:#f8fbff}
#teams-helper-control-panel .th-sub{color:var(--th-muted)}
#teams-helper-control-panel button{background:rgba(15,23,42,.84);border-color:rgba(148,163,184,.22);color:var(--th-text);border-radius:14px}
#teams-helper-control-panel button:hover{background:rgba(30,41,59,.92)}
#teams-helper-control-panel .th-primary{background:linear-gradient(180deg,#34d399,#10b981);border-color:rgba(110,231,183,.52);color:#042014}
#teams-helper-control-panel button.active,#teams-helper-control-panel .th-tab.active{background:rgba(110,231,183,.14);border-color:var(--th-border-strong);color:#d8fff0}
#teams-helper-control-panel .th-stat,#teams-helper-control-panel .th-row,#teams-helper-control-panel .manager-rule,#teams-helper-control-panel .schedule-day-row{background:rgba(255,255,255,.045);border-color:var(--th-border)}
#teams-helper-control-panel .th-label,#teams-helper-control-panel .th-row span:first-child,#teams-helper-control-panel .muted,#teams-helper-control-panel .schedule-timeline-hint,#teams-helper-control-panel .schedule-day-label span{color:var(--th-muted)}
#teams-helper-control-panel .th-select,#teams-helper-control-panel .th-input,#teams-helper-control-panel textarea,#teams-helper-control-panel .manager-grid input,#teams-helper-control-panel .manager-grid select,#teams-helper-control-panel .schedule-detail-input{background:rgba(5,12,24,.94);border-color:rgba(148,163,184,.22);color:var(--th-text);border-radius:14px}
#teams-helper-control-panel .th-track{background:rgba(148,163,184,.18);border-color:rgba(148,163,184,.22)}
#teams-helper-control-panel .th-switch input:checked+.th-track{background:#10b981;border-color:rgba(110,231,183,.55)}
#teams-helper-control-panel .pill{background:rgba(15,23,42,.82);border-color:rgba(148,163,184,.22)}
#teams-helper-control-panel .pill-on{color:#b7f7dc;border-color:rgba(110,231,183,.42);background:rgba(16,185,129,.13)}
#teams-helper-control-panel .pill-off{color:#fda4af;border-color:rgba(251,113,133,.38);background:rgba(244,63,94,.12)}
#teams-helper-control-panel .th-close{font-size:16px;line-height:1;padding:8px 10px}
#teams-helper-control-panel .schedule-time-wrap{background:linear-gradient(180deg,rgba(5,12,24,.92),rgba(3,8,18,.92));border-color:var(--th-border)}
#teams-helper-control-panel.th-collapsed{resize:none;min-height:auto}

/* Teams Helper timeline palette */
#teams-helper-control-panel{
  --th-page:#081020;
  --th-card:#101b2e;
  --th-card-2:#0b1425;
  --th-card-3:#111f35;
  --th-border:#2a3f61;
  --th-border-strong:#3f5f8d;
  --th-text:#f8fbff;
  --th-muted:#9ab7e6;
  --th-blue:#93c5fd;
  --th-green:#20b866;
  --th-green-soft:#72d99b;
  --th-orange:#d95a13;
  --th-orange-soft:#e89a75;
  --th-rose:#c63a65;
  --th-gray:#8e9aae;
  width:min(710px,calc(100vw - 32px));
  min-width:380px;
  min-height:170px;
  color:var(--th-text);
  contain:layout style;
}
#teams-helper-control-panel .th-card{background:linear-gradient(180deg,var(--th-card),var(--th-card-2));border:1px solid var(--th-border);box-shadow:0 18px 52px rgba(0,0,0,.44);backdrop-filter:none}
#teams-helper-control-panel .th-head{cursor:move;touch-action:none;background:linear-gradient(180deg,#111f35,#0d182b);border-bottom:1px solid var(--th-border)}
#teams-helper-control-panel .th-body{background:var(--th-card-2);scrollbar-color:#9b9b9b #2b2b2b;contain:layout paint style}
#teams-helper-control-panel.th-dragging{will-change:transform;cursor:grabbing}
#teams-helper-control-panel.th-dragging .th-head{cursor:grabbing}
#teams-helper-control-panel.th-dragging .th-card{box-shadow:0 14px 38px rgba(0,0,0,.36);backdrop-filter:none!important}
#teams-helper-control-panel.th-dragging *{user-select:none!important}
#teams-helper-control-panel .th-stat,#teams-helper-control-panel .th-row,#teams-helper-control-panel .manager-rule,#teams-helper-control-panel .schedule-day-row,#teams-helper-control-panel .th-log-card,#teams-helper-control-panel .th-feedback-card{background:var(--th-card-3);border-color:var(--th-border)}
#teams-helper-control-panel .th-label,#teams-helper-control-panel .th-row span:first-child,#teams-helper-control-panel .muted,#teams-helper-control-panel .schedule-timeline-hint,#teams-helper-control-panel .schedule-day-label span{color:var(--th-muted)}
#teams-helper-control-panel .th-value,#teams-helper-control-panel .schedule-day-label strong{color:var(--th-text)}
#teams-helper-control-panel button,#teams-helper-control-panel .th-select,#teams-helper-control-panel .th-input,#teams-helper-control-panel textarea,#teams-helper-control-panel .manager-grid input,#teams-helper-control-panel .manager-grid select,#teams-helper-control-panel .schedule-detail-input{background:#0b1425;color:var(--th-text);border-color:var(--th-border)}
#teams-helper-control-panel button:hover{background:#14243c;border-color:var(--th-border-strong)}
#teams-helper-control-panel .th-primary{background:linear-gradient(180deg,#1f9d5a,var(--th-green));border-color:rgba(114,217,155,.65);color:#04170d}
#teams-helper-control-panel button.active,#teams-helper-control-panel .th-tab.active{background:#14243c;border-color:var(--th-blue);color:#dbeeff}
#teams-helper-control-panel .pill{background:#0b1425;border-color:var(--th-border);color:#dbeeff}
#teams-helper-control-panel .pill-on{color:#c7f8d8;border-color:rgba(114,217,155,.58);background:rgba(32,184,102,.16)}
#teams-helper-control-panel .pill-off{color:#ffc4ce;border-color:rgba(198,58,101,.58);background:rgba(198,58,101,.14)}
#teams-helper-control-panel .th-switch input:checked+.th-track{background:var(--th-green);border-color:rgba(114,217,155,.65)}
#teams-helper-control-panel .th-track{background:#1a2a43;border-color:var(--th-border)}
#teams-helper-control-panel .schedule-time-wrap{background:#0b1425;border-color:var(--th-border);scrollbar-color:#9b9b9b #2b2b2b}
#teams-helper-control-panel .schedule-axis{border-bottom-color:var(--th-border)}
#teams-helper-control-panel .schedule-axis-tick{color:var(--th-blue);font-weight:800}
#teams-helper-control-panel .schedule-grid{background:rgba(147,197,253,.16)}
#teams-helper-control-panel .schedule-grid.major{background:rgba(147,197,253,.28)}
#teams-helper-control-panel .schedule-block{box-shadow:0 8px 18px rgba(0,0,0,.34);border-color:rgba(255,255,255,.26)}
#teams-helper-control-panel .schedule-block[data-tone=available]{background:linear-gradient(90deg,var(--th-green-soft),var(--th-green))}
#teams-helper-control-panel .schedule-block[data-tone=busy]{background:linear-gradient(90deg,var(--th-orange-soft),var(--th-orange))}
#teams-helper-control-panel .schedule-block[data-tone=away]{background:linear-gradient(90deg,#a7b1c2,#64748b)}
#teams-helper-control-panel .schedule-block[data-tone=dnd]{background:linear-gradient(90deg,#e36a8e,var(--th-rose))}
#teams-helper-control-panel .schedule-block.selected{outline:2px solid #f8fbff;outline-offset:2px}
#teams-helper-control-panel .th-log-card,#teams-helper-control-panel .th-feedback-card{display:grid;gap:8px;border:1px solid var(--th-border);border-radius:14px;padding:10px}
#teams-helper-control-panel .th-good{color:#bff7d3!important}
#teams-helper-control-panel .th-bad{color:#ffc4ce!important}
#teams-helper-control-panel .th-close{font-size:16px;line-height:1;padding:8px 10px}
#teams-helper-control-panel{resize:none!important;overflow:visible!important;container-type:inline-size;min-width:300px;min-height:150px}
#teams-helper-control-panel .th-card{height:100%;min-height:0;overflow:hidden}
#teams-helper-control-panel .th-body{flex:1;min-height:0;overflow:auto;max-height:none!important}
#teams-helper-control-panel .th-brand{min-width:0;max-width:100%}
#teams-helper-control-panel .th-brand>div:last-child{min-width:0;overflow:hidden}
#teams-helper-control-panel .th-mark{flex:0 0 42px!important;width:42px!important;height:42px!important;min-width:42px!important;max-width:42px!important;min-height:42px!important;max-height:42px!important;background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important;image-rendering:auto!important}
#teams-helper-control-panel .th-panel-resize{position:absolute;z-index:10;background:transparent;touch-action:none;user-select:none}
#teams-helper-control-panel .th-resize-n{left:12px;right:12px;top:-4px;height:8px;cursor:ns-resize}
#teams-helper-control-panel .th-resize-s{left:12px;right:12px;bottom:-4px;height:8px;cursor:ns-resize}
#teams-helper-control-panel .th-resize-e{top:12px;bottom:12px;right:-4px;width:8px;cursor:ew-resize}
#teams-helper-control-panel .th-resize-w{top:12px;bottom:12px;left:-4px;width:8px;cursor:ew-resize}
#teams-helper-control-panel .th-resize-ne{right:-5px;top:-5px;width:14px;height:14px;cursor:nesw-resize}
#teams-helper-control-panel .th-resize-nw{left:-5px;top:-5px;width:14px;height:14px;cursor:nwse-resize}
#teams-helper-control-panel .th-resize-se{right:-5px;bottom:-5px;width:14px;height:14px;cursor:nwse-resize}
#teams-helper-control-panel .th-resize-sw{left:-5px;bottom:-5px;width:14px;height:14px;cursor:nesw-resize}
#teams-helper-control-panel.th-resizing,#teams-helper-control-panel.th-resizing *{user-select:none!important}
#teams-helper-control-panel.th-resizing .th-card{backdrop-filter:none!important;box-shadow:0 14px 38px rgba(0,0,0,.36)}
#teams-helper-control-panel.th-collapsed .th-panel-resize{display:none}
#teams-helper-control-panel .th-grid{grid-template-columns:repeat(auto-fit,minmax(128px,1fr))}
#teams-helper-control-panel .schedule-day-row{grid-template-columns:minmax(62px,76px) minmax(0,1fr);min-width:0}
#teams-helper-control-panel .schedule-time-wrap{min-width:0}
#teams-helper-control-panel .schedule-detail-editor{min-width:0}
@container (max-width:520px){#teams-helper-control-panel .th-row{grid-template-columns:1fr}#teams-helper-control-panel .schedule-day-row{grid-template-columns:1fr}#teams-helper-control-panel .schedule-detail-editor{grid-column:1;grid-template-columns:1fr 1fr}#teams-helper-control-panel .th-actions{gap:6px}#teams-helper-control-panel .th-title{font-size:14px}#teams-helper-control-panel .th-sub{display:none}}

/* Ergonomic resize and button stability patch */
#teams-helper-control-panel{
  width:clamp(320px,46vw,860px);
  height:min(680px,calc(100vh - 36px));
  min-width:320px;
  min-height:220px;
  overflow:visible!important;
}
#teams-helper-control-panel .th-card{display:flex!important;flex-direction:column!important;min-width:0!important;min-height:0!important;overflow:hidden!important}
#teams-helper-control-panel .th-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;min-height:64px!important;padding:12px 14px!important}
#teams-helper-control-panel .th-brand{display:flex!important;align-items:center!important;gap:10px!important;min-width:0!important;overflow:hidden!important}
#teams-helper-control-panel .th-brand>div:last-child{min-width:0!important;overflow:hidden!important}
#teams-helper-control-panel .th-mark{flex:0 0 42px!important;width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important;max-width:42px!important;max-height:42px!important;background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important;transform:none!important}
#teams-helper-control-panel .th-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex-wrap:wrap!important;min-width:0!important}
#teams-helper-control-panel button{appearance:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-height:34px!important;height:auto!important;max-height:44px!important;width:auto!important;min-width:0!important;padding:8px 12px!important;line-height:1.1!important;white-space:nowrap!important;text-align:center!important;overflow:hidden!important;text-overflow:ellipsis!important;word-break:keep-all!important;writing-mode:horizontal-tb!important;transform:none!important;flex:0 1 auto!important}
#teams-helper-control-panel .th-ghost{width:36px!important;min-width:36px!important;max-width:36px!important;padding:8px!important;flex:0 0 36px!important}
#teams-helper-control-panel .th-close{font-size:16px!important;line-height:1!important}
#teams-helper-control-panel .th-switch{flex:0 0 48px!important;width:48px!important;height:28px!important;min-width:48px!important;max-width:48px!important}
#teams-helper-control-panel .th-body{display:grid!important;grid-template-rows:auto auto minmax(0,1fr)!important;gap:14px!important;flex:1 1 auto!important;min-height:0!important;overflow:auto!important;padding:14px!important;max-height:none!important}
#teams-helper-control-panel .th-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))!important;gap:10px!important;align-items:stretch!important;min-width:0!important}
#teams-helper-control-panel .th-stat{min-height:78px!important;display:grid!important;align-content:start!important;gap:4px!important;min-width:0!important;overflow:hidden!important}
#teams-helper-control-panel .th-value{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#teams-helper-control-panel .th-tabs{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important;overflow:visible!important;padding:0!important;min-height:0!important}
#teams-helper-control-panel .th-tab{height:auto!important;min-height:36px!important;max-height:42px!important;width:auto!important;min-width:0!important;flex:0 1 auto!important;padding:8px 12px!important;border-radius:14px!important}
#teams-helper-control-panel .th-panel{min-width:0!important;min-height:0!important;overflow:visible!important}
#teams-helper-control-panel .th-panel.active{display:grid!important;align-content:start!important;gap:12px!important}
#teams-helper-control-panel .buttons{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important;min-width:0!important}
#teams-helper-control-panel .buttons button{flex:0 1 auto!important}
#teams-helper-control-panel .th-row{grid-template-columns:minmax(116px,.42fr) minmax(0,1fr)!important;min-width:0!important;gap:10px!important;align-items:center!important}
#teams-helper-control-panel .th-row span:first-child{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#teams-helper-control-panel textarea{resize:none!important;min-height:110px!important;max-height:none!important}
#teams-helper-control-panel .th-logbox{min-height:110px!important}
#teams-helper-control-panel .th-feedback-card,#teams-helper-control-panel .th-log-card{min-width:0!important;min-height:0!important;overflow:hidden!important}
#teams-helper-control-panel .schedule-timeline-editor,#teams-helper-control-panel .schedule-day-row,#teams-helper-control-panel .schedule-time-wrap,#teams-helper-control-panel .schedule-detail-editor{min-width:0!important}
#teams-helper-control-panel.th-resizing .th-card,#teams-helper-control-panel.th-dragging .th-card{transition:none!important;backdrop-filter:none!important}
#teams-helper-control-panel.th-resizing *,#teams-helper-control-panel.th-dragging *{cursor:inherit}
#teams-helper-control-panel .th-panel-resize{background:transparent!important}
@container (max-width:560px){
  #teams-helper-control-panel .th-head{grid-template-columns:1fr!important;align-items:start!important}
  #teams-helper-control-panel .th-actions{justify-content:flex-start!important}
  #teams-helper-control-panel .th-grid{grid-template-columns:1fr 1fr!important}
  #teams-helper-control-panel .th-row{grid-template-columns:1fr!important;align-items:start!important}
  #teams-helper-control-panel .schedule-day-row{grid-template-columns:1fr!important}
  #teams-helper-control-panel .schedule-detail-editor{grid-template-columns:1fr 1fr!important;grid-column:1 / -1!important}
}
@container (max-width:390px){
  #teams-helper-control-panel .th-grid{grid-template-columns:1fr!important}
  #teams-helper-control-panel .th-tab{flex:1 1 auto!important}
  #teams-helper-control-panel .buttons button{flex:1 1 120px!important}
}
@media (max-height:430px){
  #teams-helper-control-panel .th-head{min-height:52px!important;padding:9px 12px!important}
  #teams-helper-control-panel .th-mark{width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important;max-width:34px!important;max-height:34px!important;flex-basis:34px!important}
  #teams-helper-control-panel .th-body{gap:10px!important;padding:10px!important}
  #teams-helper-control-panel .th-stat{min-height:58px!important;padding:8px!important}
  #teams-helper-control-panel textarea{min-height:76px!important}
}





/* Teams Helper GUI polish v2: bounded buttons, readable pills, and responsive timeline */
#teams-helper-control-panel .th-card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;contain:layout paint style!important}
#teams-helper-control-panel .pill{display:inline-flex!important;width:max-content!important;max-width:100%!important;min-width:0!important;justify-self:start!important;align-self:start!important;flex:0 0 auto!important;align-items:center!important;min-height:22px!important;padding:5px 10px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#teams-helper-control-panel .th-stat .pill{max-width:calc(100% - 2px)!important}
#teams-helper-control-panel .th-head{overflow:hidden!important;min-width:0!important}
#teams-helper-control-panel .th-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex-wrap:wrap!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}
#teams-helper-control-panel .th-actions button{flex:0 0 auto!important;min-width:34px!important;max-width:170px!important}
#teams-helper-control-panel button{box-sizing:border-box!important;max-width:100%!important;min-height:34px!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;vertical-align:middle!important}
#teams-helper-control-panel .buttons{align-items:center!important;align-content:flex-start!important;overflow:hidden!important}
#teams-helper-control-panel .buttons button{flex:0 0 auto!important;min-width:40px!important;max-width:220px!important}
#teams-helper-control-panel .th-tabs{display:flex!important;flex-wrap:nowrap!important;gap:8px!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:thin!important;padding-bottom:3px!important}
#teams-helper-control-panel .th-tab{flex:0 0 auto!important;min-width:0!important;max-width:180px!important}
#teams-helper-control-panel .th-body{overscroll-behavior:contain!important;scrollbar-width:thin!important}
#teams-helper-control-panel .schedule-time-wrap{width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:thin!important}
#teams-helper-control-panel .schedule-time-strip,#teams-helper-control-panel .schedule-axis,#teams-helper-control-panel .schedule-lanes{min-width:100%!important}
#teams-helper-control-panel .schedule-lanes{overflow:visible!important}
#teams-helper-control-panel .schedule-axis-tick{font-weight:800!important;color:#9fd0ff!important;text-shadow:0 1px 0 rgba(0,0,0,.35)!important}
#teams-helper-control-panel .schedule-block{height:30px!important;min-height:30px!important;max-height:30px!important;display:grid!important;grid-template-columns:10px minmax(0,1fr) 10px!important;align-items:center!important;justify-items:stretch!important;gap:4px!important;min-width:34px!important;padding:0 7px!important;overflow:hidden!important;line-height:1!important;border-width:1px!important;box-shadow:0 7px 18px rgba(0,0,0,.26)!important;z-index:2!important}
#teams-helper-control-panel .schedule-block:hover{z-index:5!important}
#teams-helper-control-panel .schedule-block-label{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:10px!important;font-weight:850!important;line-height:1!important;text-align:center!important;pointer-events:none!important}
#teams-helper-control-panel .schedule-resize-handle{display:block!important;width:10px!important;min-width:10px!important;max-width:10px!important;flex:0 0 10px!important;height:22px!important;border-radius:999px!important;margin:0!important;opacity:.82!important}
#teams-helper-control-panel .schedule-block.compact{grid-template-columns:7px minmax(0,1fr) 7px!important;gap:2px!important;padding:0 5px!important}
#teams-helper-control-panel .schedule-block.compact .schedule-resize-handle{width:7px!important;min-width:7px!important;max-width:7px!important;flex-basis:7px!important}
#teams-helper-control-panel .schedule-block.tiny{grid-template-columns:minmax(0,1fr)!important;gap:0!important;padding:0 5px!important;justify-content:center!important}
#teams-helper-control-panel .schedule-block.tiny .schedule-resize-handle{display:none!important}
#teams-helper-control-panel .schedule-block.tiny .schedule-block-label{font-size:9px!important;text-align:center!important}
#teams-helper-control-panel .schedule-day-row{align-items:stretch!important;overflow:hidden!important}
#teams-helper-control-panel .schedule-day-label{min-width:0!important;overflow:hidden!important}
#teams-helper-control-panel .schedule-detail-editor{overflow:hidden!important}
@container (max-width:520px){
  #teams-helper-control-panel .th-head{grid-template-columns:1fr!important;gap:8px!important}
  #teams-helper-control-panel .th-actions{justify-content:flex-start!important}
  #teams-helper-control-panel .th-actions button{max-width:140px!important}
  #teams-helper-control-panel .th-grid{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))!important}
}
@container (max-width:380px){
  #teams-helper-control-panel .th-actions button:not(.th-ghost){max-width:112px!important;padding-left:8px!important;padding-right:8px!important}
  #teams-helper-control-panel .th-tab{max-width:130px!important;padding-left:9px!important;padding-right:9px!important}
  #teams-helper-control-panel .schedule-block-label{font-size:9px!important}
}
/* Teams Helper compact ergonomic summary */
#teams-helper-control-panel .th-summary-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;align-items:stretch!important}
#teams-helper-control-panel .th-summary-stat{min-height:72px!important;padding:12px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:7px!important;overflow:hidden!important}
#teams-helper-control-panel .th-summary-values{display:flex!important;align-items:center!important;gap:7px!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}
#teams-helper-control-panel .th-summary-values .pill,#teams-helper-control-panel .th-summary-count{max-width:100%!important;min-width:0!important;min-height:24px!important;height:auto!important;line-height:1.15!important;padding:5px 9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:999px!important}
#teams-helper-control-panel .th-summary-target,#teams-helper-control-panel .th-summary-account-text{font-size:12px!important;font-weight:850!important;line-height:1.25!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#teams-helper-control-panel .th-summary-count{align-self:flex-start!important;border:1px solid rgba(147,197,253,.28)!important;color:#cfe3ff!important;background:rgba(9,31,69,.55)!important;font-size:11px!important;font-weight:850!important}
#teams-helper-control-panel .th-actions{min-width:0!important;overflow:hidden!important;flex-wrap:nowrap!important}
#teams-helper-control-panel .th-actions .pill{max-width:118px!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#teams-helper-control-panel button,#teams-helper-control-panel .th-tab{min-height:32px!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;flex:0 1 auto!important}
#teams-helper-control-panel .buttons{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:8px!important;min-width:0!important;overflow:hidden!important}
#teams-helper-control-panel .buttons button{min-width:fit-content!important;max-width:100%!important}
#teams-helper-control-panel .th-tabs{display:flex!important;flex-wrap:wrap!important;gap:8px!important;overflow:visible!important;padding:0!important;min-width:0!important}
#teams-helper-control-panel .th-tab{border-radius:14px!important;padding:8px 12px!important;flex:0 1 auto!important;width:auto!important;min-width:72px!important;text-align:center!important}
#teams-helper-control-panel.th-resizing .schedule-block-label,#teams-helper-control-panel.th-resizing .pill,#teams-helper-control-panel.th-resizing .th-value{transition:none!important}
@container (max-width:560px){
  #teams-helper-control-panel .th-summary-grid{grid-template-columns:1fr!important}
  #teams-helper-control-panel .th-summary-stat{min-height:58px!important}
  #teams-helper-control-panel .th-head{grid-template-columns:minmax(0,1fr)!important}
  #teams-helper-control-panel .th-actions{justify-content:flex-start!important;flex-wrap:wrap!important}
}

/* Teams Helper compact summary + stable controls */
#teams-helper-control-panel .th-summary-grid-compact{grid-template-columns:minmax(260px,1.2fr) minmax(220px,.8fr)!important;gap:10px!important}
#teams-helper-control-panel .th-summary-stat{min-height:78px!important;justify-content:flex-start!important}
#teams-helper-control-panel .th-summary-values{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}
#teams-helper-control-panel .pill{max-width:100%!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.15!important;height:auto!important;min-height:24px!important}
#teams-helper-control-panel .th-summary-target,#teams-helper-control-panel .th-summary-account-text{font-size:12px!important;line-height:1.25!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important}
#teams-helper-control-panel .th-summary-count{display:inline-flex!important;align-items:center!important;gap:4px!important;width:max-content!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#teams-helper-control-panel button{max-width:100%!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.2!important}
#teams-helper-control-panel .th-actions{flex-wrap:nowrap!important;min-width:0!important}
#teams-helper-control-panel .th-actions .pill{max-width:170px!important}
@media(max-width:720px){#teams-helper-control-panel .th-summary-grid-compact{grid-template-columns:1fr!important}#teams-helper-control-panel .th-actions{flex-wrap:wrap!important}}
/* Teams Helper bugfix pass: safe minimum size, stable controls, and smoother timeline editing */
#teams-helper-control-panel{min-width:min(560px,calc(100vw - 16px))!important;min-height:min(360px,calc(100vh - 16px))!important;}
#teams-helper-control-panel .th-head{display:grid!important;grid-template-columns:minmax(190px,1fr) auto!important;align-items:center!important;gap:10px!important;min-height:58px!important;}
#teams-helper-control-panel .th-actions{flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-end!important;overflow:visible!important;}
#teams-helper-control-panel .th-actions .pill{flex:0 1 auto!important;max-width:150px!important;min-width:76px!important;text-align:center!important;}
#teams-helper-control-panel .th-actions .th-switch{flex:0 0 auto!important;}
#teams-helper-control-panel .th-actions button{flex:0 0 38px!important;width:38px!important;min-width:38px!important;max-width:38px!important;height:38px!important;padding:0!important;display:inline-grid!important;place-items:center!important;}
#teams-helper-control-panel .th-body{min-width:0!important;}
#teams-helper-control-panel .schedule-time-strip{user-select:none!important;}
#teams-helper-control-panel .schedule-lanes{touch-action:none!important;}
#teams-helper-control-panel .schedule-block{touch-action:none!important;cursor:grab!important;user-select:none!important;will-change:left,width,top!important;}
#teams-helper-control-panel .schedule-block.dragging{cursor:grabbing!important;z-index:20!important;filter:brightness(1.05)!important;}
#teams-helper-control-panel .schedule-resize-handle{cursor:ew-resize!important;}
#teams-helper-control-panel.th-dragging .th-card,#teams-helper-control-panel.th-resizing .th-card{transition:none!important;}
@container (max-width:620px){#teams-helper-control-panel .th-head{grid-template-columns:1fr!important;}#teams-helper-control-panel .th-actions{justify-content:flex-start!important;}}

/* Timeline dimension hardening: schedule blocks are positioned elements, not normal buttons.
   This keeps long all-day/end-of-day blocks proportional after panel resize. */
#teams-helper-control-panel .schedule-lanes .schedule-block{position:absolute!important;width:var(--th-unused,auto);max-width:none!important;min-width:34px!important;box-sizing:border-box!important;contain:layout paint!important;}
#teams-helper-control-panel .schedule-time-strip,#teams-helper-control-panel .schedule-axis,#teams-helper-control-panel .schedule-lanes{box-sizing:border-box!important;}
#teams-helper-control-panel .schedule-time-wrap{scrollbar-gutter:stable!important;}
`

        });
        const card = Oe("div", { className: "th-card" });
        const title = Oe("div", { className: "th-title", text: "Teams Helper" });
        const sub = Oe("div", { className: "th-sub" });
        const toggleText = Oe("span", { className: "pill", text: L.enabled ? "Manual on" : "Manual off", title: "Manual status pauses scheduled changes while it is on." });
                const toggle = Oe("input", { type: "checkbox", checked: !!L.enabled });
        const toggleWrap = Oe("label", { className: "th-switch", title: "Turn manual status on or off. Schedule is paused while manual status is on." }, [toggle, Oe("span", { className: "th-track" })]);
        const collapseBtn = Oe("button", { className: "th-ghost", text: L.collapsed ? "▴" : "▾", title: "Collapse panel" });
        const refreshBtn = Oe("button", { className: "th-ghost", text: "↻", title: "Refresh Teams" });
        const closeBtn = Oe("button", { className: "th-ghost th-close", text: "×", title: "Close Teams Helper panel" });
        const head = Oe("div", { className: "th-head" }, [
            Oe("div", { className: "th-brand" }, [Oe("div", { className: "th-mark" }), Oe("div", {}, [title, sub])]),
            Oe("div", { className: "th-actions" }, [toggleText, toggleWrap, refreshBtn, collapseBtn, closeBtn])
        ]);
        function stat(label, id) {
            return Oe("div", { className: "th-stat" }, [Oe("div", { className: "th-label", text: label }), Oe("div", { className: "th-value", id: id, text: "—" })])
        }
        function isTab(id) {
            return T.some(tab => tab.id === id)
        }
        function row(label, control) {
            return Oe("div", { className: "th-row" }, [Oe("span", { text: label }), control])
        }
        function switchRow(label, input) {
            return row(label, Oe("label", { className: "th-switch" }, [input, Oe("span", { className: "th-track" })]))
        }
        function makeInput(value, type) {
            return Oe("input", { className: "th-input", type: type || "text", value: null == value ? "" : value })
        }
        function makeNumberInput(value) {
            return Oe("input", { className: "th-input", type: "number", value: null == value ? "" : value, attrs: { step: "1" } })
        }
        function makeSwitch(value) {
            return Oe("input", { type: "checkbox", checked: !!value })
        }
        function makeSelect(options, value) {
            const select = Oe("select", { className: "th-select" });
            for (const opt of options) select.appendChild(Oe("option", { value: opt.value, text: opt.label }));
            select.value = value || (options[0] && options[0].value) || "";
            return select
        }
        function blankToNull(input) {
            const value = String(input && input.value || "").trim();
            return value ? value : null
        }
        function numberOrNull(input) {
            const value = String(input && input.value || "").trim();
            if (!value) return null;
            const number = Number(value);
            return Number.isFinite(number) ? number : null
        }
        function csvOrNull(input) {
            const value = String(input && input.value || "").trim();
            if (!value) return null;
            const parts = value.split(",").map(part => part.trim()).filter(Boolean);
            return parts.length ? parts : null
        }
        function setValue(input, value) {
            if (!input || document.activeElement === input) return;
            input.value = Array.isArray(value) ? value.join(", ") : null == value ? "" : String(value)
        }
        function setCheck(input, value) {
            if (input) input.checked = !!value
        }
        const status = Oe("span", { className: "pill", text: "Disabled" });
        const api = Oe("span", { className: "pill", text: "Available" });
        const ctx = Oe("span", { className: "pill", text: "Checking" });
        const acc = Oe("span", { className: "pill", text: "Signed in" });
        const target = Oe("div", { className: "th-value", text: "—" });
        const account = Oe("div", { className: "th-value", text: "Unknown" });
        const ruleCount = Oe("span", { className: "pill", text: "0" });
        const targetAccountEmail = Oe("div", { className: "th-value", text: "Unknown" });
        const targetAccountType = Oe("div", { className: "th-value", text: "Unknown" });
        const accountSelect = Oe("select", { className: "th-select" });
        const backendPresence = Oe("div", { className: "th-value", text: "No status yet" });
        const backendAccount = Oe("div", { className: "th-value", text: "—" });
        const backendSource = Oe("div", { className: "th-value", text: "—" });
        const managerStatus = makeSelect(STATUS_PRESET_KEYS.map(key => ({ value: key, label: getStatusPreset(key).label })), L.manager.manualStatusKey || "available");
        const manualStatusSelect = managerStatus;
        const manualOverrideSwitch = makeSwitch(!!L.enabled);
        const allowAvailableDuringCalls = makeSwitch(!!L.manager.allowAvailableDuringCalls);
        const allowDuringCallsToggle = allowAvailableDuringCalls;
        const notSeenModeToggle = makeSwitch(!1 !== L.manager.notSeenMode);
        const scheduleEnabled = makeSwitch(!!L.manager.scheduleEnabled);
        const scheduleEnabledToggle = scheduleEnabled;
        const scheduleOverrideWarning = Oe("div", { className: "th-warning", text: "", attrs: { hidden: "hidden" } });
        const scheduleList = Oe("div", { className: "th-rule-list" });
        const targetStatus = Oe("div", { className: "th-value", text: describeManagerTarget(L.manager).description });
        const selectedSchedulePreview = Oe("div", { className: "muted th-selected-schedule-preview", text: "", attrs: { hidden: "hidden" } });
        const callState = Oe("div", { className: "muted", text: "Checking calls…" });
        const lastApplied = Oe("div", { className: "th-value", text: "—" });
        const lastSync = Oe("div", { className: "th-value", text: "—" });
        const jsonScope = Oe("strong", { text: "all sections" });
        const json = Oe("textarea", { value: rt(L.spoofConfig), rows: 12 });
        const logCount = Oe("span", { className: "pill", text: "0" });
        const logViewer = Oe("textarea", { className: "th-input th-logbox", rows: 7, attrs: { readonly: "readonly", spellcheck: "false" } });
        const consoleViewer = Oe("textarea", { className: "th-input th-logbox", rows: 8, attrs: { readonly: "readonly", spellcheck: "false" } });
        const feedbackBox = Oe("textarea", { className: "th-input", rows: 5, attrs: { maxlength: "600", placeholder: "Tell me what worked, what broke, or what you want improved." } });
        const feedbackAttachLogs = makeSwitch(true);
        const feedbackStatus = Oe("div", { className: "muted", text: "Send beta feedback from the Teams page. Attach logs when the issue is hard to reproduce." });
        const sendFeedbackBtn = Oe("button", { className: "th-primary", text: "Send feedback" });
        const betaEmailInput = null;
        const betaNoteInput = null;
        const betaRequestBtn = null;

        const navCfg = L.spoofConfig.navigator || {};
        const navEnabled = makeSwitch(!1 !== navCfg.enabled);
        const navUserAgent = makeInput(navCfg.userAgent);
        const navAppVersion = makeInput(navCfg.appVersion);
        const navPlatform = makeInput(navCfg.platform);
        const navVendor = makeInput(navCfg.vendor);
        const navLanguage = makeInput(navCfg.language);
        const navLanguages = makeInput(Array.isArray(navCfg.languages) ? navCfg.languages.join(", ") : navCfg.languages);
        const navHardwareConcurrency = makeNumberInput(navCfg.hardwareConcurrency);
        const navDeviceMemory = makeNumberInput(navCfg.deviceMemory);
        const navMaxTouchPoints = makeNumberInput(navCfg.maxTouchPoints);
        const navApplyBtn = Oe("button", { className: "th-primary", text: "Apply" });
        const navResetBtn = Oe("button", { text: "Reset" });

        const workerCfg = L.spoofConfig.worker || {};
        const workerFieldsCfg = workerCfg.fields || {};
        const workerEnabled = makeSwitch(!1 !== workerCfg.enabled);
        const workerFieldKeys = ["experienceName", "ring", "environment", "sessionId", "platformId", "buildVersion", "localeCode", "workerId", "publicPath", "deviceId", "isOcdi", "isPwa", "shouldFetchWorkerChunksBeforeImportScripts", "useDiagnosticsServiceV2", "turboCohort", "enableLazyLoadedWorker", "enableMinimalSchemaWorker", "workerCreationTime", "preECSConsoleLogLevel"];
        const workerInputs = Object.create(null);
        for (const key of workerFieldKeys) workerInputs[key] = makeInput(workerFieldsCfg[key]);
        const workerApplyBtn = Oe("button", { className: "th-primary", text: "Apply" });
        const workerResetBtn = Oe("button", { text: "Reset" });

        const telemetryCfg = L.spoofConfig.telemetry || {};
        const telemetryQueryCfg = telemetryCfg.query || {};
        const telemetryMode = makeSelect([{ value: "suppress", label: "Suppress" }, { value: "rewrite", label: "Rewrite" }], Ze());
        const telemetryQueryKeys = ["AppInfo_BootType", "AppInfo_ClientType", "AppInfo_ExperienceName", "AppInfo_PlatformId", "AppInfo_Version", "AppInfo_Environment", "AppInfo_ServiceWorkerState", "AppInfo_UxStatus", "DeviceInfo_Id", "environment", "loaderNetworkPingState", "navigatorNetworkState", "Session_Id", "Session_TelemetryContext", "userAgent", "UserInfo_Ring", "UserInfo_Id", "UserInfo_TenantId", "UserInfo_TelemetryRegion"];
        const telemetryInputs = Object.create(null);
        for (const key of telemetryQueryKeys) telemetryInputs[key] = makeInput(telemetryQueryCfg[key]);
        const telemetryApplyBtn = Oe("button", { className: "th-primary", text: "Apply" });
        const telemetryResetBtn = Oe("button", { text: "Reset" });

        const presenceCfg = L.spoofConfig.presence || {};
        const presenceHeadersCfg = presenceCfg.headers || {};
        const presenceEnabled = makeSwitch(!1 !== presenceCfg.enabled);
        const presenceStatusSelect = makeSelect(STATUS_PRESET_KEYS.map(key => ({ value: key, label: getStatusPreset(key).label })), L.manager.manualStatusKey || "available");
        const presenceHeaderKeys = ["x-ms-endpoint-id", "x-ms-session-id", "x-ms-client-caller", "x-ms-client-consumer-type", "x-ms-client-user-agent"];
        const presenceHeaderInputs = Object.create(null);
        for (const key of presenceHeaderKeys) presenceHeaderInputs[key] = makeInput(presenceHeadersCfg[key]);
        const presenceApplyBtn = Oe("button", { className: "th-primary", text: "Save status" });
        const presenceForceBtn = Oe("button", { text: "Force status now" });
        const presenceResetBtn = Oe("button", { text: "Reset status" });

        const activityCfg = Me();
        const activityEnabled = makeSwitch(!1 !== activityCfg.enabled);
        const activityForceVisible = makeSwitch(!1 !== activityCfg.forceVisible);
        const activityForceFocused = makeSwitch(!1 !== activityCfg.forceFocused);
        const activityPointerInside = makeSwitch(!1 !== activityCfg.forcePointerInside);
        const activityStopAwayEvents = makeSwitch(!1 !== activityCfg.stopAwayEvents);
        const activityReplayTrusted = makeSwitch(!1 !== activityCfg.replayTrustedListeners);
        const syntheticCfg = activityCfg.syntheticEvents || {};
        const activitySyntheticEnabled = makeSwitch(!1 !== syntheticCfg.enabled);
        const activityIntervalMs = makeNumberInput(syntheticCfg.intervalMs);
        const activityClientX = makeNumberInput(syntheticCfg.clientX);
        const activityClientY = makeNumberInput(syntheticCfg.clientY);
        const activityApplyBtn = Oe("button", { className: "th-primary", text: "Save" });
        const activityResetBtn = Oe("button", { text: "Reset" });

        const tabs = Oe("div", { className: "th-tabs" });
        const tabButtons = new Map;
        const panels = new Map;
        function panel(id, children) {
            const pane = Oe("div", { className: "th-panel", attrs: { "data-panel": id } }, children);
            panels.set(id, pane);
            return pane
        }
        for (const tab of T) {
            const btn = Oe("button", { className: "th-tab", text: tab.label, attrs: { "data-tab": tab.id } });
            btn.addEventListener("click", () => {
                L.activeTab = tab.id;
                try { localStorage.setItem(k.activeTab, L.activeTab) } catch {}
                syncTabs();
                syncGuiControls();
                if (tab.id === "activity") renderManagerRules();
                if (tab.id === "json") lt(at());
                if (tab.id === "logs") renderLogsPanel();
            });
            tabButtons.set(tab.id, btn);
            tabs.appendChild(btn);
        }
        const body = Oe("div", { className: "th-body" }, [
            Oe("div", { className: "th-grid th-summary-grid th-summary-grid-compact" }, [
                Oe("div", { className: "th-stat th-summary-stat th-summary-status" }, [
                    Oe("div", { className: "th-label", text: "Status" }),
                    Oe("div", { className: "th-summary-values" }, [status]),
                    Oe("div", { className: "th-value th-summary-target", id: "th-target", text: "—" })
                ]),
                Oe("div", { className: "th-stat th-summary-stat th-summary-account" }, [
                    Oe("div", { className: "th-label", text: "Account" }),
                    Oe("div", { className: "th-value th-summary-account-text", id: "th-account", text: "Unknown" }),
                    Oe("div", { className: "th-summary-count" }, [Oe("span", { id: "th-rules", text: "0" }), " schedule blocks"])
                ])
            ]),
            tabs,
            panel("overview", [
                Oe("div", { className: "buttons" }, [Oe("button", { text: "Refresh" })]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Current status" }), target]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Account" }), account]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Last change" }), lastApplied]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Last refresh" }), lastSync])
            ]),
            panel("navigator", [
                switchRow("Browser details", navEnabled),
                row("User agent", navUserAgent), row("App version", navAppVersion), row("Platform", navPlatform), row("Vendor", navVendor), row("Language", navLanguage), row("Languages", navLanguages), row("Hardware concurrency", navHardwareConcurrency), row("Device memory", navDeviceMemory), row("Max touch points", navMaxTouchPoints),
                Oe("div", { className: "buttons" }, [navApplyBtn, navResetBtn])
            ]),
            panel("worker", [
                switchRow("Background support", workerEnabled),
                ...workerFieldKeys.map(key => row(key, workerInputs[key])),
                Oe("div", { className: "buttons" }, [workerApplyBtn, workerResetBtn])
            ]),
            panel("telemetry", [
                row("Mode", telemetryMode),
                ...telemetryQueryKeys.map(key => row(key, telemetryInputs[key])),
                Oe("div", { className: "buttons" }, [telemetryApplyBtn, telemetryResetBtn])
            ]),
            panel("presence", [
                Oe("label", { className: "th-row" }, [Oe("span", { text: "Account" }), accountSelect]),
                switchRow("Status updates", presenceEnabled),
                row("Status", presenceStatusSelect),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Email" }), targetAccountEmail]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Type" }), targetAccountType]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Saved status" }), backendPresence]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Saved account" }), backendAccount]),
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Source" }), backendSource]),
                ...presenceHeaderKeys.map(key => row(key, presenceHeaderInputs[key])),
                Oe("div", { className: "buttons" }, [presenceApplyBtn, presenceForceBtn, presenceResetBtn])
            ]),
            panel("activity", [
                row("Status", manualStatusSelect),
                switchRow("Manual status", manualOverrideSwitch),
                switchRow("Schedule", scheduleEnabledToggle),
                switchRow("No Seen", notSeenModeToggle),
                switchRow("Allow status changes during calls", allowDuringCallsToggle),
                scheduleOverrideWarning,
                Oe("div", { className: "th-row" }, [Oe("span", { text: "Current status" }), targetStatus]),
                selectedSchedulePreview,
                callState,
                Oe("div", { className: "buttons" }, [activityApplyBtn, activityResetBtn, Oe("button", { className: "th-primary", text: "Add schedule" })]),
                scheduleList
            ]),
            panel("json", [
                Oe("div", { className: "muted" }, ["Showing ", jsonScope]),
                json,
                Oe("div", { className: "buttons" }, [Oe("button", { className: "th-primary", text: "Apply" }), Oe("button", { text: "Refresh" })])
            ]),
            panel("feedback", [
                Oe("div", { className: "th-feedback-card" }, [
                    Oe("div", { className: "th-section-title", text: "Beta feedback" }),
                    Oe("div", { className: "muted", text: "Tell us what worked, what broke, or what you want improved." }),
                    feedbackBox,
                    switchRow("Attach log", feedbackAttachLogs),
                    Oe("div", { className: "buttons" }, [sendFeedbackBtn]),
                    feedbackStatus
                ])
            ]),
            panel("logs", [
                Oe("div", { className: "th-log-tab-head" }, [
                    Oe("div", { className: "th-section-title", text: "Log" }),
                    Oe("div", { className: "muted", text: "Account activity and recent schedule updates." })
                ]),
                Oe("div", { className: "th-log-controls" }, [
                    Oe("div", { className: "th-log-heading" }, [Oe("span", { text: "History entries" }), logCount]),
                    Oe("div", { className: "buttons th-log-buttons" }, [Oe("button", { text: "Refresh" }), Oe("button", { className: "th-primary", text: "Copy" }), Oe("button", { text: "Clear" })])
                ]),
                logViewer
            ])       ]);

        try {
            style.textContent += `
/* Teams Helper patch: Log tab layout and resizable tiny timeline bubbles */
#teams-helper-control-panel .th-log-tab-head{display:grid!important;gap:3px!important;padding:2px 0 4px!important;border:0!important;background:transparent!important}
#teams-helper-control-panel .th-log-controls{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;flex-wrap:wrap!important}
#teams-helper-control-panel .th-log-heading{display:inline-flex!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;width:auto!important;max-width:max-content!important;min-width:0!important;padding:6px 9px!important}
#teams-helper-control-panel .th-log-heading .pill{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;width:auto!important;min-width:24px!important;max-width:max-content!important;padding:3px 8px!important;margin:0!important}
#teams-helper-control-panel .th-log-buttons{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:7px!important;flex:1 1 260px!important;min-width:0!important}
#teams-helper-control-panel .th-log-buttons button{flex:0 1 auto!important;min-width:86px!important;max-width:150px!important;width:auto!important;white-space:nowrap!important}
#teams-helper-control-panel .schedule-block{box-sizing:border-box!important;max-width:none!important}
#teams-helper-control-panel .schedule-block.tiny{display:grid!important;grid-template-columns:8px minmax(10px,1fr) 8px!important;gap:1px!important;padding:0 2px!important;justify-content:stretch!important;align-items:center!important;min-width:34px!important;overflow:visible!important}
#teams-helper-control-panel .schedule-block.tiny .schedule-resize-handle{display:block!important;width:8px!important;min-width:8px!important;max-width:8px!important;flex:0 0 8px!important;height:24px!important;opacity:.95!important;pointer-events:auto!important}
#teams-helper-control-panel .schedule-block.tiny .schedule-resize-handle.left{margin-left:0!important}
#teams-helper-control-panel .schedule-block.tiny .schedule-resize-handle.right{margin-right:0!important}
#teams-helper-control-panel .schedule-block.tiny .schedule-block-label{display:block!important;font-size:8px!important;line-height:1!important;min-width:0!important;text-align:center!important;overflow:hidden!important;text-overflow:clip!important;white-space:nowrap!important}
#teams-helper-control-panel .schedule-block.tiny:hover,#teams-helper-control-panel .schedule-block.tiny.selected,#teams-helper-control-panel .schedule-block.tiny.dragging{z-index:30!important;min-width:54px!important}
#teams-helper-control-panel .schedule-block.tiny:hover .schedule-block-label,#teams-helper-control-panel .schedule-block.tiny.selected .schedule-block-label,#teams-helper-control-panel .schedule-block.tiny.dragging .schedule-block-label{font-size:9px!important}
`;
        } catch {}

        try {
            style.textContent += `
/* Teams Helper website dark-metal theme */
#teams-helper-control-panel{
  --dm-page:#030303;
  --dm-surface:#0a0a0b;
  --dm-surface-2:#0e0f11;
  --dm-surface-3:#131417;
  --dm-ink:#f5f5f6;
  --dm-text:#c9cbd0;
  --dm-muted:#858990;
  --dm-line:#282a2e;
  --dm-line-soft:#18191c;
  --dm-green:#42c977;
  --dm-amber:#e4a443;
  --dm-rose:#ef7d8f;
  --dm-metal:linear-gradient(180deg,#262a31 0%,#171a20 100%);
  --dm-metal-hover:linear-gradient(180deg,#30353d 0%,#1d2128 100%);
  --dm-metal-soft:linear-gradient(180deg,#1d2026 0%,#111419 100%);
  --dm-metal-soft-hover:linear-gradient(180deg,#242932 0%,#171b21 100%);
  color:var(--dm-text)!important;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
}
#teams-helper-control-panel *{scrollbar-color:#404247 #0a0a0b!important}
#teams-helper-control-panel *:focus-visible{outline:2px solid rgba(238,240,243,.72)!important;outline-offset:2px!important}
#teams-helper-control-panel .th-card{
  background:linear-gradient(180deg,rgba(14,15,17,.985),rgba(5,5,6,.985))!important;
  border:1px solid var(--dm-line)!important;
  border-radius:19px!important;
  box-shadow:0 28px 78px rgba(0,0,0,.58),inset 0 1px 0 rgba(255,255,255,.04)!important;
  color:var(--dm-text)!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
#teams-helper-control-panel .th-head{
  position:relative!important;
  background:linear-gradient(180deg,#111214,#080809)!important;
  border-bottom:1px solid var(--dm-line)!important;
  padding:13px 15px!important;
  min-height:64px!important;
}
#teams-helper-control-panel .th-head:after{
  content:""!important;position:absolute!important;left:16px!important;right:16px!important;bottom:-1px!important;height:1px!important;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)!important;opacity:.55!important;pointer-events:none!important;
}
#teams-helper-control-panel .th-brand{gap:11px!important}
#teams-helper-control-panel .th-mark{
  width:54px!important;height:36px!important;min-width:54px!important;max-width:54px!important;min-height:36px!important;max-height:36px!important;
  border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;
  display:grid!important;place-items:center!important;
}
#teams-helper-control-panel .th-mark:before{
  content:""!important;
  display:none!important;
}
#teams-helper-control-panel .th-title{color:var(--dm-ink)!important;font-size:15px!important;font-weight:850!important;letter-spacing:-.02em!important}
#teams-helper-control-panel .th-sub{color:var(--dm-muted)!important;font-size:10px!important;letter-spacing:.02em!important}
#teams-helper-control-panel .th-actions{gap:7px!important}
#teams-helper-control-panel .th-body{
  background:
    radial-gradient(circle at 88% 0,rgba(255,255,255,.035),transparent 17rem),
    linear-gradient(180deg,#080809 0%,#050506 100%)!important;
  gap:13px!important;padding:14px 15px 15px!important;
}
#teams-helper-control-panel button{
  min-height:34px!important;
  padding:8px 11px!important;
  border:1px solid rgba(255,255,255,.13)!important;
  border-radius:11px!important;
  background:var(--dm-metal-soft)!important;
  color:#dfe2e6!important;
  font-weight:760!important;
  text-shadow:none!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 5px 14px rgba(0,0,0,.18)!important;
}
#teams-helper-control-panel button:hover{
  border-color:rgba(255,255,255,.22)!important;background:var(--dm-metal-soft-hover)!important;color:#fff!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.075),0 7px 18px rgba(0,0,0,.22)!important;
}
#teams-helper-control-panel .th-primary{
  background:var(--dm-metal)!important;border-color:rgba(255,255,255,.18)!important;color:#f4f5f6!important;
  text-shadow:0 1px 0 rgba(0,0,0,.45)!important;
}
#teams-helper-control-panel .th-primary:hover{background:var(--dm-metal-hover)!important;border-color:rgba(255,255,255,.27)!important;color:#fff!important}
#teams-helper-control-panel button.active,#teams-helper-control-panel .th-tab.active{
  background:linear-gradient(180deg,#f0f0f1,#a9abb0)!important;border-color:rgba(255,255,255,.38)!important;color:#09090a!important;
  text-shadow:0 1px 0 rgba(255,255,255,.48)!important;
}
#teams-helper-control-panel .th-ghost{background:#0b0b0c!important;color:#bfc1c6!important}
#teams-helper-control-panel .th-grid{gap:8px!important}
#teams-helper-control-panel .th-stat,
#teams-helper-control-panel .th-row,
#teams-helper-control-panel .manager-rule,
#teams-helper-control-panel .schedule-day-row,
#teams-helper-control-panel .th-log-card,
#teams-helper-control-panel .th-feedback-card,
#teams-helper-control-panel .th-log-intro{
  border:1px solid var(--dm-line)!important;
  background:linear-gradient(180deg,#111214,#0a0a0b)!important;
  border-radius:13px!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
}
#teams-helper-control-panel .th-stat{min-height:72px!important;padding:10px!important}
#teams-helper-control-panel .th-row{padding:10px 11px!important}
#teams-helper-control-panel .th-label,
#teams-helper-control-panel .th-row span:first-child,
#teams-helper-control-panel .muted,
#teams-helper-control-panel .schedule-timeline-hint,
#teams-helper-control-panel .schedule-day-label span,
#teams-helper-control-panel .manager-grid .row{
  color:var(--dm-muted)!important;
}
#teams-helper-control-panel .th-label{font-size:9px!important;font-weight:800!important;letter-spacing:.11em!important}
#teams-helper-control-panel .th-value,#teams-helper-control-panel .schedule-day-label strong,#teams-helper-control-panel .th-section-title{color:var(--dm-ink)!important}
#teams-helper-control-panel .th-value{font-size:12px!important;font-weight:760!important}
#teams-helper-control-panel .th-section-title{font-size:13px!important;font-weight:820!important;letter-spacing:-.01em!important}
#teams-helper-control-panel .th-tabs{gap:6px!important;border-bottom:1px solid var(--dm-line-soft)!important;padding:0 0 8px!important}
#teams-helper-control-panel .th-tab{min-height:32px!important;padding:7px 10px!important;border-radius:10px!important;background:#0d0e10!important;color:#aeb1b7!important;font-size:10px!important}
#teams-helper-control-panel .th-tab:hover{background:#17191d!important;color:#fff!important}
#teams-helper-control-panel .th-select,
#teams-helper-control-panel .th-input,
#teams-helper-control-panel textarea,
#teams-helper-control-panel .manager-grid input,
#teams-helper-control-panel .manager-grid select,
#teams-helper-control-panel .schedule-detail-input{
  border:1px solid var(--dm-line)!important;border-radius:11px!important;background:#050506!important;color:var(--dm-ink)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;
}
#teams-helper-control-panel .th-select:hover,
#teams-helper-control-panel .th-input:hover,
#teams-helper-control-panel textarea:hover,
#teams-helper-control-panel .manager-grid input:hover,
#teams-helper-control-panel .manager-grid select:hover,
#teams-helper-control-panel .schedule-detail-input:hover{border-color:#3a3c41!important}
#teams-helper-control-panel .th-track{background:#1b1c1f!important;border-color:#34363b!important}
#teams-helper-control-panel .th-track:after{background:linear-gradient(180deg,#f6f6f7,#aeb0b5)!important;box-shadow:0 3px 8px rgba(0,0,0,.55)!important}
#teams-helper-control-panel .th-switch input:checked+.th-track{background:#1e6038!important;border-color:rgba(66,201,119,.55)!important}
#teams-helper-control-panel .pill{background:#0b0b0c!important;border-color:var(--dm-line)!important;color:#d7d9dd!important;border-radius:999px!important}
#teams-helper-control-panel .pill-on{color:#a7edc0!important;border-color:rgba(66,201,119,.34)!important;background:rgba(66,201,119,.10)!important}
#teams-helper-control-panel .pill-off{color:#efacb7!important;border-color:rgba(239,125,143,.32)!important;background:rgba(239,125,143,.09)!important}
#teams-helper-control-panel .th-warning{border-color:rgba(228,164,67,.28)!important;background:rgba(228,164,67,.09)!important;color:#efcb91!important}
#teams-helper-control-panel .th-good{color:#a7edc0!important}
#teams-helper-control-panel .th-bad{color:#efacb7!important}
#teams-helper-control-panel .schedule-time-wrap{
  border-color:var(--dm-line)!important;border-radius:11px!important;
  background:linear-gradient(180deg,#060607,#030304)!important;
}
#teams-helper-control-panel .schedule-axis{border-bottom-color:var(--dm-line)!important}
#teams-helper-control-panel .schedule-axis-tick{color:#8e9198!important;text-shadow:none!important;font-size:9px!important}
#teams-helper-control-panel .schedule-grid{background:rgba(255,255,255,.075)!important}
#teams-helper-control-panel .schedule-grid.major{background:rgba(255,255,255,.14)!important}
#teams-helper-control-panel .schedule-block{border-color:rgba(255,255,255,.28)!important;box-shadow:0 7px 18px rgba(0,0,0,.38)!important}
#teams-helper-control-panel .schedule-block[data-tone=available]{background:linear-gradient(90deg,#2e9f5c,var(--dm-green))!important}
#teams-helper-control-panel .schedule-block[data-tone=busy]{background:linear-gradient(90deg,#b65f28,var(--dm-amber))!important}
#teams-helper-control-panel .schedule-block[data-tone=away]{background:linear-gradient(90deg,#aeb0b5,#676a70)!important}
#teams-helper-control-panel .schedule-block[data-tone=dnd]{background:linear-gradient(90deg,#cb5f77,var(--dm-rose))!important}
#teams-helper-control-panel .schedule-block.selected{outline:2px solid #f5f5f6!important;outline-offset:2px!important}
#teams-helper-control-panel .schedule-resize-handle{background:rgba(255,255,255,.78)!important}
#teams-helper-control-panel .th-mark{background-image:url("${teamsHelperLogoUrl}")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important}
#teams-helper-control-panel .th-mark:before{content:""!important;display:none!important}
#teams-helper-control-panel .th-log-heading{border-color:var(--dm-line)!important;background:#09090a!important;color:#bfc1c6!important}
#teams-helper-control-panel .th-logbox{background:#030304!important;color:#c9cbd0!important;border-color:var(--dm-line)!important}
#teams-helper-control-panel .th-panel-resize{background:transparent!important}
#teams-helper-control-panel.th-dragging .th-card,#teams-helper-control-panel.th-resizing .th-card{box-shadow:0 18px 46px rgba(0,0,0,.52)!important}
@container (max-width:560px){
  #teams-helper-control-panel .th-mark{width:48px!important;min-width:48px!important;max-width:48px!important}
  #teams-helper-control-panel .th-actions button{max-width:145px!important}
}
`;
        } catch {}
        card.appendChild(head);
        card.appendChild(body);
        host.appendChild(style);
        host.appendChild(card);
        const panelResizeHandles = ["n", "e", "s", "w", "ne", "nw", "se", "sw"].map(dir => Oe("div", { className: "th-panel-resize th-resize-" + dir, attrs: { "data-resize-dir": dir } }));
        panelResizeHandles.forEach(handle => host.appendChild(handle));
        root.appendChild(host);
        const guiFrameStorageKey = "teams_helper_panel_frame_v1";
        function clampGuiNumber(value, min, max) {
            value = Number(value);
            if (!Number.isFinite(value)) return min;
            return Math.max(min, Math.min(max, value));
        }
        function persistGuiFrame() {
            try {
                const rect = host.getBoundingClientRect();
                localStorage.setItem(guiFrameStorageKey, JSON.stringify({ left: Math.round(rect.left), top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) }));
            } catch {}
        }
        function placeGuiAt(left, top) {
            try {
                const rect = host.getBoundingClientRect();
                const width = Math.max(Math.min(560, window.innerWidth - 20), Math.min(rect.width || 600, window.innerWidth - 20));
                const height = Math.max(Math.min(360, window.innerHeight - 20), Math.min(rect.height || 420, window.innerHeight - 20));
                host.style.left = clampGuiNumber(left, 8, Math.max(8, window.innerWidth - width - 8)) + "px";
                host.style.top = clampGuiNumber(top, 8, Math.max(8, window.innerHeight - height - 8)) + "px";
                host.style.right = "auto";
                host.style.bottom = "auto";
            } catch {}
        }
        function restoreGuiFrame() {
            try {
                const saved = JSON.parse(localStorage.getItem(guiFrameStorageKey) || "null");
                if (!saved || typeof saved !== "object") return;
                if (Number.isFinite(Number(saved.width))) host.style.width = clampGuiNumber(saved.width, Math.min(560, window.innerWidth - 20), Math.max(560, window.innerWidth - 20)) + "px";
                if (Number.isFinite(Number(saved.height))) host.style.height = clampGuiNumber(saved.height, Math.min(360, window.innerHeight - 20), Math.max(360, window.innerHeight - 20)) + "px";
                if (Number.isFinite(Number(saved.left)) && Number.isFinite(Number(saved.top))) placeGuiAt(saved.left, saved.top);
            } catch {}
        }
        restoreGuiFrame();
        let panelDrag = null;
        function startPanelDrag(event) {
            try {
                if (!event || event.button && event.button !== 0) return;
                const targetNode = event.target;
                if (targetNode && targetNode.closest && targetNode.closest("button,input,select,textarea,a,label")) return;
                const rect = host.getBoundingClientRect();
                const width = Math.max(Math.min(panelResizeMinWidth || 560, window.innerWidth - 20), Math.min(rect.width || 600, window.innerWidth - 20));
                const height = Math.max(Math.min(panelResizeMinHeight || 360, window.innerHeight - 20), Math.min(rect.height || 420, window.innerHeight - 20));
                host.style.left = Math.round(rect.left) + "px";
                host.style.top = Math.round(rect.top) + "px";
                host.style.right = "auto";
                host.style.bottom = "auto";
                host.style.transform = "translate3d(0,0,0)";
                panelDrag = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, startLeft: rect.left, startTop: rect.top, width, height, nextLeft: rect.left, nextTop: rect.top, raf: 0 };
                host.classList.add("th-dragging");
                event.preventDefault && event.preventDefault();
                window.addEventListener("pointermove", onPanelDragMove, true);
                window.addEventListener("pointerup", stopPanelDrag, true);
                window.addEventListener("pointercancel", stopPanelDrag, true);
            } catch {}
        }
        function onPanelDragMove(event) {
            if (!panelDrag) return;
            try {
                event.preventDefault && event.preventDefault();
                panelDrag.nextLeft = clampGuiNumber(event.clientX - panelDrag.offsetX, 8, Math.max(8, window.innerWidth - panelDrag.width - 8));
                panelDrag.nextTop = clampGuiNumber(event.clientY - panelDrag.offsetY, 8, Math.max(8, window.innerHeight - panelDrag.height - 8));
                if (!panelDrag.raf) {
                    panelDrag.raf = window.requestAnimationFrame ? window.requestAnimationFrame(() => {
                        if (!panelDrag) return;
                        panelDrag.raf = 0;
                        const dx = Math.round(panelDrag.nextLeft - panelDrag.startLeft);
                        const dy = Math.round(panelDrag.nextTop - panelDrag.startTop);
                        host.style.transform = `translate3d(${dx}px,${dy}px,0)`;
                    }) : 0;
                    if (!panelDrag.raf) {
                        const dx = Math.round(panelDrag.nextLeft - panelDrag.startLeft);
                        const dy = Math.round(panelDrag.nextTop - panelDrag.startTop);
                        host.style.transform = `translate3d(${dx}px,${dy}px,0)`;
                    }
                }
            } catch {}
        }
        function stopPanelDrag() {
            if (!panelDrag) return;
            const finalLeft = panelDrag.nextLeft;
            const finalTop = panelDrag.nextTop;
            try { panelDrag.raf && window.cancelAnimationFrame && window.cancelAnimationFrame(panelDrag.raf); } catch {}
            panelDrag = null;
            try { host.classList.remove("th-dragging"); } catch {}
            try { window.removeEventListener("pointermove", onPanelDragMove, true); } catch {}
            try { window.removeEventListener("pointerup", stopPanelDrag, true); } catch {}
            try { window.removeEventListener("pointercancel", stopPanelDrag, true); } catch {}
            try { host.style.transform = ""; } catch {}
            placeGuiAt(finalLeft, finalTop);
            persistGuiFrame();
        }
        let panelResize = null;
        const panelResizeMinWidth = 560;
        const panelResizeMinHeight = 360;
        function setGuiRect(left, top, width, height) {
            try {
                const margin = 8;
                const maxWidth = Math.max(260, window.innerWidth - margin * 2);
                const maxHeight = Math.max(140, window.innerHeight - margin * 2);
                const minWidth = Math.min(panelResizeMinWidth, maxWidth);
                const minHeight = Math.min(panelResizeMinHeight, maxHeight);
                const nextWidth = clampGuiNumber(width, minWidth, maxWidth);
                const nextHeight = clampGuiNumber(height, minHeight, maxHeight);
                const nextLeft = clampGuiNumber(left, margin, Math.max(margin, window.innerWidth - nextWidth - margin));
                const nextTop = clampGuiNumber(top, margin, Math.max(margin, window.innerHeight - nextHeight - margin));
                host.style.left = Math.round(nextLeft) + "px";
                host.style.top = Math.round(nextTop) + "px";
                host.style.width = Math.round(nextWidth) + "px";
                host.style.height = Math.round(nextHeight) + "px";
                host.style.right = "auto";
                host.style.bottom = "auto";
                host.style.transform = "";
            } catch {}
        }
        function startPanelResize(event) {
            try {
                if (!event || event.button && event.button !== 0) return;
                const dir = event.currentTarget && event.currentTarget.getAttribute && event.currentTarget.getAttribute("data-resize-dir") || "se";
                const rect = host.getBoundingClientRect();
                host.style.left = Math.round(rect.left) + "px";
                host.style.top = Math.round(rect.top) + "px";
                host.style.right = "auto";
                host.style.bottom = "auto";
                host.style.transform = "";
                panelResize = { dir, startX: event.clientX, startY: event.clientY, startLeft: rect.left, startTop: rect.top, startRight: rect.right, startBottom: rect.bottom, startWidth: rect.width, startHeight: rect.height, next: null, raf: 0 };
                host.classList.add("th-resizing");
                event.preventDefault && event.preventDefault();
                event.stopPropagation && event.stopPropagation();
                window.addEventListener("pointermove", onPanelResizeMove, true);
                window.addEventListener("pointerup", stopPanelResize, true);
                window.addEventListener("pointercancel", stopPanelResize, true);
            } catch {}
        }
        function onPanelResizeMove(event) {
            if (!panelResize) return;
            try {
                event.preventDefault && event.preventDefault();
                const dx = event.clientX - panelResize.startX;
                const dy = event.clientY - panelResize.startY;
                const margin = 8;
                const maxWidth = Math.max(260, window.innerWidth - margin * 2);
                const maxHeight = Math.max(140, window.innerHeight - margin * 2);
                const minWidth = Math.min(panelResizeMinWidth, maxWidth);
                const minHeight = Math.min(panelResizeMinHeight, maxHeight);
                let left = panelResize.startLeft;
                let top = panelResize.startTop;
                let width = panelResize.startWidth;
                let height = panelResize.startHeight;
                if (panelResize.dir.includes("e")) width = clampGuiNumber(panelResize.startWidth + dx, minWidth, Math.min(maxWidth, window.innerWidth - panelResize.startLeft - margin));
                if (panelResize.dir.includes("s")) height = clampGuiNumber(panelResize.startHeight + dy, minHeight, Math.min(maxHeight, window.innerHeight - panelResize.startTop - margin));
                if (panelResize.dir.includes("w")) {
                    width = clampGuiNumber(panelResize.startWidth - dx, minWidth, Math.min(maxWidth, panelResize.startRight - margin));
                    left = panelResize.startRight - width;
                }
                if (panelResize.dir.includes("n")) {
                    height = clampGuiNumber(panelResize.startHeight - dy, minHeight, Math.min(maxHeight, panelResize.startBottom - margin));
                    top = panelResize.startBottom - height;
                }
                panelResize.next = { left, top, width, height };
                if (!panelResize.raf) {
                    panelResize.raf = window.requestAnimationFrame ? window.requestAnimationFrame(() => {
                        if (!panelResize || !panelResize.next) return;
                        panelResize.raf = 0;
                        setGuiRect(panelResize.next.left, panelResize.next.top, panelResize.next.width, panelResize.next.height);
                    }) : 0;
                    if (!panelResize.raf) setGuiRect(left, top, width, height);
                }
            } catch {}
        }
        function stopPanelResize() {
            if (!panelResize) return;
            const finalRect = panelResize.next || { left: panelResize.startLeft, top: panelResize.startTop, width: panelResize.startWidth, height: panelResize.startHeight };
            try { panelResize.raf && window.cancelAnimationFrame && window.cancelAnimationFrame(panelResize.raf); } catch {}
            panelResize = null;
            try { host.classList.remove("th-resizing"); } catch {}
            try { window.removeEventListener("pointermove", onPanelResizeMove, true); } catch {}
            try { window.removeEventListener("pointerup", stopPanelResize, true); } catch {}
            try { window.removeEventListener("pointercancel", stopPanelResize, true); } catch {}
            setGuiRect(finalRect.left, finalRect.top, finalRect.width, finalRect.height);
            persistGuiFrame();
        }
        panelResizeHandles.forEach(handle => handle.addEventListener("pointerdown", startPanelResize, true));
        head.addEventListener("pointerdown", startPanelDrag, true);
        let guiDisposed = false;
        let guiResizeObserver = null;
        let resizeFrameTimer = null;
        let lastObservedWidth = 0;
        const onWindowResize = () => {
            if (guiDisposed || !host.isConnected || !L.gui || L.gui.host !== host) return;
            try {
                const rect = host.getBoundingClientRect();
                setGuiRect(rect.left, rect.top, rect.width, rect.height);
                persistGuiFrame();
            } catch {}
        };
        window.addEventListener("resize", onWindowResize, { passive: true });
        if (typeof ResizeObserver === "function") {
            try {
                guiResizeObserver = new ResizeObserver(entries => {
                    if (guiDisposed || !host.isConnected || !L.gui || L.gui.host !== host) {
                        try { guiResizeObserver && guiResizeObserver.disconnect(); } catch {}
                        return;
                    }
                    let nextWidth = 0;
                    try {
                        const entry = entries && entries[entries.length - 1];
                        nextWidth = Math.round(entry && entry.contentRect && entry.contentRect.width || host.getBoundingClientRect().width || 0);
                    } catch {}
                    const widthChanged = !!nextWidth && Math.abs(nextWidth - Number(lastObservedWidth || 0)) > 1;
                    nextWidth && (lastObservedWidth = nextWidth);
                    try { resizeFrameTimer && clearTimeout(resizeFrameTimer); } catch {}
                    resizeFrameTimer = setTimeout(() => {
                        resizeFrameTimer = null;
                        if (guiDisposed || !host.isConnected || !L.gui || L.gui.host !== host) return;
                        try { persistGuiFrame(); } catch {}
                        if (widthChanged && L.activeTab === "activity") {
                            try { D.lastScheduleRulesSig = ""; renderManagerRules(); } catch {}
                        }
                    }, 160);
                });
                guiResizeObserver.observe(host);
            } catch {}
        }
        const overviewButtons = panels.get("overview").querySelectorAll("button");
        const activityButtons = panels.get("activity").querySelectorAll("button");
        const jsonButtons = panels.get("json").querySelectorAll("button");
        const logButtons = panels.get("logs").querySelectorAll("button");
        function disposeGui(reason = "dispose") {
            if (guiDisposed) return;
            guiDisposed = true;
            try { panelDrag && panelDrag.raf && window.cancelAnimationFrame && window.cancelAnimationFrame(panelDrag.raf); } catch {}
            try { panelResize && panelResize.raf && window.cancelAnimationFrame && window.cancelAnimationFrame(panelResize.raf); } catch {}
            panelDrag = null;
            panelResize = null;
            try { window.removeEventListener("pointermove", onPanelDragMove, true); } catch {}
            try { window.removeEventListener("pointerup", stopPanelDrag, true); } catch {}
            try { window.removeEventListener("pointercancel", stopPanelDrag, true); } catch {}
            try { window.removeEventListener("pointermove", onPanelResizeMove, true); } catch {}
            try { window.removeEventListener("pointerup", stopPanelResize, true); } catch {}
            try { window.removeEventListener("pointercancel", stopPanelResize, true); } catch {}
            try { window.removeEventListener("resize", onWindowResize, false); } catch {}
            try { guiResizeObserver && guiResizeObserver.disconnect(); } catch {}
            guiResizeObserver = null;
            try { resizeFrameTimer && clearTimeout(resizeFrameTimer); } catch {}
            resizeFrameTimer = null;
            for (const timerKey of ["lightUiRefreshTimer", "fullUiRefreshTimer", "manualToggleForceTimer"]) {
                try {
                    const timer = D[timerKey];
                    timer && (U.nativeClearTimeout || window.clearTimeout)(timer);
                    D[timerKey] = null;
                } catch {}
            }
            D.pendingFullUiOptions = null;
            const domKeys = ["tg", "tgText", "status", "api", "ctx", "acc", "targetStat", "accountStat", "target", "account", "targetAccountEmail", "targetAccountType", "accountSelect", "scheduleEnabledToggle", "manualOverrideToggle", "manualStatusSelect", "allowDuringCallsToggle", "notSeenModeToggle", "presenceStatusSelect", "callInfo", "backendPresence", "backendAccount", "backendSource", "logCount", "logViewer", "consoleViewer", "feedbackBox", "feedbackStatus", "ruleCount", "scheduleOverrideWarning", "lastApplied", "lastSync"];
            for (const key of domKeys) {
                try {
                    const value = D[key];
                    if (value === host || value && typeof Node !== "undefined" && value instanceof Node && host.contains(value)) D[key] = null;
                } catch {}
            }
            try { if (D.syncTabs === syncTabs) D.syncTabs = null; } catch {}
            try { if (D.syncHeader === syncHeader) D.syncHeader = null; } catch {}
            try { if (D.syncGuiControls === syncGuiControls) D.syncGuiControls = null; } catch {}
            try { if (D.guiDispose === disposeGui) D.guiDispose = null; } catch {}
            try { D.lastScheduleRulesSig = ""; D.pendingScheduleRender = false; } catch {}
            try { if (L.gui && L.gui.host === host) L.gui = null; } catch {}
        }
        D.guiDispose = disposeGui;
        D.tg = toggle;
        D.tgText = toggleText;
D.status = host.querySelector("#th-status") || status;
        D.api = host.querySelector("#th-transport") || api;
        D.ctx = host.querySelector("#th-context") || ctx;
        D.acc = host.querySelector("#th-auth") || acc;
        D.targetStat = host.querySelector("#th-target");
        D.accountStat = host.querySelector("#th-account");
        D.target = target;
        D.account = account;
        D.targetAccountEmail = targetAccountEmail;
        D.targetAccountType = targetAccountType;
        D.accountSelect = accountSelect;
        D.scheduleEnabledToggle = scheduleEnabledToggle;
        D.manualOverrideToggle = manualOverrideSwitch;
        D.manualStatusSelect = manualStatusSelect;
        D.allowDuringCallsToggle = allowDuringCallsToggle;
        D.notSeenModeToggle = notSeenModeToggle;
        D.presenceStatusSelect = presenceStatusSelect;
        D.callInfo = callState;
        D.backendPresence = backendPresence;
        D.backendAccount = backendAccount;
        D.backendSource = backendSource;
        D.logCount = logCount;
        D.logViewer = logViewer;
        D.consoleViewer = consoleViewer;
        D.feedbackBox = feedbackBox;
        D.feedbackStatus = feedbackStatus;
        D.ruleCount = host.querySelector("#th-rules") || ruleCount;
        D.scheduleOverrideWarning = scheduleOverrideWarning;
        D.lastApplied = lastApplied;
        D.lastSync = lastSync;
        L.gui = {
            host,
            dispose: disposeGui,
            elements: {
                managerStatus,
                allowAvailableDuringCalls,
                scheduleEnabled,
                scheduleList,
                targetStatus,
                selectedSchedulePreview,
                callState,
                targetAccountEmail,
                jsonScope,
                json
            }
        };
        async function pageFeedbackLogs() {
            const clientAttachedAt = new Date().toISOString();
            const pageEntries = (L.logs || []).slice(-80);
            const consoleEntries = (L.consoleLogs || []).slice(-40);
            let backgroundEntries = [];
            let accountStatus = null;
            try {
                const result = await bridgeUiRequest("getScheduleStatusLogs", {}, 9000);
                backgroundEntries = Array.isArray(result && result.logs) ? result.logs.slice(-120) : [];
                accountStatus = result && result.accountStatus || null;
            } catch (error) {
                backgroundEntries = [{ at: new Date().toISOString(), level: "warn", message: "Unable to attach background schedule logs", extra: { error: Y(error && (error.message || error.msg) || error, 180) } }];
            }
            const entries = backgroundEntries.length ? backgroundEntries : pageEntries;
            const pageText = pageEntries.map(formatLogLine).join("\n");
            const backgroundText = backgroundEntries.map(entry => {
                try { return JSON.stringify(entry) } catch { return String(entry) }
            }).join("\n");
            return {
                attachedAt: new Date().toISOString(),
                clientAttachedAt,
                source: "send-logs",
                pageUrl: location.href,
                count: entries.length,
                entryCount: entries.length,
                entries,
                pageEntries,
                consoleEntries,
                accountStatus,
                text: (backgroundText || pageText || "").slice(-30000)
            };
        }
        async function sendPageFeedback() {
            const message = String(feedbackBox && feedbackBox.value || "").trim();
            if (!message) {
                feedbackStatus.textContent = "Write a short note before sending feedback.";
                feedbackStatus.className = "muted th-bad";
                return;
            }
            sendFeedbackBtn.disabled = true;
            feedbackStatus.textContent = "Sending feedback…";
            feedbackStatus.className = "muted";
            try {
                const attachLogs = !!(feedbackAttachLogs && feedbackAttachLogs.checked);
                const logs = attachLogs ? await pageFeedbackLogs() : null;
                const response = await bridgeUiRequest("submitFeedback", { message, attachLogs, logs }, 18000);
                if (response && response.ok === false) throw new Error(response.error || "Unable to send feedback");
                feedbackBox.value = "";
                feedbackStatus.textContent = "Feedback sent. Thank you.";
                feedbackStatus.className = "muted th-good";
                q("feedback", "Beta feedback sent from Teams page");
            } catch (error) {
                feedbackStatus.textContent = String(error && (error.message || error.msg) || error || "Unable to send feedback");
                feedbackStatus.className = "muted th-bad";
                q("error", "Beta feedback send failed", { error: Y(error && (error.message || error.msg) || error, 180) });
            } finally {
                sendFeedbackBtn.disabled = false;
            }
        }
        async function requestBetaFromPage() {
            return null;
        }
        function syncTabs() {
            const feedbackAllowed = isFeedbackTabAllowed();
            let active = isTab(L.activeTab) ? L.activeTab : "overview";
            if (active === "feedback" && !feedbackAllowed) active = "overview";
            if (active !== L.activeTab) {
                L.activeTab = active;
                try { localStorage.setItem(k.activeTab, active) } catch {}
            }
            for (const [id, btn] of tabButtons) {
                const hidden = id === "feedback" && !feedbackAllowed;
                btn.hidden = hidden;
                btn.classList.toggle("active", !hidden && id === active);
            }
            for (const [id, pane] of panels) {
                const hidden = id === "feedback" && !feedbackAllowed;
                pane.hidden = hidden;
                pane.classList.toggle("active", !hidden && id === active);
            }
        }
        function toggleCollapsedLabel() {
            host.classList.toggle("th-collapsed", !!L.collapsed);
            collapseBtn.textContent = L.collapsed ? "▴" : "▾";
        }
        function syncHeader() {
            const enabled = !!L.enabled;
            toggle.checked = enabled;
            toggleText.textContent = enabled ? "Manual on" : "Manual off";
}
        function refreshNavigatorControls() {
            const cfg = B(L.spoofConfig).navigator || {}, live = je();
            setCheck(navEnabled, !1 !== cfg.enabled);
            setValue(navUserAgent, live.userAgent); setValue(navAppVersion, live.appVersion); setValue(navPlatform, live.platform); setValue(navVendor, live.vendor); setValue(navLanguage, live.language); setValue(navLanguages, live.languages); setValue(navHardwareConcurrency, live.hardwareConcurrency); setValue(navDeviceMemory, live.deviceMemory); setValue(navMaxTouchPoints, live.maxTouchPoints)
        }
        function refreshWorkerControls() {
            const cfg = B(L.spoofConfig).worker || {}, fields = liveWorkerFields();
            setCheck(workerEnabled, !1 !== cfg.enabled);
            for (const key of workerFieldKeys) setValue(workerInputs[key], fields[key])
        }
        function refreshTelemetryControls() {
            const cfg = B(L.spoofConfig).telemetry || {}, query = et();
            if (document.activeElement !== telemetryMode) telemetryMode.value = "rewrite" === cfg.mode ? "rewrite" : "suppress";
            for (const key of telemetryQueryKeys) setValue(telemetryInputs[key], query[key])
        }
        function refreshPresenceControls() {
            const cfg = B(L.spoofConfig).presence || {}, headers = livePresenceHeaders();
            requestCapturedPresenceHeaders("presence-tab-refresh");
            setCheck(presenceEnabled, !1 !== cfg.enabled);
            if (document.activeElement !== presenceStatusSelect) presenceStatusSelect.value = L.manager.manualStatusKey || "available";
            for (const key of presenceHeaderKeys) setValue(presenceHeaderInputs[key], headers[key])
        }
        function refreshActivityControls() {
            const cfg = Me(), synthetic = cfg.syntheticEvents || {};
            setCheck(activityEnabled, !1 !== cfg.enabled);
            setCheck(activityForceVisible, !1 !== cfg.forceVisible);
            setCheck(activityForceFocused, !1 !== cfg.forceFocused);
            setCheck(activityPointerInside, !1 !== cfg.forcePointerInside);
            setCheck(activityStopAwayEvents, !1 !== cfg.stopAwayEvents);
            setCheck(activityReplayTrusted, !1 !== cfg.replayTrustedListeners);
            setCheck(activitySyntheticEnabled, !1 !== synthetic.enabled);
            setValue(activityIntervalMs, synthetic.intervalMs);
            setValue(activityClientX, synthetic.clientX);
            setValue(activityClientY, synthetic.clientY);
            setCheck(manualOverrideSwitch, !!L.enabled);
            setCheck(notSeenModeToggle, !1 !== L.manager.notSeenMode);
            if (document.activeElement !== managerStatus) managerStatus.value = L.manager.manualStatusKey || "available"
        }
        function syncGuiControls() {
            syncHeader();
            if ("navigator" === L.activeTab) refreshNavigatorControls();
            if ("worker" === L.activeTab) refreshWorkerControls();
            if ("telemetry" === L.activeTab) refreshTelemetryControls();
            if ("presence" === L.activeTab) refreshPresenceControls();
            if ("activity" === L.activeTab) refreshActivityControls();
            if ("logs" === L.activeTab) renderLogsPanel()
        }
        D.syncTabs = syncTabs;
        D.syncHeader = syncHeader;
        D.syncGuiControls = syncGuiControls;
        function forcePrimaryToggle(e) {
            if (e) {
                try { e.preventDefault() } catch {}
                try { e.stopPropagation() } catch {}
                try { e.stopImmediatePropagation && e.stopImmediatePropagation() } catch {}
            }
            const now = Date.now();
            if (D.lastPrimaryToggleAt && now - D.lastPrimaryToggleAt < 180) return;
            D.lastPrimaryToggleAt = now;
            pt(!L.enabled);
        }
        function applyActivitySettingsFromControls(reason = "activity-toggle") {
            const current = Me();
            L.spoofConfig = B({ ...L.spoofConfig, activity: { ...current, enabled: !!activityEnabled.checked, forceVisible: !!activityForceVisible.checked, forceFocused: !!activityForceFocused.checked, forcePointerInside: !!activityPointerInside.checked, stopAwayEvents: !!activityStopAwayEvents.checked, replayTrustedListeners: !!activityReplayTrusted.checked, syntheticEvents: { ...(current.syntheticEvents || {}), enabled: !!activitySyntheticEnabled.checked, intervalMs: numberOrNull(activityIntervalMs) || 15e3, clientX: numberOrNull(activityClientX) || 96, clientY: numberOrNull(activityClientY) || 96, screenX: numberOrNull(activityClientX) || 96, screenY: numberOrNull(activityClientY) || 96 } } });
            Be(reason === "activity-apply" ? "Saved schedule settings" : "Updated schedule setting", { section: "activity", reason });
            refreshActivityControls();
        }
        toggle.addEventListener("click", e => {
            try { e.stopPropagation() } catch {}
        }, true);
        toggleWrap.addEventListener("click", e => {
            if (e && e.target === toggle) return;
            forcePrimaryToggle(e);
            toggle.checked = !!L.enabled;
        }, true);
        toggle.addEventListener("change", e => {
            if (e) {
                try { e.stopPropagation() } catch {}
            }
            if (D.lastPrimaryChangeAt && Date.now() - D.lastPrimaryChangeAt < 180) { toggle.checked = !!L.enabled; return; }
            D.lastPrimaryChangeAt = Date.now();
            pt(!!toggle.checked);
            toggle.checked = !!L.enabled;
        }, true);
overviewButtons[0] && overviewButtons[0].addEventListener("click", () => {
            q("gui", "Refresh requested");
            Ae(50);
            Ee("manual-refresh");
            ct();
        });
        collapseBtn.addEventListener("click", () => {
            ft(!L.collapsed);
            toggleCollapsedLabel();
        });
        refreshBtn.addEventListener("click", () => {
            q("gui", "Refresh requested");
            Ae(50);
            Ee("manual-refresh");
            ct();
        });
        closeBtn.addEventListener("click", () => {
            L.guiClosed = true;
            persistGuiFrame();
            removeTeamsHelperGui("closed");
        });
        accountSelect.addEventListener("change", e => applyAccountSelection(e.target.value, { reason: "gui-account-select" }));
        manualOverrideSwitch.addEventListener("change", e => {
            pt(!!e.target.checked);
            e.target.checked = !!L.enabled;
            scheduleLightUiRefresh("manual-override-toggle");
        });
        manualStatusSelect.addEventListener("change", e => {
            L.manager = normalizeManagerState({ ...L.manager, manualStatusKey: e.target.value });
            presenceStatusSelect.value = L.manager.manualStatusKey;
            D.localManagerDirtyUntil = Date.now() + 300000;
            D.lastLocalManagerEditAt = new Date().toISOString();
            persistManagerState("manager-manual-status", { preferCurrentManager: true, forceCurrentManager: true });
            ct();
        });
        presenceStatusSelect.addEventListener("change", e => {
            L.manager = normalizeManagerState({ ...L.manager, manualStatusKey: e.target.value });
            manualStatusSelect.value = L.manager.manualStatusKey;
            D.localManagerDirtyUntil = Date.now() + 300000;
            D.lastLocalManagerEditAt = new Date().toISOString();
            persistManagerState("manager-presence-status", { preferCurrentManager: true, forceCurrentManager: true });
            ct();
        });
        allowDuringCallsToggle.addEventListener("change", e => {
            L.manager = normalizeManagerState({ ...L.manager, allowAvailableDuringCalls: !!e.target.checked });
            persistManagerState("manager-call-override");
        });
        notSeenModeToggle.addEventListener("change", e => {
            L.manager = normalizeManagerState({ ...L.manager, notSeenMode: !!e.target.checked });
            persistManagerState("manager-not-seen");
            q("privacy", "No Seen " + (L.manager.notSeenMode ? "enabled" : "disabled"));
        });
        scheduleEnabledToggle.addEventListener("change", e => {
            const scheduleOn = !!e.target.checked;
            L.manager = normalizeManagerState({ ...L.manager, scheduleEnabled: scheduleOn });
            if (scheduleOn) D.localScheduleOffUntil = 0;
            else {
                D.localScheduleOffUntil = Date.now() + 300000;
                try { U.scheduleTransitionTimer && U.nativeClearTimeout && U.nativeClearTimeout(U.scheduleTransitionTimer); } catch {}
                U.scheduleTransitionTimer = null;
            }
            persistManagerState("manager-schedule-toggle", { force: false, forceRender: false });
            scheduleLightUiRefresh("manager-schedule-toggle");
        });
        const scheduleHold = () => { D.scheduleRenderHoldUntil = Date.now() + 2500; };
        ["pointerdown", "mousedown", "touchstart", "focusin", "keydown"].forEach((eventName => scheduleList.addEventListener(eventName, scheduleHold, { passive: true })));
        scheduleList.addEventListener("focusout", (() => {
            D.scheduleRenderHoldUntil = Date.now() + 250;
            U.nativeSetTimeout && U.nativeSetTimeout((() => { D.pendingScheduleRender && renderManagerRules() }), 300);
        }));
        navApplyBtn.addEventListener("click", () => {
            L.spoofConfig = B({ ...L.spoofConfig, navigator: { ...(L.spoofConfig.navigator || {}), enabled: !!navEnabled.checked, userAgent: blankToNull(navUserAgent), appVersion: blankToNull(navAppVersion), platform: blankToNull(navPlatform), vendor: blankToNull(navVendor), language: blankToNull(navLanguage), languages: csvOrNull(navLanguages), hardwareConcurrency: numberOrNull(navHardwareConcurrency), deviceMemory: numberOrNull(navDeviceMemory), maxTouchPoints: numberOrNull(navMaxTouchPoints) } });
            Be("Saved settings", { section: "navigator" });
            refreshNavigatorControls();
        });
        navResetBtn.addEventListener("click", () => {
            L.spoofConfig = B({ ...L.spoofConfig, navigator: N("navigator") });
            Be("Reset settings", { section: "navigator" });
            refreshNavigatorControls();
        });
        workerApplyBtn.addEventListener("click", () => {
            const fields = { ...((L.spoofConfig.worker && L.spoofConfig.worker.fields) || {}) };
            for (const key of workerFieldKeys) fields[key] = blankToNull(workerInputs[key]);
            L.spoofConfig = B({ ...L.spoofConfig, worker: { ...(L.spoofConfig.worker || {}), enabled: !!workerEnabled.checked, fields } });
            Be("Saved settings", { section: "worker" });
            refreshWorkerControls();
        });
        workerResetBtn.addEventListener("click", () => {
            L.spoofConfig = B({ ...L.spoofConfig, worker: N("worker") });
            Be("Reset settings", { section: "worker" });
            refreshWorkerControls();
        });
        telemetryApplyBtn.addEventListener("click", () => {
            const query = { ...((L.spoofConfig.telemetry && L.spoofConfig.telemetry.query) || {}) };
            for (const key of telemetryQueryKeys) query[key] = blankToNull(telemetryInputs[key]);
            L.spoofConfig = B({ ...L.spoofConfig, telemetry: { ...(L.spoofConfig.telemetry || {}), mode: telemetryMode.value === "rewrite" ? "rewrite" : "suppress", query } });
            Be("Saved settings", { section: "telemetry" });
            refreshTelemetryControls();
        });
        telemetryResetBtn.addEventListener("click", () => {
            L.spoofConfig = B({ ...L.spoofConfig, telemetry: N("telemetry") });
            Be("Reset settings", { section: "telemetry" });
            refreshTelemetryControls();
        });
        presenceApplyBtn.addEventListener("click", () => {
            const headers = { ...((L.spoofConfig.presence && L.spoofConfig.presence.headers) || {}) };
            for (const key of presenceHeaderKeys) headers[key] = blankToNull(presenceHeaderInputs[key]);
            L.spoofConfig = B({ ...L.spoofConfig, presence: { ...(L.spoofConfig.presence || {}), enabled: !!presenceEnabled.checked, headers } });
            L.manager = normalizeManagerState({ ...L.manager, manualStatusKey: presenceStatusSelect.value || manualStatusSelect.value || L.manager.manualStatusKey });
            manualStatusSelect.value = L.manager.manualStatusKey;
            presenceStatusSelect.value = L.manager.manualStatusKey;
            L.enabled || pt(!0, { force: false });
            persistManagerState("manager-presence-apply", { force: false });
            persistSelectedAccountState({ touch: true, preserveCloudState: true });
            Be(null, { section: "presence" });
            q("gui", "Status update queued", { statusKey: L.manager.manualStatusKey });
            scheduleFullUiRefresh("presence-apply", { renderRules: !0 });
        });
        presenceForceBtn.addEventListener("click", () => {
            L.manager = normalizeManagerState({ ...L.manager, manualStatusKey: presenceStatusSelect.value || manualStatusSelect.value || L.manager.manualStatusKey });
            manualStatusSelect.value = L.manager.manualStatusKey;
            presenceStatusSelect.value = L.manager.manualStatusKey;
            L.enabled || pt(!0, { force: false });
            persistManagerState("manager-presence-force", { force: false });
            q("gui", "Status update queued", { statusKey: L.manager.manualStatusKey });
            scheduleFullUiRefresh("presence-force", { renderRules: !0 });
        });
        presenceResetBtn.addEventListener("click", () => {
            L.spoofConfig = B({ ...L.spoofConfig, presence: N("presence") });
            Be("Reset status settings", { section: "presence" });
            refreshPresenceControls();
        });
        activityApplyBtn.addEventListener("click", () => applyActivitySettingsFromControls("activity-apply"));
        [activityEnabled, activityForceVisible, activityForceFocused, activityPointerInside, activityStopAwayEvents, activityReplayTrusted, activitySyntheticEnabled].forEach(input => input.addEventListener("change", () => applyActivitySettingsFromControls("activity-toggle")));
        [activityIntervalMs, activityClientX, activityClientY].forEach(input => input.addEventListener("change", () => applyActivitySettingsFromControls("activity-field")));
        activityResetBtn.addEventListener("click", () => {
            L.spoofConfig = B({ ...L.spoofConfig, activity: N("activity") });
            Be("Reset schedule settings", { section: "activity" });
            refreshActivityControls();
        });
        activityButtons[2] && activityButtons[2].addEventListener("click", () => {
            const now = Date.now();
            if (D.timelineSuppressAddUntil && now < D.timelineSuppressAddUntil) return;
            D.timelineSuppressAddUntil = now + 750;
            activityButtons[2].disabled = true;
            U.nativeSetTimeout && U.nativeSetTimeout(() => { activityButtons[2] && (activityButtons[2].disabled = false); }, 800);
            const id = "rule-" + Date.now().toString(36);
            L.manager = normalizeManagerState({
                ...L.manager,
                scheduleEnabled: true,
                scheduleRules: [...(L.manager.scheduleRules || []), { id, start: "09:00", end: "17:00", statusKey: L.manager.manualStatusKey || "available", days: [1, 2, 3, 4, 5], enabled: true }]
            });
            D.selectedScheduleBlock = { dayKey: 1, ruleId: id };
            forceImmediateScheduleTimelineRefresh();
            persistManagerState("manager-rule-add", { forceRender: true, preferCurrentManager: true });
            forceImmediateScheduleTimelineRefresh();
        });
        jsonButtons[0] && jsonButtons[0].addEventListener("click", () => {
            try {
                const parsed = JSON.parse(json.value || "{}");
                if ("all" === at()) {
                    L.spoofConfig = B(parsed);
                    Be("Applied full JSON from GUI", null);
                } else {
                    L.spoofConfig = B({ ...L.spoofConfig, [at()]: parsed });
                    Be("Applied JSON section from GUI", { section: at() });
                }
                lt(at());
                refreshNavigatorControls();
                refreshWorkerControls();
                refreshTelemetryControls();
                refreshPresenceControls();
                refreshActivityControls();
            } catch (e) {
                q("error", "Could not save settings", { msg: Y(e && e.message || e, 160) });
                ct();
            }
        });
        jsonButtons[1] && jsonButtons[1].addEventListener("click", () => lt(at()));
        logButtons[0] && logButtons[0].addEventListener("click", renderLogsPanel);
        logButtons[1] && logButtons[1].addEventListener("click", copyLogs);
        logButtons[2] && logButtons[2].addEventListener("click", mt);
        sendFeedbackBtn && sendFeedbackBtn.addEventListener("click", sendPageFeedback);
        betaRequestBtn && betaRequestBtn.addEventListener("click", requestBetaFromPage);
        if (betaEmailInput && L.targetAccountEmail) betaEmailInput.value = L.targetAccountEmail;
        syncTabs();
        syncHeader();
        toggleCollapsedLabel();
        syncGuiControls();
        if (L.activeTab === "activity") renderManagerRules();
        if (L.activeTab === "json") lt(at());
        ct();
        q("gui", "Teams page GUI mounted");
        return L.gui;
    }

    function ct() {
        if (!D || !L.gui) return;
        const setText = (node, value, fallback = "—") => {
            if (!node) return;
            const text = null == value || "" === String(value) ? fallback : String(value);
            if (node.textContent !== text) node.textContent = text;
            if (node.title !== text) node.title = text;
        };
        const e = !!L.enabled,
            t = resolveManagedStatus(L.manager),
            n = t.callOverride ? "Hold during call" : t.label,
            i = normalizeAccountRegistry(L.accountRegistry || null),
            a = L.selectedAccountKey && i.accounts[L.selectedAccountKey] ? L.selectedAccountKey : i.activeAccountKey,
            selectedAccount = a && i.accounts[a] ? i.accounts[a] : null,
            currentMeta = getCurrentAccountMeta(),
            o = selectedAccount && selectedAccount.email || L.targetAccountEmail || currentMeta.email || "Unknown",
            accountType = [selectedAccount && selectedAccount.teamsType, L.targetAccountType, currentMeta.teamsType, normalizeTeamsAccountType(location.href)].find(e => e && "unknown" !== e) || "unknown",
            r = "personal" === accountType ? "Personal" : "business" === accountType ? "Business" : "Unknown",
            syncAt = L.lastRuntimeSyncAt || (L.lastBackendPresence && L.lastBackendPresence.at);
        D.tg.checked = e;
        D.tgText.textContent = e ? "Manual on" : "Manual off";
        const managerForUi = normalizeManagerState(L.manager);
        const targetForUi = managerTargetDescriptionForUi(managerForUi);
        D.status.textContent = e ? "Manual override" : (t.source === "schedule" || t.source === "exception") ? "Schedule active" : managerForUi.scheduleEnabled ? "Schedule waiting" : "Idle";
        D.status.className = e || t.source === "schedule" || t.source === "exception" || managerForUi.scheduleEnabled ? "pill pill-on" : "pill pill-off";
        D.api.textContent = t.label || "Available";
        D.api.className = "pill pill-on";
        D.ctx.textContent = L.endpointInfo ? "Ready" : "Checking";
        D.acc.textContent = U.bearerToken || U.skypeToken ? "Tokens" : "Signed in";
        setText(D.targetStat, targetForUi.description || n);
        setText(D.target, targetForUi.description || n);
        if (targetForUi.previewDescription && D.targetStat) D.targetStat.title = "Actual runtime now: " + targetForUi.actualDescription + "\nSelected-day preview: " + targetForUi.previewDescription;
        if (targetForUi.previewDescription && D.target) D.target.title = "Actual runtime now: " + targetForUi.actualDescription + "\nSelected-day preview: " + targetForUi.previewDescription;
        setText(D.accountStat, o, "Unknown");
        setText(D.account, o, "Unknown");
        D.targetAccountEmail && setText(D.targetAccountEmail, o, "Unknown");
        D.targetAccountType && setText(D.targetAccountType, r, "Unknown");
        D.scheduleEnabledToggle && (D.scheduleEnabledToggle.checked = !!L.manager.scheduleEnabled);
        D.manualOverrideToggle && (D.manualOverrideToggle.checked = !!L.enabled);
        D.manualStatusSelect && document.activeElement !== D.manualStatusSelect && (D.manualStatusSelect.value = L.manager.manualStatusKey || "available");
        D.allowDuringCallsToggle && (D.allowDuringCallsToggle.checked = !!L.manager.allowAvailableDuringCalls);
        D.notSeenModeToggle && (D.notSeenModeToggle.checked = !1 !== L.manager.notSeenMode);
        if (L.gui && L.gui.elements && L.gui.elements.targetStatus) {
            L.gui.elements.targetStatus.textContent = targetForUi.description || n;
            L.gui.elements.targetStatus.title = targetForUi.previewDescription ? "Actual runtime now: " + targetForUi.actualDescription + "\nSelected-day preview: " + targetForUi.previewDescription : targetForUi.description || n;
            if (L.gui.elements.selectedSchedulePreview) {
                L.gui.elements.selectedSchedulePreview.hidden = !targetForUi.previewDescription;
                L.gui.elements.selectedSchedulePreview.textContent = targetForUi.previewDescription ? "Selected preview only: " + targetForUi.previewDescription : "";
            }
        }
        if (D && D.scheduleOverrideWarning) {
            const warn = !!(L.enabled && managerForUi.scheduleEnabled && hasEnabledScheduleRules(managerForUi));
            D.scheduleOverrideWarning.hidden = !warn;
            D.scheduleOverrideWarning.textContent = warn ? "Manual override is on; schedule blocks are paused until override is turned off." : "";
        }
        if (D.callInfo) {
            D.callInfo.textContent = formatCallStateForUi(L.lastCallState);
            D.callInfo.title = L.lastCallState ? ((L.lastCallState.known ? (L.lastCallState.inCall ? "In call" : "Not in call") : "Checking calls") + " · " + (L.lastCallState.source || "unknown") + (L.lastCallState.detail ? " · " + L.lastCallState.detail : "")) : "Checking calls";
        }
        D.backendPresence && setText(D.backendPresence, describeBackendPresence(L.lastBackendPresence), "No status yet");
        D.backendAccount && setText(D.backendAccount, L.lastBackendPresence && L.lastBackendPresence.email || o, "—");
        D.backendSource && setText(D.backendSource, L.lastBackendPresence && L.lastBackendPresence.authMode || "runtime", "—");
        if (D.accountSelect) {
            const accounts = Object.values(i.accounts).sort(((e, t) => `${e.email || e.key}`.localeCompare(`${t.email || t.key}`))),
                sig = JSON.stringify(accounts.map(e => [e.key, e.email, e.teamsType]));
            if (D.lastAccountOptionsSig !== sig) {
                D.lastAccountOptionsSig = sig;
                D.accountSelect.options.length = 0;
                for (const accountEntry of accounts) {
                    const optionEmail = accountKeyEmail(accountEntry.email || accountEntry.targetAccountEmail || accountEntry.teamsAccountEmail || accountEntry.key) || accountEntry.email || accountEntry.key;
                    const optionType = "personal" === accountEntry.teamsType ? "Personal" : "business" === accountEntry.teamsType ? "Business" : "Unknown";
                    const option = Oe("option", {
                        value: accountEntry.key,
                        text: `${optionEmail} · ${optionType}`
                    });
                    D.accountSelect.appendChild(option)
                }
            }
            document.activeElement !== D.accountSelect && (D.accountSelect.value = a || "")
        }
        D.logCount && (D.logCount.textContent = String((L.logs || []).length));
        D.ruleCount && (D.ruleCount.textContent = String((L.manager.scheduleRules || []).length));
        D.lastApplied && setText(D.lastApplied, n);
        D.lastSync && setText(D.lastSync, syncAt ? new Date(syncAt).toLocaleTimeString() : "—");
        D.syncHeader && D.syncHeader();
        D.syncGuiControls && D.syncGuiControls();
        renderLogsPanel()
    }

    function dt() {
        if (!TEAMS_HELPER_PAGE_PANEL_UI_ENABLED) {
            L.guiClosed = true;
            try { removeTeamsHelperGui("panel-ui-disabled"); } catch {}
            return;
        }
        if (!isRuntimePolicyAllowed()) return;
        if (L.gui || !document.documentElement || D.guiMountObserver) return;
        const cleanup = () => {
            try { D.guiMountObserver && D.guiMountObserver.disconnect(); } catch {}
            D.guiMountObserver = null;
            try { D.guiMountObserverTimer && clearTimeout(D.guiMountObserverTimer); } catch {}
            D.guiMountObserverTimer = null;
        };
        const e = new MutationObserver(() => {
            if (L.gui) return cleanup();
            ut();
            L.gui && cleanup();
        });
        D.guiMountObserver = e;
        e.observe(document.documentElement, {
            childList: !0,
            subtree: !0
        });
        D.guiMountObserverTimer = window.setTimeout(cleanup, 3e4)
    }

    function pt(e, options = {}) {
        if (e && !isRuntimePolicyAllowed()) {
            L.enabled = false;
            C(k.enabled, false);
            stopRuntimeTimersForPolicy();
            removeTeamsHelperGui(L.policyBlockReason || "controls-unavailable");
            q("license", "Override blocked", { reason: L.policyBlockReason || "controls-unavailable" });
            ct();
            return;
        }
        L.enabled = !!e;
        if (L.enabled) D.localManualOffUntil = 0;
        else D.localManualOffUntil = Date.now() + 300000;
        C(k.enabled, L.enabled);
        try {
            // Manual override must not change Cloud Edit. Cloud remains controlled only by the Cloud toggle.
            persistSelectedAccountState({ touch: true, preserveCloudState: true });
        } catch {}
        if (D && D.tg) D.tg.checked = !!L.enabled;
        if (D && D.tgText) D.tgText.textContent = L.enabled ? "Manual on" : "Manual off";
        q("gui", "Override " + (L.enabled ? "enabled" : "disabled"));
        const shouldForce = !options || !1 !== options.force;
        L.gui || ut();
        L.gui || dt();
        const toggleReason = L.enabled ? "manual-override-enabled" : "manual-override-disabled";
        if (L.enabled) {
            try { U.scheduleTransitionTimer && U.nativeClearTimeout && U.nativeClearTimeout(U.scheduleTransitionTimer); } catch {}
            U.scheduleTransitionTimer = null;
        } else {
            U.heartbeatTimer && U.nativeClearInterval && (U.nativeClearInterval(U.heartbeatTimer), U.heartbeatTimer = null);
            $e(toggleReason);
            Te();
        }
        L.gui && scheduleFullUiRefresh(toggleReason, { renderRules: !1, delayMs: 180 });
        resetScheduleTransitionTimer(toggleReason);
        try {
            D.manualToggleForceTimer && U.nativeClearTimeout && U.nativeClearTimeout(D.manualToggleForceTimer);
            D.manualToggleForceTimer = null;
        } catch {}
        if (shouldForce) {
            // A UI toggle is authoritative locally. Send the new state to the
            // background immediately; cloud persistence happens afterward.
            if (!oe(toggleReason)) scheduleRuntimeSync(toggleReason, 150);
        }
    }

    function ft(e) {
        L.collapsed = !!e, C(k.collapsed, L.collapsed), ct()
    }

    function mt() {
        L.logs.length = 0, q("gui", "Log cleared"), ct()
    }

            return { ut, ct, dt, pt, ft, mt };
        }
    };
})(window);
/* END merged source: src/page/modules/ui.js */

/* BEGIN merged source: src/page/modules/bootstrap.js */
/*
 * Teams Helper page bootstrap module.
 * Contains network hooks and startup wiring that used to live at the bottom of page.js.
 */
(function(global) {
    "use strict";
    const modules = global.__TWH_PAGE_MODULES__ = global.__TWH_PAGE_MODULES__ || {};

    modules.bootstrap = {
        run(deps) {
            const {
                t, n, o, r, i, a, s, l, u, d, S,
                p, f, m, g, y, b, v, h, w, I, ECS_TELEMETRY_NOISE, ZUSTAND_NOISE, AUTH_NOISE, j, isRuntimePolicyAllowed, U, R, L, D, F, J, W, z, Y, trimArrayInPlace, q, recordConsole, $, K, Q, te, ne, oe, re, ie, requestUrlOf, rememberTelemetryQueryFromUrl, observeNetworkRequest, pagePacketTraceFinish, pagePacketTracePromise, applyRemoteBridgeState, he, isStrongTeamsCallApiUrl, isPresenceGetPresenceUrl, shouldBlockSeenMarkerRequest, noteSeenMarkerBlocked, syntheticSeenMarkerResponse, rememberPresenceApiResponse, rememberCallApiSignal, startCallStateMonitor, resetScheduleTransitionTimer, Te, handleBackgroundPresenceForceMessage, Ae, Ee, je, Ne, Me, Le, Je, We, ze, Ve, Xe, qe, Ge, $e, Ke, parseWorkerBootstrapUrl, rememberWorkerBootstrap, workerOverrideFields, Ze, tt, applyPageLicensePolicy, removeTeamsHelperGui, ut, ct, dt
            } = deps;

    window.addEventListener("pagehide", () => {
            try { removeTeamsHelperGui("pagehide"); } catch {}
            try { U.heartbeatTimer && U.nativeClearInterval && (U.nativeClearInterval(U.heartbeatTimer), U.heartbeatTimer = null) } catch {}
            try { U.callPollTimer && U.nativeClearInterval && (U.nativeClearInterval(U.callPollTimer), U.callPollTimer = null) } catch {}
            try { U.refreshTimer && U.nativeClearTimeout && (U.nativeClearTimeout(U.refreshTimer), U.refreshTimer = null) } catch {}
            try { U.bootstrapTimer && U.nativeClearTimeout && (U.nativeClearTimeout(U.bootstrapTimer), U.bootstrapTimer = null) } catch {}
            try { U.pendingForceTimer && U.nativeClearTimeout && (U.nativeClearTimeout(U.pendingForceTimer), U.pendingForceTimer = null) } catch {}
            try { U.scheduleTransitionTimer && U.nativeClearTimeout && (U.nativeClearTimeout(U.scheduleTransitionTimer), U.scheduleTransitionTimer = null) } catch {}
            try { R.timer && R.nativeClearInterval && (R.nativeClearInterval(R.timer), R.timer = null) } catch {}
            try { R.listeners && (R.listeners.length = 0) } catch {}
            try { L.liveDiscoveryCache = null } catch {}
            try { L.consoleLogs && (L.consoleLogs.length = 0); trimArrayInPlace(L.logs, 12) } catch {}
            try {
                if (D.pending && "function" == typeof D.pending.entries) {
                    for (const [id, item] of Array.from(D.pending.entries())) {
                        try { item && item.timer && U.nativeClearTimeout && U.nativeClearTimeout(item.timer) } catch {}
                        D.pending.delete(id);
                        try { item && item.reject && item.reject(new Error("extension bridge page unloaded")) } catch {}
                    }
                }
            } catch {}
        }, {
            once: !0
        }), window.__teamsHelperBridgeInstalled || (window.__teamsHelperBridgeInstalled = !0, window.addEventListener("message", e => {
            if (e.source !== window) return;
            const t = e.data;
            if (!t || t.source !== S || "to-page" !== t.direction) return;
            if ("bridgeReady" === t.type || "pong" === t.type) {
                const e = D.ready;
                return te(t.info || null), void(e || (Ae(100), Ee("bridge-ready")))
            }
            if ("licensePolicy" === t.type) return void applyPageLicensePolicy(!!t.enabled, t.policy || null, t.error || null);
            if ("presenceForceNow" === t.type && t.id) return void handleBackgroundPresenceForceMessage(t);
            if ("showPanel" === t.type) {
                L.guiClosed = true;
                try { removeTeamsHelperGui("panel-ui-disabled"); } catch {}
                return void q("gui", "Teams page GUI remains disabled", { reason: t.reason || "popup-open-panel" });
            }
            if ("remoteState" === t.type) return void applyRemoteBridgeState(t.state || null);
            if (("captureResult" === t.type || "submitFeedbackResult" === t.type || "requestBetaResult" === t.type || "getScheduleStatusLogsResult" === t.type) && t.id) {
                const e = D.pending.get(t.id);
                return void(e && (D.pending.delete(t.id), e.timer && U.nativeClearTimeout && U.nativeClearTimeout(e.timer), t.error ? e.reject(new Error(t.error)) : e.resolve(t.response || t)))
            }
            if ("proxyFetchResult" !== t.type || !t.id) return;
            const n = D.pending.get(t.id);
            n && (D.pending.delete(t.id), n.timer && U.nativeClearTimeout && U.nativeClearTimeout(n.timer), t.error ? n.reject(new Error(t.error)) : n.resolve(t.response))
        }, !1), ne(0)),
        function() {
            if (window.__teamsHelperNavigatorSpoofsInstalled) return;
            window.__teamsHelperNavigatorSpoofsInstalled = !0;
            const e = window.navigator,
                t = (t, n) => {
                    try {
                        return Object.defineProperty(e, t, {
                            configurable: !0,
                            enumerable: !0,
                            get: n
                        }), !0
                    } catch {}
                    try {
                        const o = Object.getPrototypeOf(e),
                            r = o ? Object.getOwnPropertyDescriptor(o, t) : null;
                        if (!r || r.configurable) return Object.defineProperty(o, t, {
                            configurable: !0,
                            enumerable: !r || !!r.enumerable,
                            get: n
                        }), !0
                    } catch {}
                    return !1
                };
            for (const e of ["userAgent", "appVersion", "platform", "vendor", "language", "languages", "hardwareConcurrency", "deviceMemory", "maxTouchPoints"]) t(e, () => je()[e]);
            Ne()
        }(),
        function() {
            if (window.__teamsHelperActivitySpoofsInstalled) return;
            window.__teamsHelperActivitySpoofsInstalled = !0;
            const e = EventTarget.prototype.addEventListener,
                t = EventTarget.prototype.removeEventListener;
            EventTarget.prototype.addEventListener = function(t, n, o) {
                return function(e, t, n, o) {
                    if (!n || !F.has(String(t || "")) || ! function(e) {
                            return e === window || e === document || e === document.documentElement || e === document.body
                        }(e) || ze(n)) return;
                    if ("function" != typeof WeakRef || "object" != typeof n && "function" != typeof n) return;
                    const r = Je(o);
                    let duplicate = !1;
                    for (let index = R.listeners.length - 1; index >= 0; index -= 1) {
                        const item = R.listeners[index], listener = item.listenerRef && item.listenerRef.deref ? item.listenerRef.deref() : item.listener;
                        if (!listener) {
                            R.listeners.splice(index, 1);
                            continue
                        }
                        item.target === e && item.type === String(t) && listener === n && item.capture === r.capture && (duplicate = !0)
                    }
                    if (!duplicate) {
                        R.listeners.length >= 256 && R.listeners.splice(0, R.listeners.length - 255);
                        R.listeners.push({
                            target: e,
                            type: String(t),
                            listenerRef: new WeakRef(n),
                            capture: r.capture,
                            once: r.once
                        })
                    }
                }(this, String(t || ""), n, o), e.call(this, t, n, o)
            }, EventTarget.prototype.removeEventListener = function(e, n, o) {
                return Ve(this, String(e || ""), n, o), t.call(this, e, n, o)
            };
            const n = window.Document && window.Document.prototype ? window.Document.prototype : Object.getPrototypeOf(document),
                o = (e, t, n) => {
                    if (!e) return !1;
                    try {
                        return Object.defineProperty(e, t, {
                            configurable: !0,
                            enumerable: !0,
                            get: n
                        }), !0
                    } catch {
                        return !1
                    }
                },
                r = () => (!Le() || !1 === Me().forceVisible) && W(document, J.hiddenDescriptor, !1);
            o(n, "hidden", r) || o(document, "hidden", r), o(n, "webkitHidden", r) || o(document, "webkitHidden", r), o(n, "msHidden", r) || o(document, "msHidden", r);
            const i = () => Le() && !1 !== Me().forceVisible ? "visible" : W(document, J.visibilityStateDescriptor, "visible");
            o(n, "visibilityState", i) || o(document, "visibilityState", i);
            const a = function() {
                return !(!Le() || !1 === Me().forceFocused) || !J.hasFocus || !!J.hasFocus()
            };
            try {
                Object.defineProperty(document, "hasFocus", {
                    configurable: !0,
                    enumerable: !1,
                    writable: !1,
                    value: a
                })
            } catch {
                try {
                    Object.defineProperty(n, "hasFocus", {
                        configurable: !0,
                        enumerable: !1,
                        writable: !1,
                        value: a
                    })
                } catch {}
            }
            const s = We(e => {
                    !1 !== Me().forceFocused && Ge("blur-blocked", e)
                }),
                l = We(e => {
                    !1 !== Me().forceVisible && Ge("visibility-blocked", e)
                }),
                c = We(e => {
                    !1 !== Me().forcePointerInside && Ge("mouseleave-blocked", e)
                }),
                u = We(e => {
                    !1 === Me().forcePointerInside || e.relatedTarget && e.relatedTarget !== document.documentElement && e.relatedTarget !== document.body || Ge("mouseout-blocked", e)
                }),
                d = We(e => {
                    !1 === Me().forcePointerInside || e.relatedTarget || Ge("window-mouseout-blocked", e)
                });
            window.addEventListener("blur", s, !0), document.addEventListener("visibilitychange", l, !0), document.addEventListener("mouseleave", c, !0), document.addEventListener("mouseout", u, !0), window.addEventListener("mouseout", d, !0), qe(), Xe("install")
        }(),
        function() {
            if (!window.__teamsHelperWorkerSpoofsInstalled && (window.__teamsHelperWorkerSpoofsInstalled = !0, "function" == typeof window.Worker)) {
                const e = window.Worker;

                function t(t, n) {
                    if (function(e) {
                            if (!e || "object" != typeof e && "function" != typeof e) return !1;
                            try {
                                const t = e.constructor || Object.getPrototypeOf(e) && Object.getPrototypeOf(e).constructor;
                                return !(!t || "TrustedScriptURL" !== t.name)
                            } catch {
                                return !1
                            }
                        }(t)) return rememberWorkerBootstrap(t, "trusted-script-url", !1, null), new e(t, n);
                    const o = function(e) {
                        if ("string" != typeof e && !(e instanceof URL)) return e;
                        const t = e instanceof URL ? e.toString() : e;
                        if (!/\/v2\/worker\//i.test(t) || -1 === t.indexOf("#")) return e;
                        try {
                            const n = new URL(t, location.href),
                                o = parseWorkerBootstrapUrl(n.toString());
                            if (!o) return e;
                            const r = j(o, workerOverrideFields()),
                                i = JSON.stringify(o) !== JSON.stringify(r);
                            return L.lastWorkerBootstrap = {
                                at: z(),
                                url: n.origin + n.pathname,
                                changed: i,
                                bypassed: !1,
                                reason: null,
                                original: o,
                                rewritten: r
                            }, ct(), i ? (n.hash = function(e) {
                                const t = JSON.stringify(e);
                                return t && "{" === t[0] && "}" === t[t.length - 1] ? "{" + encodeURIComponent(t.slice(1, -1)) + "}" : encodeURIComponent(t)
                            }(r), e instanceof URL ? n : n.toString()) : e
                        } catch {
                            return e
                        }
                    }(t);
                    try {
                        return new e(o, n)
                    } catch (r) {
                        if (o !== t && /TrustedScriptURL/i.test($(r))) return Ke("trusted-script-url"), new e(t, n);
                        throw r
                    }
                }
                t.prototype = e.prototype;
                try {
                    Object.setPrototypeOf(t, e)
                } catch {}
                window.Worker = t
            }
        }(),
        function() {
            const e = window.console;
            if (!e || e.__teamsHelperConsoleFilterInstalled) return;
            const c = c => {
                const S = "function" == typeof e[c] ? e[c].bind(e) : null;
                S && (e[c] = function(...e) {
                    const shouldSuppress = function(e) {
                            const c = Array.from(e || []),
                                S = [],
                                k = function(e) {
                                    return Array.from(e || []).map(e => {
                                        if ("string" == typeof e) return e;
                                        if (e && "object" == typeof e) {
                                            if ("string" == typeof e.msg && e.msg) return e.msg;
                                            try {
                                                return JSON.stringify(e)
                                            } catch {
                                                return String(e)
                                            }
                                        }
                                        return String(e)
                                    }).join(" ")
                                }(c);
                            k && (S.push(k), S.push(k.replace(/%c/g, " ")));
                            for (const e of c) {
                                const t = $(e) || K(e) || ("string" == typeof e ? e : "");
                                t && (S.push(t), S.push(String(t).replace(/%c/g, " ")))
                            }
                            const x = S.join("\n");
                            return c.some(ie) && /Unhandled error\/rejection/i.test(x) || u.test(x) || i.test(x) || a.test(x) || s.test(x) || l.test(x) || r.test(x) || t.test(x) || n.test(x) || o.test(x) || p.test(x) || f.test(x) || m.test(x) || g.test(x) || y.test(x) || b.test(x) || v.test(x) || h.test(x) || w.test(x) || I.test(x) || d.test(x) || ECS_TELEMETRY_NOISE.test(x) || ZUSTAND_NOISE.test(x) || AUTH_NOISE.test(x)
                        }(e);
                    recordConsole(c, e, shouldSuppress);
                    if (!shouldSuppress) return S(...e)
                })
            };
            c("error"), c("warn");
            if (globalThis.__TEAMS_HELPER_VERBOSE_CONSOLE_CAPTURE__ === true) c("log"), c("info"), c("debug");
            try {
                Object.defineProperty(e, "__teamsHelperConsoleFilterInstalled", {
                    configurable: !0,
                    enumerable: !1,
                    writable: !1,
                    value: !0
                })
            } catch {
                e.__teamsHelperConsoleFilterInstalled = !0
            }
        }(),
        function() {
            if (!window.__teamsHelperTelemetryGuardsInstalled) {
                if (window.__teamsHelperTelemetryGuardsInstalled = !0, "function" == typeof window.fetch) {
                    const e = window.fetch.bind(window);
                    window.fetch = function(t, n) {
                        const o = requestUrlOf(t), method = String(n && n.method || t && t.method || "GET").toUpperCase(), requestBody = n && Object.prototype.hasOwnProperty.call(n, "body") ? n.body : t && t.body;
                        let packetTrace = null;
                        try { packetTrace = observeNetworkRequest(t, n, requestBody, "fetch") } catch {}
                        if (shouldBlockSeenMarkerRequest(o, method, requestBody)) {
                            noteSeenMarkerBlocked(o, "fetch");
                            const synthetic = syntheticSeenMarkerResponse();
                            pagePacketTraceFinish(packetTrace, synthetic, { blocked: true, sent: false, blockReason: "seen-marker" });
                            return Promise.resolve(synthetic)
                        }
                        let responsePromise;
                        if (re(o)) {
                            rememberTelemetryQueryFromUrl(o, "fetch");
                            if ("suppress" === Ze()) {
                                const synthetic = new Response("", { status: 204, statusText: "No Content", headers: { "content-type": "text/plain;charset=UTF-8" } });
                                pagePacketTraceFinish(packetTrace, synthetic, { blocked: true, sent: false, blockReason: "telemetry-suppressed" });
                                return Promise.resolve(synthetic)
                            }
                            const r = tt(o);
                            try { responsePromise = "string" == typeof t ? e(r, n) : e(new Request(r, t), n) }
                            catch { responsePromise = e(r, n) }
                        } else responsePromise = e(t, n);
                        let tracedPromise;
                        try { tracedPromise = pagePacketTracePromise(responsePromise, packetTrace) } catch { tracedPromise = Promise.resolve(responsePromise) }
                        const needsPresenceBody = isPresenceGetPresenceUrl(o);
                        const needsCallSignal = isStrongTeamsCallApiUrl(o);
                        if (needsPresenceBody || needsCallSignal) return tracedPromise.then(response => {
                            try {
                                const status = response && response.status;
                                if (needsCallSignal) rememberCallApiSignal(o, null, "api-response:fetch", method, status);
                                if (needsPresenceBody) {
                                    const len = Number(response && response.headers && response.headers.get && response.headers.get("content-length") || 0);
                                    if (!len || len <= 262144) {
                                        const clone = response && "function" == typeof response.clone ? response.clone() : null;
                                        clone && clone.text().then(body => {
                                            if (String(body || "").length <= 262144) rememberPresenceApiResponse(o, body, "api-response:fetch", method, status)
                                        }).catch((() => {}))
                                    }
                                }
                            } catch {}
                            return response
                        });
                        return tracedPromise
                    }
                }
                if (navigator && "function" == typeof navigator.sendBeacon) {
                    const e = navigator.sendBeacon.bind(navigator);
                    navigator.sendBeacon = function(t, n) {
                        let packetTrace = null;
                        try { packetTrace = observeNetworkRequest(t, { method: "POST" }, n, "sendBeacon") } catch {}
                        if (shouldBlockSeenMarkerRequest(requestUrlOf(t), "POST", n)) { noteSeenMarkerBlocked(requestUrlOf(t), "sendBeacon"); try { pagePacketTraceFinish(packetTrace, { ok: true, status: 204, url: requestUrlOf(t) }, { blocked: true, sent: false, blockReason: "seen-marker" }) } catch {} return !0 }
                        if (re(t)) {
                            rememberTelemetryQueryFromUrl(t, "sendBeacon");
                            if ("suppress" === Ze()) { try { pagePacketTraceFinish(packetTrace, { ok: true, status: 204, url: requestUrlOf(t) }, { blocked: true, sent: false, blockReason: "telemetry-suppressed" }) } catch {} return !0 }
                            const sent = e(tt(t), n); try { pagePacketTraceFinish(packetTrace, { ok: !!sent, status: null, url: requestUrlOf(t) }, { beaconAccepted: !!sent }) } catch {} return sent
                        }
                        const sent = e(t, n); try { pagePacketTraceFinish(packetTrace, { ok: !!sent, status: null, url: requestUrlOf(t) }, { beaconAccepted: !!sent }) } catch {} return sent
                    }
                }
                if (window.XMLHttpRequest && window.XMLHttpRequest.prototype && !window.__teamsHelperXhrCaptureInstalled) {
                    window.__teamsHelperXhrCaptureInstalled = !0;
                    const e = window.XMLHttpRequest.prototype, t = e.open, n = e.setRequestHeader, o = e.send;
                    "function" == typeof t && (e.open = function(e, n) {
                        try { this.__twhMethod = String(e || "GET").toUpperCase(), this.__twhUrl = requestUrlOf(n), this.__twhHeaders = Object.create(null) } catch {}
                        return t.apply(this, arguments)
                    });
                    "function" == typeof n && (e.setRequestHeader = function(e, t) {
                        try { this.__twhHeaders || (this.__twhHeaders = Object.create(null)), this.__twhHeaders[String(e).toLowerCase()] = String(t) } catch {}
                        return n.apply(this, arguments)
                    });
                    "function" == typeof o && (e.send = function(e) {
                        let packetTrace = null;
                        try { packetTrace = observeNetworkRequest(this.__twhUrl || "", { method: this.__twhMethod || "GET", headers: this.__twhHeaders || {} }, e, "xhr"); this.__twhPacketTrace = packetTrace } catch {}
                        try { this.addEventListener("loadend", function() { try { pagePacketTraceFinish(packetTrace || this.__twhPacketTrace, { ok: Number(this.status || 0) >= 200 && Number(this.status || 0) < 400, status: Number(this.status || 0), statusText: this.statusText || "", url: this.responseURL || this.__twhUrl || "" }, { xhrReadyState: Number(this.readyState || 0) }) } catch {} }, { once: !0 }) } catch {}
                        try {
                            if (shouldBlockSeenMarkerRequest(this.__twhUrl || "", this.__twhMethod || "", e)) {
                                noteSeenMarkerBlocked(this.__twhUrl || "", "xhr");
                                pagePacketTraceFinish(packetTrace || this.__twhPacketTrace, { ok: true, status: 200, statusText: "OK", url: this.__twhUrl || "" }, { blocked: true, sent: false, blockReason: "seen-marker" });
                                try {
                                    Object.defineProperty(this, "readyState", { configurable: !0, get: () => 4 });
                                    Object.defineProperty(this, "status", { configurable: !0, get: () => 200 });
                                    Object.defineProperty(this, "statusText", { configurable: !0, get: () => "OK" });
                                    Object.defineProperty(this, "responseText", { configurable: !0, get: () => "" });
                                    Object.defineProperty(this, "response", { configurable: !0, get: () => "" })
                                } catch {}
                                const fire = () => {
                                    try { this.onreadystatechange && this.onreadystatechange(new Event("readystatechange")) } catch {}
                                    try { this.onload && this.onload(new Event("load")) } catch {}
                                    try { this.onloadend && this.onloadend(new Event("loadend")) } catch {}
                                    try { this.dispatchEvent(new Event("readystatechange")); this.dispatchEvent(new Event("load")); this.dispatchEvent(new Event("loadend")) } catch {}
                                };
                                (U.nativeSetTimeout || window.setTimeout)(fire, 0);
                                return
                            }
                        } catch {}
                        try {
                            const captureUrl = this.__twhUrl || "";
                            if (isStrongTeamsCallApiUrl(captureUrl) || isPresenceGetPresenceUrl(captureUrl)) this.addEventListener("loadend", function() {
                                try {
                                    const url = this.__twhUrl || "";
                                    if (isStrongTeamsCallApiUrl(url)) rememberCallApiSignal(url, null, "api-response:xhr", this.__twhMethod || "", this.status);
                                    if (isPresenceGetPresenceUrl(url)) {
                                        const body = "string" == typeof this.responseText && this.responseText.length <= 262144 ? this.responseText : "";
                                        body && rememberPresenceApiResponse(url, body, "api-response:xhr", this.__twhMethod || "", this.status)
                                    }
                                } catch {}
                            }, { once: !0 })
                        } catch {}
                        return o.apply(this, arguments)
                    })
                }
            }
        }(), window.addEventListener("error", e => {
            const t = e && ($(e.error) || e.msg) || "";
            if (Q(t, [e && e.filename, e && K(e.error)].filter(Boolean).join("\n")) || p.test(t) || ie(e && e.error)) {
                try {
                    e.preventDefault()
                } catch {}
                try {
                    e.stopImmediatePropagation()
                } catch {}
                q("filter", "Suppressed Teams worker error", {
                    msg: Y(t, 180)
                })
            }
        }, !0), window.addEventListener("unhandledrejection", e => {
            const t = e && $(e.reason) || "",
                n = e ? K(e.reason) : "";
            if (Q(t, n) || p.test(t) || ie(e && e.reason)) {
                try {
                    e.preventDefault()
                } catch {}
                try {
                    e.stopImmediatePropagation()
                } catch {}
                q("filter", "Suppressed Teams worker rejection", {
                    msg: Y(t || n || "unknown", 180)
                })
            }
        }, !0), q("init", "Teams helper installed (extension bridge + spoof gui)"), startCallStateMonitor(), he("startup", {
            silent: !1,
            retryOnMiss: 0
        }), Ee("startup"), $e("startup"), Te(), Ae(3000), window.addEventListener("hashchange", () => Ae(1500), {
            passive: !0
        }), window.addEventListener("pageshow", () => Ae(1500), {
            passive: !0
        }), document.addEventListener("visibilitychange", () => {
            if ("visible" === document.visibilityState) Ae(1500);
            else {
                try { oe("visibility-hidden") } catch {}
                try { resetScheduleTransitionTimer("visibility-hidden") } catch {}
            }
        }, {
            passive: !0
        }), window.addEventListener("pagehide", () => {
            try { oe("pagehide") } catch {}
        }, {
            passive: !0
        }), document.addEventListener("freeze", () => {
            try { oe("page-freeze") } catch {}
        }, {
            passive: !0
        }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => {
            isRuntimePolicyAllowed() && (ut(), dt())
        }, {
            once: !0
        }) : isRuntimePolicyAllowed() && (ut(), dt())
        }
    };
})(window);
/* END merged source: src/page/modules/bootstrap.js */

/* BEGIN merged source: src/page/page.js */
(() => {
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
const e = "__twh_i24__";
    if (window[e]) return;
    window[e] = !0;
    const t = /^Discover::regionGtm::InvalidResponse\b/i,
        n = /\bAuthFailed\b/i,
        o = /Cannot read properties of undefined \(reading ['\"]slice['\"]\)/i,
        r = /\bInvalid id undefined\b/i,
        i = /tried to unregister but was not registered\./i,
        a = /Some icons were re-registered\./i,
        s = /Applications should only call registerIcons/i,
        l = /\[floodgate\]\s+Floodgate module loaded/i,
        c = /^https:\/\/browser\.events\.data\.microsoft\.com\/OneCollector\/1\.0\//i,
        u = /browser\.events\.data\.microsoft\.com\/OneCollector\/1\.0/i,
        d = /Compiling or instantiating a WebAssembly module violates the following Content Security policy directive/i,
        p = /Unhandled error\/rejection\s+\{\"isTrusted\":true\}/i,
        f = /Banner not shown:/i,
        m = /slider-vertical/i,
        g = /\[ExpLoader\]/i,
        y = /ExperienceLoader:\s+OCDI redirect:\s+Not redirecting - not enabled/i,
        b = /\[Auth\]:\s+(?:auth_cache initialized|authTelemetryProvider initialized)\b/i,
        v = /\[Telemetry\]\[[^\]]+\]\[auth_web_initialization\]\s+\[start\]/i,
        h = /Manifest:\s+(?:property .* ignored|protocol_handlers entry ignored)/i,
        w = /The resource .* was preloaded using link preload but not used/i,
        I = /Connecting to .* violates the following Content Security Policy directive/i,
        ECS_TELEMETRY_NOISE = /No previously cached ECS telemetry config exists\s*-\s*fallback to sending event/i,
        ZUSTAND_NOISE = /\[DEPRECATED\]\s+Use\s+[`'"]?(?:createWithEqualityFn|useStoreWithEqualityFn)\b.*zustand\/traditional/i,
        AUTH_NOISE = /(?:\bAuthFailed\b|InteractionRequired|We need you to sign in again|UPR:\s*(?:\"Error:\s*)?AuthFailed|Discover::regionGtm::InvalidResponse|authService is missing|getSerializedKeyForKeypath returned undefined key|PinnedChannelsUtils|SensitivityLabel|findPlaces|subscribePresence|publishEndpointPresence|getPresence)/i,
        S = "__twh_b__",
        POLICY_STATE_KEY_PAGE = "__twh_ps__",
        k = Object.freeze({
            enabled: "__twh_en__",
            collapsed: "__teams_web_helper_ui_collapsed__",
            activeTab: "__teams_web_helper_active_tab__",
            spoofConfig: "__teams_web_helper_spoof_config__",
            spoofConfigUpdatedAt: "__teams_web_helper_spoof_config_updated_at__"
        });

    function x(e, t) {
        try {
            const n = localStorage.getItem(e);
            return null == n ? t : "1" === n || "true" === n
        } catch {
            return t
        }
    }

    function C(e, t) {
        setLocalStorageIfChanged(e, t ? "1" : "0")
    }

    function setLocalStorageIfChanged(e, t) {
        try {
            const n = String(null == t ? "" : t);
            if (localStorage.getItem(e) !== n) localStorage.setItem(e, n);
            return !0
        } catch {
            return !1
        }
    }

    function getCachedRuntimePolicyState() {
        try {
            const raw = localStorage.getItem(POLICY_STATE_KEY_PAGE);
            if (!raw) return { known: false, enabled: false, meta: null, reason: "policy-pending" };
            const parsed = JSON.parse(raw);
            if (!parsed || "object" != typeof parsed) return { known: false, enabled: false, meta: null, reason: "policy-pending" };
            const meta = parsed.meta && "object" == typeof parsed.meta ? parsed.meta : null,
                blocked = policyMetaBlocksRuntime(meta),
                enabled = !!parsed.enabled && !blocked;
            return {
                known: true,
                enabled,
                meta,
                reason: enabled ? null : describeRuntimePolicyBlock(meta, meta && meta.reason || "controls-unavailable")
            }
        } catch {
            return { known: false, enabled: false, meta: null, reason: "policy-pending" }
        }
    }

    function policyMetaBlocksRuntime(policy) {
        return !!(policy && "object" == typeof policy && (policy.killSwitch || false === policy.minVersionOk))
    }

    function describeRuntimePolicyBlock(policy, fallback) {
        if (policy && "object" == typeof policy) {
            if (policy.killSwitch) return "controls unavailable";
            if (false === policy.minVersionOk) return "update required";
            if (policy.reason) return String(policy.reason)
        }
        return String(fallback || "controls-unavailable")
    }

    const INITIAL_POLICY_STATE = getCachedRuntimePolicyState();

    function isApprovedBetaRuntimePolicy(policy) {
        try {
            const p = policy || (L && L.runtimePolicy) || {};
            const entitlement = String(p.entitlement || p.plan || p.access || p.accountAccess || "").toLowerCase();
            const betaStatus = String(p.betaStatus || p.beta || p.beta_state || p.betaState || "").toLowerCase();
            const flags = p.flags || p.ui || p.user || p.account || {};
            return betaStatus === "approved" || betaStatus === "beta-approved" || entitlement === "beta" || entitlement === "beta-approved" || flags.betaApproved === true || flags.approvedBeta === true;
        } catch {
            return false;
        }
    }

    function isFeedbackTabAllowed() {
        return isApprovedBetaRuntimePolicy(L && L.runtimePolicy);
    }

    const T = Object.freeze([{
            id: "overview",
            label: "Home"
        }, {
            id: "activity",
            label: "Schedule"
        }, {
            id: "logs",
            label: "Log"
        }, {
            id: "feedback",
            label: "Feedback"
        }]),
        A = Object.freeze({
            schemaVersion: 1,
            notes: "",
            navigator: {
                enabled: !0,
                userAgent: null,
                appVersion: null,
                platform: null,
                vendor: null,
                language: null,
                languages: null,
                hardwareConcurrency: null,
                deviceMemory: null,
                maxTouchPoints: null
            },
            worker: {
                enabled: !0,
                fields: {
                    experienceName: null,
                    ring: null,
                    environment: null,
                    sessionId: null,
                    platformId: null,
                    buildVersion: null,
                    localeCode: null,
                    workerId: null,
                    publicPath: null,
                    deviceId: null,
                    isOcdi: null,
                    isPwa: null,
                    shouldFetchWorkerChunksBeforeImportScripts: null,
                    useDiagnosticsServiceV2: null,
                    turboCohort: null,
                    enableLazyLoadedWorker: null,
                    enableMinimalSchemaWorker: null,
                    workerCreationTime: null,
                    preECSConsoleLogLevel: null
                }
            },
            telemetry: {
                mode: "suppress",
                query: {
                    AppInfo_BootType: null,
                    AppInfo_ClientType: null,
                    AppInfo_ExperienceName: null,
                    AppInfo_PlatformId: null,
                    AppInfo_Version: null,
                    AppInfo_Environment: null,
                    AppInfo_ServiceWorkerState: null,
                    AppInfo_UxStatus: null,
                    DeviceInfo_Id: null,
                    environment: null,
                    loaderNetworkPingState: null,
                    navigatorNetworkState: null,
                    Session_Id: null,
                    Session_TelemetryContext: null,
                    userAgent: null,
                    UserInfo_Ring: null,
                    UserInfo_Id: null,
                    UserInfo_TenantId: null,
                    UserInfo_TelemetryRegion: null
                }
            },
            presence: {
                enabled: !0,
                headers: {
                    "x-ms-client-user-agent": null,
                    "x-ms-client-caller": null,
                    "x-ms-client-consumer-type": null,
                    "x-ms-endpoint-id": null,
                    "x-ms-session-id": null
                },
                endpointBody: {
                    id: null,
                    availability: null,
                    activity: null,
                    activityReporting: null,
                    deviceType: null
                },
                forceBody: {
                    availability: null,
                    activity: null
                },
                activityBody: {
                    endpointId: null,
                    isActive: null
                }
            },
            activity: {
                enabled: !0,
                forceVisible: !0,
                forceFocused: !0,
                forcePointerInside: !0,
                stopAwayEvents: !0,
                replayTrustedListeners: !0,
                syntheticEvents: {
                    enabled: !0,
                    intervalMs: 15e3,
                    clientX: 96,
                    clientY: 96,
                    screenX: 96,
                    screenY: 96
                }
            }
        });

    function E(e) {
        return !!e && "object" == typeof e && !Array.isArray(e)
    }

    function O(e) {
        if (null == e) return e;
        try {
            return JSON.parse(JSON.stringify(e))
        } catch {
            return e
        }
    }

    function _(e, t) {
        if (Array.isArray(e)) return Array.isArray(t) ? O(t) : O(e);
        if (E(e)) {
            const n = O(e) || {};
            if (E(t))
                for (const [e, o] of Object.entries(t)) Object.prototype.hasOwnProperty.call(n, e) ? n[e] = _(n[e], o) : n[e] = O(o);
            return n
        }
        return O(void 0 === t ? e : t)
    }

    function B(e) {
        return _(A, E(e) ? e : {})
    }

    function P(e) {
        return null != e
    }

    function j(e, t) {
        const n = E(e) || Array.isArray(e) ? O(e) : {};
        if (!E(t)) return n;
        for (const [e, o] of Object.entries(t)) P(o) && (n[e] = O(o));
        return n
    }

    function N(e) {
        return O(A[e])
    }

    function M(e) {
        return ["navigator", "worker", "telemetry", "presence", "activity"].includes(e)
    }
    const STATUS_PRESETS = Object.freeze({
            available: Object.freeze({
                key: "available",
                label: "Available",
                availability: "Available",
                activity: "Available",
                forceBody: {
                    availability: "Available"
                }
            }),
            busy: Object.freeze({
                key: "busy",
                label: "Busy",
                availability: "Busy",
                activity: "Busy",
                forceBody: {
                    availability: "Busy"
                }
            }),
            dnd: Object.freeze({
                key: "dnd",
                label: "Do not disturb",
                availability: "DoNotDisturb",
                activity: "DoNotDisturb",
                forceBody: {
                    availability: "DoNotDisturb"
                }
            }),
            brb: Object.freeze({
                key: "brb",
                label: "Be right back",
                availability: "BeRightBack",
                activity: "BeRightBack",
                forceBody: {
                    availability: "BeRightBack"
                }
            }),
            away: Object.freeze({
                key: "away",
                label: "Away",
                availability: "Away",
                activity: "Away",
                forceBody: {
                    availability: "Away"
                }
            }),
            offline: Object.freeze({
                key: "offline",
                label: "Offline",
                availability: "Offline",
                activity: "OffWork",
                forceBody: {
                    availability: "Offline",
                    activity: "OffWork"
                }
            })
        }),
        STATUS_PRESET_KEYS = Object.freeze(Object.keys(STATUS_PRESETS)),
        SCHEDULE_DAY_LABELS = Object.freeze(["S", "M", "T", "W", "T", "F", "S"]),
        SCHEDULE_TIMELINE_DAY_ORDER = Object.freeze([1, 2, 3, 4, 5, 6, 0]),
        SCHEDULE_DAY_FULL_LABELS = Object.freeze(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
        SCHEDULE_TIMELINE_ZOOM_STEPS = Object.freeze([14, 18, 24, 32, 40, 52]),
        MAX_SCHEDULE_BLOCKS_PER_DAY = 16,
        MANAGER_STORAGE_KEY = "__teams_web_helper_manager__",
        ACCOUNT_CONFIGS_STORAGE_KEY = "__teams_web_helper_accounts__",
        SELECTED_ACCOUNT_KEY_STORAGE_KEY = "__teams_web_helper_selected_account__",
        DEFAULT_MANAGER_STATE = Object.freeze({
            manualStatusKey: "available",
            allowAvailableDuringCalls: !1,
            notSeenMode: !0,
            scheduleEnabled: !1,
            scheduleRules: [],
            scheduleExceptions: []
        });

    const STATUS_ALIASES = Object.freeze({
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

    function normalizeStatusKey(e) {
        const t = String(e || "").trim();
        if (!t) return "available";
        const n = t.toLowerCase().replace(/[\s_-]+/g, "");
        return STATUS_ALIASES[n] || STATUS_PRESETS[n] && n || "available"
    }

    function getStatusPreset(e) {
        return STATUS_PRESETS[normalizeStatusKey(e)] || STATUS_PRESETS.available
    }

    function coerceStatusKey(e) {
        return getStatusPreset(e).key
    }

    function createScheduleRuleId() {
        return "rule-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
    }

    function normalizeSchedulePriority(value, fallback = 0) {
        const number = Number(value != null ? value : fallback || 0);
        return Number.isFinite(number) ? Math.max(0, Math.min(999, Math.round(number))) : 0
    }

    function normalizeScheduleTimeZone(value) {
        const raw = String(value || "").trim();
        return raw && raw.length <= 96 ? raw : ""
    }

    function normalizeScheduleTimezoneOffset(value) {
        const number = Number(value);
        return Number.isFinite(number) && number >= -14 * 60 && number <= 14 * 60 ? Math.round(number) : null
    }

    function normalizeScheduleLocalDate(value) {
        const raw = String(value || "").trim();
        return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null
    }

    function normalizeScheduleLocalDay(value) {
        const number = Number(value);
        return Number.isInteger(number) && number >= 0 && number <= 6 ? number : null
    }

    function normalizeScheduleLocalMinutes(value) {
        const number = Number(value);
        return Number.isInteger(number) && number >= 0 && number <= 1439 ? number : null
    }

    function normalizeScheduleClockIso(value) {
        const raw = String(value || "").trim();
        if (!raw || raw.length > 64) return null;
        const time = Date.parse(raw);
        return Number.isFinite(time) ? raw : null
    }

    function scheduleClientTimeZoneName() {
        try {
            return Intl && Intl.DateTimeFormat ? (Intl.DateTimeFormat().resolvedOptions().timeZone || "") : ""
        } catch {
            return ""
        }
    }

    function scheduleLocalDateString(date = new Date) {
        const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date;
        return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-")
    }

    function scheduleClientClockSnapshot(date = new Date) {
        const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date;
        const zone = scheduleClientTimeZoneName();
        return {
            clientTimeZone: zone,
            timeZone: zone,
            timezoneOffsetMinutes: d.getTimezoneOffset(),
            clientLocalDate: scheduleLocalDateString(d),
            clientLocalDay: d.getDay(),
            clientLocalMinutes: d.getHours() * 60 + d.getMinutes(),
            clientClockAt: d.toISOString()
        }
    }

    function normalizeScheduleDays(e) {
        const t = Array.isArray(e) ? e : [1, 2, 3, 4, 5];
        return Array.from(new Set(t.map((e => Number(e))).filter((e => Number.isInteger(e) && e >= 0 && e <= 6)))).sort(((e, t) => e - t))
    }

    function normalizeScheduleRule(e, t = 0, n = "weekly") {
        const o = E(e) ? e : {},
            r = /^\d{2}:\d{2}$/.test(String(o.start || "")) ? String(o.start) : "09:00",
            i = /^\d{2}:\d{2}$/.test(String(o.end || "")) ? String(o.end) : "17:00",
            a = normalizeScheduleDays(o.days),
            s = coerceStatusKey(o.statusKey || o.status || o.presence || o.availability || o.activity || o.label),
            l = String(o.mode || o.kind || n || o.date && "exception" || "weekly").toLowerCase() === "exception" ? "exception" : "weekly",
            c = /^\d{4}-\d{2}-\d{2}$/.test(String(o.date || "")) ? String(o.date) : null;
        return {
            id: P(o.id) ? String(o.id) : createScheduleRuleId() + "-" + t,
            mode: l,
            enabled: !1 !== o.enabled,
            date: "exception" === l ? c : null,
            start: r,
            end: i,
            days: "exception" === l ? [] : a.length ? a : [1, 2, 3, 4, 5],
            statusKey: s,
            note: String(o.note || o.notes || "").trim().slice(0, 120),
            priority: normalizeSchedulePriority(o.priority ?? o.rank ?? o.weight ?? o.precedence, 0),
            allowAvailableDuringCalls: !!(o.allowAvailableDuringCalls ?? o.forceDuringCalls)
        }
    }

    function normalizeManagerState(e) {
        const t = E(e) ? e : {};
        return {
            manualStatusKey: coerceStatusKey(t.manualStatusKey || t.statusKey || t.status || t.presence || t.availability || t.activity),
            allowAvailableDuringCalls: !!t.allowAvailableDuringCalls,
            notSeenMode: !1 !== t.notSeenMode,
            scheduleEnabled: !!t.scheduleEnabled,
            scheduleRules: Array.isArray(t.scheduleRules) ? t.scheduleRules.slice(0, 56).map(((e, t) => normalizeScheduleRule(e, t, "weekly"))).filter((e => "exception" !== e.mode)) : [],
            scheduleExceptions: Array.isArray(t.scheduleExceptions) ? t.scheduleExceptions.slice(0, 56).map(((e, t) => normalizeScheduleRule(e, t, "exception"))).filter((e => !!e.date)) : [],
            clientTimeZone: normalizeScheduleTimeZone(t.clientTimeZone || t.timeZone || t.timezone || t.clientTimezone),
            timeZone: normalizeScheduleTimeZone(t.clientTimeZone || t.timeZone || t.timezone || t.clientTimezone),
            timezoneOffsetMinutes: normalizeScheduleTimezoneOffset(t.timezoneOffsetMinutes ?? t.timeZoneOffsetMinutes ?? t.clientTimezoneOffsetMinutes ?? t.clientTimeZoneOffsetMinutes),
            clientLocalDate: normalizeScheduleLocalDate(t.clientLocalDate || t.localDate),
            clientLocalDay: normalizeScheduleLocalDay(t.clientLocalDay ?? t.localDay),
            clientLocalMinutes: normalizeScheduleLocalMinutes(t.clientLocalMinutes ?? t.localMinutes),
            clientClockAt: normalizeScheduleClockIso(t.clientClockAt || t.localClockAt || t.clientNow)
        }
    }

    function attachScheduleClientClock(e, date = new Date) {
        const manager = normalizeManagerState(e);
        return Object.assign({}, manager, scheduleClientClockSnapshot(date))
    }

    function stripScheduleClientClock(e) {
        const manager = normalizeManagerState(e);
        return Object.assign({}, manager, {
            clientTimeZone: manager.clientTimeZone || null,
            timeZone: manager.timeZone || null,
            timezoneOffsetMinutes: manager.timezoneOffsetMinutes,
            clientLocalDate: manager.clientLocalDate,
            clientLocalDay: manager.clientLocalDay,
            clientLocalMinutes: manager.clientLocalMinutes,
            clientClockAt: manager.clientClockAt
        })
    }

    function shouldRefreshScheduleClientClock(e, date = new Date, minAgeMs = 300000) {
        const manager = normalizeManagerState(e);
        const now = date instanceof Date && !isNaN(date.getTime()) ? date : new Date;
        const clockMs = Date.parse(manager.clientClockAt || "");
        if (!Number.isFinite(clockMs)) return true;
        if (manager.clientLocalDate && manager.clientLocalDate !== scheduleLocalDateString(now)) return true;
        return now.getTime() - clockMs >= Math.max(60000, Number(minAgeMs) || 300000)
    }

    function maybeAttachScheduleClientClock(e, date = new Date, minAgeMs = 300000) {
        return shouldRefreshScheduleClientClock(e, date, minAgeMs) ? attachScheduleClientClock(e, date) : normalizeManagerState(e)
    }

    function loadManagerState() {
        try {
            const e = localStorage.getItem(MANAGER_STORAGE_KEY);
            return normalizeManagerState(e ? JSON.parse(e) : DEFAULT_MANAGER_STATE)
        } catch {
            return normalizeManagerState(DEFAULT_MANAGER_STATE)
        }
    }

    function saveManagerState(e) {
        try {
            setLocalStorageIfChanged(MANAGER_STORAGE_KEY, JSON.stringify(attachScheduleClientClock(e)))
        } catch {}
    }

    function normalizeTeamsAccountType(e) {
        const t = String(e || "").trim().toLowerCase();
        if (!t) return "unknown";
        const consumerTenant = "9188040d-6c67-4c5b-b112-36a304b66dad";
        if (t.includes(consumerTenant)) return "personal";
        if (/@(?:[^@\s]+\.)*onmicrosoft\.com(?:$|[^a-z0-9.-])/i.test(t) || /(?:^|:)orgid:/i.test(t)) return "business";
        if (/^(?:personal|consumer|life|msa|microsoft-account|tfl)$/.test(t) || /^personal:/.test(t) || /teams\.live\.com|(?:^|:)live:|8:live:|cid\./.test(t)) return "personal";
        if (/^(?:business|work|school|enterprise|commercial|org|aad)$/.test(t) || /^business:/.test(t) || /teams\.(?:cloud\.microsoft|microsoft\.com)|login\.microsoftonline\.com|(?:^|:)28:|(?:^|:)29:/.test(t)) return "business";
        if (/^unknown:/.test(t)) return "unknown";
        return "unknown"
    }

    function accountIdentityGuid(value) {
        const text = String(value || "").trim().toLowerCase();
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(text) ? text : ""
    }

    function accountIdentityFromKey(value) {
        const match = String(value || "").trim().toLowerCase().match(/^business:([0-9a-f-]{36}):([0-9a-f-]{36})$/i);
        return match ? { accountTid: accountIdentityGuid(match[1]), accountOid: accountIdentityGuid(match[2]) } : { accountTid: "", accountOid: "" }
    }

    function identityAwareTeamsAccountType(typeValue, entry = null) {
        const value = entry && typeof entry === "object" ? entry : {};
        const key = String(value.key || value.accountKey || value.selectedAccountKey || "").trim().toLowerCase();
        const parsed = accountIdentityFromKey(key);
        const tid = accountIdentityGuid(value.accountTid || value.oauthResolvedTid || value.tenantId || value.tid || parsed.accountTid || "");
        const home = String(value.homeAccountId || "").trim().toLowerCase();
        const homeTid = accountIdentityGuid(home.includes(".") ? home.slice(home.lastIndexOf(".") + 1) : "");
        const consumerTenant = "9188040d-6c67-4c5b-b112-36a304b66dad";
        const email = normalizeAccountEmail(value.email || value.targetAccountEmail || value.teamsAccountEmail || key || "");
        const principal = String(value.userPrincipalName || value.upn || value.preferred_username || "").trim().toLowerCase();
        const mri = String(value.userMri || value.mri || value.skypeId || "").trim().toLowerCase();
        if (tid === consumerTenant || homeTid === consumerTenant) return "personal";
        if (tid || homeTid) return "business";
        if (/@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(email) || /#ext#@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(principal) || /(?:^|:)orgid:/i.test(mri) || /^orgid:/i.test(principal)) return "business";
        if (value.cid || /(?:^|:)live:/i.test(mri) || /^live:/i.test(principal)) return "personal";
        if (/^business:/.test(key)) return "business";
        if (/^personal:/.test(key)) return "personal";
        return normalizeTeamsAccountType(typeValue)
    }

    function stripAccountKeyPrefixes(e) {
        return String(e || "").trim().toLowerCase().replace(/^(?:(?:personal|business|unknown):)+/i, "")
    }

    function accountFallbackId(e, t = "default") {
        const n = stripAccountKeyPrefixes(e || t || "default");
        return (n || "default").slice(0, 180)
    }

    function buildAccountKey(e, t, n = "default", identity = null) {
        const details = identity && typeof identity === "object" ? identity : {};
        const o = identityAwareTeamsAccountType(e, Object.assign({}, details, { key: details.key || n })),
            r = normalizeAccountEmail(t),
            parsed = accountIdentityFromKey(details.key || n),
            tid = accountIdentityGuid(details.accountTid || details.oauthResolvedTid || details.tenantId || parsed.accountTid),
            oid = accountIdentityGuid(details.accountOid || details.oauthResolvedOid || details.objectId || parsed.accountOid);
        if (o === "business" && tid && oid) return `business:${tid}:${oid}`;
        return `${o}:${r || accountFallbackId(n)}`
    }
    function accountKeyEmail(e) {
        return normalizeAccountEmail(stripAccountKeyPrefixes(e))
    }

    function currentPageTeamsType() {
        const type = normalizeTeamsAccountType(location.href || location.hostname || "");
        return "unknown" !== type ? type : normalizeTeamsAccountType(L && (L.directBaseUrl || L.targetAccountType) || "")
    }

    function accountEntryTeamsType(entry) {
        if (!entry) return "unknown";
        return identityAwareTeamsAccountType(entry.teamsType || entry.targetAccountType || entry.key || "", entry)
    }

    function accountMatchesCurrentPage(entry) {
        const pageType = currentPageTeamsType();
        if (!entry || "unknown" === pageType) return true;
        const entryType = accountEntryTeamsType(entry);
        return "unknown" === entryType || entryType === pageType
    }

    function baseUrlMatchesTeamsType(value, type = currentPageTeamsType()) {
        if (!value || "unknown" === type) return true;
        const parsedType = normalizeTeamsAccountType(String(value || ""));
        return "unknown" === parsedType || parsedType === type
    }

    function resolveAccountKeyForCurrentPage(registry, preferredKey = null) {
        const normalized = normalizeAccountRegistry(registry || null),
            accounts = normalized.accounts || {},
            pageType = currentPageTeamsType(),
            pageEmail = normalizeAccountEmail(extractTeamsAccountEmail() || ""),
            keys = Object.keys(accounts);
        const isMatch = key => {
            const entry = key && accounts[key];
            if (!entry) return false;
            const entryType = accountEntryTeamsType(entry);
            if ("unknown" !== pageType && "unknown" !== entryType && entryType !== pageType) return false;
            const entryEmail = normalizeAccountEmail(entry.email || accountKeyEmail(key) || "");
            return !(pageEmail && entryEmail && entryEmail !== pageEmail)
        };
        const preferred = [preferredKey, L && L.currentAccountKey, L && L.selectedAccountKey, normalized.activeAccountKey].filter(Boolean);
        for (const key of preferred) if (isMatch(key)) return key;
        if (pageEmail && "unknown" !== pageType) {
            const exact = keys.find(key => {
                const entry = accounts[key];
                return accountEntryTeamsType(entry) === pageType && normalizeAccountEmail(entry.email || accountKeyEmail(key) || "") === pageEmail
            });
            if (exact) return exact
        }
        if ("unknown" !== pageType) {
            const typed = keys.find(key => accountEntryTeamsType(accounts[key]) === pageType && !normalizeAccountEmail(accounts[key].email || accountKeyEmail(key) || "")) || keys.find(key => accountEntryTeamsType(accounts[key]) === pageType);
            if (typed) return typed
        }
        return keys.find(isMatch) || normalized.activeAccountKey || keys[0] || null
    }

    function accountUpdatedAtValue(e) {
        const t = e && e.updatedAt ? Date.parse(e.updatedAt) : 0;
        return Number.isFinite(t) ? t : 0
    }

    function managerScheduleWeight(e) {
        const t = normalizeManagerState(e || null);
        let n = 0;
        if (t.scheduleEnabled) n += 1;
        n += (Array.isArray(t.scheduleRules) ? t.scheduleRules.length : 0) * 10;
        n += (Array.isArray(t.scheduleExceptions) ? t.scheduleExceptions.length : 0) * 12;
        for (const e of t.scheduleRules || []) n += normalizeSchedulePriority(e && e.priority, 0);
        for (const e of t.scheduleExceptions || []) n += normalizeSchedulePriority(e && e.priority, 0);
        return n
    }

    function preferIncomingAccountEntry(e, t, n = !1) {
        if (!e) return !0;
        const o = accountUpdatedAtValue(e), r = accountUpdatedAtValue(t), i = managerScheduleWeight(e && e.manager), a = managerScheduleWeight(t && t.manager);
        if (r || o) {
            if (r > o + 1000) return !0;
            if (o > r + 1000) return !1
        }
        if (a > i) return !0;
        if (i > 0 && a === 0) return !1;
        return !!n || r >= o
    }

    function mergeStoredAccountEntry(e, t, n = !1) {
        const existing = e && "object" == typeof e ? e : null,
            incoming = t && "object" == typeof t ? t : Object.create(null),
            o = existing ? preferIncomingAccountEntry(existing, incoming, n) : !0,
            incomingEmail = normalizeAccountEmail(incoming.email || incoming.targetAccountEmail || incoming.teamsAccountEmail || accountKeyEmail(incoming.key) || ""),
            existingEmail = normalizeAccountEmail(existing && (existing.email || existing.targetAccountEmail || existing.teamsAccountEmail || accountKeyEmail(existing.key)) || ""),
            email = incomingEmail || existingEmail || "",
            incomingType = identityAwareTeamsAccountType(incoming.teamsType || incoming.targetAccountType || incoming.key || incoming.baseUrl || incoming.pageUrl || "", incoming),
            existingType = identityAwareTeamsAccountType(existing && (existing.teamsType || existing.targetAccountType || existing.key || existing.baseUrl || existing.pageUrl) || "", existing || null),
            teamsType = "unknown" !== incomingType ? incomingType : "unknown" !== existingType ? existingType : "unknown",
            incomingParsed = accountIdentityFromKey(incoming.key || ""),
            existingParsed = accountIdentityFromKey(existing && existing.key || ""),
            accountTid = accountIdentityGuid(incoming.accountTid || incoming.oauthResolvedTid || incomingParsed.accountTid || existing && (existing.accountTid || existing.oauthResolvedTid) || existingParsed.accountTid),
            accountOid = accountIdentityGuid(incoming.accountOid || incoming.oauthResolvedOid || incomingParsed.accountOid || existing && (existing.accountOid || existing.oauthResolvedOid) || existingParsed.accountOid),
            homeAccountId = String(incoming.homeAccountId || existing && existing.homeAccountId || "").trim().toLowerCase(),
            key = buildAccountKey(teamsType, email, incoming.key || existing && existing.key || "default", { accountTid, accountOid, homeAccountId }),
            rawPageUrl = incoming.pageUrl || existing && existing.pageUrl || "",
            rawBaseUrl = incoming.baseUrl || existing && existing.baseUrl || "",
            pageType = normalizeTeamsAccountType(rawPageUrl),
            baseType = normalizeTeamsAccountType(rawBaseUrl),
            pageMismatch = teamsType !== "unknown" && pageType !== "unknown" && pageType !== teamsType,
            baseMismatch = teamsType !== "unknown" && baseType !== "unknown" && baseType !== teamsType,
            contextMismatch = pageMismatch || baseMismatch,
            defaultPageUrl = teamsType === "personal" ? "https://teams.live.com/v2/" : teamsType === "business" ? "https://teams.cloud.microsoft/" : "",
            defaultBaseUrl = teamsType === "personal" ? "https://teams.live.com/ups/global" : teamsType === "business" ? "https://teams.cloud.microsoft/ups/noam" : "";
        return {
            key,
            email,
            teamsType,
            accountTid,
            oauthResolvedTid: accountTid,
            accountOid,
            oauthResolvedOid: accountOid,
            homeAccountId,
            enabled: o ? !!incoming.enabled : !!(existing && existing.enabled),
            cloudEnabled: "boolean" == typeof incoming.cloudEnabled ? !!incoming.cloudEnabled : existing && "boolean" == typeof existing.cloudEnabled ? !!existing.cloudEnabled : null,
            manager: o ? normalizeManagerState(incoming.manager) : normalizeManagerState(existing && existing.manager),
            pageUrl: pageMismatch ? defaultPageUrl : rawPageUrl,
            baseUrl: baseMismatch ? defaultBaseUrl : rawBaseUrl,
            endpointId: contextMismatch ? "" : incoming.endpointId || existing && existing.endpointId || "",
            userMri: contextMismatch ? "" : incoming.userMri || existing && existing.userMri || "",
            tabId: contextMismatch ? -1 : Number.isFinite(incoming.tabId) && incoming.tabId >= 0 ? incoming.tabId : existing && Number.isFinite(existing.tabId) && existing.tabId >= 0 ? existing.tabId : -1,
            headers: contextMismatch ? null : incoming.headers || existing && existing.headers || null,
            endpointBody: contextMismatch ? null : incoming.endpointBody || existing && existing.endpointBody || null,
            forceBody: contextMismatch ? null : incoming.forceBody || existing && existing.forceBody || null,
            activityBody: contextMismatch ? null : incoming.activityBody || existing && existing.activityBody || null,
            updatedAt: o ? incoming.updatedAt || existing && existing.updatedAt || null : existing && existing.updatedAt || incoming.updatedAt || null
        }
    }

    function normalizeStoredAccountEntry(e, t = "default") {
        const n = e && "object" == typeof e ? e : Object.create(null),
            o = String(n.key || t || ""),
            r = identityAwareTeamsAccountType(n.teamsType || n.targetAccountType || n.baseUrl || n.pageUrl || o || "", Object.assign({}, n, { key: o })),
            s = r,
            i = normalizeAccountEmail(n.email || n.targetAccountEmail || n.teamsAccountEmail || accountKeyEmail(o) || ""),
            parsed = accountIdentityFromKey(o),
            accountTid = accountIdentityGuid(n.accountTid || n.oauthResolvedTid || n.tenantId || parsed.accountTid),
            accountOid = accountIdentityGuid(n.accountOid || n.oauthResolvedOid || n.objectId || parsed.accountOid),
            homeAccountId = String(n.homeAccountId || "").trim().toLowerCase(),
            a = buildAccountKey(s, i, accountFallbackId(o, t), { key: o, accountTid, accountOid, homeAccountId }),
            rawPageUrl = "string" == typeof n.pageUrl && n.pageUrl ? n.pageUrl : "",
            rawBaseUrl = "string" == typeof n.baseUrl && n.baseUrl ? n.baseUrl : "",
            pageType = normalizeTeamsAccountType(rawPageUrl),
            baseType = normalizeTeamsAccountType(rawBaseUrl),
            pageMismatch = s !== "unknown" && pageType !== "unknown" && pageType !== s,
            baseMismatch = s !== "unknown" && baseType !== "unknown" && baseType !== s,
            contextMismatch = pageMismatch || baseMismatch,
            defaultPageUrl = s === "personal" ? "https://teams.live.com/v2/" : s === "business" ? "https://teams.cloud.microsoft/" : "",
            defaultBaseUrl = s === "personal" ? "https://teams.live.com/ups/global" : s === "business" ? "https://teams.cloud.microsoft/ups/noam" : "";
        return {
            key: a,
            email: i,
            teamsType: s,
            accountTid,
            oauthResolvedTid: accountTid,
            accountOid,
            oauthResolvedOid: accountOid,
            homeAccountId,
            enabled: "boolean" == typeof n.enabled ? !!n.enabled : !1,
            cloudEnabled: "boolean" == typeof n.cloudEnabled ? !!n.cloudEnabled : null,
            manager: normalizeManagerState(n.manager),
            pageUrl: pageMismatch ? defaultPageUrl : rawPageUrl,
            baseUrl: baseMismatch ? defaultBaseUrl : rawBaseUrl,
            endpointId: contextMismatch ? "" : "string" == typeof n.endpointId && n.endpointId ? n.endpointId : "",
            userMri: contextMismatch ? "" : "string" == typeof n.userMri && n.userMri ? n.userMri : "",
            tabId: contextMismatch ? -1 : Number.isFinite(n.tabId) && n.tabId >= 0 ? n.tabId : -1,
            headers: contextMismatch ? null : n.headers && "object" == typeof n.headers ? n.headers : null,
            endpointBody: contextMismatch ? null : n.endpointBody && "object" == typeof n.endpointBody ? n.endpointBody : null,
            forceBody: contextMismatch ? null : n.forceBody && "object" == typeof n.forceBody ? n.forceBody : null,
            activityBody: contextMismatch ? null : n.activityBody && "object" == typeof n.activityBody ? n.activityBody : null,
            updatedAt: "string" == typeof n.updatedAt && n.updatedAt ? n.updatedAt : null
        }
    }

    function normalizeAccountRegistry(e) {
        let t = e;
        if ("string" == typeof t) try {
            t = JSON.parse(t)
        } catch {
            t = null
        }
        const n = t && "object" == typeof t ? t : Object.create(null),
            o = Object.create(null),
            r = Object.create(null),
            i = "string" == typeof n.activeAccountKey && n.activeAccountKey ? n.activeAccountKey : "string" == typeof n.selectedAccountKey && n.selectedAccountKey ? n.selectedAccountKey : null;
        if (n.accounts && "object" == typeof n.accounts)
            for (const [e, t] of Object.entries(n.accounts)) {
                const n = normalizeStoredAccountEntry(t, e), a = e === i || t && "object" == typeof t && t.key === i;
                r[e] = n.key, t && "object" == typeof t && t.key && (r[t.key] = n.key), o[n.key] = mergeStoredAccountEntry(o[n.key], n, a)
            }
        const l = Object.create(null);
        for (const [e, t] of Object.entries(o)) {
            if (!t.email) continue;
            const identity = `${t.teamsType || "unknown"}:${t.email}`;
            if (l[identity] && l[identity].teamsType === "unknown" && t.teamsType !== "unknown") l[identity] = t;
            if (!l[identity]) l[identity] = t
        }
        for (const [e, t] of Object.entries(o)) {
            const identity = t.email ? `${t.teamsType || "unknown"}:${t.email}` : "";
            const n = identity && l[identity] && l[identity].key !== e && "unknown" !== l[identity].teamsType ? l[identity].key : null;
            n && (o[n] = mergeStoredAccountEntry(o[n], t, e === i), delete o[e], r[e] = n)
        }
        // Collapse the impossible cross-authority alias produced by older builds:
        // a personal record carrying the same onmicrosoft.com email as one
        // tenant-qualified business identity. Preserve settings, but retain the
        // business account's identity and Teams Cloud runtime context.
        for (const [aliasKey, aliasValue] of Object.entries(o)) {
            if (!/^personal:/i.test(String(aliasKey || aliasValue && aliasValue.key || ""))) continue;
            const aliasEmail = normalizeAccountEmail(aliasValue && aliasValue.email || accountKeyEmail(aliasKey) || "");
            if (!aliasEmail || !/@(?:[^@\s]+\.)*onmicrosoft\.com$/i.test(aliasEmail)) continue;
            const matches = Object.entries(o).filter(([candidateKey, candidate]) => {
                if (candidateKey === aliasKey || normalizeAccountEmail(candidate && candidate.email || accountKeyEmail(candidateKey) || "") !== aliasEmail) return false;
                const parsed = accountIdentityFromKey(candidate && candidate.key || candidateKey);
                const tid = accountIdentityGuid(candidate && (candidate.accountTid || candidate.oauthResolvedTid) || parsed.accountTid);
                const oid = accountIdentityGuid(candidate && (candidate.accountOid || candidate.oauthResolvedOid) || parsed.accountOid);
                return accountEntryTeamsType(candidate) === "business" && !!(tid && oid)
            });
            if (matches.length !== 1) continue;
            const [targetKey, targetValue] = matches[0];
            const merged = mergeStoredAccountEntry(targetValue, aliasValue, aliasKey === i);
            for (const contextKey of ["baseUrl", "pageUrl", "endpointId", "userMri", "tabId", "headers", "endpointBody", "forceBody", "activityBody", "accountTid", "oauthResolvedTid", "accountOid", "oauthResolvedOid", "homeAccountId"]) {
                const value = targetValue && targetValue[contextKey];
                if (value != null && value !== "" && !(contextKey === "tabId" && Number(value) < 0)) merged[contextKey] = value
            }
            merged.key = targetKey;
            merged.teamsType = "business";
            o[targetKey] = normalizeStoredAccountEntry(merged, targetKey);
            delete o[aliasKey];
            r[aliasKey] = targetKey
        }
        const fullEmailTypes = new Set(Object.values(o).filter((e => e && e.email)).map((e => e.teamsType || "unknown")));
        for (const [e, t] of Object.entries(o)) if (!t.email && fullEmailTypes.has(t.teamsType || "unknown") && Object.keys(o).length > 1) {
            const n = Object.values(o).find((e => e && e.email && (e.teamsType || "unknown") === (t.teamsType || "unknown")));
            n && (o[n.key] = mergeStoredAccountEntry(o[n.key], t, e === i), delete o[e], r[e] = n.key)
        }
        for (const [e, t] of Object.entries(o)) if (Object.keys(o).length > 1 && t && !t.email && "unknown" === (t.teamsType || "unknown") && !t.baseUrl && !t.endpointId && !t.userMri && !t.enabled && !managerScheduleWeight(t.manager)) {
            delete o[e], r[e] = Object.keys(o)[0] || null
        }
        if (!Object.keys(o).length && n.manager) {
            const e = normalizeStoredAccountEntry({
                email: n.email || n.targetAccountEmail || "",
                teamsType: n.targetAccountType || n.teamsType || "unknown",
                enabled: "boolean" == typeof n.enabled ? n.enabled : !1,
                cloudEnabled: "boolean" == typeof n.cloudEnabled ? !!n.cloudEnabled : null,
                manager: n.manager,
                updatedAt: n.updatedAt || null
            }, buildAccountKey(n.targetAccountType || n.teamsType || "unknown", n.email || n.targetAccountEmail || "", "default"));
            o[e.key] = mergeStoredAccountEntry(o[e.key], e, !0)
        }
        const a = loadManagerState();
        if (!Object.keys(o).length) {
            const e = normalizeStoredAccountEntry({
                enabled: !1,
                manager: a,
                teamsType: "unknown"
            }, buildAccountKey("unknown", "", "default"));
            o[e.key] = e
        }
        let s = i && r[i] || null;
        if (!s && i) {
            const e = normalizeStoredAccountEntry({
                key: i,
                email: accountKeyEmail(i) || ""
            }, i);
            s = e && e.key || null
        }
        s && !o[s] && (s = r[s] || null);
        return o[s] || (s = Object.keys(o)[0]), {
            version: 2,
            activeAccountKey: s,
            accounts: o
        }
    }

    function loadAccountRegistry() {
        try {
            const e = localStorage.getItem(ACCOUNT_CONFIGS_STORAGE_KEY);
            return normalizeAccountRegistry(e ? JSON.parse(e) : null)
        } catch {
            return normalizeAccountRegistry(null)
        }
    }

    function saveAccountRegistry(e) {
        try {
            setLocalStorageIfChanged(ACCOUNT_CONFIGS_STORAGE_KEY, JSON.stringify(normalizeAccountRegistry(e)))
        } catch {}
    }

    function loadSelectedAccountKey() {
        try {
            const e = localStorage.getItem(SELECTED_ACCOUNT_KEY_STORAGE_KEY);
            if (!e) return null;
            const t = String(e);
            const n = normalizeAccountRegistry(localStorage.getItem(ACCOUNT_CONFIGS_STORAGE_KEY));
            if (n.accounts[t]) return t;
            const o = normalizeStoredAccountEntry({
                key: t,
                email: accountKeyEmail(t) || ""
            }, t);
            return o && n.accounts[o.key] ? o.key : n.activeAccountKey || t
        } catch {
            return null
        }
    }

    function saveSelectedAccountKey(e) {
        try {
            if (e) setLocalStorageIfChanged(SELECTED_ACCOUNT_KEY_STORAGE_KEY, String(e));
            else localStorage.getItem(SELECTED_ACCOUNT_KEY_STORAGE_KEY) != null && localStorage.removeItem(SELECTED_ACCOUNT_KEY_STORAGE_KEY)
        } catch {}
    }

    function getCurrentAccountMeta() {
        const e = normalizeAccountEmail(extractTeamsAccountEmail() || L && L.targetAccountEmail || ""),
            pageType = currentPageTeamsType(),
            n = L && L.endpointInfo && L.endpointInfo.loginUserMri ? String(L.endpointInfo.loginUserMri) : U && U.skypeTokenInfo && U.skypeTokenInfo.skypeId ? String(U.skypeTokenInfo.skypeId) : "default",
            identity = {
                email: e,
                accountTid: L && (L.accountTid || L.oauthResolvedTid) || "",
                accountOid: L && (L.accountOid || L.oauthResolvedOid) || "",
                homeAccountId: L && L.homeAccountId || "",
                userMri: n === "default" ? "" : n,
                key: L && (L.currentAccountKey || L.selectedAccountKey) || ""
            },
            explicitType = normalizeTeamsAccountType(L && (L.targetAccountType || L.teamsAccountType || L.teamsType) || ""),
            typeSeed = explicitType !== "unknown" ? explicitType : e || identity.userMri || identity.accountTid ? "unknown" : pageType,
            t = identityAwareTeamsAccountType(typeSeed, identity),
            o = buildAccountKey(t, e, n, identity);
        return {
            key: o,
            email: e,
            teamsType: t
        }
    }

    function persistSelectedAccountState(options = {}) {
        const touch = !!(options && options.touch),
            stamp = touch ? new Date().toISOString() : null,
            e = normalizeAccountRegistry(L.accountRegistry || null),
            t = getCurrentAccountMeta(),
            selectedBefore = L.selectedAccountKey && e.accounts[L.selectedAccountKey] ? L.selectedAccountKey : e.activeAccountKey && e.accounts[e.activeAccountKey] ? e.activeAccountKey : null;
        let n = touch ? resolveAccountKeyForCurrentPage(e, L.selectedAccountKey || e.activeAccountKey || t.key) : resolveAccountKeyForCurrentPage(e, t.key);
        if (!n || !e.accounts[n]) n = t.key || selectedBefore || Object.keys(e.accounts)[0];
        if (!n) return null;
        const o = e.accounts[n] || normalizeStoredAccountEntry({
            email: t.email,
            teamsType: t.teamsType,
            enabled: !!L.enabled,
            cloudEnabled: "boolean" == typeof L.cloudEnabled ? !!L.cloudEnabled : null,
            manager: L.manager,
            updatedAt: null
        }, n),
            currentManager = touch ? attachScheduleClientClock(L.manager) : normalizeManagerState(L.manager),
            storedManager = normalizeManagerState(o.manager),
            currentWeight = managerScheduleWeight(currentManager),
            storedWeight = managerScheduleWeight(storedManager),
            preferCurrentManager = !!(options && (options.preferCurrentManager || options.destructiveScheduleEdit || options.forceCurrentManager)),
            preserveCloudState = !!(options && options.preserveCloudState),
            // Timeline/scheduler/manual/status edits are not allowed to change Cloud Edit.
            // Preserve the saved account flag exactly. Only the explicit Cloud Edit
            // toggle in the popup/panel may change this value.
            // Cloud Edit is an explicit per-account option. Manual/schedule/status edits must not inherit
            // a transient root L.cloudEnabled value and accidentally turn Cloud Edit on.
            preservedCloudEnabled = preserveCloudState ? ("boolean" == typeof o.cloudEnabled ? !!o.cloudEnabled : false) : "boolean" == typeof o.cloudEnabled ? !!o.cloudEnabled : "boolean" == typeof L.cloudEnabled ? !!L.cloudEnabled : null,
            chosenManager = touch ? attachScheduleClientClock(preferCurrentManager || currentWeight >= storedWeight ? currentManager : storedManager) : normalizeManagerState(preferCurrentManager || currentWeight >= storedWeight ? currentManager : storedManager),
            r = normalizeStoredAccountEntry({
                ...o,
                email: resolveAccountKeyForCurrentPage(e, t.key) === n && t.email ? t.email : normalizeAccountEmail(o.email || accountKeyEmail(o.key) || ""),
                teamsType: resolveAccountKeyForCurrentPage(e, t.key) === n && "unknown" !== t.teamsType ? t.teamsType : o.teamsType,
                enabled: touch ? !!L.enabled : !!o.enabled,
                cloudEnabled: preserveCloudState ? preservedCloudEnabled : touch ? "boolean" == typeof L.cloudEnabled ? !!L.cloudEnabled : "boolean" == typeof o.cloudEnabled ? !!o.cloudEnabled : null : "boolean" == typeof o.cloudEnabled ? !!o.cloudEnabled : "boolean" == typeof L.cloudEnabled ? !!L.cloudEnabled : null,
                manager: chosenManager,
                pageUrl: location.href,
                baseUrl: L.directBaseUrl || me(),
                endpointId: L.endpointInfo && L.endpointInfo.endpointId || localStorage.getItem("__teams_web_helper_endpoint_id__") || o.endpointId || "",
                userMri: L.endpointInfo && L.endpointInfo.loginUserMri ? String(L.endpointInfo.loginUserMri) : U.skypeTokenInfo && U.skypeTokenInfo.skypeId ? String(U.skypeTokenInfo.skypeId) : o.userMri || "",
                tabId: o.tabId || -1,
                headers: L.endpointInfo && L.endpointInfo.endpointId ? ke(L.endpointInfo.endpointId) : o.headers || null,
                endpointBody: o.endpointBody || null,
                forceBody: o.forceBody || null,
                activityBody: o.activityBody || null,
                updatedAt: touch ? stamp || (new Date).toISOString() : o.updatedAt || null
            }, n),
            activeKey = touch ? r.key : selectedBefore && e.accounts[selectedBefore] ? selectedBefore : r.key;
        e.accounts[r.key] = r;
        e.activeAccountKey = activeKey;
        if (touch || !L.selectedAccountKey || !e.accounts[L.selectedAccountKey]) L.selectedAccountKey = activeKey;
        L.accountRegistry = e;
        touch && typeof D !== "undefined" && D && (D.localManagerDirtyUntil = Date.now() + 300000, D.lastLocalManagerEditAt = r.updatedAt);
        saveAccountRegistry(e);
        saveSelectedAccountKey(L.selectedAccountKey || activeKey);
        return r
    }

    function applyAccountSelection(e, t = {}) {
        if (!e) return !1;
        const n = normalizeAccountRegistry(L.accountRegistry || null),
            o = n.accounts[e];
        return !!o && (L.accountRegistry = n, L.selectedAccountKey = e, n.activeAccountKey = e, L.enabled = !!o.enabled, L.cloudEnabled = "boolean" == typeof o.cloudEnabled ? !!o.cloudEnabled : L.cloudEnabled, L.manager = normalizeManagerState(o.manager), o.email && (L.targetAccountEmail = o.email), o.teamsType && "unknown" !== o.teamsType && (L.targetAccountType = o.teamsType), saveManagerState(L.manager), saveAccountRegistry(n), saveSelectedAccountKey(e), !1 !== t.refresh && (renderManagerRules(), ct(), oe(t.reason || "account-select")), !0)
    }

    function ensureDetectedAccountRegistered(e = !1) {
        const t = getCurrentAccountMeta(),
            n = normalizeAccountRegistry(L.accountRegistry || null),
            o = L.currentAccountKey || null,
            r = n.accounts[t.key] || normalizeStoredAccountEntry({
                key: t.key,
                email: t.email,
                teamsType: t.teamsType,
                enabled: !!L.enabled,
                cloudEnabled: "boolean" == typeof L.cloudEnabled ? !!L.cloudEnabled : null,
                manager: L.manager,
                updatedAt: null
            }, t.key),
            i = normalizeStoredAccountEntry({
                ...r,
                key: t.key,
                email: t.email || r.email,
                teamsType: "unknown" !== t.teamsType ? t.teamsType : r.teamsType,
                enabled: r.enabled,
                cloudEnabled: "boolean" == typeof r.cloudEnabled ? !!r.cloudEnabled : "boolean" == typeof L.cloudEnabled ? !!L.cloudEnabled : null,
                manager: r.manager,
                pageUrl: location.href,
                baseUrl: L.directBaseUrl || me(),
                endpointId: L.endpointInfo && L.endpointInfo.endpointId || localStorage.getItem("__teams_web_helper_endpoint_id__") || r.endpointId || "",
                userMri: L.endpointInfo && L.endpointInfo.loginUserMri ? String(L.endpointInfo.loginUserMri) : U.skypeTokenInfo && U.skypeTokenInfo.skypeId ? String(U.skypeTokenInfo.skypeId) : r.userMri || "",
                headers: L.endpointInfo && L.endpointInfo.endpointId ? ke(L.endpointInfo.endpointId) : r.headers || null,
                endpointBody: r.endpointBody || null,
                forceBody: r.forceBody || null,
                activityBody: r.activityBody || null,
                updatedAt: r.updatedAt
            }, t.key);
        if (t.email) {
            const fallback = L.selectedAccountKey && n.accounts[L.selectedAccountKey] && !n.accounts[L.selectedAccountKey].email ? n.accounts[L.selectedAccountKey] : null;
            if (fallback && fallback.key !== t.key && (fallback.teamsType || "unknown") === (i.teamsType || "unknown")) {
                i.manager = normalizeManagerState(fallback.manager || i.manager);
                i.enabled = fallback.enabled;
                i.cloudEnabled = "boolean" == typeof fallback.cloudEnabled ? !!fallback.cloudEnabled : i.cloudEnabled;
                i.updatedAt = fallback.updatedAt || i.updatedAt;
                delete n.accounts[fallback.key];
            }
        }
        return n.accounts[t.key] = i, L.accountRegistry = n, L.currentAccountKey = t.key, L.targetAccountEmail = i.email || L.targetAccountEmail, L.targetAccountType = i.teamsType || L.targetAccountType, saveAccountRegistry(n), (!L.selectedAccountKey || !n.accounts[L.selectedAccountKey] || e) && applyAccountSelection(t.key, {
            refresh: !1,
            reason: "detected-account"
        }), i
    }

    function buildRuntimeAccountRegistryPayload() {
        persistSelectedAccountState({ touch: false });
        const e = normalizeAccountRegistry(L.accountRegistry || null);
        const selectedKey = L.selectedAccountKey && e.accounts[L.selectedAccountKey] ? L.selectedAccountKey : e.activeAccountKey && e.accounts[e.activeAccountKey] ? e.activeAccountKey : resolveAccountKeyForCurrentPage(e, L.currentAccountKey || e.activeAccountKey);
        selectedKey && e.accounts[selectedKey] && (e.activeAccountKey = selectedKey);
        const activeKey = selectedKey || e.activeAccountKey;
        if (activeKey && e.accounts[activeKey]) {
            e.accounts[activeKey] = normalizeStoredAccountEntry(Object.assign({}, e.accounts[activeKey], {
                manager: maybeAttachScheduleClientClock(e.accounts[activeKey].manager, new Date, 900000),
                updatedAt: e.accounts[activeKey].updatedAt || null
            }), activeKey);
            L.accountRegistry = e;
            saveAccountRegistry(e);
            if (activeKey === L.selectedAccountKey || !L.selectedAccountKey) {
                L.manager = normalizeManagerState(e.accounts[activeKey].manager);
                saveManagerState(L.manager)
            }
        }
        const t = e.accounts[activeKey] || null;
        return {
            version: 2,
            activeAccountKey: activeKey,
            cloudEnabled: t && "boolean" == typeof t.cloudEnabled ? !!t.cloudEnabled : void 0,
            accounts: e.accounts
        }
    }

    function scheduleTimeToMinutes(e) {
        const t = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(e || ""));
        return t ? 60 * Number(t[1]) + Number(t[2]) : null
    }

    function ruleMatchesNow(e, t = new Date) {
        const n = scheduleTimeToMinutes(e.start),
            o = scheduleTimeToMinutes(e.end);
        if (!1 === e.enabled || null == n || null == o) return !1;
        const r = 60 * t.getHours() + t.getMinutes();
        if ("exception" === e.mode || e.date) {
            const i = [t.getFullYear(), String(t.getMonth() + 1).padStart(2, "0"), String(t.getDate()).padStart(2, "0")].join("-");
            if (i !== e.date) return !1;
            return n === o ? !0 : n < o ? r >= n && r < o : r >= n || r < o
        }
        const i = t.getDay(),
            a = Array.isArray(e.days) && e.days.includes(i);
        if (n === o) return a;
        if (n < o) return a && r >= n && r < o;
        const s = (i + 6) % 7;
        return a && r >= n || Array.isArray(e.days) && e.days.includes(s) && r < o
    }

    function scheduleRulePrioritySuffix(rule) {
        const priority = normalizeSchedulePriority(rule && rule.priority, 0);
        return priority > 0 ? " · P" + priority : ""
    }

    function scheduleRuleTimeSummary(rule) {
        if (!rule) return "";
        return String(rule.start || "09:00") + "-" + String(rule.end || "17:00") + scheduleRulePrioritySuffix(rule)
    }

    function collectMatchingScheduleRules(manager, date = new Date) {
        const source = normalizeManagerState(manager);
        const matches = [];
        const pushMatches = (rules, sourceName, sourceRank) => {
            if (!Array.isArray(rules)) return;
            rules.forEach((rule, index) => {
                if (rule && !1 !== rule.enabled && ruleMatchesNow(rule, date)) matches.push({ rule, index, sourceName, sourceRank });
            });
        };
        pushMatches(source.scheduleRules, "schedule", 0);
        pushMatches(source.scheduleExceptions, "exception", 1);
        matches.sort((a, b) => normalizeSchedulePriority(b.rule.priority, 0) - normalizeSchedulePriority(a.rule.priority, 0) || b.sourceRank - a.sourceRank || a.index - b.index);
        return matches
    }

    function selectHighestPriorityRule(rules, date) {
        const matches = [];
        if (!Array.isArray(rules)) return null;
        rules.forEach((rule, index) => {
            if (rule && !1 !== rule.enabled && ruleMatchesNow(rule, date)) matches.push({ rule, index });
        });
        if (!matches.length) return null;
        matches.sort((a, b) => normalizeSchedulePriority(b.rule.priority, 0) - normalizeSchedulePriority(a.rule.priority, 0) || a.index - b.index);
        return matches[0].rule
    }

    function evaluateManagerSchedule(e, t = new Date) {
        if (!e || !e.scheduleEnabled) return null;
        const matches = collectMatchingScheduleRules(e, t);
        return matches.length ? matches[0].rule : null
    }
    function enabledScheduleRules(e) {
        const t = normalizeManagerState(e);
        const n = [];
        if (Array.isArray(t.scheduleExceptions)) for (const e of t.scheduleExceptions) !1 !== e.enabled && n.push(e);
        if (Array.isArray(t.scheduleRules)) for (const e of t.scheduleRules) !1 !== e.enabled && n.push(e);
        return n
    }

    function hasEnabledScheduleRules(e) {
        return enabledScheduleRules(e).length > 0
    }

    function dateForScheduleDay(dayKey, date = new Date) {
        const t = new Date(date.getTime());
        const n = Number(dayKey);
        if (!Number.isInteger(n) || n < 0 || n > 6) return t;
        t.setDate(t.getDate() + (n - t.getDay()));
        return t
    }

    function selectedSchedulePreviewDescription(e = L.manager, t = new Date) {
        const n = D && D.selectedScheduleBlock || null;
        if (!n || !Number.isInteger(Number(n.dayKey))) return null;
        const o = dateForScheduleDay(Number(n.dayKey), t), r = describeManagerTarget(e, o);
        return r && r.rule ? r.description + " · selected " + scheduleDayLabel(Number(n.dayKey), !0) : null
    }

    function managerTargetDescriptionForUi(e = L.manager, t = new Date) {
        const n = describeManagerTarget(e, t), o = selectedSchedulePreviewDescription(e, t);
        return {
            description: n.description,
            actualDescription: n.description,
            previewDescription: o && o !== n.description ? o : null
        }
    }

    function scheduleDayNameFromRule(e, t = new Date) {
        if (!e) return "";
        if (e.date) return e.date;
        const n = Array.isArray(e.days) ? e.days : [];
        if (!n.length) return "";
        const o = t.getDay();
        const r = n.includes(o) ? o : n[0];
        return SCHEDULE_DAY_FULL_LABELS[r] || ""
    }

    function nextScheduleRuleSummary(e, t = new Date) {
        const n = normalizeManagerState(e);
        if (!n.scheduleEnabled) return "";
        const o = enabledScheduleRules(n);
        if (!o.length) return "no enabled rules";
        const matched = collectMatchingScheduleRules(n, t);
        const r = matched.length ? matched[0].rule : o.slice().sort((a, b) => normalizeSchedulePriority(b.priority, 0) - normalizeSchedulePriority(a.priority, 0) || String(a.id || "").localeCompare(String(b.id || "")))[0];
        const i = getStatusPreset(r.statusKey).label;
        const a = scheduleDayNameFromRule(r, t);
        return i + " " + (a ? a + " " : "") + scheduleRuleTimeSummary(r)
    }

    function scheduleStoredElsewhereSummary() {
        try {
            const registry = normalizeAccountRegistry(L.accountRegistry || null),
                activeKey = resolveAccountKeyForCurrentPage(registry, L.selectedAccountKey || registry.activeAccountKey),
                activeType = currentPageTeamsType(),
                candidates = Object.values(registry.accounts || {}).filter((entry => {
                    if (!entry || entry.key === activeKey) return false;
                    const rules = enabledScheduleRules(entry.manager);
                    return rules.length > 0
                }));
            if (!candidates.length) return "";
            candidates.sort(((a, b) => managerScheduleWeight(b.manager) - managerScheduleWeight(a.manager)));
            const entry = candidates[0],
                rules = enabledScheduleRules(entry.manager),
                type = entry.teamsType && "unknown" !== entry.teamsType ? entry.teamsType : "another",
                email = entry.email || accountKeyEmail(entry.key) || entry.key || "account",
                typeNote = activeType && "unknown" !== activeType && type !== activeType ? activeType + " tab is separate from " + type : "different account";
            return rules.length + " block" + (rules.length === 1 ? "" : "s") + " stored under " + email + " (" + typeNote + ")"
        } catch {
            return ""
        }
    }

    function isManualOverrideActive() {
        try {
            return !!(typeof L !== "undefined" && L && L.enabled)
        } catch {
            return !1
        }
    }

    function isPresenceRequestsEnabled() {
        try {
            const e = L && L.spoofConfig && L.spoofConfig.presence || null;
            return !e || !1 !== e.enabled
        } catch {
            return !0
        }
    }

    function isRuntimePolicyAllowed() {
        try {
            return !!(L && L.policyAllowed)
        } catch {
            return false
        }
    }

    function isPresenceRuntimeEnabled(e = L.manager) {
        const t = normalizeManagerState(e), n = evaluateManagerSchedule(t, new Date);
        return !!(isRuntimePolicyAllowed() && isPresenceRequestsEnabled() && (isManualOverrideActive() || !!n))
    }

    function resolveManagedStatus(e = L.manager, t = new Date, o = {}) {
        const n = normalizeManagerState(e),
            r = evaluateManagerSchedule(n, t),
            i = o && Object.prototype.hasOwnProperty.call(o, "manualOverride") ? !!o.manualOverride : isManualOverrideActive();
        if (i) {
            const e = getStatusPreset(n.manualStatusKey);
            return {
                manager: n,
                rule: null,
                suppressedRule: r || null,
                status: e,
                statusKey: e.key,
                label: e.label,
                source: "manual-override",
                active: !0,
                scheduleSuppressed: !!r
            }
        }
        if (r) {
            const e = getStatusPreset(r.statusKey);
            const sourceName = r.mode === "exception" || r.date ? "exception" : "schedule";
            return {
                manager: n,
                rule: r,
                suppressedRule: null,
                status: e,
                statusKey: e.key,
                label: e.label,
                source: sourceName,
                active: !0,
                scheduleSuppressed: !1
            }
        }
        const a = getStatusPreset(n.manualStatusKey);
        return {
            manager: n,
            rule: null,
            suppressedRule: null,
            status: a,
            statusKey: a.key,
            label: a.label,
            source: "idle",
            active: !1,
            scheduleSuppressed: !1
        }
    }

    function forceAvailabilityExpiry() {
        return "9999-12-31T23:59:59.9999999Z"
    }

    function managedStatusAllowsAvailableDuringCalls(e) {
        return !!(e && e.rule && e.rule.allowAvailableDuringCalls || e && e.manager && e.manager.allowAvailableDuringCalls)
    }

    function statusForceAvailabilityBody(statusKey) {
        const preset = getStatusPreset(statusKey), body = {
            availability: preset.availability || "Available"
        };
        if ("Offline" === body.availability) body.activity = "OffWork";
        return body
    }

    function buildManagedBodies(e, t, n, o, r) {
        const i = getStatusPreset(o),
            a = j(e || {}, {
                id: t,
                availability: "Available",
                activity: "Available",
                activityReporting: "Transport",
                deviceType: "Web"
            }),
            l = statusForceAvailabilityBody(o);
        a.availability = "Available";
        a.activity = "Available";
        a.activityReporting = "Transport";
        return {
            endpointBody: a,
            forceBody: l,
            activityBody: j(E(r) ? r : {}, {
                endpointId: t,
                isActive: !0
            }),
            preset: i
        }
    }

    function describeManagerTarget(e = L.manager, t = new Date) {
        const n = resolveManagedStatus(e, t),
            o = normalizeManagerState(e),
            r = hasEnabledScheduleRules(o),
            i = nextScheduleRuleSummary(o, t);
        const description = n.source === "manual-override" ? n.label + " · manual override" : n.rule ? n.label + " · " + (n.source === "exception" ? "exception" : "schedule") + " " + scheduleRuleTimeSummary(n.rule) : o.scheduleEnabled && r ? "Schedule waiting" + (i ? " · next " + i : "") : o.scheduleEnabled ? "Schedule on · no active block" : "Idle";
        return {
            ...n,
            description
        }
    }
    const L = {
            enabled: !1,
            policyKnown: INITIAL_POLICY_STATE.known,
            policyAllowed: INITIAL_POLICY_STATE.enabled,
            runtimePolicy: INITIAL_POLICY_STATE.meta || null,
            policyBlockReason: INITIAL_POLICY_STATE.reason || null,
            collapsed: x(k.collapsed, !1),
            activeTab: function(e, t) {
                try {
                    const n = localStorage.getItem(e);
                    return null == n ? t : n
                } catch {
                    return t
                }
            }(k.activeTab, "overview"),
            jsonScope: "all",
            spoofConfig: B(function(e, t) {
                try {
                    const n = localStorage.getItem(e);
                    if (null == n || "" === n) return t;
                    const o = JSON.parse(n);
                    return null == o ? t : o
                } catch {
                    return t
                }
            }(k.spoofConfig, null)),
            spoofConfigStored: function() {
                try { return localStorage.getItem(k.spoofConfig) !== null } catch { return false }
            }(),
            spoofConfigUpdatedAt: function() {
                try {
                    const value = String(localStorage.getItem(k.spoofConfigUpdatedAt) || "").trim();
                    return Number.isFinite(Date.parse(value)) ? value : null
                } catch { return null }
            }(),
            mode: "extension-pending",
            logs: [],
            consoleLogs: [],
            consoleSuppressedNoise: 0,
            consoleSuppressedNoiseReportedAt: 0,
            filterLogDedupe: Object.create(null),
            auth: null,
            endpointInfo: null,
            directBaseUrl: null,
            tokenMode: "cookie",
            selectedAuthMode: null,
            lastFrame: null,
            lastPresence: null,
            lastBackendPresence: null,
            lastCallState: null,
            lastCallApiState: null,
            lastRuntimeSyncAt: null,
            targetAccountEmail: null,
            targetAccountType: null,
            accountRegistry: loadAccountRegistry(),
            selectedAccountKey: loadSelectedAccountKey(),
            currentAccountKey: null,
            cloudEnabled: null,
            manager: loadManagerState(),
            lastEndpoint: null,
            lastReplay: null,
            lastTelemetryRewrite: null,
            lastTelemetryQuery: null,
            lastTelemetrySeenAt: null,
            lastCapturedPresenceHeaders: null,
            lastCapturedPresenceUrl: null,
            lastWorkerBootstrap: null,
            liveDiscoveryCache: null,
            lastActivitySpoof: null,
            gui: null
        },
        U = {
            nativeFetch: "function" == typeof window.fetch ? window.fetch.bind(window) : null,
            nativeSetInterval: "function" == typeof window.setInterval ? window.setInterval.bind(window) : null,
            nativeClearInterval: "function" == typeof window.clearInterval ? window.clearInterval.bind(window) : null,
            nativeSetTimeout: "function" == typeof window.setTimeout ? window.setTimeout.bind(window) : null,
            nativeClearTimeout: "function" == typeof window.clearTimeout ? window.clearTimeout.bind(window) : null,
            heartbeatTimer: null,
            refreshTimer: null,
            bootstrapTimer: null,
            callPollTimer: null,
            callPollLastNetworkAt: 0,
            callApiSyncLastAt: 0,
            forcePromise: null,
            lastFailedEndpointId: null,
            tokenInfo: null,
            skypeTokenInfo: null,
            authzUrl: null,
            lastGoodAuthMode: null,
            lastContextSignature: null,
            pendingForceReason: null,
            pendingForceTimer: null,
            scheduleTransitionTimer: null,
            lastScheduleForceSignature: null,
            lastScheduleForceAt: 0,
            presenceForceBackoffUntil: 0,
            presenceForceBackoffMs: 0,
            lastForceBackoffLogAt: 0,
            activityReportBackoffUntil: 0,
            lastActivityReportSignature: "",
            lastActivityReportAt: 0,
            lastDirectForceSignature: "",
            lastDirectForceAt: 0,
            lastDirectForceOk: false,
            lastDirectForceErrorSignature: "",
            lastDirectForceErrorAt: 0,
            lastDirectForceRateLimitedAt: 0,
            lastDirectForceStatusKey: "",
            presenceAuthFailureUntil: 0,
            presenceAuthFailureAt: 0,
            presenceAuthFailureReason: "",
            lastAuthFailureLogAt: 0,
            preferCookieAuthModeUntil: 0,
            lastEndpointRegisterSignature: "",
            lastEndpointRegisterAt: 0
        },
        D = {
            ready: !1,
            announcedReady: !1,
            pending: new Map,
            seq: 0,
            pingTimer: null,
            lastScheduleRulesSig: null,
            pendingScheduleRender: false,
            scheduleRenderHoldUntil: 0,
            localManagerDirtyUntil: 0,
            lastLocalManagerEditAt: null,
            lastRemoteBridgeStateSignature: "",
            lastRuntimeSyncSignature: "",
            lastRuntimeSyncAt: 0,
            selectedScheduleBlock: null,
            timelineZoomLevel: 2,
            timelineScrollLeftByDay: {},
            timelineSuppressAddUntil: 0,
            localScheduleOffUntil: 0,
            localManualOffUntil: 0,
            localUiConfigDirtyUntil: 0,
            scheduleDragGhost: null
        },
        R = {
            nativeSetInterval: "function" == typeof window.setInterval ? window.setInterval.bind(window) : null,
            nativeClearInterval: "function" == typeof window.clearInterval ? window.clearInterval.bind(window) : null,
            timer: null,
            runtimeActive: false,
            listeners: [],
            emitting: !1,
            replaying: !1
        },
        F = new Set(["mousemove", "pointermove", "mouseover", "mouseenter", "focus", "focusin", "visibilitychange"]),
        H = Object.freeze({
            userAgent: "string" == typeof navigator.userAgent ? navigator.userAgent : null,
            appVersion: "string" == typeof navigator.appVersion ? navigator.appVersion : null,
            platform: "string" == typeof navigator.platform ? navigator.platform : null,
            vendor: "string" == typeof navigator.vendor ? navigator.vendor : null,
            language: "string" == typeof navigator.language ? navigator.language : null,
            languages: Array.isArray(navigator.languages) ? Array.from(navigator.languages) : null,
            hardwareConcurrency: "number" == typeof navigator.hardwareConcurrency ? navigator.hardwareConcurrency : null,
            deviceMemory: "number" == typeof navigator.deviceMemory ? navigator.deviceMemory : null,
            maxTouchPoints: "number" == typeof navigator.maxTouchPoints ? navigator.maxTouchPoints : null
        }),
        J = Object.freeze({
            hiddenDescriptor: window.Document && Object.getOwnPropertyDescriptor(window.Document.prototype, "hidden") || Object.getOwnPropertyDescriptor(document, "hidden") || null,
            visibilityStateDescriptor: window.Document && Object.getOwnPropertyDescriptor(window.Document.prototype, "visibilityState") || Object.getOwnPropertyDescriptor(document, "visibilityState") || null,
            webkitHiddenDescriptor: window.Document && Object.getOwnPropertyDescriptor(window.Document.prototype, "webkitHidden") || Object.getOwnPropertyDescriptor(document, "webkitHidden") || null,
            msHiddenDescriptor: window.Document && Object.getOwnPropertyDescriptor(window.Document.prototype, "msHidden") || Object.getOwnPropertyDescriptor(document, "msHidden") || null,
            hasFocus: "function" == typeof document.hasFocus ? document.hasFocus.bind(document) : null
        });

    function W(e, t, n) {
        try {
            if (t) {
                if ("function" == typeof t.get) return t.get.call(e);
                if (Object.prototype.hasOwnProperty.call(t, "value")) return t.value
            }
        } catch {}
        return n
    }

    function z() {
        return Date.now()
    }

    function V(e) {
        if (!e) return "—";
        try {
            return new Date(e).toLocaleTimeString([], {
                hour12: !1,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })
        } catch {
            return String(e)
        }
    }

    function Y(e, t = 160) {
        const n = String(null == e ? "" : e);
        return n.length > t ? n.slice(0, t - 1) + "…" : n
    }

    function X(e) {
        try {
            return JSON.parse(JSON.stringify(e))
        } catch {
            return Y(e, 220)
        }
    }

    function compactLogValue(value, depth = 0, seen) {
        if (null == value) return value;
        const type = typeof value;
        if ("string" === type) return Y(value, depth ? 180 : 360);
        if ("number" === type || "boolean" === type || "bigint" === type) return value;
        if ("function" === type || "symbol" === type || "undefined" === type) return String(value);
        seen || (seen = new WeakSet);
        if (value && "object" === typeof value) {
            if (seen.has(value)) return "[circular]";
            seen.add(value);
            if (depth >= 2) return Array.isArray(value) ? "[array:" + value.length + "]" : "[object]";
            if (Array.isArray(value)) return value.slice(0, 4).map((entry => compactLogValue(entry, depth + 1, seen)));
            const out = {};
            let count = 0;
            for (const [key, entry] of Object.entries(value)) {
                if (++count > 8) {
                    out.__truncated = true;
                    break;
                }
                out[key] = compactLogValue(entry, depth + 1, seen);
            }
            return out;
        }
        return Y(value, 180)
    }

    function compactLogExtra(value) {
        try {
            return compactLogValue(value)
        } catch {
            return Y(value, 300)
        }
    }

    function pruneTimestampMap(map, maxEntries = 96, ttlMs = 300000) {
        try {
            if (!map || "object" != typeof map) return;
            const now = z();
            const entries = Object.entries(map).filter(([, at]) => Number.isFinite(Number(at)));
            for (const [key, at] of entries) if (now - Number(at) > ttlMs) delete map[key];
            const fresh = Object.entries(map).filter(([, at]) => Number.isFinite(Number(at))).sort(((a, b) => Number(b[1]) - Number(a[1])));
            for (const [key] of fresh.slice(maxEntries)) delete map[key]
        } catch {}
    }

    function isHeavyDebugRetentionEnabled() {
        try {
            return /^(?:1|true|yes|on)$/i.test(String(localStorage.getItem("__teams_helper_debug_logs__") || ""))
        } catch {
            return !1
        }
    }

    function pageLogLimit() {
        return isHeavyDebugRetentionEnabled() ? 120 : 48
    }

    function consoleLogLimit() {
        return isHeavyDebugRetentionEnabled() ? 80 : 0
    }

    function trimArrayInPlace(arr, max) {
        if (!Array.isArray(arr)) return;
        const limit = Math.max(0, Number(max) || 0);
        if (!limit) {
            arr.length = 0;
            return;
        }
        arr.length > limit && arr.splice(0, arr.length - limit)
    }

    function shouldRetainPageLog(kind) {
        if (isHeavyDebugRetentionEnabled()) return !0;
        return /^(?:init|gui|license|runtime|bridge|presence|direct|error)$/i.test(String(kind || ""))
    }

    function q(e, t, n) {
        try {
            if ("filter" === e) {
                const o = String(t || "") + "|" + String(n && n.msg || "");
                const r = z();
                L.filterLogDedupe || (L.filterLogDedupe = Object.create(null));
                if (L.filterLogDedupe[o] && r - L.filterLogDedupe[o] < 15000) return;
                L.filterLogDedupe[o] = r;
                pruneTimestampMap(L.filterLogDedupe, 48, 180000);
            }
        } catch {}
        if (shouldRetainPageLog(e)) L.logs.push({
            at: z(),
            kind: e,
            msg: Y(t, 180),
            extra: null == n ? null : compactLogExtra(n)
        });
        try {
            if (/^error$/i.test(String(e || "")) && window.console && "function" == typeof window.console.info) window.console.info("[Teams Helper]", e, Y(t, 180), compactLogExtra(n || ""))
        } catch {}
        trimArrayInPlace(L.logs, pageLogLimit());
        D && D.logCount && (D.logCount.textContent = String((L.logs || []).length));
        L.activeTab && "logs" === L.activeTab && scheduleLightUiRefresh("log");
    }

    function consoleArgToText(e) {
        if (null == e) return String(e);
        if ("string" == typeof e) return e;
        if ("number" == typeof e || "boolean" == typeof e || "bigint" == typeof e) return String(e);
        if (e && "string" == typeof e.message) return e.message;
        try {
            return JSON.stringify(e)
        } catch {
            try { return String(e) } catch { return "[unprintable]" }
        }
    }

    function isRoutineSuppressedConsole(e) {
        try {
            const t = String(e || "");
            return !t || /\[ExpLoader\]/i.test(t) || /ExperienceLoader:\s+OCDI redirect:\s+Not redirecting - not enabled/i.test(t) || /\[Auth\]:\s+(?:auth_cache initialized|authTelemetryProvider initialized)\b/i.test(t) || /\[Telemetry\]\[[^\]]+\]\[auth_web_initialization\]\s+\[start\]/i.test(t) || /\[floodgate\]\s+Floodgate module loaded/i.test(t) || /Unhandled error\/rejection\s+\{\"isTrusted\":true\}/i.test(t) || /browser\.events\.data\.microsoft\.com\/OneCollector\/1\.0/i.test(t) || ECS_TELEMETRY_NOISE.test(t) || ZUSTAND_NOISE.test(t) || AUTH_NOISE.test(t)
        } catch {
            return !1
        }
    }

    function noteSuppressedConsoleNoise() {
        try {
            L.consoleSuppressedNoise = (L.consoleSuppressedNoise || 0) + 1;
            L.consoleSuppressedNoiseReportedAt = z();
        } catch {}
    }

    function recordConsole(e, t, n) {
        try {
            if (!L || !Array.isArray(L.consoleLogs)) return;
            const level = String(e || "log");
            const debug = isHeavyDebugRetentionEnabled();
            const limit = consoleLogLimit();
            if (!debug && !/^(?:error|warn)$/i.test(level)) return;
            const o = Array.from(t || []).slice(0, 3),
                r = o.map(consoleArgToText).join(" ");
            if ((n || !debug) && isRoutineSuppressedConsole(r)) return void noteSuppressedConsoleNoise();
            if (!limit) return;
            L.consoleLogs.push({
                at: z(),
                level,
                msg: Y(r, debug ? 400 : 180),
                suppressed: !!n
            });
            trimArrayInPlace(L.consoleLogs, limit);
            L.activeTab && "logs" === L.activeTab && renderLogsPanel();
        } catch {}
    }

    function formatLogLine(e) {
        if (!e || "object" != typeof e) return "";
        const t = e.at ? V(e.at) : "--:--:--",
            n = e.kind || e.level || "log",
            o = e.suppressed ? " suppressed" : "",
            r = e.msg || "";
        return `[${t}] ${n}${o}: ${r}`
    }

    function renderLogsPanel() {
        try {
            if (!L || !D || !D.logViewer && !D.consoleViewer) return;
            if (L.activeTab && "logs" !== L.activeTab) return;
            if (D.logViewer && document.activeElement !== D.logViewer) {
                const e = (L.logs || []).map(formatLogLine).join("\n") || "No extension log entries yet.";
                D.logViewer.value !== e && (D.logViewer.value = e)
            }
            if (D.consoleViewer && document.activeElement !== D.consoleViewer) {
                const e = (L.consoleLogs || []).map(formatLogLine).join("\n") || "No console entries captured yet.";
                D.consoleViewer.value !== e && (D.consoleViewer.value = e)
            }
        } catch {}
    }

    function scheduleLightUiRefresh(reason = "ui") {
        try {
            if (!D || !L || !L.gui) return false;
            if (D.lightUiRefreshTimer) return true;
            D.lightUiRefreshTimer = window.setTimeout(() => {
                D.lightUiRefreshTimer = null;
                try {
                    D.logCount && (D.logCount.textContent = String((L.logs || []).length));
                    D.ruleCount && (D.ruleCount.textContent = String((L.manager && L.manager.scheduleRules || []).length));
                    if (L.activeTab && "logs" === L.activeTab) renderLogsPanel();
                } catch {}
            }, 50);
            return true;
        } catch {
            return false;
        }
    }

    function scheduleFullUiRefresh(reason = "ui", options = {}) {
        try {
            if (!D || !L || !L.gui) return false;
            D.pendingFullUiOptions = Object.assign({}, D.pendingFullUiOptions || {}, options || {});
            if (D.fullUiRefreshTimer) return true;
            D.fullUiRefreshTimer = window.setTimeout(() => {
                const pending = D.pendingFullUiOptions || {};
                D.fullUiRefreshTimer = null;
                D.pendingFullUiOptions = null;
                try {
                    if (pending.renderRules && "function" == typeof renderManagerRules) renderManagerRules();
                } catch {}
                try {
                    if ("function" == typeof ct) ct();
                } catch {}
            }, options && Number.isFinite(options.delayMs) ? Math.max(0, Number(options.delayMs)) : 50);
            return true;
        } catch {
            return false;
        }
    }

    function scheduleRuntimeSync(reason = "manager-update", delayMs = 250) {
        try {
            if (!isRuntimePolicyAllowed()) return false;
            D.pendingRuntimeSyncReason = reason || D.pendingRuntimeSyncReason || "manager-update";
            if (D.runtimeSyncTimer) window.clearTimeout(D.runtimeSyncTimer);
            D.runtimeSyncTimer = window.setTimeout(() => {
                const nextReason = D.pendingRuntimeSyncReason || reason || "manager-update";
                D.runtimeSyncTimer = null;
                D.pendingRuntimeSyncReason = null;
                try { oe(nextReason); } catch (err) { q("error", "Runtime sync failed", { reason: nextReason, msg: Y(err && err.message || err, 180) }); }
            }, Math.max(150, Number(delayMs) || 250));
            return true;
        } catch {
            return false;
        }
    }

    function exportLogs() {
        try {
            const e = {
                    createdAt: new Date().toISOString(),
                    pageUrl: location.href,
                    enabled: !!L.enabled,
                    target: describeManagerTarget(L.manager),
                    account: { email: L.targetAccountEmail || null, type: L.targetAccountType || null, selectedAccountKey: L.selectedAccountKey || null },
                    endpointInfo: O(L.endpointInfo),
                    lastPresence: O(L.lastPresence),
                    lastBackendPresence: O(L.lastBackendPresence),
                    lastReplay: O(L.lastReplay),
                    logs: O(L.logs || []),
                    console: O(L.consoleLogs || []),
                    spoofConfig: O(L.spoofConfig)
                },
                t = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }),
                n = URL.createObjectURL(t),
                o = Oe("a", { attrs: { href: n, download: `teams-helper-logs-${new Date().toISOString().replace(/[:.]/g, "-")}.json` } });
            document.documentElement.appendChild(o);
            o.click();
            o.remove();
            setTimeout(() => URL.revokeObjectURL(n), 1e3);
            q("gui", "Logs exported")
        } catch (e) {
            q("error", "Log export failed", { msg: Y(e && e.message || e, 180) })
        }
    }

    function copyLogs() {
        try {
            const text = D && D.logViewer ? String(D.logViewer.value || "") : (L.logs || []).map(formatLogLine).join("\n");
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => q("gui", "Logs copied")).catch(() => q("warn", "Log copy failed"));
            } else if (D && D.logViewer) {
                D.logViewer.focus();
                D.logViewer.select();
                document.execCommand && document.execCommand("copy");
                q("gui", "Logs copied");
            }
        } catch (e) {
            q("error", "Log copy failed", { msg: Y(e && e.message || e, 180) })
        }
    }

    function G(e) {
        if ("string" != typeof e) return null;
        const t = e.trim();
        if (!t) return null;
        const n = t[0], o = t[t.length - 1], r = "{" === n && "}" === o || "[" === n && "]" === o || '"' === n && '"' === o || /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)$/.test(t);
        if (!r) return null;
        try {
            return JSON.parse(t)
        } catch {
            return null
        }
    }

    function $(e) {
        if (null == e) return "";
        if ("string" == typeof e) return e;
        if ("object" == typeof e) {
            if ("string" == typeof e.msg) return e.msg;
            try {
                return JSON.stringify(e)
            } catch {}
        }
        try {
            return String(e)
        } catch {
            return ""
        }
    }

    function K(e) {
        if (null == e) return "";
        if ("string" == typeof e) return e;
        if ("object" == typeof e) {
            const t = [];
            if ("string" == typeof e.stack && t.push(e.stack), "string" == typeof e.filename && t.push(e.filename), "string" == typeof e.url && t.push(e.url), t.length) return t.join("\n");
            try {
                return JSON.stringify(e)
            } catch {}
        }
        try {
            return String(e)
        } catch {
            return ""
        }
    }

    function Q(e, a) {
        const s = String(e || ""),
            l = String(a || "");
        return !(!/precompiled-web-worker/i.test(s + "\n" + l) && !/worker\.js/i.test(l) || !t.test(s) && !n.test(s) && !o.test(s) && !r.test(s) && !i.test(s))
    }

    function Z(e, t = 8, n = 4) {
        const o = String(e || "");
        return o ? o.length <= t + n + 1 ? o : o.slice(0, t) + "…" + o.slice(-n) : "—"
    }

    function remoteBridgeStateSignature(e) {
        if (!e || "object" != typeof e) return "";
        try {
            const stable = {
                enabled: !!e.enabled,
                runtimeEnabled: !!e.runtimeEnabled,
                manualOverrideEnabled: !!e.manualOverrideEnabled,
                cloudEnabled: !!e.cloudEnabled,
                targetAccountEmail: e.targetAccountEmail || null,
                targetAccountType: e.targetAccountType || null,
                selectedAccountKey: e.selectedAccountKey || null,
                accountKey: e.accountKey || null,
                baseUrl: e.baseUrl || null,
                endpointId: e.endpointId || null,
                manager: e.manager || null,
                accountRegistry: e.accountRegistry || null,
                uiConfig: E(e.uiConfig) ? B(e.uiConfig) : null,
                uiConfigUpdatedAt: e.uiConfigUpdatedAt || null
            };
            return JSON.stringify(stable, ((key, value) => /^(clientClockAt|clientLocalMinutes|localMinutes)$/i.test(key) ? void 0 : value))
        } catch {
            return ""
        }
    }

    function isRemoteManualOverrideEnableReason(reason) {
        return /(?:manual-override-enabled|manual-override-active|page-manual-pipeline-manual-override-enabled)/i.test(String(reason || ""))
    }

    function isRemoteManualOverrideDisableReason(reason) {
        return /(?:manual-override-disabled|manual-off|manual-override-off)/i.test(String(reason || ""))
    }

    function shouldIgnoreStaleRemoteManualOff(state, account) {
        if (!L || !L.enabled) return false;
        const reason = state && state.reason || "";
        if (isRemoteManualOverrideDisableReason(reason)) return false;
        if (isRemoteManualOverrideEnableReason(reason)) return false;
        const topLevelOff = !!(state && (("boolean" == typeof state.manualOverrideEnabled && !state.manualOverrideEnabled) || ("boolean" == typeof state.enabled && !state.enabled)));
        const accountOff = !!(account && "boolean" == typeof account.enabled && !account.enabled);
        if (!(topLevelOff || accountOff)) return false;
        const localRegistry = normalizeAccountRegistry(L.accountRegistry || null),
            localKey = resolveAccountKeyForCurrentPage(localRegistry, L.selectedAccountKey || localRegistry.activeAccountKey),
            localAccount = localKey ? localRegistry.accounts[localKey] || null : null,
            localMs = accountUpdatedAtValue(localAccount),
            remoteMs = accountUpdatedAtValue(account);
        if (remoteMs && (!localMs || remoteMs > localMs + 1000)) return false;
        if (/^cloud-/i.test(String(reason || "")) && (!remoteMs || !localMs || remoteMs + 1000 >= localMs)) return false;
        return true
    }

    function ee(e, t) {
        try {
            return window.postMessage(Object.assign({
                source: S,
                direction: "to-extension",
                type: e
            }, t || {}), "*"), !0
        } catch {
            return !1
        }
    }

    function isRuntimeMutationReason(reason) {
        const value = String(reason || "").toLowerCase();
        return !!value && (/^manager-/.test(value) || /^(enabled|disabled|toggle-enabled|gui-account-select|account-select|popup-cloud-toggle|detected-account|manual|presence-force|gui-presence-force)/.test(value))
    }

    function isCloudStatePreservingTimelineReason(reason) {
        const value = String(reason || "").toLowerCase();
        return !!value && (/^manager-/.test(value) || /(?:manual|presence|schedule|timeline|rule-add|rule-delete|rule-update|rule-drag|rule-resize)/.test(value)) && !/^popup-cloud-toggle/.test(value)
    }

    function runtimeSyncStableSignature(payload) {
        try {
            const stable = {
                enabled: !!(payload && payload.enabled),
                runtimeEnabled: !!(payload && payload.runtimeEnabled),
                manualOverrideEnabled: !!(payload && payload.manualOverrideEnabled),
                baseUrl: payload && payload.baseUrl || null,
                endpointId: payload && payload.endpointId || null,
                cloudEnabled: payload && payload.cloudEnabled,
                selectedAccountKey: payload && payload.selectedAccountKey || null,
                accountKey: payload && payload.accountKey || null,
                targetAccountEmail: payload && payload.targetAccountEmail || null,
                targetAccountType: payload && payload.targetAccountType || null,
                targetStatusKey: payload && payload.targetStatusKey || null,
                manager: payload && payload.manager || null,
                accountRegistry: payload && payload.accountRegistry || null,
                uiConfig: payload && E(payload.uiConfig) ? B(payload.uiConfig) : null,
                uiConfigUpdatedAt: payload && payload.uiConfigUpdatedAt || null,
                lastCallState: payload && payload.lastCallState || null,
                lastCallApiState: payload && payload.lastCallApiState || null
            };
            return JSON.stringify(stable, ((key, value) => /^(at|reason|headers|endpointBody|forceBody|activityBody|clientClockAt|clientLocalMinutes|localMinutes)$/i.test(key) ? void 0 : value))
        } catch {
            return ""
        }
    }

    function shouldPostRuntimeSync(payload, reason) {
        const now = z(), mutation = isRuntimeMutationReason(reason), signature = runtimeSyncStableSignature(payload);
        if (mutation) {
            D.lastRuntimeSyncSignature = signature || D.lastRuntimeSyncSignature || "";
            D.lastRuntimeSyncAt = now;
            return true
        }
        if (signature && signature === D.lastRuntimeSyncSignature && now - Number(D.lastRuntimeSyncAt || 0) < 120000) return false;
        if (!signature && now - Number(D.lastRuntimeSyncAt || 0) < 30000) return false;
        D.lastRuntimeSyncSignature = signature || D.lastRuntimeSyncSignature || "";
        D.lastRuntimeSyncAt = now;
        return true
    }

    function te(e) {
        D.ready = !0, L.mode = "extension", D.pingTimer && U.nativeClearTimeout && (U.nativeClearTimeout(D.pingTimer), D.pingTimer = null), D.announcedReady || (D.announcedReady = !0, q("bridge", "Extension bridge ready", e || null)), ct(), oe("bridge-ready"), resetScheduleTransitionTimer("bridge-ready")
    }

    function ne(e = 0) {
        if (D.ready) return;
        const t = () => {
            D.pingTimer = null, ee("ping", {
                at: z()
            }), !D.ready && U.nativeSetTimeout && (D.pingTimer = U.nativeSetTimeout(() => ne(0), 1500))
        };
        if (e > 0 && U.nativeSetTimeout) return D.pingTimer && U.nativeClearTimeout && U.nativeClearTimeout(D.pingTimer), void(D.pingTimer = U.nativeSetTimeout(t, e));
        t()
    }

    function buildRuntimeSyncPayload(e) {
        const t = L.endpointInfo || null,
            n = t && t.endpointId || null,
            p = isPresenceRequestsEnabled(),
            scheduledRule = evaluateManagerSchedule(normalizeManagerState(L.manager), new Date),
            o = !!(L.enabled && p),
            y = !!(p && (L.enabled || !!scheduledRule)),
            m = resolveManagedStatus(L.manager, new Date, { manualOverride: !!L.enabled }),
            b = buildManagedBodies(ot({
                id: n,
                availability: "Available",
                activity: "Available",
                activityReporting: "Transport",
                deviceType: "Web"
            }, "endpointBody"), n, ot({
                availability: m.status.availability,
                activity: m.status.activity
            }, "forceBody"), m.statusKey, ot({
                endpointId: n,
                isActive: !0
            }, "activityBody")),
            r = b.endpointBody,
            i = b.forceBody,
            a = b.activityBody,
            preserveCloudState = isCloudStatePreservingTimelineReason(e),
            s = ensureDetectedAccountRegistered(!1),
            l = persistSelectedAccountState({ preserveCloudState }),
            c = buildRuntimeAccountRegistryPayload();
        return {
            enabled: o,
            runtimeEnabled: y,
            manualOverrideEnabled: !!L.enabled,
            reason: e || null,
            at: z(),
            pageUrl: location.href,
            baseUrl: L.directBaseUrl || me(),
            endpointId: n,
            headers: ke(n),
            endpointBody: r,
            forceBody: i,
            activityBody: a,
            manager: isRuntimeMutationReason(e) ? attachScheduleClientClock(L.manager) : maybeAttachScheduleClientClock(L.manager, new Date, 900000),
            cloudEnabled: l && "boolean" == typeof l.cloudEnabled ? !!l.cloudEnabled : void 0,
            accountRegistry: c,
            selectedAccountKey: L.selectedAccountKey || c.activeAccountKey,
            accountKey: s && s.key || L.currentAccountKey || null,
            teamsAccountEmail: l && l.email || (e => (e && (L.targetAccountEmail = e), e))(extractTeamsAccountEmail()),
            targetAccountEmail: l && l.email || L.targetAccountEmail || null,
            targetAccountType: l && l.teamsType || L.targetAccountType || normalizeTeamsAccountType(L.directBaseUrl || location.href),
            targetStatusKey: m.statusKey,
            userMri: t && t.loginUserMri ? String(t.loginUserMri) : U.skypeTokenInfo && U.skypeTokenInfo.skypeId ? String(U.skypeTokenInfo.skypeId) : null,
            uiConfig: O(L.spoofConfig),
            uiConfigUpdatedAt: L.spoofConfigUpdatedAt || null,
            lastCallState: O(L.lastCallState || null),
            lastCallApiState: O(L.lastCallApiState || null)
        }
    }

    function oe(e) {
        if (!isRuntimePolicyAllowed()) return false;
        const t = buildRuntimeSyncPayload(e);
        if (t) D.lastRuntimeSyncPayload = t;
        if (!t || !shouldPostRuntimeSync(t, e)) return false;
        L.lastRuntimeSyncAt = t.at || z();
        scheduleLightUiRefresh("runtime-sync");
        return ee("keepAliveUpdate", {
            config: t
        })
    }

    
function re(e) {
        return c.test(String(e || ""))
    }

    function ie(e) {
        return !(!e || "object" != typeof e || !0 !== e.isTrusted)
    }

    function ae() {
        const e = [];
        try {
            for (let t = 0; t < localStorage.length; t += 1) {
                const n = localStorage.key(t);
                n && e.push([n, localStorage.getItem(n)])
            }
        } catch {}
        return e
    }

    const LIVE_WORKER_FIELDS = Object.freeze(["experienceName", "ring", "environment", "sessionId", "platformId", "buildVersion", "localeCode", "workerId", "publicPath", "deviceId", "isOcdi", "isPwa", "shouldFetchWorkerChunksBeforeImportScripts", "useDiagnosticsServiceV2", "turboCohort", "enableLazyLoadedWorker", "enableMinimalSchemaWorker", "workerCreationTime", "preECSConsoleLogLevel"]);
    const LIVE_TELEMETRY_KEYS = Object.freeze(["AppInfo_BootType", "AppInfo_ClientType", "AppInfo_ExperienceName", "AppInfo_PlatformId", "AppInfo_Version", "AppInfo_Environment", "AppInfo_ServiceWorkerState", "AppInfo_UxStatus", "DeviceInfo_Id", "environment", "loaderNetworkPingState", "navigatorNetworkState", "Session_Id", "Session_TelemetryContext", "userAgent", "UserInfo_Ring", "UserInfo_Id", "UserInfo_TenantId", "UserInfo_TelemetryRegion"]);
    const LIVE_PRESENCE_HEADER_KEYS = Object.freeze(["authorization", "x-skypetoken", "ms-teams-authz-type", "claimschallengecapable", "x-ms-endpoint-id", "x-ms-session-id", "x-ms-client-caller", "x-ms-client-consumer-type", "x-ms-client-type", "x-ms-client-version", "x-ms-client-user-agent", "x-ms-request-id", "x-ms-object-id", "behavioroverride"]);

    function hasLiveValue(e) {
        return null != e && "" !== e
    }

    function putLiveValue(e, t, n) {
        hasLiveValue(n) && !hasLiveValue(e[t]) && (e[t] = O(n))
    }

    function normalizeHeaderMap(e) {
        const t = Object.create(null);
        if (!e) return t;
        try {
            if ("function" == typeof e.forEach) {
                e.forEach((e, n) => {
                    n && hasLiveValue(e) && (t[String(n).toLowerCase()] = String(e))
                });
                return t
            }
        } catch {}
        if (Array.isArray(e)) {
            for (const n of e || []) {
                if (Array.isArray(n) && n.length >= 2) t[String(n[0]).toLowerCase()] = String(n[1]);
                else if (n && n.name) t[String(n.name).toLowerCase()] = String(n.value || "")
            }
            return t
        }
        if ("object" == typeof e) try {
            for (const [n, o] of Object.entries(e)) hasLiveValue(o) && (t[String(n).toLowerCase()] = String(o))
        } catch {}
        return t
    }

    function headersFromRequestLike(e, t) {
        const n = Object.create(null), o = r => {
            const e = normalizeHeaderMap(r);
            for (const [t, o] of Object.entries(e)) n[t] = o
        };
        try { e && e.headers && o(e.headers) } catch {}
        try { t && t.headers && o(t.headers) } catch {}
        return n
    }

    function requestUrlOf(e) {
        try {
            return "string" == typeof e ? e : e && "string" == typeof e.url ? e.url : e instanceof URL ? e.toString() : String(e || "")
        } catch {
            return ""
        }
    }

    function parseBodyObject(e) {
        if (!e) return null;
        if ("string" == typeof e) return G(e) || null;
        if (e && "object" == typeof e) {
            if (e instanceof URLSearchParams) {
                const t = {};
                try { e.forEach((e, n) => t[n] = e) } catch {}
                return t
            }
            if (e instanceof Blob || e instanceof ArrayBuffer || ArrayBuffer.isView(e)) return null;
            return e
        }
        return null
    }

    function rememberTelemetryQueryFromUrl(e, t = "network") {
        if (!e) return;
        let n = null;
        try { n = new URL(String(e), location.href) } catch { return }
        const o = Object.create(null);
        for (const e of LIVE_TELEMETRY_KEYS) n.searchParams.has(e) && (o[e] = n.searchParams.get(e));
        if (!Object.keys(o).length) return;
        const sig = JSON.stringify(o);
        const now = z();
        if (sig === L.lastTelemetryQuerySignature && now - Number(L.lastTelemetrySeenAt || 0) < 300000) return;
        L.lastTelemetryQuerySignature = sig;
        L.lastTelemetryQuery = j(L.lastTelemetryQuery || {}, o);
        L.lastTelemetrySeenAt = now;
        L.liveDiscoveryCache = null;
        q("telemetry", "Captured telemetry query fields", { source: t, fields: Object.keys(o).length });
        ct()
    }

    function queueLivePresenceCaptureForBackground(e, t, n, o, r = "network") {
        try {
            const i = String(e || ""), a = String(t || "GET").toUpperCase();
            if (!i || !/(presence|endpoint|forceavailability|reportmyactivity|\/ups\/|\/v1\/me\/)/i.test(i)) return !1;
            const s = normalizeHeaderMap(n), l = parseBodyObject(o);
            let c = null;
            try {
                const e = l == null ? "" : JSON.stringify(l);
                e && e.length <= 8192 && (c = l)
            } catch {}
            const u = { url: i, method: a, headers: s, body: c, source: r, pageUrl: location.href, at: z(), endpointId: s["x-ms-endpoint-id"] || null };
            const d = JSON.stringify({ url: u.url, method: u.method, endpointId: u.endpointId || null, headers: s });
            const m = z();
            if (d === L.lastBackgroundPresenceCaptureSignature && m - Number(L.lastBackgroundPresenceCaptureAt || 0) < 10000) return !1;
            L.lastBackgroundPresenceCaptureSignature = d;
            L.lastBackgroundPresenceCaptureAt = m;
            ee("presenceCaptureUpdate", { capture: u });
            return !0
        } catch {
            return !1
        }
    }

    function rememberPresenceRequest(e, t, n = null, o = "network", r = "GET") {
        const i = String(e || ""), a = normalizeHeaderMap(t), s = Object.create(null);
        for (const e of LIVE_PRESENCE_HEADER_KEYS) hasLiveValue(a[e]) && (s[e] = a[e]);
        const l = parseBodyObject(n);
        if (l && "object" == typeof l) {
            hasLiveValue(l.endpointId) && (s["x-ms-endpoint-id"] = String(l.endpointId));
            hasLiveValue(l.id) && (s["x-ms-endpoint-id"] = String(l.id))
        }
        const c = i.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        c && !hasLiveValue(s["x-ms-endpoint-id"]) && (s["x-ms-endpoint-id"] = c[0]);
        if (!Object.keys(s).length || !/(presence|endpoint|forceavailability|reportmyactivity|\/ups\/|\/v1\/me\/)/i.test(i + "\n" + Object.keys(a).join("\n"))) return;
        queueLivePresenceCaptureForBackground(i, r, s, l || n, o);
        const sig = JSON.stringify({ url: i, headers: s });
        const now = z();
        if (sig === L.lastCapturedPresenceSignature && now - Number(L.lastCapturedPresenceAt || 0) < 300000) return;
        L.lastCapturedPresenceSignature = sig;
        L.lastCapturedPresenceAt = now;
        L.lastCapturedPresenceHeaders = j(L.lastCapturedPresenceHeaders || {}, s);
        L.lastCapturedPresenceUrl = i || null;
        L.liveDiscoveryCache = null;
        q("presence", "Captured live presence request headers", { source: o, forwarded: true, headers: Object.keys(s).filter(e => !/authorization|skypetoken/i.test(e)) });
        ct()
    }

    let pagePacketTraceSequence = 0;
    function pagePacketTraceUrlInfo(value) {
        try {
            const parsed = new URL(requestUrlOf(value), location.href);
            const hashParams = new URLSearchParams(String(parsed.hash || "").replace(/^#/, ""));
            const authError = String(parsed.searchParams.get("error") || hashParams.get("error") || "").slice(0, 80) || null;
            const authDescription = String(parsed.searchParams.get("error_description") || hashParams.get("error_description") || "");
            const aadstsMatch = authDescription.match(/AADSTS\d+/i);
            return { url: parsed.origin + parsed.pathname, origin: parsed.origin, path: parsed.pathname, queryKeys: Array.from(new Set(Array.from(parsed.searchParams.keys()))).slice(0, 40), authError, aadsts: aadstsMatch ? aadstsMatch[0].toUpperCase() : null }
        } catch { return { url: String(value || "").split(/[?#]/, 1)[0], origin: null, path: null, queryKeys: [], authError: null, aadsts: null } }
    }
    function pagePacketTraceHeaderNames(e, t) {
        try { return Object.keys(normalizeHeaderMap(headersFromRequestLike(e, t))).map(name => String(name).toLowerCase()).sort().slice(0, 80) } catch { return [] }
    }
    function pagePacketTraceBodyMeta(body) {
        if (body == null) return null;
        try {
            if (typeof body === "string") return { type: "string", bytes: (new TextEncoder).encode(body).byteLength };
            if (body instanceof URLSearchParams) return { type: "url-search-params", keys: Array.from(new Set(Array.from(body.keys()))).slice(0, 40) };
            if (typeof FormData !== "undefined" && body instanceof FormData) return { type: "form-data", keys: Array.from(new Set(Array.from(body.keys()))).slice(0, 40) };
            if (typeof Blob !== "undefined" && body instanceof Blob) return { type: "blob", bytes: Number(body.size || 0), mime: String(body.type || "") || null };
            if (body instanceof ArrayBuffer) return { type: "array-buffer", bytes: Number(body.byteLength || 0) };
            if (ArrayBuffer.isView(body)) return { type: "typed-array", bytes: Number(body.byteLength || 0) };
            return { type: typeof body }
        } catch { return { type: typeof body } }
    }
    function pagePacketTraceCallsite() {
        try { return String((new Error).stack || "").split("\n").slice(2).map(line => line.trim()).filter(line => line && !/pagePacketTrace|observeNetworkRequest|window\.fetch|XMLHttpRequest\.send/i.test(line)).slice(0, 5) } catch { return [] }
    }
    function pagePacketTraceEnabled() {
        return globalThis.__TEAMS_HELPER_VERBOSE_PACKET_TRACE__ === true
    }
    function pagePacketTraceEmit(phase, detail, level = "info") {
        if (!pagePacketTraceEnabled()) return;
        try {
            const input = detail && typeof detail === "object" ? detail : {};
            const info = pagePacketTraceUrlInfo(input.url || input.finalUrl || "internal://teams-page");
            const phaseName = String(phase || input.phase || "event");
            const method = String(input.method || "EVENT").toUpperCase();
            let label = String(input.label || "");
            if (!label) {
                if (/\/api\/auth\/v\d+(?:\.\d+)?\/authz\/consumer/i.test(info.url)) label = "teams-authz-consumer";
                else if (/\/api\/mt\/beta\/users\/me\//i.test(info.url)) label = "teams-users-me";
                else if (/\/ups\/global\/v1\/me\/endpoints/i.test(info.url)) label = "ups-endpoint-register";
                else if (/\/ups\/global\/v1\/presence\/getpresence/i.test(info.url)) label = "ups-getpresence";
                else if (/\/ups\/global\/v1\/me\/forceavailability/i.test(info.url)) label = "ups-forceavailability";
                else if (/go\.trouter\.teams\.microsoft\.com/i.test(info.url)) label = "trouter-route-check";
                else if (/\/config\/v1\/Skype\//i.test(info.url)) label = "config-skype";
                else if (/\/config\/v1\/MicrosoftTeams\//i.test(info.url)) label = "config-microsoftteams";
                else label = "teams-page-network";
            }
            const step = /config-microsoftteams/.test(label) ? 3 : /config-skype/.test(label) ? 4 : /trouter/.test(label) ? 5 : /authz-consumer/.test(label) ? 6 : /users-me/.test(label) ? 7 : /endpoint/.test(label) ? 9 : /getpresence/.test(label) ? 10 : /forceavailability/.test(label) ? 11 : 0;
            const record = {
                phase: phaseName,
                flow: input.flow || input.packetManagerId || input.id || "teams-page",
                step,
                label,
                method,
                url: info.url || "internal://teams-page",
                status: input.status == null ? (/^(?:send|start)$/i.test(phaseName) ? "pending" : "not-applicable") : Number(input.status),
                ms: input.elapsedMs == null ? 0 : Number(input.elapsedMs),
                caller: String(input.caller || "teams-page-main-world"),
                from: Array.isArray(input.callsite) && input.callsite.length ? String(input.callsite[0]).slice(0, 220) : "not-applicable",
                context: "teams-page-main-world",
                account: input.accountKey || "browser-account",
                authError: String(input.authError || info.authError || "") || "none",
                aadsts: String(input.aadsts || info.aadsts || "") || "none",
                error: String(input.error || "").slice(0, 220) || "none"
            };
            (console[level] || console.info || console.log).call(console, `[Teams Helper][NET] ${JSON.stringify(record)}`);
            if (globalThis.__TEAMS_HELPER_VERBOSE_PACKET_TRACE__ === true && console.debug) console.debug(`[Teams Helper][PacketTrace:${phase}]`, detail)
        } catch {}
    }
    function pagePacketTraceStart(e, t = null, n = null, source = "network") {
        if (!pagePacketTraceEnabled()) return null;
        const rawUrl = requestUrlOf(e), info = pagePacketTraceUrlInfo(rawUrl);
        if (!info.origin) return null;
        const method = String(t && t.method || e && e.method || source === "sendBeacon" ? "POST" : "GET").toUpperCase();
        const trace = {
            id: `page_${Date.now().toString(36)}_${(++pagePacketTraceSequence).toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
            startedAt: Date.now(),
            context: "teams-page-main-world",
            transport: String(source || "network"),
            caller: `page:${String(source || "network")}`,
            method,
            url: info.url,
            origin: info.origin,
            path: info.path,
            queryKeys: info.queryKeys,
            authError: info.authError,
            aadsts: info.aadsts,
            pageUrl: pagePacketTraceUrlInfo(location.href).url,
            headerNames: pagePacketTraceHeaderNames(e, t),
            body: pagePacketTraceBodyMeta(n && hasLiveValue(n.body) ? n.body : n && hasLiveValue(n) ? n : t && t.body),
            callsite: pagePacketTraceCallsite(),
            completed: false
        };
        pagePacketTraceEmit("page-send", trace, "info");
        return trace
    }
    function pagePacketTraceFinish(trace, response = null, extra = {}) {
        if (!trace || trace.completed) return trace;
        trace.completed = true;
        const status = response && response.status != null ? Number(response.status) : null;
        const result = Object.assign({}, trace, {
            completedAt: Date.now(),
            elapsedMs: Math.max(0, Date.now() - Number(trace.startedAt || Date.now())),
            ok: response && typeof response.ok === "boolean" ? !!response.ok : status == null ? null : status >= 200 && status < 400,
            status,
            redirected: !!(response && response.redirected),
            finalUrl: pagePacketTraceUrlInfo(response && response.url || trace.url).url
        }, extra || {});
        pagePacketTraceEmit("page-response", result, result.ok === false ? "warn" : "info");
        return result
    }
    function pagePacketTraceFail(trace, error, extra = {}) {
        if (!trace || trace.completed) return trace;
        trace.completed = true;
        const result = Object.assign({}, trace, {
            completedAt: Date.now(),
            elapsedMs: Math.max(0, Date.now() - Number(trace.startedAt || Date.now())),
            ok: false,
            status: null,
            error: String(error && (error.message || error.msg) || error || "network-error").replace(/(authorization|x-skypetoken|skypetoken|cookie|bearer|access_token|refresh_token|code|session|secret|password)\s*[=:]\s*[^\s,;&]+/ig, "$1=[redacted]").slice(0, 500)
        }, extra || {});
        pagePacketTraceEmit("page-error", result, "error");
        return result
    }
    function pagePacketTracePromise(promise, trace, extra = {}) {
        if (!trace) return promise;
        return Promise.resolve(promise).then(response => { pagePacketTraceFinish(trace, response, extra); return response }, error => { pagePacketTraceFail(trace, error, extra); throw error })
    }

    function observeNetworkRequest(e, t = null, n = null, o = "network") {
        const r = requestUrlOf(e);
        if (!r) return null;
        const packetTrace = pagePacketTraceStart(e, t, n, o);
        /precompiled-(?:telemetry-)?web-worker|\/v2\/worker\//i.test(r) && parseWorkerBootstrapUrl(r) && rememberWorkerBootstrap(r, o, !1, null);
        if (re(r) || /browser\.events\.data\.microsoft\.com\/OneCollector\/1\.0/i.test(r)) rememberTelemetryQueryFromUrl(r, o);
        const body = n && hasLiveValue(n.body) ? n.body : n && hasLiveValue(n) ? n : t && t.body;
        const method = String(t && t.method || e && e.method || "GET").toUpperCase();
        const requestHeaders = headersFromRequestLike(e, t);
        if (/(presence\.|\/ups\/|\/forceavailability\/|\/reportmyactivity\/|\/endpoints\/|\/v1\/me\/)/i.test(r)) rememberPresenceRequest(r, requestHeaders, body, o, method);
        if (isTeamsCallApiUrl(r)) rememberCallApiSignal(r, body, "api-request:" + o, method);
        return packetTrace
    }

    function serviceWorkerStateText() {
        try {
            if (!navigator.serviceWorker) return "unsupported";
            if (navigator.serviceWorker.controller) return "controlled";
            return "uncontrolled"
        } catch {
            return "unknown"
        }
    }

    function regionFromText(e) {
        const t = String(e || "").toLowerCase();
        return /\bemea\b|\beur\b|\beurope\b/.test(t) ? "emea" : /\bapac\b|\basia\b|\banz\b/.test(t) ? "apac" : /\blatam\b|\blac\b/.test(t) ? "latam" : /\bnoam\b|\bamer\b|\bus\b|\bnam\b/.test(t) ? "noam" : null
    }

    function collectLiveDiscoveryHints() {
        const e = Date.now();
        if (L.liveDiscoveryCache && e - L.liveDiscoveryCache.at < 30000) return L.liveDiscoveryCache.data;
        const t = { worker: {}, telemetry: {}, presenceHeaders: {} }, n = new WeakSet;
        let discoveryBudget = 1800;
        L.lastTelemetryQuery && (t.telemetry = j(t.telemetry, L.lastTelemetryQuery));
        L.lastCapturedPresenceHeaders && (t.presenceHeaders = j(t.presenceHeaders, L.lastCapturedPresenceHeaders));
        const o = (e, o = 0) => {
            if (null == e || o > 5 || discoveryBudget-- <= 0) return;
            if ("string" == typeof e) {
                if (e.length > 250000) return;
                const value = e.trim();
                if (!value) return;
                if (/precompiled-(?:telemetry-)?web-worker|\/v2\/worker\//i.test(value)) {
                    const n = parseWorkerBootstrapUrl(value);
                    n && (t.worker = j(t.worker, n))
                }
                const first = value[0], last = value[value.length - 1];
                if (("{" === first && "}" === last || "[" === first && "]" === last) && value.length <= 100000) {
                    const r = G(value);
                    r && "object" == typeof r && o < 5 && a(r, o + 1)
                }
                if (value.length >= 24 && value.length <= 12000 && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)?$/.test(value)) {
                    const i = decodeJwtPayload(value);
                    i && a(i, o + 1)
                }
                return
            }
            if (Array.isArray(e)) {
                for (const t of e.slice(0, 80)) o < 5 && a(t, o + 1);
                return
            }
            "object" == typeof e && a(e, o + 1)
        }, r = (e, n) => {
            if (!hasLiveValue(n)) return;
            const o = String(e || ""), r = o.toLowerCase();
            for (const e of LIVE_WORKER_FIELDS) r === e.toLowerCase() && putLiveValue(t.worker, e, n);
            for (const e of LIVE_TELEMETRY_KEYS) o === e && putLiveValue(t.telemetry, e, n);
            if (/session[_-]?id$/i.test(o) || "sid" === r) putLiveValue(t.worker, "sessionId", n), putLiveValue(t.telemetry, "Session_Id", n);
            if (/device[_-]?id$/i.test(o)) putLiveValue(t.worker, "deviceId", n), putLiveValue(t.telemetry, "DeviceInfo_Id", n);
            if (/platform[_-]?id$/i.test(o)) putLiveValue(t.worker, "platformId", n), putLiveValue(t.telemetry, "AppInfo_PlatformId", n);
            if (/build(version)?$/i.test(o) || /client(version)?$/i.test(o)) putLiveValue(t.worker, "buildVersion", n), putLiveValue(t.telemetry, "AppInfo_Version", n);
            if (/^ring$/i.test(o)) putLiveValue(t.worker, "ring", n), putLiveValue(t.telemetry, "UserInfo_Ring", n);
            if (/environment$/i.test(o)) putLiveValue(t.worker, "environment", n), putLiveValue(t.telemetry, "AppInfo_Environment", n), putLiveValue(t.telemetry, "environment", n);
            if (/tenant[_-]?id$|^tid$/i.test(o)) putLiveValue(t.telemetry, "UserInfo_TenantId", n);
            if (/^(?:user[_-]?id|oid|puid|skypeid|mri|id)$/i.test(o)) putLiveValue(t.telemetry, "UserInfo_Id", n);
            if (/telemetryregion|region$/i.test(o)) putLiveValue(t.telemetry, "UserInfo_TelemetryRegion", n);
            if (/x-ms-/i.test(o)) t.presenceHeaders[o.toLowerCase()] = String(n)
        }, i = e => {
            if (!e || "object" != typeof e) return !1;
            if (n.has(e)) return !0;
            n.add(e);
            return !1
        }, a = (e, n = 0) => {
            if (null == e || n > 5 || "object" != typeof e || i(e)) return;
            if (Array.isArray(e)) return void e.slice(0, 80).forEach(e => o(e, n + 1));
            for (const [i, a] of Object.entries(e)) {
                r(i, a);
                o(a, n + 1)
            }
        };
        a(U.tokenInfo || null, 0); a(U.skypeTokenInfo || null, 0); a(L.endpointInfo || null, 0);
        try {
            const keyPattern = /worker|bootstrap|telemetry|session|platform|device|build|ring|environment|user|tenant|region|presence|endpoint|auth|profile|cachedprimary|msal|token/i;
            let scanned = 0;
            for (let index = 0; index < localStorage.length && scanned < 80 && discoveryBudget > 0; index += 1) {
                const key = localStorage.key(index);
                if (!key || !keyPattern.test(String(key))) continue;
                const value = localStorage.getItem(key);
                if (!hasLiveValue(value)) continue;
                scanned += 1;
                r(key, value);
                o(value, 0)
            }
        } catch {}
        try {
            const e = performance && "function" == typeof performance.getEntriesByType ? performance.getEntriesByType("resource") : [];
            for (const n of (e || []).slice(-250)) {
                const e = n && n.name ? String(n.name) : "";
                if (!e || !/(precompiled-(?:telemetry-)?web-worker|\/v2\/worker\/|OneCollector\/1\.0|presence\.|\/ups\/|\/forceavailability\/|\/reportmyactivity\/|\/endpoints\/|\/v1\/me\/)/i.test(e)) continue;
                if (/precompiled-(?:telemetry-)?web-worker|\/v2\/worker\//i.test(e)) {
                    const n = parseWorkerBootstrapUrl(e);
                    n && (t.worker = j(t.worker, n))
                }
                if (re(e) || /browser\.events\.data\.microsoft\.com\/OneCollector\/1\.0/i.test(e)) {
                    try {
                        const n = new URL(e, location.href);
                        for (const e of LIVE_TELEMETRY_KEYS) n.searchParams.has(e) && (t.telemetry[e] = n.searchParams.get(e))
                    } catch {}
                }
                o(e, 0)
            }
        } catch {}
        L.liveDiscoveryCache = { at: e, data: t };
        return t
    }

    function defaultWorkerFields() {
        const e = String(location.hostname || "").toLowerCase(), t = {};
        t.experienceName = "react-web-client";
        t.ring = "general";
        t.environment = e.endsWith("teams.live.com") ? "life" : "prod";
        e.endsWith("teams.live.com") && (t.platformId = 1415);
        t.localeCode = String(document.documentElement && document.documentElement.lang || navigator.language || "en-us").toLowerCase();
        t.workerId = "precore-worker";
        try { t.sessionId = sessionStorage.getItem("tmp.sessionId") || localStorage.getItem("tmp.sessionId") || t.sessionId || null } catch {}
        try { t.buildVersion = localStorage.getItem("react-web-client-version") || localStorage.getItem("tmp.react-web-client-version") || t.buildVersion || (e.endsWith("teams.live.com") ? "1.0.0.0" : null) } catch { e.endsWith("teams.live.com") && (t.buildVersion = t.buildVersion || "1.0.0.0") }
        t.deviceId = t.deviceId || null;
        e.endsWith("teams.live.com") && (t.publicPath = "https://statics.teams.cdn.live.net/teams-modular-packages/hashed-assets/");
        t.isOcdi = !1; t.isPwa = !!(window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
        t.shouldFetchWorkerChunksBeforeImportScripts = !1; t.useDiagnosticsServiceV2 = !0; t.turboCohort = "";
        t.enableLazyLoadedWorker = !0; t.enableMinimalSchemaWorker = !1;
        t.workerCreationTime = window.__teamsHelperWorkerCreationTime || (window.__teamsHelperWorkerCreationTime = Date.now());
        t.preECSConsoleLogLevel = 0;
        return t
    }

    function livePresenceHeaders() {
        const e = L.endpointInfo && L.endpointInfo.endpointId || L.lastEndpoint && L.lastEndpoint.endpointId || null,
            t = j(collectLiveDiscoveryHints().presenceHeaders || {}, L.spoofConfig && L.spoofConfig.presence && L.spoofConfig.presence.headers || {}),
            n = liveWorkerFields();
        putLiveValue(t, "x-ms-endpoint-id", e);
        putLiveValue(t, "x-ms-session-id", n.sessionId);
        putLiveValue(t, "x-ms-client-user-agent", "Teams-V2-Web");
        return t
    }

    function pruneBridgePending(maxEntries = 32, maxAgeMs = 15000) {
        try {
            if (!D.pending || "function" != typeof D.pending.entries) return;
            const now = Date.now();
            const settle = (id, item, message) => {
                try { item && item.timer && U.nativeClearTimeout && U.nativeClearTimeout(item.timer) } catch {}
                D.pending.delete(id);
                try { item && item.reject && item.reject(new Error(message)) } catch {}
            };
            const entries = Array.from(D.pending.entries());
            for (const [id, item] of entries) {
                const createdAt = Number(item && item.createdAt || 0);
                const expiresAt = Number(item && item.expiresAt || (createdAt ? createdAt + maxAgeMs : 0));
                if (expiresAt && now >= expiresAt) settle(id, item, "extension bridge request expired");
            }
            const overflow = D.pending.size - maxEntries;
            if (overflow > 0) {
                let removed = 0;
                for (const [id, item] of D.pending.entries()) {
                    settle(id, item, "extension bridge request queue overflow");
                    if (++removed >= overflow) break;
                }
            }
        } catch {}
    }
    function bridgeUiRequest(type, payload = {}, timeoutMs = 15000) {
        return new Promise((resolve, reject) => {
            try {
                pruneBridgePending();
                const id = "th-ui-" + ++D.seq + "-" + Math.random().toString(36).slice(2, 8);
                const duration = Math.max(1000, Number(timeoutMs) || 15000);
                const createdAt = Date.now();
                const timer = U.nativeSetTimeout ? U.nativeSetTimeout(() => {
                    D.pending.delete(id);
                    reject(new Error("extension bridge timeout"));
                }, duration) : null;
                D.pending.set(id, { resolve, reject, timer, createdAt, expiresAt: createdAt + duration });
                if (!ee(type, Object.assign({ id }, payload || {}))) {
                    timer && U.nativeClearTimeout && U.nativeClearTimeout(timer);
                    D.pending.delete(id);
                    reject(new Error("extension bridge unavailable"));
                }
            } catch (error) {
                reject(error);
            }
        });
    }


    function requestCapturedPresenceHeaders(e = "refresh") {
        if (!D.ready) return;
        const o = Date.now();
        if (L.lastCaptureRequestAt && o - L.lastCaptureRequestAt < 3000) return;
        L.lastCaptureRequestAt = o;
        try {
            pruneBridgePending();
            const t = "th-cap-" + ++D.seq + "-" + Math.random().toString(36).slice(2, 8), createdAt = Date.now(), n = U.nativeSetTimeout ? U.nativeSetTimeout(() => D.pending.delete(t), 2500) : null;
            D.pending.set(t, { timer: n, createdAt, expiresAt: createdAt + 2500, resolve: e => { e && e.capture && rememberPresenceRequest(e.capture.url || e.url || "", e.capture.headers || {}, e.capture.body || e.capture.requestBody || null, "background") }, reject: () => {} });
            ee("captureGet", { id: t, url: L.directBaseUrl || me() || location.href, reason: e })
        } catch {}
    }

    function normalizeAccountEmail(e) {
        const t = stripAccountKeyPrefixes(e);
        if (!t || t.length > 160 || /^https?:\/\//i.test(t) || /[\s{}[\]<>"'`]/.test(t)) return "";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? t : ""
    }

    function extractUrlEmail(e) {
        try {
            const t = new URL(String(e || ""), location.origin);
            for (const e of ["smtp", "userPrincipalName", "email", "login_hint", "upn"]) {
                const n = normalizeAccountEmail(t.searchParams.get(e) || "");
                if (n) return n
            }
        } catch {}
        return ""
    }

    function decodeJwtPayload(e) {
        const t = String(e || "").trim();
        if (!t || t.split(".").length < 2) return null;
        try {
            let e = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            for (; e.length % 4;) e += "=";
            return G(atob(e))
        } catch {
            return null
        }
    }

    function collectAccountEmails(e, t, n = 0) {
        if (!e || "object" != typeof e || n > 5) return;
        if (Array.isArray(e)) {
            for (const o of e) collectAccountEmails(o, t, n + 1);
            return
        }
        for (const [o, r] of Object.entries(e)) {
            if ("string" == typeof r) {
                (/email|mail|smtp|principal|preferred|login_hint|loginhint|username|upn/i.test(o) || /@/.test(r)) && t(r);
                const e = extractUrlEmail(r);
                e && t(e);
                const a = decodeJwtPayload(r);
                a && collectAccountEmails(a, t, n + 1)
            } else r && "object" == typeof r && collectAccountEmails(r, t, n + 1)
        }
    }

    function extractTeamsAccountEmail() {
        const e = [];
        let t = "";
        const n = n => {
            const o = normalizeAccountEmail(n || "");
            o && !e.includes(o) && (e.push(o), t || (t = o))
        };
        collectAccountEmails(U.tokenInfo || null, n), collectAccountEmails(U.skypeTokenInfo || null, n), collectAccountEmails(L.endpointInfo || null, n), [U.tokenInfo && U.tokenInfo.token, U.skypeTokenInfo && U.skypeTokenInfo.skypeToken].forEach((e => collectAccountEmails(decodeJwtPayload(e), n)));
        for (const [e, t] of ae()) {
            /cachedprimaryuser|profile|persona|account|auth|token|identity|user/i.test(String(e || "")) && (n(t), collectAccountEmails(G(t || ""), n), collectAccountEmails(decodeJwtPayload(t), n));
            const o = extractUrlEmail(t);
            o && n(o)
        }
        try {
            const e = performance.getEntriesByType && performance.getEntriesByType("resource") || [];
            for (const t of e) {
                const e = extractUrlEmail(t && t.name || "");
                if (e) {
                    n(e);
                    break
                }
            }
        } catch {}
        return t || null
    }

    function forceAfterRemoteState(reason, changed) {
        if (!isRuntimePolicyAllowed() || !isPresenceRequestsEnabled()) return false;
        if (isManualOverrideActive() && changed) {
            const payload = buildRuntimeSyncPayload(reason || "manual-override-active");
            if (payload) D.lastRuntimeSyncPayload = payload;
            requestBackgroundForceRun(reason || "manual-override-active", payload || null);
            return true
        }
        const activeSchedule = !!activeScheduleRuntimeSignature(L.manager, new Date);
        if (activeSchedule) {
            try { $e("schedule-remote-state-activity") } catch {}
            return maybeForceActiveSchedule(reason || "remote-state", { minMs: changed ? 30000 : 120000 })
        }
        try { $e("schedule-remote-state-idle") } catch {}
        return false
    }

    function applyRemoteBridgeState(e) {
        if (!e || "object" != typeof e) return;
        if (e.lastCallState && "object" == typeof e.lastCallState) setLastCallState(e.lastCallState);
        const incomingSignature = remoteBridgeStateSignature(e);
        if (incomingSignature && incomingSignature === D.lastRemoteBridgeStateSignature) {
            forceAfterRemoteState(e.reason || "remote-state", false);
            return
        }
        incomingSignature && (D.lastRemoteBridgeStateSignature = incomingSignature);
        const presenceStateBefore = JSON.stringify({ enabled: !!L.enabled, selectedAccountKey: L.selectedAccountKey || null, manager: normalizeManagerState(L.manager) }, ((key, value) => /^(clientClockAt|clientLocalMinutes|localMinutes)$/i.test(key) ? void 0 : value));
        let t = !1;
        const n = e.accountRegistry ? normalizeAccountRegistry(e.accountRegistry) : null,
            pageAccountKey = n && resolveAccountKeyForCurrentPage(n, L.currentAccountKey || n.activeAccountKey),
            remoteSelectedKey = n && e.selectedAccountKey && n.accounts[e.selectedAccountKey] ? e.selectedAccountKey : null,
            remoteAccountKey = n && e.accountKey && n.accounts[e.accountKey] ? e.accountKey : null,
            remoteActiveKey = n && n.activeAccountKey && n.accounts[n.activeAccountKey] ? n.activeAccountKey : null,
            remotePreferredKey = pageAccountKey || remoteAccountKey || remoteSelectedKey || remoteActiveKey,
            o = remotePreferredKey,
            r = o && n ? n.accounts[o] || null : null;
        n && o && n.accounts[o] && (n.activeAccountKey = o);
        if (!isRuntimePolicyAllowed()) return;
        if (E(e.uiConfig)) {
            const nextUiConfig = B(e.uiConfig),
                incomingUiUpdatedAt = "string" == typeof e.uiConfigUpdatedAt && Number.isFinite(Date.parse(e.uiConfigUpdatedAt)) ? e.uiConfigUpdatedAt : null,
                incomingUiMs = incomingUiUpdatedAt ? Date.parse(incomingUiUpdatedAt) : 0,
                localUiMs = L.spoofConfigUpdatedAt && Number.isFinite(Date.parse(L.spoofConfigUpdatedAt)) ? Date.parse(L.spoofConfigUpdatedAt) : 0,
                localRegistryForUi = normalizeAccountRegistry(L.accountRegistry || null),
                localUiKey = resolveAccountKeyForCurrentPage(localRegistryForUi, L.selectedAccountKey || localRegistryForUi.activeAccountKey),
                localUiAccount = localUiKey ? localRegistryForUi.accounts[localUiKey] || null : null,
                localCloudEditEnabled = localUiAccount ? localUiAccount.cloudEnabled === true : L.cloudEnabled === true,
                localUiEcho = /^local-ui-config-saved$/i.test(String(e.reason || "")),
                localUiDirty = !!(D.localUiConfigDirtyUntil && Date.now() < D.localUiConfigDirtyUntil),
                staleUiSnapshot = !!(L.spoofConfigStored && localUiMs && (!incomingUiMs || incomingUiMs < localUiMs)),
                localOnlyAuthority = !!(L.spoofConfigStored && !localCloudEditEnabled && !localUiEcho),
                rejectIncomingUi = localOnlyAuthority || staleUiSnapshot || localUiDirty && !localUiEcho && (!incomingUiMs || incomingUiMs <= localUiMs);
            if (!rejectIncomingUi) {
                if (JSON.stringify(nextUiConfig) !== JSON.stringify(B(L.spoofConfig))) {
                    L.spoofConfig = nextUiConfig;
                    setLocalStorageIfChanged(k.spoofConfig, JSON.stringify(L.spoofConfig));
                    Ne();
                    t = !0
                }
                L.spoofConfigStored = true;
                if (incomingUiUpdatedAt) {
                    L.spoofConfigUpdatedAt = incomingUiUpdatedAt;
                    setLocalStorageIfChanged(k.spoofConfigUpdatedAt, incomingUiUpdatedAt)
                }
                if (localUiEcho || incomingUiMs && incomingUiMs >= localUiMs) D.localUiConfigDirtyUntil = 0
            }
        }
        if (shouldIgnoreStaleRemoteManualOff(e, r)) {
            q("sync", "Ignored stale schedule state while manual override is active", { reason: e.reason || null, remoteEnabled: e.enabled, remoteManualOverride: e.manualOverrideEnabled });
            forceAfterRemoteState("manual-override-active", false);
            return
        }
        if (n) {
            const localRegistry = normalizeAccountRegistry(L.accountRegistry || null),
                localKey = resolveAccountKeyForCurrentPage(localRegistry, L.selectedAccountKey || localRegistry.activeAccountKey),
                localAccount = localKey ? localRegistry.accounts[localKey] || null : null,
                localMs = accountUpdatedAtValue(localAccount),
                remoteMs = accountUpdatedAtValue(r),
                localManagerSignature = JSON.stringify(normalizeManagerState(localAccount && localAccount.manager)),
                remoteManagerSignature = JSON.stringify(normalizeManagerState(r && r.manager)),
                remoteManualOrManagerChanged = !localAccount || !!(r && r.enabled) !== !!(localAccount && localAccount.enabled) || remoteManagerSignature !== localManagerSignature,
                remoteReason = String(e && e.reason || ""),
                localCloudDisabled = !!(localAccount && localAccount.cloudEnabled !== true),
                cloudPulledRuntime = /^(?:cloud-|cloud-poll|autosync|alarm|page-autosync)/i.test(remoteReason) && !/^popup-cloud-toggle/i.test(remoteReason),
                localDirtyActive = !!(D.localManagerDirtyUntil && Date.now() < D.localManagerDirtyUntil),
                remoteNewerThanLocal = !!(remoteMs && localMs && remoteMs > localMs + 1000),
                localNewerThanRemote = !!(localMs && (!remoteMs || localMs > remoteMs + 1000)),
                preserveLocalManualManager = !!(localAccount && remoteManualOrManagerChanged && (localDirtyActive || localNewerThanRemote) && !remoteNewerThanLocal && !/^popup-cloud-toggle/i.test(remoteReason)),
                keepLocal = !!(localAccount && ((localCloudDisabled && cloudPulledRuntime && remoteManualOrManagerChanged) || preserveLocalManualManager || (!remoteManualOrManagerChanged && (localDirtyActive || localMs && remoteMs && localMs > remoteMs + 1000))));
            // A bridge update is scoped to the Teams origin that produced it.
            // Keep verified accounts from the other origin instead of treating
            // their absence from this payload as a sign-out/deletion event.
            for (const [localRegistryKey, localRegistryValue] of Object.entries(localRegistry.accounts || {})) {
                const localEntry = normalizeStoredAccountEntry(localRegistryValue, localRegistryKey),
                    localType = accountEntryTeamsType(localEntry),
                    localParsed = accountIdentityFromKey(localEntry.key || localRegistryKey),
                    localTid = accountIdentityGuid(localEntry.accountTid || localEntry.oauthResolvedTid || localParsed.accountTid),
                    localOid = accountIdentityGuid(localEntry.accountOid || localEntry.oauthResolvedOid || localParsed.accountOid),
                    localEmail = normalizeAccountEmail(localEntry.email || accountKeyEmail(localEntry.key || localRegistryKey) || ""),
                    matchingKey = Object.keys(n.accounts || {}).find(key => {
                        const remoteEntry = n.accounts[key];
                        if (!remoteEntry) return false;
                        const remoteType = accountEntryTeamsType(remoteEntry);
                        if (localType !== "unknown" && remoteType !== "unknown" && localType !== remoteType) return false;
                        const remoteParsed = accountIdentityFromKey(remoteEntry.key || key),
                            remoteTid = accountIdentityGuid(remoteEntry.accountTid || remoteEntry.oauthResolvedTid || remoteParsed.accountTid),
                            remoteOid = accountIdentityGuid(remoteEntry.accountOid || remoteEntry.oauthResolvedOid || remoteParsed.accountOid);
                        if ((localType === "business" || remoteType === "business") && localTid && localOid && remoteTid && remoteOid) return localTid === remoteTid && localOid === remoteOid;
                        if (localTid && remoteTid && localTid !== remoteTid) return false;
                        if (localOid && remoteOid && localOid !== remoteOid) return false;
                        const remoteEmail = normalizeAccountEmail(remoteEntry.email || accountKeyEmail(remoteEntry.key || key) || "");
                        return !!(localEmail && remoteEmail && localEmail === remoteEmail)
                    });
                if (!matchingKey && localEntry.email && localType !== "unknown") n.accounts[localEntry.key] = localEntry
            }
            if (keepLocal) {
                // A local manual/schedule edit is authoritative until it is synced out or a newer remote edit arrives.
                // Otherwise the background/cloud echo can restore the previous manual status while the user is changing it.
                n.accounts[localAccount.key] = mergeStoredAccountEntry(n.accounts[localAccount.key], localAccount, !0);
                n.activeAccountKey = localAccount.key;
                if ((localCloudDisabled && cloudPulledRuntime) || preserveLocalManualManager) {
                    e.cloudEnabled = !!localAccount.cloudEnabled;
                    e.enabled = !!localAccount.enabled;
                    e.manualOverrideEnabled = !!localAccount.enabled;
                    e.manager = normalizeManagerState(localAccount.manager);
                    e.selectedAccountKey = localAccount.key;
                    e.accountKey = localAccount.key;
                }
            }
        }
        try {
            const nowGuard = Date.now();
            if (D.localManualOffUntil && nowGuard < D.localManualOffUntil) {
                if (n && n.accounts) {
                    for (const key of Array.from(new Set([o, n.activeAccountKey, L.selectedAccountKey].filter(Boolean)))) {
                        if (n.accounts[key]) n.accounts[key] = { ...n.accounts[key], enabled: false };
                    }
                }
                e.enabled = false;
                e.manualOverrideEnabled = false;
            }
            if (D.localScheduleOffUntil && nowGuard < D.localScheduleOffUntil) {
                const keepScheduleOff = managerValue => {
                    const normalized = normalizeManagerState(managerValue);
                    return normalized.scheduleEnabled ? { ...normalized, scheduleEnabled: false } : normalized;
                };
                if (n && n.accounts) {
                    for (const key of Array.from(new Set([o, n.activeAccountKey, L.selectedAccountKey].filter(Boolean)))) {
                        if (n.accounts[key]) n.accounts[key] = { ...n.accounts[key], manager: keepScheduleOff(n.accounts[key].manager) };
                    }
                }
                if (e.manager && typeof e.manager === "object") e.manager = keepScheduleOff(e.manager);
            }
        } catch {}
        const nr = n && (n.activeAccountKey && n.accounts[n.activeAccountKey] ? n.accounts[n.activeAccountKey] : null);
        if (n && JSON.stringify(n) !== JSON.stringify(normalizeAccountRegistry(L.accountRegistry || null)) && (L.accountRegistry = n, saveAccountRegistry(n), t = !0), n && n.activeAccountKey && n.activeAccountKey !== L.selectedAccountKey && (L.selectedAccountKey = n.activeAccountKey, saveSelectedAccountKey(n.activeAccountKey), t = !0), nr && accountMatchesCurrentPage(nr)) L.enabled = !!nr.enabled, L.cloudEnabled = "boolean" == typeof nr.cloudEnabled ? !!nr.cloudEnabled : L.cloudEnabled, L.manager = normalizeManagerState(nr.manager), nr.email && (L.targetAccountEmail = nr.email), nr.teamsType && "unknown" !== nr.teamsType && (L.targetAccountType = nr.teamsType), saveManagerState(L.manager), t = !0;
        else if (!n) {
            if ("boolean" == typeof e.cloudEnabled && e.cloudEnabled !== L.cloudEnabled && (L.cloudEnabled = e.cloudEnabled, t = !0), "boolean" == typeof e.enabled && e.enabled !== L.enabled && (L.enabled = e.enabled, t = !0), e.manager && "object" == typeof e.manager) {
                const n = normalizeManagerState(e.manager),
                    o = normalizeManagerState(L.manager);
                JSON.stringify(n) !== JSON.stringify(o) && (!D.localManagerDirtyUntil || Date.now() >= D.localManagerDirtyUntil) && (L.manager = n, saveManagerState(L.manager), persistSelectedAccountState({ touch: false }), t = !0)
            }
            const n = normalizeAccountEmail(e.targetAccountEmail || "");
            n && n !== L.targetAccountEmail && (L.targetAccountEmail = n, t = !0), "string" == typeof e.targetAccountType && e.targetAccountType && normalizeTeamsAccountType(e.targetAccountType) !== L.targetAccountType && (L.targetAccountType = normalizeTeamsAccountType(e.targetAccountType), t = !0)
        }
        if (!t) {
            forceAfterRemoteState(e.reason || "remote-state", false);
            return
        }
        if (t) {
            L.lastRuntimeSyncAt = e.at || z();
            renderManagerRules();
            ct();
            resetScheduleTransitionTimer("remote-state");
            const presenceStateAfter = JSON.stringify({ enabled: !!L.enabled, selectedAccountKey: L.selectedAccountKey || null, manager: normalizeManagerState(L.manager) }, ((key, value) => /^(clientClockAt|clientLocalMinutes|localMinutes)$/i.test(key) ? void 0 : value));
            presenceStateAfter !== presenceStateBefore && forceAfterRemoteState(e.reason || "remote-state", true);
            q("sync", "Cloud runtime config applied", {
                reason: e.reason || null,
                enabled: L.enabled,
                targetAccountEmail: L.targetAccountEmail || null,
                targetAccountType: L.targetAccountType || null,
                selectedAccountKey: L.selectedAccountKey || null
            })
        }
    }

    function se() {
        try {
            const e = G(localStorage.getItem("tmp.react-web-client.cachedPrimaryUser") || ""),
                t = e && "object" == typeof e ? e.region : null;
            return "string" == typeof t && t ? t.toLowerCase() : null
        } catch {
            return null
        }
    }

    function le(e) {
        const t = String(e || "").toLowerCase();
        return t ? /\bnoam\b/.test(t) ? "noam" : /\bemea\b/.test(t) || /\beur\b/.test(t) ? "emea" : /\bapac\b/.test(t) || /\basi?a\b/.test(t) || /\banz\b/.test(t) ? "apac" : /\blatam\b/.test(t) || /\blac\b/.test(t) || /\bsam\b/.test(t) ? "latam" : /\bamer\b/.test(t) || /\bnam\b/.test(t) || /\bus\b/.test(t) || /\bcan\b/.test(t) ? "noam" : null : null
    }

    function ce() {
        const e = ae(),
            t = Date.now(),
            n = [],
            o = (e, o) => {
                if (!o || "object" != typeof o) return;
                const r = [o.skypeToken, o.token, o.secret, o.accessToken].find(e => "string" == typeof e && e && "dummy-token" !== e) || "",
                    i = Number(o.expiration || o.expiresOn || o.tokenExpiration || o.expires || 0),
                    a = Number.isFinite(i) && i > 0 ? i > 1e10 ? i : 1e3 * i : null;
                null != a && a <= t + 3e4 || r && n.push({
                    key: e,
                    token: r,
                    expiresOn: a,
                    skypeId: o.skypeId || o.id || o.mri || null
                })
            };
        for (const [t, n] of e) {
            const e = G(n || "");
            if (!e || "object" != typeof e) continue;
            const r = e.item && "object" == typeof e.item ? e.item : null;
            (/Discover\.SKYPE-TOKEN/i.test(t) || /Token\.SERVICE::API\.FL\.SPACES\.SKYPE\.COM::MBI_SSL/i.test(t) || /skype/i.test(t) && /token/i.test(t)) && o(t, r || e)
        }
        return n.sort((e, t) => (t.expiresOn || 0) - (e.expiresOn || 0)), n[0] || null
    }

    function ue() {
        for (const [e, t] of ae()) {
            if (!/Discover\.(?:DISCOVER-REGION-GTM|SKYPE-TOKEN)/i.test(e)) continue;
            const n = G(t || ""),
                o = n && "object" == typeof n ? n.item || n : null;
            if (!o || "object" != typeof o) continue;
            const r = o.regionGtms && "object" == typeof o.regionGtms ? o.regionGtms : o;
            if (r && "object" == typeof r) return r
        }
        return null
    }

    function de(e) {
        if ("string" != typeof e || !e) return null;
        try {
            const t = new URL(e, location.href),
                n = String(t.pathname || "").replace(/\/+$/, "").replace(/\/v1\/(?:me(?:\/.*)?|presence(?:\/.*)?|pubsub(?:\/.*)?|workLocation(?:\/.*)?)$/i, "").replace(/\/(?:endpoints(?:\/.*)?|forceavailability(?:\/.*)?|reportmyactivity(?:\/.*)?)$/i, "");
            return t.pathname = n || "/", t.search = "", t.hash = "", t.toString().replace(/\/$/, "")
        } catch {
            return null
        }
    }

    function pe(e, t) {
        if (e) {
            if ("string" == typeof e) {
                const n = String(e).match(/https:\/\/[^"'\s]+/gi) || [];
                for (const e of n) {
                    if (!/(presence\.|\/ups\/)/i.test(e)) continue;
                    const n = de(e);
                    n && t.add(n)
                }
                return
            }
            if (Array.isArray(e))
                for (const n of e) pe(n, t);
            else if ("object" == typeof e)
                for (const n of Object.values(e)) pe(n, t)
        }
    }

    function fe(e) {
        if (!e) return null;
        if ("string" == typeof e) {
            const t = String(e).match(/https:\/\/teams\.cloud\.microsoft\/ups\/([a-z0-9-]+)/i);
            if (t) return `https://teams.cloud.microsoft/ups/${t[1].toLowerCase()}`;
            const n = le(e);
            return n ? `https://teams.cloud.microsoft/ups/${n}` : null
        }
        if (Array.isArray(e)) {
            for (const t of e) {
                const e = fe(t);
                if (e) return e
            }
            return null
        }
        if ("object" == typeof e)
            for (const [t, n] of Object.entries(e)) {
                const e = fe(n);
                if (e) return e;
                const o = le(t);
                if (o) return `https://teams.cloud.microsoft/ups/${o}`
            }
        return null
    }

    function me() {
        const e = function() {
            const e = new Set;
            pe(ue(), e);
            const t = [window.localStorage, window.sessionStorage].filter(Boolean);
            for (const n of t) try {
                for (let t = 0; t < n.length; t += 1) {
                    const o = n.key(t);
                    if (!o) continue;
                    const r = n.getItem(o);
                    r && /(presence|endpoint|discover|ups)/i.test(o + "\n" + r) && pe(r, e)
                }
            } catch {}
            try {
                const t = performance && "function" == typeof performance.getEntriesByType ? performance.getEntriesByType("resource") : [];
                for (const n of t || []) {
                    const t = n && n.name;
                    if (!t || !/presence\.|\/ups\//i.test(String(t))) continue;
                    const o = de(String(t));
                    o && e.add(o)
                }
            } catch {}
            return Array.from(e)
        }();
        if (e.length) {
            const currentType = currentPageTeamsType(),
                typedCandidates = e.filter(candidate => baseUrlMatchesTeamsType(candidate, currentType)),
                candidates = typedCandidates.length ? typedCandidates : e;
            const t = candidates.find(e => /\/ups\//i.test(e)) || candidates[0];
            if (t) return t
        }
        const t = String(location.hostname || "").toLowerCase();
        if (t.endsWith("teams.live.com")) return "https://teams.live.com/ups/global";
        if (t.endsWith("teams.microsoft.com")) return "https://presence.teams.microsoft.com";
        if (t.endsWith("teams.cloud.microsoft")) {
            return [fe(ue()), fe(ce()), fe(se())].filter(Boolean)[0] || "https://teams.cloud.microsoft/ups/noam"
        }
        return location.origin
    }

    function ge(e, t) {
        return new Promise((n, o) => {
            if (!e.objectStoreNames.contains(t)) return void n([]);
            let r;
            try {
                r = e.transaction(t, "readonly")
            } catch (e) {
                return void o(e)
            }
            const i = r.objectStore(t),
                a = "function" == typeof i.getAll ? i.getAll() : i.openCursor();
            if ("function" == typeof i.getAll) return a.onsuccess = () => n(Array.isArray(a.result) ? a.result : []), void(a.onerror = () => o(a.error || new Error("IndexedDB read failed")));
            const s = [];
            a.onsuccess = () => {
                const e = a.result;
                e ? (s.push(e.value), e.continue()) : n(s)
            }, a.onerror = () => o(a.error || new Error("IndexedDB cursor failed"))
        })
    }

    function ye(e) {
        const t = e && e.presence && e.presence.presence ? e.presence.presence : e && e.presence ? e.presence : e;
        return t && "object" == typeof t ? {
            availability: t.availability || null,
            activity: t.activity || null,
            deviceType: t.deviceType || null,
            lastActiveTime: t.lastActiveTime || null
        } : null
    }
    async function be(e) {
        let t;
        try {
            t = await
            function(e) {
                return new Promise((t, n) => {
                    let o, r = !1;
                    try {
                        o = indexedDB.open(e)
                    } catch (e) {
                        return void n(e)
                    }
                    o.onsuccess = () => {
                        r = !0, t(o.result)
                    }, o.onerror = () => {
                        r = !0, n(o.error || new Error("IndexedDB open failed"))
                    }, o.onblocked = () => {
                        r || n(new Error("IndexedDB open blocked"))
                    }
                })
            }(e)
        } catch {
            return null
        }
        try {
            const n = await ge(t, "user_presence_endpoint_ids");
            if (!n.length) return null;
            const o = n.filter(e => e && "object" == typeof e && "string" == typeof e.endpointId).sort((e, t) => Number(t.lastActiveTimestamp || 0) - Number(e.lastActiveTimestamp || 0))[0];
            if (!o) return null;
            const r = await ge(t, "user-presence-store");
            let i = null;
            for (const e of r) {
                if (!e || "object" != typeof e) continue;
                const t = e.sourceEncodedMri || e.mri || null;
                if (o.loginUserMri && t === o.loginUserMri) {
                    i = e;
                    break
                }
            }
            return i || (i = r[0] || null), {
                dbName: e,
                endpointId: o.endpointId,
                loginUserMri: o.loginUserMri || null,
                lastActiveTimestamp: Number(o.lastActiveTimestamp || 0) || null,
                presence: ye(i)
            }
        } finally {
            try {
                t.close()
            } catch {}
        }
    }
    async function ve() {
        const e = await async function() {
            const e = new Set;
            if ("function" == typeof indexedDB.databases) try {
                const t = await indexedDB.databases();
                for (const n of t || []) {
                    const t = n && n.name;
                    "string" == typeof t && t.toLowerCase().includes("presence-manager") && e.add(t)
                }
            } catch {}
            if (!e.size) {
                const t = function() {
                        const e = {
                            tenantIds: new Set,
                            userIds: new Set
                        };
                        for (const [t] of ae()) {
                            const n = t.match(/([0-9a-f-]{36})\.([0-9a-f-]{36})-login\.windows\.net-accesstoken/i);
                            n && (e.userIds.add(n[1]), e.tenantIds.add(n[2]))
                        }
                        return {
                            tenantIds: Array.from(e.tenantIds),
                            userIds: Array.from(e.userIds)
                        }
                    }(),
                    n = Array.from(new Set([String(document.documentElement && document.documentElement.lang || "").toLowerCase(), String(navigator.language || "").toLowerCase(), "en-us"].filter(Boolean)));
                for (const o of t.tenantIds)
                    for (const r of t.userIds)
                        for (const t of n) e.add(`Teams:presence-manager:react-web-client:${o}:${r}:${t}`)
            }
            return Array.from(e).slice(0, 8)
        }(), t = [];
        for (const n of e) {
            const e = await be(n);
            e && e.endpointId && t.push(e)
        }
        if (t.sort((e, t) => Number(t.lastActiveTimestamp || 0) - Number(e.lastActiveTimestamp || 0)), t[0]) return t[0];
        const n = function() {
            const e = [],
                t = (t, n) => {
                    if ("string" != typeof t) return;
                    const o = t.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
                    o && e.push({
                        endpointId: o[0],
                        source: n
                    })
                },
                n = [window.localStorage, window.sessionStorage].filter(Boolean);
            for (const e of n) try {
                for (let n = 0; n < e.length; n += 1) {
                    const o = e.key(n);
                    if (!o) continue;
                    const r = e.getItem(o) || "";
                    /(endpoint|presence|activity)/i.test(o + "\n" + r) && t(r, `storage:${o}`)
                }
            } catch {}
            try {
                const e = performance && "function" == typeof performance.getEntriesByType ? performance.getEntriesByType("resource") : [];
                for (const n of e || []) {
                    const e = n && n.name ? String(n.name) : "";
                    /(endpoints|reportmyactivity|forceavailability|presence|ups)/i.test(e) && t(e, "performance")
                }
            } catch {}
            return e[0] || null
        }();
        return n && n.endpointId ? {
            dbName: n.source || "fallback",
            endpointId: n.endpointId,
            loginUserMri: null,
            lastActiveTimestamp: Date.now(),
            presence: null
        } : null
    }
    async function he(e, t = {}) {
        const n = function() {
            const e = ae(),
                t = [];
            for (const [n, o] of e) {
                if (!/UserAuthState/i.test(n)) continue;
                const e = G(o || ""),
                    r = e && "object" == typeof e ? e.item || e : null;
                r && "object" == typeof r && t.push({
                    key: n,
                    state: r.state || null,
                    reason: r.reason || null,
                    errorCode: r.customError && r.customError.errorCode || null,
                    correlationId: r.customError && r.customError.correlationId || null
                })
            }
            return t[0] || null
        }();
        let o = await ve();
        const r = function() {
                const e = ae(),
                    t = Math.floor(Date.now() / 1e3),
                    n = [],
                    o = /(service::api\.fl\.spaces\.skype\.com::mbi_ssl|service::api\.fl\.teams\.microsoft\.com::mbi_ssl|https?:\/\/mtsvc\.fl\.teams\.microsoft\.com\/teams\.mt\.readwrite|https?:\/\/groupssvc\.fl\.teams\.microsoft\.com\/teams\.readwrite|https?:\/\/presence\.teams\.microsoft\.com\/?\/?(?:user_impersonation|\.default)|https?:\/\/api\.spaces\.skype\.com\/?(?:authorization\.readwrite|region\.readwrite|user_impersonation|\.default)|teams\.auth\.readwrite)/i;
                for (const [r, i] of e) {
                    if (!/accesstoken/i.test(r) || !o.test(r)) continue;
                    const e = G(i || "");
                    if (!e || "object" != typeof e || "string" != typeof e.secret || !e.secret) continue;
                    const a = Number(e.expiresOn || 0);
                    Number.isFinite(a) && a <= t + 30 || n.push({
                        key: r,
                        token: e.secret,
                        expiresOn: Number.isFinite(a) ? a : null,
                        clientId: e.clientId || null
                    })
                }
                return n.sort((e, t) => (t.expiresOn || 0) - (e.expiresOn || 0)), n[0] || null
            }(),
            i = ce();
        if ((!o || !o.endpointId)) {
            const e = getStableEndpointId(), t = i && i.skypeId || U.skypeTokenInfo && U.skypeTokenInfo.skypeId || null;
            e && (o = { dbName: "generated", endpointId: e, loginUserMri: t ? String(t) : null, lastActiveTimestamp: Date.now(), presence: null })
        }
        const a = function() {
                for (const [e, t] of ae()) {
                    if (!/Discover\.SKYPE-AUTHZ-URL/i.test(e)) continue;
                    const n = G(t || ""),
                        o = n && "object" == typeof n ? n.item ?? n : null;
                    if ("string" == typeof o && o) return o
                }
                return null
            }(),
            s = me(),
            l = function(e, t) {
                const n = [];
                return e && e.token && n.push("bearer"), t && t.token && n.push("skype"), n.length ? n.join("+") : "cookie"
            }(r, i);
        if ((!o || !o.endpointId) && t && t.retryOnMiss) {
            const e = Math.min(Math.max(Number(t.retryOnMiss) || 0, 0), 6);
            for (let t = 0; t < e && (await new Promise(e => (U.nativeSetTimeout || window.setTimeout)(e, 350 * (t + 1))), o = await ve(), !o || !o.endpointId); t += 1);
        }
        if (U.tokenInfo = r, U.skypeTokenInfo = i, U.authzUrl = a, L.auth = n, L.endpointInfo = o, L.lastEndpoint = o, L.directBaseUrl = s, L.tokenMode = l, L.liveDiscoveryCache = null, (L.gui || ut(), L.gui || dt()), o && o.presence) {
            const e = {
                source: "indexeddb",
                at: o.lastActiveTimestamp || z(),
                ...o.presence
            };
            L.lastPresence && "direct" === L.lastPresence.source && L.lastReplay && L.lastReplay.ok || (L.lastPresence = e);
            L.lastBackendPresence = {
                authMode: "indexeddb",
                ...e
            }
        }
        const c = {
                auth: n,
                endpointInfo: o,
                baseUrl: s,
                tokenMode: l,
                skypeTokenInfo: i,
                authzUrl: a
            },
            u = function(e) {
                return JSON.stringify({
                    authState: e.auth && e.auth.state || null,
                    authReason: e.auth && e.auth.reason || null,
                    endpointId: e.endpointInfo && e.endpointInfo.endpointId || null,
                    lastActiveTimestamp: e.endpointInfo && e.endpointInfo.lastActiveTimestamp || null,
                    baseUrl: e.baseUrl || null,
                    tokenMode: e.tokenMode || null
                })
            }(c),
            d = u !== U.lastContextSignature;
        return U.lastContextSignature = u, d && !t.silent && q("direct", "Context refreshed", {
            reason: e,
            authState: n && n.state || null,
            endpointId: o && Z(o.endpointId) || null,
            baseUrl: s,
            tokenMode: l
        }), ensureDetectedAccountRegistered(!0), ct(), oe(e || "context-refresh"), c
    }

    function we(e) {
        const t = "string" == typeof e ? G(e) : e;
        return t && "object" == typeof t ? {
            id: t.id || t.endpointId || null,
            availability: t.availability || null,
            activity: t.activity || null,
            activityReporting: t.activityReporting || null
        } : {
            raw: Y(e, 200)
        }
    }

    function Ie() {
        try {
            if (window.crypto && "function" == typeof window.crypto.randomUUID) return window.crypto.randomUUID()
        } catch {}
        return "th-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10)
    }

    function getStableEndpointId() {
        return null
    }

    function Se(e, t, n = {
        label: "cookie",
        useBearer: !1,
        useSkype: !1
    }) {
        const o = {
            "Content-Type": "application/json",
            "x-ms-client-user-agent": "Teams-V2-Web",
            "x-ms-correlation-id": t
        };
        e && (o["x-ms-endpoint-id"] = e);
        const r = nt();
        for (const [e, t] of Object.entries(r)) P(t) && (o[e] = String(t));
        return n.useBearer && U.tokenInfo && U.tokenInfo.token && (o.Authorization = "Bearer " + U.tokenInfo.token), n.useSkype && U.skypeTokenInfo && U.skypeTokenInfo.token && (o["x-skypetoken"] = U.skypeTokenInfo.token), o
    }

    function ke(e) {
        const t = Se(e, Ie(), {
            label: "keepalive",
            useBearer: !(!U.tokenInfo || !U.tokenInfo.token),
            useSkype: !(!U.skypeTokenInfo || !U.skypeTokenInfo.token)
        });
        return delete t["x-ms-correlation-id"], t
    }
    function bridgeFailureSignature(message, url, method) {
        return [Y(message || "", 120), (() => { try { const parsed = new URL(String(url || "")); return parsed.origin + parsed.pathname } catch { return Y(url || "", 120) } })(), String(method || "GET").toUpperCase()].join("|")
    }

    function noteBridgeProxyFailure(message, url, method, authMode) {
        try {
            const signature = bridgeFailureSignature(message, url, method);
            const now = z();
            D.bridgeProxyFailureDedupe || (D.bridgeProxyFailureDedupe = Object.create(null));
            const last = Number(D.bridgeProxyFailureDedupe[signature] || 0);
            D.bridgeProxyFailureDedupe[signature] = now;
            pruneTimestampMap(D.bridgeProxyFailureDedupe, 32, 300000);
            if (last && now - last < 60000) return;
            q("bridge", "Extension bridge unavailable; reconnecting", {
                msg: Y(message || "", 180),
                method: String(method || "GET").toUpperCase(),
                url: (() => { try { const parsed = new URL(String(url || "")); return parsed.origin + parsed.pathname } catch { return Y(url || "", 180) } })(),
                authMode: authMode || null,
                fallback: "none"
            })
        } catch {}
    }

    function isForceAvailabilityRequestUrl(e) {
        try {
            const t = new URL(String(e || ""), location.href), n = String(t.pathname || "").replace(/\/+$/, "").toLowerCase();
            return /(^|\.)(?:teams\.live\.com|teams\.microsoft\.com|teams\.cloud\.microsoft)$/i.test(t.hostname) && n.endsWith("/v1/me/forceavailability")
        } catch {
            return !1
        }
    }

    function availabilityBridgeHeaderHints(endpointId) {
        const e = {};
        P(endpointId) && (e["x-ms-endpoint-id"] = String(endpointId));
        try {
            const t = collectLiveDiscoveryHints().presenceHeaders || {};
            for (const n of ["x-ms-session-id", "x-ms-client-version", "x-ms-client-caller", "x-ms-client-consumer-type", "x-ms-object-id"]) P(t[n]) && (e[n] = String(t[n]))
        } catch {}
        return e
    }

    async function xe(e, t, n, o, r = {
        label: "cookie",
        useBearer: !1,
        useSkype: !1
    }) {
        const i = Ie(),
            a = new URL(e, L.directBaseUrl.endsWith("/") ? L.directBaseUrl : L.directBaseUrl + "/").toString(),
            availabilityForceRequest = isForceAvailabilityRequestUrl(a),
            availabilityStatusKey = availabilityForceRequest && n && typeof n === "object" ? String(n.statusKey || n.availability || n.activity || "") : "",
            s = availabilityForceRequest ? availabilityBridgeHeaderHints(o) : Se(o, i, r),
            l = null == n ? null : we(n),
            c = availabilityForceRequest ? null : null == n ? null : JSON.stringify(n),
            u = {
                method: t,
                headers: s,
                body: null == c ? void 0 : c,
                credentials: "include",
                mode: "cors",
                cache: "no-store",
                redirect: "follow"
            };
        try {
            const e = await (d = {
                url: a,
                baseUrl: availabilityForceRequest ? L.directBaseUrl || "" : "",
                operation: availabilityForceRequest ? t === "DELETE" ? "presence.clearavailability" : "presence.forceavailability" : "",
                method: t,
                headers: s,
                body: availabilityForceRequest ? void 0 : c,
                statusKey: availabilityStatusKey,
                endpointId: o,
                authMode: r && r.label || "cookie",
                pageUrl: location.href
            }, new Promise((e, t) => {
                pruneBridgePending();
                const n = "th-bridge-" + ++D.seq + "-" + Math.random().toString(36).slice(2, 8),
                    o = U.nativeSetTimeout ? U.nativeSetTimeout(() => {
                        D.pending.delete(n), t(new Error("extension bridge timeout"))
                    }, 65e3) : null;
                const createdAt = Date.now();
                D.pending.set(n, {
                    resolve: e,
                    reject: t,
                    timer: o,
                    createdAt,
                    expiresAt: createdAt + 65e3
                }), ee("proxyFetch", {
                    id: n,
                    request: d
                }) || (o && U.nativeClearTimeout && U.nativeClearTimeout(o), D.pending.delete(n), t(new Error("extension bridge unavailable")))
            }));
            te(e && e.captureUsed ? {
                captureAuth: e.captureAuth || null
            } : null);
            const p = String(e && e.responseText || "");
            if (e && !e.ok && null == e.status && /Active beta|subscription required|permit|required|license/i.test(p)) {
                q("bridge", "Proxy fetch rejected by extension runtime policy", {
                    url: a.replace(/([?&]skypetoken=)[^&]+/i, "$1…"),
                    method: t,
                    authMode: r && r.label || "cookie",
                    reason: Y(p, 180),
                    fallback: "disabled"
                });
                return {
                    ok: false,
                    status: null,
                    authMode: r && r.label || "cookie",
                    url: a,
                    method: t,
                    body: l,
                    responseText: Y(p, 900),
                    transport: "extension-runtime-policy-error",
                    captureUsed: !1,
                    captureAuth: null
                }
            }
            const result = {
                ok: !(!e || !e.ok),
                status: e && null != e.status ? e.status : null,
                authMode: e && e.authMode || r && r.label || "cookie",
                url: a,
                method: t,
                body: l,
                responseText: Y(p, 900),
                transport: e && e.transport || "extension",
                captureUsed: !(!e || !e.captureUsed),
                captureAuth: e && e.captureAuth || null
            };
            if (result.ok) clearPresenceAuthFailure("proxy-fetch-ok");
            else if (!isPresenceGetPresenceUrl(a) && isPresenceAuthFailureResponse(result)) recordPresenceAuthFailure(result, "proxy-fetch");
            return result
        } catch (e) {
            const n = Y(e && (e.message || e.msg) || e, 220);
            const transportUnavailable = /bridge unavailable|port disconnected|receiving end does not exist|extension context invalidated/i.test(n);
            if (transportUnavailable) {
                D.ready = false;
                try { ne(0) } catch {}
            }
            q("bridge", transportUnavailable ? "Extension bridge send failed; reconnecting" : "Extension bridge request timed out; background work may still be finishing", {
                msg: n,
                method: t,
                url: (() => { try { const parsed = new URL(String(a || "")); return parsed.origin + parsed.pathname } catch { return Y(a || "", 180) } })(),
                authMode: r && r.label || "cookie",
                retry: transportUnavailable ? "bridge-ping" : "none"
            });
            return {
                ok: false,
                status: null,
                authMode: r && r.label || "cookie",
                url: a,
                method: t,
                body: l,
                responseText: n,
                transport: "extension-bridge-error",
                captureUsed: false,
                captureAuth: null
            }
        }
        var d
    }
    function getAuthModeCandidates() {
        const e = [],
            t = new Set,
            n = (n, o, r) => {
                t.has(n) || ((!o || U.tokenInfo && U.tokenInfo.token) && (!r || U.skypeTokenInfo && U.skypeTokenInfo.token) && (t.add(n), e.push({
                    label: n,
                    useBearer: o,
                    useSkype: r
                })))
            };
        n("cookie", !1, !1);
        switch (U.lastGoodAuthMode) {
            case "bearer+skype":
            case "skype":
            case "bearer":
                n(U.lastGoodAuthMode, /bearer/.test(U.lastGoodAuthMode), /skype/.test(U.lastGoodAuthMode))
        }
        return n("bearer+skype", !0, !0), n("skype", !1, !0), n("bearer", !0, !1), e
    }

    function getCurrentUserMri(e = L.endpointInfo) {
        const t = e && e.loginUserMri;
        if (P(t)) return String(t);
        const n = U.skypeTokenInfo && U.skypeTokenInfo.skypeId;
        return P(n) ? String(n) : null
    }

    const CALL_ACTIVITY_RE = /\b(?:inacall|inameeting|incall|inmeeting|onacall|oncall|calling|callconnected|meeting|presenting)\b/i;
    const CALL_TEXT_RE = /\b(?:in a call|on a call|in meeting|in a meeting|call connected|meeting in progress|currently in call|currently in a call|teams call|teams meeting|call is active|active call|phone call|mobile call)\b/i;
    const CALL_API_SIGNAL_TTL_MS = 180 * 1000;
    const CALL_API_IDLE_GRACE_MS = 20 * 1000;
    const CALL_API_STRONG_RE = /(?:api(?:-[a-z0-9-]+)?\.flightproxy\.(?:skype|teams\.microsoft)\.com\/api\/v2\/(?:cpconv|epconv|(?:cp|ep)\/[^?#]+\/(?:conv\/|api\/v1\/subscribe\/))|\/updateEndpoint(?:Metadata|State)(?:[?#]|$))/i;
    const CALL_API_CONTEXT_RE = /(?:\/v1\/presence\/getpresence\/?|\/v1\/pubsub\/subscriptions\/|edge\.skype\.com\/registrar\/prod\/v2\/registrations|go\.trouter\.skype\.com|\/calendars\/(?:default\/)?calendarView|\/privateMeeting\/schedulingService\/create|\/api\/chatsvc\/(?:consumer\/v1|amer\/v1|[^/]+\/v1)\/(?:threads|users\/ME\/conversations\/19(?::|%3A)meeting))/i;
    const CALL_API_BODY_RE = /\b(?:callState|meetingState|activeCall|activeConversation|selfParticipant|mediaSession|callLeg|callId|conversationId|roster|participant|presenter|muted|onHold|connected|inCall|inMeeting)\b/i;
    const SEEN_MARKER_RE = /\/api\/chatsvc\/[^?#]*(?:\/properties(?:[?#][^#]*)?|\/consumptionhorizons?)(?:[?#]|$|[^#]*\bname=consumptionhorizon\b)|\/api\/chatsvc\/[^?#]*[?#][^#]*(?:^|[?&])name=consumptionhorizon\b|\/api\/chatsvc\/[^?#]*consumptionhorizons?/i;
    const SEEN_BODY_RE = /(?:^|[\s{"'&,;])consumptionhorizons?(?:[\s}"'&,;:=]|$)/i;
    function collectCallText(e, t = 0, n = []) {
        if (null == e || t > 5 || n.length > 80) return n;
        if ("string" == typeof e || "number" == typeof e || "boolean" == typeof e) {
            const t = String(e || "").trim();
            t && n.push(t);
            return n
        }
        if (Array.isArray(e)) {
            for (const o of e) collectCallText(o, t + 1, n);
            return n
        }
        if (E(e)) {
            for (const [o, r] of Object.entries(e)) {
                /activity|availability|call|meeting|media|conversation|status|state|calendar|device|endpoint|source|label|caption|title|aria/i.test(String(o || "")) && collectCallText(r, t + 1, n)
            }
        }
        return n
    }
    function isCallLikePresence(e) {
        if (!E(e)) return !1;
        const t = [e.activity, e.availability, e.status, e.statusMessage, e.state, e.meetingState, e.callState].map((e => String(e || "").toLowerCase())).join(" "),
            n = e.calendarData;
        if (CALL_ACTIVITY_RE.test(t) || CALL_TEXT_RE.test(t)) return !0;
        if (E(n) && (n.isInMeeting || n.isInCall || n.isCall || n.isMeeting)) return !0;
        return collectCallText(e).some((e => CALL_ACTIVITY_RE.test(e) || CALL_TEXT_RE.test(e)))
    }
    function isStrongTeamsCallApiUrl(e) {
        const t = String(e || "");
        return CALL_API_STRONG_RE.test(t) || /api(?:-[a-z0-9-]+)?\.flightproxy\.(?:skype|teams\.microsoft)\.com\/api\/v2\/(?:cp|ep)\/[^?#]+\/conv\/[^?#]+\/(?:updateEndpointMetadata|updateEndpointState|leave)(?:[?#]|$)/i.test(t)
    }
    function isCallContextApiUrl(e) {
        return CALL_API_CONTEXT_RE.test(String(e || ""))
    }
    function isPresenceGetPresenceUrl(e) {
        return /\/v1\/presence\/getpresence\/?(?:[?#]|$)/i.test(String(e || ""))
    }
    function isTeamsCallApiUrl(e) {
        const t = String(e || "");
        return isStrongTeamsCallApiUrl(t) || isCallContextApiUrl(t)
    }
    function isNotSeenModeEnabled() {
        try { return !1 !== normalizeManagerState(L.manager).notSeenMode } catch { return !0 }
    }
    function bodyTextForSeenMarker(e) {
        try {
            if (null == e) return "";
            if ("string" == typeof e) return e.slice(0, 4096);
            if (e instanceof URLSearchParams) return e.toString().slice(0, 4096);
            if (e instanceof FormData) {
                const t = [];
                e.forEach((e, n) => t.push(String(n || "") + "=" + String(e || "")));
                return t.join("&").slice(0, 4096)
            }
            if (e && "object" == typeof e && !(e instanceof Blob) && !(e instanceof ArrayBuffer) && !ArrayBuffer.isView(e)) return JSON.stringify(e).slice(0, 4096)
        } catch {}
        return ""
    }
    function shouldBlockSeenMarkerRequest(e, t = "", n = null) {
        const o = String(t || "GET").toUpperCase(), r = String(e || ""), i = bodyTextForSeenMarker(n);
        return isNotSeenModeEnabled() && /^(?:PUT|POST|PATCH)$/i.test(o) && (SEEN_MARKER_RE.test(r) || (i && /\/api\/chatsvc\//i.test(r) && SEEN_BODY_RE.test(i)))
    }
    function noteSeenMarkerBlocked(e, t = "network") {
        L.lastNotSeenBlock = { at: z(), url: String(e || "").slice(0, 220), source: String(t || "network") };
        q("privacy", "Blocked Teams consumption horizon update", { source: t });
        ct()
    }
    function syntheticSeenMarkerResponse() {
        return new Response("", { status: 200, statusText: "OK", headers: { "content-type": "text/plain;charset=UTF-8", "x-teams-helper-not-seen": "blocked" } })
    }
    function describeTeamsCallApiUrl(e) {
        const t = String(e || "");
        if (/\/api\/v2\/cpconv/i.test(t)) return "flightproxy cpconv";
        if (/\/api\/v2\/epconv/i.test(t)) return "flightproxy epconv";
        if (/\/api\/v2\/(?:cp|ep)\/[^?#]+\/conv\//i.test(t)) return /updateEndpointState/i.test(t) ? "flightproxy endpoint state" : /updateEndpointMetadata/i.test(t) ? "flightproxy endpoint metadata" : /\/leave(?:[?#]|$)/i.test(t) ? "flightproxy leave" : "flightproxy active conversation";
        if (/\/api\/v2\/(?:cp|ep)\/[^?#]+\/api\/v1\/subscribe\//i.test(t)) return "flightproxy call subscription";
        if (/\/v1\/presence\/getpresence\/?/i.test(t)) return "Teams presence API";
        if (/\/v1\/pubsub\/subscriptions\//i.test(t)) return "UPS presence pubsub";
        if (/registrar\/prod\/v2\/registrations/i.test(t)) return "Skype registrar";
        if (/go\.trouter\.skype\.com/i.test(t)) return "Trouter route check";
        if (/calendarView/i.test(t)) return "calendar view";
        if (/schedulingService\/create/i.test(t)) return "meeting scheduling";
        if (/19(?::|%3A)meeting/i.test(t)) return "meeting thread API";
        return "Teams API"
    }
    function freshCallApiState() {
        const e = L.lastCallApiState;
        if (!e || !e.inCall || !Number.isFinite(Number(e.at))) return null;
        return z() - Number(e.at) <= CALL_API_SIGNAL_TTL_MS ? e : null
    }
    function pushCallApiRuntimeState(e = "call-api-state") {
        const t = z();
        if (t - Number(U.callApiSyncLastAt || 0) < 3000) return;
        U.callApiSyncLastAt = t;
        try { oe(e) } catch {}
    }
    function parsePresenceResponseBody(e) {
        try {
            const raw = String(e || "[]");
            if (raw.length > 262144) return null;
            const t = JSON.parse(raw);
            return Array.isArray(t) && t[0] && t[0].presence && "object" == typeof t[0].presence ? t[0].presence : t && t.presence && "object" == typeof t.presence ? t.presence : null
        } catch { return null }
    }
    function rememberPresenceApiResponse(e, t = "", n = "api-response", o = "", r = null) {
        if (!isPresenceGetPresenceUrl(e)) return;
        const i = parsePresenceResponseBody(t);
        if (!i) return;
        L.lastBackendPresence = { at: z(), authMode: String(n || "observed-api"), ...i };
        setLastCallState(mergeCallStates({ known: !0, inCall: isCallLikePresence(i), source: "teams-api-presence", detail: describeBackendPresence(i) }, freshCallApiState(), "teams-api-presence"));
        q("presence", "Captured Teams presence API response", { source: n, status: r || null, presence: describeBackendPresence(i) });
        ct()
    }
    function rememberCallApiSignal(e, t = null, n = "api", o = "", r = null) {
        const i = String(e || "");
        if (!isTeamsCallApiUrl(i)) return;
        if (isPresenceGetPresenceUrl(i)) return void rememberPresenceApiResponse(i, t, n, o, r);
        const a = String(o || "GET").toUpperCase();
        if ("OPTIONS" === a) return;
        const s = describeTeamsCallApiUrl(i);
        if (/\/leave(?:[?#]|$)/i.test(i)) {
            L.lastCallApiState = { at: z(), known: !0, inCall: !1, source: "teams-api", detail: [s, String(n || "api").replace(/^api-/, ""), a, Number.isFinite(Number(r)) ? String(r) : ""].filter(Boolean).join(" · ") };
            setLastCallState(L.lastCallApiState);
            pushCallApiRuntimeState("call-api-leave");
            return
        }
        if (!isStrongTeamsCallApiUrl(i)) return;
        const l = {
            at: z(),
            known: !0,
            inCall: !0,
            source: "teams-api",
            detail: [s, String(n || "api").replace(/^api-/, ""), a, Number.isFinite(Number(r)) ? String(r) : ""].filter(Boolean).join(" · ")
        };
        L.lastCallApiState = l;
        setLastCallState(l);
        q("presence", "Teams call-control API signal detected", { api: s, source: n, method: a || null, status: r || null });
        pushCallApiRuntimeState("call-api-signal")
    }
    function detectApiCallState() {
        const e = freshCallApiState();
        if (e) return e;
        if (L.lastBackendPresence) return { known: !0, inCall: isCallLikePresence(L.lastBackendPresence), source: "teams-api-presence", detail: describeBackendPresence(L.lastBackendPresence) };
        if (U.callMonitorStartedAt && z() - Number(U.callMonitorStartedAt) > CALL_API_IDLE_GRACE_MS) return { known: !1, inCall: !1, source: "teams-api", detail: "waiting for Teams presence/API" };
        return { known: !1, inCall: !1, source: "teams-api", detail: "waiting for Teams presence/API" }
    }
    function mergeCallStates(e, t, n) {
        const states = [e, t].filter(Boolean);
        const active = states.find((e => e && e.inCall));
        if (active) return { known: !0, inCall: !0, source: states.map((e => e.source)).filter(Boolean).join('+') || n || 'call-detector', detail: active.detail || '' };
        const known = states.find((e => e && e.known));
        return known ? { known: !0, inCall: !1, source: known.source || n || 'call-detector', detail: known.detail || '' } : { known: !1, inCall: !1, source: n || 'call-detector', detail: 'waiting for Teams presence/API' }
    }
    function setLastCallState(e) {
        if (!e || "object" != typeof e) return;
        const next = {
            at: z(),
            known: !!e.known,
            inCall: !!e.inCall,
            source: e.source || 'unknown',
            detail: e.detail || ''
        };
        const prev = L.lastCallState || null;
        L.lastCallState = next;
        if (!prev || prev.known !== next.known || prev.inCall !== next.inCall || prev.source !== next.source || prev.detail !== next.detail) ct()
    }
    function formatCallStateForUi(e) {
        if (!e || "object" != typeof e) return "Checking calls · waiting for Teams presence/API";
        if (!e.known) return "Checking calls · waiting for Teams presence/API";
        if (e.inCall) return "In call · Teams API";
        const t = String(e.source || "").toLowerCase();
        const n = String(e.detail || "").trim();
        if (/presence/.test(t) && n && !/presence unavailable|no presence body|waiting/i.test(n)) return "Not in call · Teams presence · " + n;
        if (/leave/.test(n)) return "Not in call · Teams call ended";
        return "Not in call · Teams API";
    }
    async function refreshCallState(e = 'poll', t = !1) {
        const n = detectApiCallState();
        if (!L.lastCallState || n.inCall || L.lastCallState.inCall && !n.inCall) setLastCallState(n);
        const now = z();
        if (!t && now - Number(U.callPollLastNetworkAt || 0) < 60000) return L.lastCallState || n;
        U.callPollLastNetworkAt = now;
        try {
            await fetchBackendPresence('call-state-' + e);
        } catch {}
        return L.lastCallState || n
    }
    function startCallStateMonitor() {
        if (!U.nativeSetInterval || !U.nativeClearInterval) return;
        U.callMonitorStartedAt = z();
        U.callPollTimer && (U.nativeClearInterval(U.callPollTimer), U.callPollTimer = null);
        refreshCallState('startup', !0).catch((() => {}));
        U.callPollTimer = U.nativeSetInterval((() => {
            refreshCallState('timer').catch((() => {}))
        }), 60000)
    }

    function describeBackendPresence(e) {
        if (!E(e)) return "No status yet";
        const t = String(e.activity || e.availability || e.status || "No status yet");
        return "OffWork" === t ? "Offline" : t
    }
    function isVerifierPresenceReason(e) {
        return /^verify(?:-|$)/i.test(String(e || ""))
    }
    function presenceLooksOffline(e) {
        if (!E(e)) return false;
        return /(?:offwork|offline)/i.test([e.activity, e.availability, e.status].map(value => String(value || "").toLowerCase()).join(" "))
    }

    async function fetchBackendPresence(e = "presence-check") {
        const verifierOnly = isVerifierPresenceReason(e);
        const t = L.endpointInfo || await he(e, {
            silent: !0
        });
        if (!t || !t.endpointId) {
            const apiState = detectApiCallState();
            setLastCallState(mergeCallStates(null, apiState, e));
            return {
                ok: !1,
                status: null,
                presence: null,
                isInCall: !!apiState.inCall,
                authMode: null,
                attemptedModes: []
            }
        };
        const n = getCurrentUserMri(t);
        if (!n) {
            const apiState = detectApiCallState();
            setLastCallState(mergeCallStates(null, apiState, e));
            return {
                ok: !1,
                status: null,
                presence: null,
                isInCall: !!apiState.inCall,
                authMode: null,
                attemptedModes: []
            }
        };
        const o = [{
            mri: n,
            memberType: "User"
        }],
            r = [];
        let i = null;
        for (const a of getAuthModeCandidates()) {
            r.push(a.label);
            try {
                i = await xe("v1/presence/getpresence/", "POST", o, t.endpointId, a)
            } catch (e) {
                i = {
                    ok: !1,
                    status: null,
                    authMode: a.label,
                    responseText: String(e && e.msg || e)
                }
            }
            if (!i || 401 !== i.status && 403 !== i.status) {
                const e = function(e) {
                    try {
                        const t = JSON.parse(e || "[]");
                        return Array.isArray(t) && t[0] && t[0].presence ? t[0].presence : null
                    } catch {
                        return null
                    }
                }(i && i.responseText);
                const apiState = detectApiCallState();
                const presenceInCall = isCallLikePresence(e);
                e && !verifierOnly && (L.lastBackendPresence = {
                    at: z(),
                    authMode: a.label,
                    ...e
                });
                setLastCallState(mergeCallStates({ known: !!e, inCall: presenceInCall, source: 'teams-api-presence', detail: e ? describeBackendPresence(e) : 'no presence body' }, apiState, 'teams-api-presence'));
                return ct(), {
                    ok: !!(i && i.ok),
                    status: i && i.status || null,
                    authMode: a.label,
                    attemptedModes: r,
                    presence: e,
                    responseText: i && i.responseText || "",
                    isInCall: !!(presenceInCall || apiState.inCall)
                }
            }
        }
        const apiState = detectApiCallState();
        setLastCallState(mergeCallStates(null, apiState, e));
        if (!verifierOnly && isPresenceAuthFailureResponse(i)) recordPresenceAuthFailure(i, "getpresence");
        return {
            ok: !1,
            status: i && i.status || null,
            authMode: i && i.authMode || null,
            attemptedModes: r,
            responseText: i && i.responseText || "",
            presence: null,
            isInCall: !!apiState.inCall
        }
    }

    function cleanForceReason(e) {
        return String(e || "direct-force").replace(/(?:-queued)+$/g, "") || "direct-force"
    }

    function responseTextOf(e) {
        return String(e && (e.responseText || e.response || e.body) || "")
    }

    function isPresenceRateLimitedResponse(e) {
        return !!(e && (429 === Number(e.status) || /\b42901\b|\b429\b|too many requests|rate.?limit/i.test(responseTextOf(e))))
    }

    function isPresenceInvalidStateResponse(e) {
        return !!(e && (400 === Number(e.status) || 409 === Number(e.status)) && /Invalid Incoming Endpoint State|not allowed for Transport|Availability=.*not allowed|validationState/i.test(responseTextOf(e)))
    }

    function isPresenceAuthFailureText(e) {
        return /\bAuthFailed\b|InteractionRequired|We need you to sign in again|sign in again|authService is missing|Discover::regionGtm::InvalidResponse|acquireToken|AADSTS|invalid_grant|login required|reauth/i.test(String(e || ""))
    }

    function isPresenceAuthFailureResponse(e) {
        if (!e) return false;
        const status = Number(e.status);
        const text = responseTextOf(e);
        if ((401 === status || 403 === status) && (!text || isPresenceAuthFailureText(text) || /unauthori[sz]ed|forbidden|token|auth/i.test(text))) return true;
        return isPresenceAuthFailureText(text)
    }

    function clearPresenceAuthFailure(reason) {
        if (!U.presenceAuthFailureUntil && !U.presenceAuthFailureAt) return;
        U.presenceAuthFailureUntil = 0;
        U.presenceAuthFailureReason = "";
        U.preferCookieAuthModeUntil = 0;
        if (reason && z() - Number(U.lastAuthFailureLogAt || 0) > 30000) {
            U.lastAuthFailureLogAt = z();
            q("auth", "Teams auth recovered", { reason })
        }
    }

    function recordPresenceAuthFailure(e, context) {
        const now = z();
        const text = responseTextOf(e);
        U.presenceAuthFailureAt = now;
        U.presenceAuthFailureUntil = 0;
        U.preferCookieAuthModeUntil = now + 60 * 60 * 1000;
        U.presenceAuthFailureReason = Y(text || context || "Teams sign-in required", 220);
        U.lastGoodAuthMode = "cookie";
        L.auth = { state: "Needs sign-in", reason: U.presenceAuthFailureReason, at: now };
        if (now - Number(U.lastAuthFailureLogAt || 0) > 30000) {
            U.lastAuthFailureLogAt = now;
            q("auth", "Teams sign-in required; holding automatic presence writes until Teams refreshes auth", {
                context: context || null,
                status: e && e.status || null,
                authMode: e && e.authMode || null,
                responseText: Y(text, 220)
            })
        }
        ct();
    }

    function presenceAuthRecoveryActive(reason) {
        return false
    }

    function presenceForceBackoffActive() {
        return false
    }

    function skipPresenceForceForBackoff() {
        return false
    }

    function availabilityOnlyForceBody(body) {
        const source = E(body) ? body : {};
        const availability = String(source.availability || "Available");
        const next = { availability };
        if ("offline" === availability.toLowerCase()) next.activity = "OffWork";
        return next
    }

    function directForceTargetSignature(endpointId, resolved) {
        const rule = resolved && resolved.rule || null;
        return [String(endpointId || ""), resolved && resolved.statusKey || "idle", resolved && resolved.source || "", rule && rule.id || "", rule && rule.start || "", rule && rule.end || "", rule && rule.date || "", Array.isArray(rule && rule.days) ? rule.days.join(",") : ""].join("|")
    }

    function normalizePresenceValue(value) {
        return String(value || "").replace(/[\s_-]+/g, "").toLowerCase()
    }

    function presenceMatchesManagedStatus(presence, resolved) {
        if (!presence || !resolved || !resolved.status) return false;
        const wantAvailability = normalizePresenceValue(resolved.status.availability || resolved.statusKey);
        const wantActivity = normalizePresenceValue(resolved.status.activity || resolved.status.availability || resolved.statusKey);
        const gotAvailability = normalizePresenceValue(presence.availability || presence.status || presence.activity);
        const gotActivity = normalizePresenceValue(presence.activity || presence.availability || presence.status);
        if (!gotAvailability && !gotActivity) return false;
        if ("available" === resolved.statusKey) return gotAvailability === "available" || gotActivity === "available";
        return gotAvailability === wantAvailability || gotActivity === wantActivity
    }

    function isAutomaticForceReason(reason) {
        return /^(?:heartbeat|scheduled-refresh|startup|bootstrap|bridge-ready|remote-state|cloud-|cloud-schedule|page-autosync|call-state|focus|visible)/i.test(cleanForceReason(reason || ""))
    }

    function isUserInitiatedForceReason(reason) {
        return /(?:manual|manager-manual|manager-presence|gui-presence|presence-apply|presence-force|toggle-enabled|enabled|activity-apply|activity-toggle|force-now|user)/i.test(cleanForceReason(reason || ""))
    }

    function manualStyleScheduleForceReason(reason) {
        const raw = cleanForceReason(reason || "schedule");
        if (isUserInitiatedForceReason(raw)) return raw;
        return "schedule-presence-force-" + raw.replace(/[^a-z0-9_.:-]+/gi, "-").slice(0, 120)
    }

    function shouldSkipRepeatedDirectForce(signature, reason, resolved) {
        if (!signature) return false;
        const now = z();
        if (/(?:afk|idle|locked|reassert|wake|wakeup|visibility-hidden|pagehide|freeze|another-tab)/i.test(String(reason || ""))) return false;
        const userInitiated = isUserInitiatedForceReason(reason);
        const manualActive = !!(resolved && resolved.source === "manual-override");
        const okWindow = manualActive ? 240000 : userInitiated ? 5000 : 90000;
        const errWindow = manualActive ? 45000 : userInitiated ? 3000 : 15000;
        if (U.lastDirectForceSignature === signature && U.lastDirectForceOk && now - (U.lastDirectForceAt || 0) < okWindow) return true;
        if (U.lastDirectForceErrorSignature === signature && now - (U.lastDirectForceErrorAt || 0) < errWindow) return true;
        return false
    }

    function rememberDirectForceOutcome(signature, ok, responses) {
        if (!signature) return;
        U.lastDirectForceSignature = signature;
        U.lastDirectForceAt = z();
        U.lastDirectForceOk = !!ok;
        if (ok) {
            U.lastDirectForceErrorSignature = "";
            U.lastDirectForceErrorAt = 0;
            U.presenceForceBackoffMs = 0;
            U.presenceForceBackoffUntil = 0;
        } else {
            U.lastDirectForceErrorSignature = signature;
            U.lastDirectForceErrorAt = z();
        }
        const endpoint = responses && responses.endpoint, force = responses && responses.force;
        if (isPresenceRateLimitedResponse(endpoint) || isPresenceRateLimitedResponse(force)) U.lastDirectForceRateLimitedAt = z()
    }

    function recordPresenceForceOutcome(ok, responses) {
        if (ok) {
            U.presenceForceBackoffMs = 0;
            U.presenceForceBackoffUntil = 0
        }
        const activity = responses && responses.activity;
        if (isPresenceRateLimitedResponse(activity)) U.lastDirectForceRateLimitedAt = z()
    }

    async function Ce(e) {
        if (!isRuntimePolicyAllowed()) return false;
        if (U.forcePromise) {
            try { return !!(await U.forcePromise) } catch { return false }
        }
        U.pendingForceReason = null;
        const t = (async () => {
            Xe("force-" + String(e || "unknown"));
            const t = String(e || "unknown"),
                n = /^(startup|bootstrap|bridge-ready)$/i.test(t),
                o = /^(startup|bootstrap|bridge-ready|toggle-enabled|scheduled-refresh)$/i.test(t);
            if (false && n && (!L.lastReplay || !L.lastReplay.ok)) return !1;
            const r = await he(e, {
                silent: !0,
                retryOnMiss: 0
            });
            if (!r.endpointInfo || !r.endpointInfo.endpointId) return L.lastReplay = {
                at: z(),
                reason: e,
                ok: !1,
                status: null
            }, q("error", "No presence endpoint id found", {
                reason: e,
                authState: r.auth && r.auth.state || null
            }), scheduleLightUiRefresh("force"), !1;
            const i = r.endpointInfo.endpointId;
            if (false && /^(startup|bootstrap|bridge-ready|scheduled-refresh)$/i.test(t) && U.lastFailedEndpointId && U.lastFailedEndpointId === i && (!L.lastReplay || !L.lastReplay.ok)) return !1;
            const a = resolveManagedStatus(L.manager, new Date, { manualOverride: !!L.enabled });
            const manualForce = !!(a && a.source === "manual-override" || isUserInitiatedForceReason(t));
            if (!a.active) {
                let clearForce = null, clearAuthMode = null;
                const shouldClear = !!(normalizeManagerState(L.manager).scheduleEnabled && hasEnabledScheduleRules(L.manager) || /(?:toggle-enabled|disabled|manual-off)/i.test(String(e || "")));
                if (shouldClear) {
                    for (const authMode of getAuthModeCandidates()) {
                        clearAuthMode = authMode.label;
                        try {
                            clearForce = await xe("v1/me/forceavailability/", "DELETE", null, i, authMode);
                        } catch (err) {
                            clearForce = { ok: !1, status: null, authMode: authMode.label, responseText: String(err && err.msg || err) };
                        }
                        if (!clearForce || 401 !== clearForce.status && 403 !== clearForce.status) break;
                    }
                }
                L.lastReplay = {
                    at: z(),
                    reason: e,
                    ok: !0,
                    skipped: !0,
                    body: {
                        endpointId: i,
                        statusKey: a.statusKey,
                        skipReason: "no-active-manual-or-schedule",
                        clearForceStatus: clearForce && clearForce.status || null,
                        clearForceOk: !!(clearForce && clearForce.ok),
                        authMode: clearAuthMode || null
                    }
                };
                q("direct", shouldClear ? "Cleared expired schedule force because no schedule rule is active" : "Skipped direct force because manual override is off and no schedule rule is active", {
                    reason: e,
                    endpointId: Z(i),
                    clearForceStatus: clearForce && clearForce.status || null,
                    clearForceOk: !!(clearForce && clearForce.ok)
                });
                scheduleLightUiRefresh("force");
                return !0;
            }
            if (presenceAuthRecoveryActive(t)) return L.lastReplay = {
                at: z(),
                reason: e,
                ok: !1,
                skipped: !0,
                body: {
                    endpointId: i,
                    statusKey: a.statusKey,
                    skipReason: "teams-sign-in-required",
                    authFailureUntil: U.presenceAuthFailureUntil ? new Date(U.presenceAuthFailureUntil).toISOString() : null,
                    authFailureReason: U.presenceAuthFailureReason || null
                }
            }, q("auth", "Skipped automatic direct force because Teams needs sign-in refresh", {
                reason: e,
                endpointId: Z(i),
                statusKey: a.statusKey,
                authFailureReason: U.presenceAuthFailureReason || null
            }), scheduleLightUiRefresh("force"), !1;
            manualForce && (U.preferCookieAuthModeUntil = z() + 10 * 60 * 1000);
            const skipPreflight = true;
            const s = skipPreflight ? {
                    ok: true,
                    status: null,
                    authMode: null,
                    attemptedModes: [],
                    responseText: "presence write skipped preflight getpresence",
                    presence: null,
                    isInCall: !!detectApiCallState().inCall
                } : await fetchBackendPresence(`force-${t}`),
                l = !manualForce && !!(s && s.isInCall) && "available" === a.statusKey && !managedStatusAllowsAvailableDuringCalls(a);
            if (l) return L.lastReplay = {
                at: z(),
                reason: e,
                ok: !0,
                skipped: !0,
                body: {
                    endpointId: i,
                    statusKey: a.statusKey,
                    skipReason: "call-active",
                    backendStatus: s && s.presence ? describeBackendPresence(s.presence) : null
                }
            }, q("direct", "Skipped direct force because call is active", {
                reason: e,
                endpointId: Z(i),
                statusKey: a.statusKey,
                backendStatus: s && s.presence ? describeBackendPresence(s.presence) : null
            }), scheduleLightUiRefresh("force"), !0;
            const targetSignature = directForceTargetSignature(i, a);
            if (!manualForce && s && s.presence && presenceMatchesManagedStatus(s.presence, a)) return rememberDirectForceOutcome(targetSignature, !0, null), L.lastReplay = {
                at: z(),
                reason: e,
                ok: !0,
                skipped: !0,
                body: {
                    endpointId: i,
                    statusKey: a.statusKey,
                    skipReason: "already-target-status",
                    backendStatus: describeBackendPresence(s.presence)
                }
            }, q("direct", "Skipped direct force because Teams already reports the target status", {
                reason: e,
                endpointId: Z(i),
                statusKey: a.statusKey,
                backendStatus: describeBackendPresence(s.presence)
            }), scheduleLightUiRefresh("force"), !0;
            if (shouldSkipRepeatedDirectForce(targetSignature, e, a)) return L.lastReplay = {
                at: z(),
                reason: e,
                ok: !!U.lastDirectForceOk,
                skipped: !0,
                body: {
                    endpointId: i,
                    statusKey: a.statusKey,
                    skipReason: U.lastDirectForceOk ? "target-already-forced" : "duplicate-force-disabled",
                    lastForceAt: U.lastDirectForceAt ? new Date(U.lastDirectForceAt).toISOString() : null,
                    lastErrorAt: U.lastDirectForceErrorAt ? new Date(U.lastDirectForceErrorAt).toISOString() : null
                }
            }, q("direct", U.lastDirectForceOk ? "Skipped duplicate direct force because target was already applied" : "Duplicate force disabled", {
                reason: e,
                endpointId: Z(i),
                statusKey: a.statusKey
            }), scheduleLightUiRefresh("force"), !!U.lastDirectForceOk;
            const c = buildManagedBodies(ot({
                    id: i,
                    availability: "Available",
                    activity: "Available",
                    activityReporting: "Transport",
                    deviceType: "Web"
                }, "endpointBody"), i, ot({
                    availability: a.status.availability,
                    activity: a.status.activity
                }, "forceBody"), a.statusKey, ot({
                    endpointId: i,
                    isActive: !0
                }, "activityBody")),
                u = c.endpointBody,
                d = c.forceBody,
                p = c.activityBody;
            L.lastEndpoint = {
                at: z(),
                method: "PUT",
                body: we(u),
                endpointId: i
            }, L.lastFrame = {
                source: "direct",
                originalState: "unknown",
                sentState: d.availability || u.availability || "active",
                at: z()
            }, scheduleLightUiRefresh("force");
            let f = {
                    ok: !0,
                    status: null,
                    authMode: null,
                    skipped: !0,
                    responseText: "endpoint registration not required for direct status write"
                },
                h = null,
                clearForce = null,
                m = null,
                g = null;
            const b = [];
            const isAuthFailureForMode = response => response && (401 === response.status || 403 === response.status || isPresenceAuthFailureResponse(response));
            for (const authMode of getAuthModeCandidates()) {
                b.push(authMode.label), L.selectedAuthMode = authMode.label, scheduleLightUiRefresh("force");
                g = authMode.label;
                try {
                    h = await xe("v1/me/forceavailability/", "PUT", d, i, authMode)
                } catch (err) {
                    h = {
                        ok: !1,
                        status: null,
                        authMode: authMode.label,
                        responseText: String(err && err.msg || err)
                    }
                }
                if (isAuthFailureForMode(h)) {
                    recordPresenceAuthFailure(h, "forceavailability");
                    continue
                }
                m = {
                    ok: !0,
                    status: null,
                    authMode: authMode.label,
                    skipped: !0,
                    reason: "forceavailability-only"
                };
                if (h && h.ok) break;
                continue
            }
            const clearForceOk = !!(clearForce && (clearForce.ok || clearForce.status === 404 || clearForce.status === 204));
            const activityOk = !m || m.ok || !!m.skipped;
            let v = !!(h && h.ok && activityOk);
            let postForceVerify = null;
            if (v && manualForce) {
                postForceVerify = { ok: true, skipped: true, manualFastPath: true, responseText: "manual mode fast path skipped post-write verification" };
            }
            if (v && !manualForce) {
                try {
                    await new Promise(resolve => (U.nativeSetTimeout || window.setTimeout)(resolve, 700));
                    postForceVerify = await fetchBackendPresence(`verify-${t}`)
                } catch (err) {
                    postForceVerify = { ok: false, status: null, presence: null, responseText: String(err && (err.message || err.msg) || err) }
                }
                const verifiedPresence = postForceVerify && postForceVerify.presence || null;
                const verifyText = String(postForceVerify && postForceVerify.responseText || "");
                const verifyAuthFailed = !!(postForceVerify && (401 === Number(postForceVerify.status) || 403 === Number(postForceVerify.status) || /session expired|sign in again|unauthori[sz]ed|forbidden|auth|token/i.test(verifyText)));
                const verified = !!(postForceVerify && postForceVerify.ok && verifiedPresence && presenceMatchesManagedStatus(verifiedPresence, a));
                const verifierObservedOffline = !!(verifiedPresence && presenceLooksOffline(verifiedPresence) && a.statusKey !== "offline");
                const verificationInconclusive = !!(!verifiedPresence || verifyAuthFailed);
                if (!verified) {
                    postForceVerify = Object.assign({}, postForceVerify || {}, {
                        ok: false,
                        skipped: verificationInconclusive,
                        readOnly: verificationInconclusive,
                        verifierOnly: true,
                        verificationInconclusive,
                        verifierObservedOffline,
                        responseText: verifierObservedOffline ? "post-force verification read Offline/OffWork; target status was not applied" : verifyAuthFailed ? postForceVerify && postForceVerify.responseText || "post-force verifier auth failed" : verifiedPresence ? "post-force verifier read a different Teams status: " + describeBackendPresence(verifiedPresence) : postForceVerify && postForceVerify.responseText || "post-force verification returned no presence body"
                    });
                    if (!verificationInconclusive) v = false
                }
            }
            recordPresenceForceOutcome(v, { endpoint: f, force: h, clearForce, activity: m, verify: postForceVerify });
            rememberDirectForceOutcome(targetSignature, v, { endpoint: f, force: h, clearForce, activity: m, verify: postForceVerify });
            v || q("error", "Presence force response rejected", {
                endpointStatus: f && f.status || null,
                endpointText: f && f.responseText || null,
                forceStatus: h && h.status || null,
                forceText: h && h.responseText || null,
                verifyStatus: postForceVerify && postForceVerify.status || null,
                verifyText: postForceVerify && postForceVerify.responseText || null,
                verifyPresence: postForceVerify && postForceVerify.presence ? describeBackendPresence(postForceVerify.presence) : null,
                activityStatus: m && m.status || null,
                activityText: m && m.responseText || null,
                statusKey: a.statusKey
            });
            v && a && a.rule && !L.enabled && markActiveScheduleForceAttempt();
            return v ? (U.lastGoodAuthMode = g, U.lastFailedEndpointId = null, L.lastPresence = {
                source: "direct",
                at: z(),
                availability: d.availability || u.availability || a.status.availability || "Available",
                activity: d.activity || a.status.activity || u.activity || "Available",
                deviceType: u.deviceType || r.endpointInfo.presence && r.endpointInfo.presence.deviceType || "Web",
                lastActiveTime: (new Date).toISOString(),
                statusKey: a.statusKey
            }) : (U.lastFailedEndpointId = i), L.lastReplay = {
                at: z(),
                reason: e,
                ok: v,
                status: null,
                body: {
                    endpointId: i,
                    authMode: g || null,
                    attemptedModes: b,
                    endpointStatus: f && f.status || null,
                    endpointOk: !!(f && f.ok),
                    forceStatus: h && h.status || null,
                    forceOk: !!(h && h.ok),
                    clearForceStatus: clearForce && clearForce.status || null,
                    clearForceOk: !!(clearForce && clearForce.ok),
                    activityStatus: m && m.status || null,
                    activitySkipped: !!(m && m.skipped),
                    verifyStatus: postForceVerify && postForceVerify.status || null,
                    verifyOk: !!(postForceVerify && postForceVerify.ok),
                    verifyPresence: postForceVerify && postForceVerify.presence ? describeBackendPresence(postForceVerify.presence) : null,
                    statusKey: a.statusKey
                }
            }, q(v ? "direct" : "error", v ? `Forced ${a.label} directly` : "Direct force failed", {
                reason: e,
                endpointId: Z(i),
                tokenMode: L.tokenMode,
                authMode: g,
                attemptedModes: b,
                endpointStatus: f && f.status || null,
                forceStatus: h && h.status || null,
                clearForceStatus: clearForce && clearForce.status || null,
                activityStatus: m && m.status || null,
                authState: L.auth && L.auth.state || null,
                statusKey: a.statusKey
            }), scheduleLightUiRefresh("force"), v
        })();
        return U.forcePromise = t, await t.finally(() => {
            U.pendingForceReason = null;
            U.forcePromise === t && (U.forcePromise = null)
        })
    }

    function scheduleResolutionSignature(manager, date) {
        const resolved = resolveManagedStatus(manager, date, { manualOverride: !!L.enabled });
        return [resolved.active ? resolved.statusKey : "idle", resolved.rule && resolved.rule.id || "", resolved.source || ""].join("|")
    }

    function activeScheduleRuntimeSignature(manager = L.manager, date = new Date) {
        const resolved = resolveManagedStatus(manager, date, { manualOverride: !1 });
        if (!resolved || !resolved.active || !resolved.rule) return "";
        const rule = resolved.rule;
        return [resolved.statusKey || "idle", resolved.source || "schedule", rule.id || "", rule.start || "", rule.end || "", rule.date || "", Array.isArray(rule.days) ? rule.days.join(",") : "", normalizeSchedulePriority(rule.priority, 0)].join("|")
    }

    function activeScheduleForceDue(reason, options = {}) {
        if (!isRuntimePolicyAllowed() || !isPresenceRequestsEnabled()) return !1;
        if (isManualOverrideActive()) return !1;
        const signature = activeScheduleRuntimeSignature(L.manager, new Date);
        if (!signature) return !1;
        return !!(options && options.force) || signature !== U.lastScheduleForceSignature
    }

    function markActiveScheduleForceAttempt() {
        const signature = activeScheduleRuntimeSignature(L.manager, new Date);
        if (!signature) return !1;
        U.lastScheduleForceSignature = signature;
        U.lastScheduleForceAt = Date.now();
        return !0
    }

    function requestBackgroundForceRun(reason, config = null) {
        try {
            const payload = config || D.lastRuntimeSyncPayload || null, accountKey = payload && (payload.accountKey || payload.selectedAccountKey) || L.currentAccountKey || L.selectedAccountKey || null;
            const reasonText = String(reason || "page-force-run");
            const manualish = /(?:manual-override|manager-manual|manager-presence|gui-presence|presence-force|presence-apply|toggle-enabled)/i.test(reasonText);
            if (manualish) {
                const manager = payload && payload.manager || L.manager || {};
                const sig = JSON.stringify({ reason: reasonText.replace(/-active$/i, ""), accountKey, enabled: !!(payload && (payload.manualOverrideEnabled || payload.enabled)), status: manager && manager.manualStatusKey || "" });
                const now = Date.now();
                if (D.lastManualBgForceSig === sig && now - Number(D.lastManualBgForceAt || 0) < 60000) return false;
                D.lastManualBgForceSig = sig;
                D.lastManualBgForceAt = now;
            }
            return ee("forceRun", { reason: reasonText, config: payload, forceAccountKey: accountKey })
        } catch {
            return false
        }
    }

    function maybeForceActiveSchedule(reason, options = {}) {
        if (!activeScheduleForceDue(reason, options)) return !1;
        const forceReason = manualStyleScheduleForceReason(reason || "schedule-active");
        try { notifyBackgroundAfkRuntime(forceReason) } catch {
            try { oe(forceReason) || scheduleRuntimeSync(forceReason, 0) } catch {}
            requestBackgroundForceRun(forceReason)
        }
        return !0
    }

    function nextScheduleTransitionDate(manager, from = new Date) {
        const normalized = normalizeManagerState(manager);
        if (!normalized.scheduleEnabled || !hasEnabledScheduleRules(normalized)) return null;
        const base = new Date(from.getTime());
        base.setSeconds(0, 0);
        const current = scheduleResolutionSignature(normalized, new Date(from.getTime() + 1e3));
        for (let offset = 1; offset <= 8 * 24 * 60; offset += 1) {
            const candidate = new Date(base.getTime() + offset * 6e4 + 1e3);
            if (scheduleResolutionSignature(normalized, candidate) !== current) return candidate
        }
        return null
    }

    function resetScheduleTransitionTimer(reason) {
        try {
            U.scheduleTransitionTimer && U.nativeClearTimeout && U.nativeClearTimeout(U.scheduleTransitionTimer)
        } catch {}
        U.scheduleTransitionTimer = null;
        if (L && L.enabled) return;
        if (!U.nativeSetTimeout || !isRuntimePolicyAllowed() || !isPresenceRequestsEnabled()) return;
        const manager = normalizeManagerState(L.manager);
        if (!manager.scheduleEnabled || !hasEnabledScheduleRules(manager)) return;
        const next = nextScheduleTransitionDate(manager, new Date);
        if (!next) return;
        const delay = Math.max(1e3, Math.min(2147483647, next.getTime() - Date.now()));
        U.scheduleTransitionTimer = U.nativeSetTimeout(() => {
            U.scheduleTransitionTimer = null;
            U.lastScheduleForceSignature = null;
            U.lastScheduleForceAt = 0;
            renderManagerRules();
            ct();
            try { $e("schedule-transition-activity") } catch {}
            notifyBackgroundAfkRuntime(manualStyleScheduleForceReason("schedule-transition"));
            resetScheduleTransitionTimer("schedule-transition-next");
        }, delay)
    }

    function Te() {
        if (U.nativeSetInterval && U.nativeClearInterval && U.heartbeatTimer) {
            U.nativeClearInterval(U.heartbeatTimer);
            U.heartbeatTimer = null
        }
        resetScheduleTransitionTimer("runtime-setup")
    }

    function th374PersonalCidFromIdentity(value) {
        const item = value && typeof value === "object" ? value : {};
        const keys = [item.key, item.accountKey, item.selectedAccountKey, item.sourceAccountKey, item.forceAccountKey];
        for (const key of keys) {
            const match = String(key || "").trim().toLowerCase().match(/^personal:cid\.([0-9a-f]{8,64})$/i);
            if (match) return match[1].toLowerCase();
        }
        const direct = String(item.cid || item.consumerCid || "").trim().toLowerCase();
        if (/^[0-9a-f]{8,64}$/.test(direct)) return direct;
        const mri = String(item.userMri || item.mri || item.skypeId || "").trim().toLowerCase();
        const mriMatch = mri.match(/^(?:8:)?live:\.cid\.([0-9a-f]{8,64})$/i);
        return mriMatch ? mriMatch[1].toLowerCase() : "";
    }

    function th374CurrentPageIdentity() {
        const registry = normalizeAccountRegistry(L && L.accountRegistry || null);
        const liveMri = String(L && L.endpointInfo && L.endpointInfo.loginUserMri || U && U.skypeTokenInfo && U.skypeTokenInfo.skypeId || "").trim();
        const liveCid = th374PersonalCidFromIdentity({ userMri: liveMri });
        let key = "";
        if (liveCid) {
            key = Object.keys(registry.accounts || {}).find(candidate => th374PersonalCidFromIdentity(Object.assign({}, registry.accounts[candidate] || {}, { key: candidate, accountKey: candidate })) === liveCid) || `personal:cid.${liveCid}`;
        }
        if (!key) key = resolveAccountKeyForCurrentPage(registry, L && (L.currentAccountKey || registry.activeAccountKey) || null);
        const entry = key && registry.accounts && registry.accounts[key] || {};
        const email = normalizeAccountEmail(extractTeamsAccountEmail() || entry.email || entry.targetAccountEmail || accountKeyEmail(key) || "");
        const cid = liveCid || th374PersonalCidFromIdentity(Object.assign({}, entry, { key, accountKey: key }));
        return { accountKey: key || "", email, cid, teamsType: accountEntryTeamsType(entry) || currentPageTeamsType() };
    }

    async function handleBackgroundPresenceForceMessage(message) {
        const id = message && message.id;
        const rawReason = message && message.reason || "background-schedule-force";
        const reason = manualStyleScheduleForceReason(rawReason);
        try {
            const expectedState = message && message.state && typeof message.state === "object" ? message.state : {};
            const expectedCid = th374PersonalCidFromIdentity(expectedState);
            const pageIdentity = th374CurrentPageIdentity();
            if (expectedCid && pageIdentity.cid !== expectedCid) {
                ee("presenceForceResult", {
                    id,
                    response: {
                        ok: false,
                        skipped: true,
                        reason: "page-account-identity-mismatch",
                        expectedAccountKey: `personal:cid.${expectedCid}`,
                        actualAccountKey: pageIdentity.accountKey || null,
                        actualEmail: pageIdentity.email || null
                    }
                });
                return;
            }
            if (message && message.state) applyRemoteBridgeState(message.state);
            try { $e("background-schedule-force-activity") } catch {}
            const ok = await Ce(reason);
            try { $e("background-schedule-force-post") } catch {}
            const replay = L.lastReplay && "object" == typeof L.lastReplay ? L.lastReplay : null;
            ee("presenceForceResult", {
                id,
                response: {
                    ok: !!ok,
                    reason,
                    statusKey: replay && replay.body && replay.body.statusKey || activeScheduleRuntimeSignature(L.manager, new Date).split("|")[0] || null,
                    verifiedAccountKey: pageIdentity.accountKey || null,
                    verifiedAccountEmail: pageIdentity.email || null,
                    verifiedPersonalCid: pageIdentity.cid || null,
                    replay: replay ? {
                        ok: !!replay.ok,
                        skipped: !!replay.skipped,
                        at: replay.at || null,
                        forceStatus: replay.body && replay.body.forceStatus || null,
                        forceOk: replay.body && replay.body.forceOk || null,
                        skipReason: replay.body && replay.body.skipReason || null
                    } : null
                }
            })
        } catch (error) {
            ee("presenceForceResult", {
                id,
                error: String(error && (error.message || error.msg) || error),
                response: { ok: false, reason }
            })
        }
    }

    function notifyBackgroundAfkRuntime(reason) {
        try {
            const syncReason = reason || "afk-runtime-sync";
            let syncSent = false;
            try { syncSent = !!(oe(syncReason) || scheduleRuntimeSync(syncReason, 0)); }
            catch { try { syncSent = !!scheduleRuntimeSync(syncReason, 0); } catch { syncSent = false; } }
            if (!syncSent) requestBackgroundForceRun(syncReason)
        } catch {}
    }
    try {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") notifyBackgroundAfkRuntime("visibility-hidden-afk")
        }, { passive: true })
    } catch {}
    try { window.addEventListener("pagehide", () => notifyBackgroundAfkRuntime("pagehide-afk"), { passive: true }) } catch {}
    try { document.addEventListener("freeze", () => notifyBackgroundAfkRuntime("freeze-afk"), { passive: true }) } catch {}


    function Ae(e = 5e3) {
        U.nativeSetTimeout && U.nativeClearTimeout && (U.refreshTimer && (U.nativeClearTimeout(U.refreshTimer), U.refreshTimer = null), U.refreshTimer = U.nativeSetTimeout(async () => {
            U.refreshTimer = null;
            await he("scheduled-refresh", { silent: !0, retryOnMiss: 0 }).catch(() => null)
        }, e))
    }

    function Ee(e) {
        const reason = e || "bootstrap";
        try {
            U.bootstrapTimer && U.nativeClearTimeout && U.nativeClearTimeout(U.bootstrapTimer)
        } catch {}
        const run = async () => {
            U.bootstrapTimer = null;
            try {
                const t = await he(reason, {
                    silent: !0,
                    retryOnMiss: 0
                });
                if (!t || !t.endpointInfo || !t.endpointInfo.endpointId) return;
                if (!L.lastPresence && t.endpointInfo.presence && (L.lastPresence = {
                        source: "indexeddb",
                        at: t.endpointInfo.lastActiveTimestamp || z(),
                        ...t.endpointInfo.presence
                    }, ct()), !isPresenceRuntimeEnabled()) return;
                const scheduleDue = activeScheduleForceDue(reason, { minMs: 3e4 });
                if (L.lastFrame && L.lastReplay && L.lastReplay.ok && !scheduleDue) return;
                if (scheduleDue) markActiveScheduleForceAttempt();
                await Ce(reason)
            } catch (t) {
                q("bootstrap", "Startup presence bootstrap failed", {
                    reason,
                    msg: Y(t && t.msg || t, 180)
                })
            }
        };
        U.bootstrapTimer = (U.nativeSetTimeout || window.setTimeout)(run, 250)
    }

    function Oe(e, t = {}, n = []) {
        const o = document.createElement(e);
        "button" === e && !Object.prototype.hasOwnProperty.call(t, "type") && o.setAttribute("type", "button");
        if (t.id && (o.id = t.id), t.className && (o.className = t.className), t.type && (o.type = t.type), t.title && (o.title = t.title), null != t.placeholder && (o.placeholder = String(t.placeholder)), Object.prototype.hasOwnProperty.call(t, "rows") && (o.rows = Number(t.rows || 0)), Object.prototype.hasOwnProperty.call(t, "checked") && (o.checked = !!t.checked), Object.prototype.hasOwnProperty.call(t, "value") && (o.value = null == t.value ? "" : String(t.value)), null != t.text && (o.textContent = String(t.text)), t.attrs)
            for (const [e, n] of Object.entries(t.attrs)) o.setAttribute(e, String(n));
        for (const e of n) null != e && o.appendChild("string" == typeof e ? document.createTextNode(e) : e);
        return o
    }

    function _e(e, t, n) {
        e.appendChild(Oe("div", {
            className: "label",
            text: t
        })), e.appendChild(Oe("div", {
            className: "value",
            id: n,
            text: "—"
        }))
    }

    function Be(e, t) {
        const updatedAt = (new Date).toISOString();
        L.spoofConfig = B(L.spoofConfig);
        L.spoofConfigStored = true;
        L.spoofConfigUpdatedAt = updatedAt;
        D.localUiConfigDirtyUntil = Date.now() + 300000;
        try {
            localStorage.setItem(k.spoofConfig, JSON.stringify(L.spoofConfig));
            localStorage.setItem(k.spoofConfigUpdatedAt, updatedAt)
        } catch {}
        Ne();
        ee("saveUiConfig", { config: O(L.spoofConfig), accountKey: L.selectedAccountKey || L.currentAccountKey || null, updatedAt });
        window.setTimeout(() => $e("config-sync"), 0);
        scheduleFullUiRefresh("config-sync");
        e && q("spoof", e, t || null)
    }

    function Pe(e) {
        const t = L.spoofConfig && L.spoofConfig.navigator || {};
        if (P(t[e])) return O(t[e]);
        if ("language" === e) {
            const e = L.spoofConfig && L.spoofConfig.worker && L.spoofConfig.worker.fields && L.spoofConfig.worker.fields.localeCode;
            if (P(e)) return e
        }
        if ("languages" === e) {
            const e = Pe("language");
            if (P(e)) return [e]
        }
        return O(H[e])
    }

    function je() {
        return {
            userAgent: Pe("userAgent"),
            appVersion: Pe("appVersion"),
            platform: Pe("platform"),
            vendor: Pe("vendor"),
            language: Pe("language"),
            languages: Pe("languages"),
            hardwareConcurrency: Pe("hardwareConcurrency"),
            deviceMemory: Pe("deviceMemory"),
            maxTouchPoints: Pe("maxTouchPoints")
        }
    }

    function Ne() {
        try {
            const e = je(),
                t = "string" == typeof e.language && e.language ? e.language : L.spoofConfig && L.spoofConfig.worker && L.spoofConfig.worker.fields && L.spoofConfig.worker.fields.localeCode || "";
            t && document.documentElement && (document.documentElement.lang = String(t).toLowerCase())
        } catch {}
    }

    function Me() {
        return _(A.activity, L.spoofConfig && L.spoofConfig.activity || {})
    }

    function isActiveScheduleRuntimeNow() {
        try {
            if (isManualOverrideActive()) return false;
            if (!isRuntimePolicyAllowed() || !isPresenceRequestsEnabled()) return false;
            const resolved = resolveManagedStatus(L.manager, new Date, { manualOverride: false });
            return !!(resolved && resolved.active && (resolved.source === "schedule" || resolved.source === "exception" || resolved.rule));
        } catch {
            return false
        }
    }

    function Le() {
        const e = Me();
        return !(!e || !1 === e.enabled || !isActiveScheduleRuntimeNow())
    }

    function Ue(e, t) {
        if (e && t) try {
            e.dispatchEvent(function(e) {
                if (!e || "object" != typeof e) return e;
                try {
                    Object.defineProperty(e, "__teamsHelperSynthetic", {
                        configurable: !0,
                        enumerable: !1,
                        writable: !1,
                        value: !0
                    })
                } catch {
                    try {
                        e.__teamsHelperSynthetic = !0
                    } catch {}
                }
                return e
            }(t))
        } catch {}
    }

    function De(e) {
        try {
            return new FocusEvent(e, {
                bubbles: !0,
                cancelable: !1,
                relatedTarget: null
            })
        } catch {
            return new Event(e, {
                bubbles: !0,
                cancelable: !1
            })
        }
    }

    function Re(e, t) {
        const n = {
            bubbles: !0,
            cancelable: !0,
            composed: !0,
            view: window,
            clientX: t.clientX,
            clientY: t.clientY,
            screenX: t.screenX,
            screenY: t.screenY,
            relatedTarget: null
        };
        try {
            return new MouseEvent(e, n)
        } catch {
            return new Event(e, {
                bubbles: !0,
                cancelable: !0
            })
        }
    }

    function Fe(e, t) {
        const n = {
            bubbles: !0,
            cancelable: !0,
            composed: !0,
            view: window,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
            buttons: 0,
            clientX: t.clientX,
            clientY: t.clientY,
            screenX: t.screenX,
            screenY: t.screenY
        };
        try {
            if ("function" == typeof PointerEvent) return new PointerEvent(e, n)
        } catch {}
        return Re(e, t)
    }

    function He(e, t, n) {
        return {
            type: e,
            target: t,
            currentTarget: t,
            srcElement: t,
            relatedTarget: null,
            bubbles: !0,
            cancelable: !1,
            defaultPrevented: !1,
            eventPhase: 2,
            isTrusted: !0,
            timeStamp: Date.now(),
            clientX: n.clientX,
            clientY: n.clientY,
            screenX: n.screenX,
            screenY: n.screenY,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
            view: window,
            preventDefault() {},
            stopPropagation() {},
            stopImmediatePropagation() {}
        }
    }

    function Je(e) {
        return null == e ? {
            capture: !1,
            once: !1
        } : "boolean" == typeof e ? {
            capture: !!e,
            once: !1
        } : {
            capture: !!e.capture,
            once: !!e.once
        }
    }

    function We(e) {
        if (!e) return e;
        try {
            Object.defineProperty(e, "__teamsHelperInternal", {
                configurable: !0,
                enumerable: !1,
                writable: !1,
                value: !0
            })
        } catch {
            try {
                e.__teamsHelperInternal = !0
            } catch {}
        }
        return e
    }

    function ze(e) {
        return !(!e || !(e.__teamsHelperInternal || e.handleEvent && e.handleEvent.__teamsHelperInternal))
    }

    function Ve(e, t, n, o) {
        const r = Je(o);
        for (let o = R.listeners.length - 1; o >= 0; o -= 1) {
            const i = R.listeners[o], listener = i.listenerRef && i.listenerRef.deref ? i.listenerRef.deref() : i.listener;
            (!listener || i.target === e && i.type === String(t) && listener === n && i.capture === r.capture) && R.listeners.splice(o, 1)
        }
    }

    function Ye(e, t) {
        if (!R.replaying) {
            R.replaying = !0;
            try {
                const n = [];
                for (let index = R.listeners.length - 1; index >= 0; index -= 1) {
                    const item = R.listeners[index], listener = item.listenerRef && item.listenerRef.deref ? item.listenerRef.deref() : item.listener;
                    if (!listener) {
                        R.listeners.splice(index, 1);
                        continue
                    }
                    item.type === e && !ze(listener) && n.push({ item, listener })
                }
                for (const o of n) {
                    const n = He(e, o.item.target, t);
                    try {
                        "function" == typeof o.listener ? o.listener.call(o.item.target, n) : o.listener && "function" == typeof o.listener.handleEvent && o.listener.handleEvent(n)
                    } catch {}
                    o.item.once && Ve(o.item.target, o.item.type, o.listener, {
                        capture: o.item.capture
                    })
                }
            } finally {
                R.replaying = !1
            }
        }
    }

    function emitActivitySpoofNow(e) {
        if (!Le() || R.emitting) return !1;
        R.emitting = !0;
        R.lastEmitAt = z();
        try {
            const t = Me(),
                n = function() {
                    const e = Me().syntheticEvents || {},
                        t = e => {
                            const t = Number(e);
                            return Number.isFinite(t) ? t : 96
                        };
                    return {
                        clientX: t(e.clientX),
                        clientY: t(e.clientY),
                        screenX: t(e.screenX),
                        screenY: t(e.screenY)
                    }
                }(),
                o = [];
            if (!1 !== t.forceFocused && (Ue(window, De("focus")), Ue(document, De("focus")), Ue(document, De("focusin")), Ye("focus", n), Ye("focusin", n), o.push("focus")), !1 !== t.forceVisible && (Ue(document, new Event("visibilitychange")), Ue(window, new Event("pageshow")), Ye("visibilitychange", n), o.push("visibility")), !1 !== t.forcePointerInside && (!t.syntheticEvents || !1 !== t.syntheticEvents.enabled)) {
                const e = [window, document, document.documentElement, document.body].filter(Boolean);
                for (const t of e) Ue(t, Fe("pointermove", n)), Ue(t, Fe("pointerover", n)), Ue(t, Re("mousemove", n)), Ue(t, Re("mouseover", n)), Ue(t, Re("mouseenter", n));
                Ye("pointermove", n), Ye("mousemove", n), Ye("mouseover", n), Ye("mouseenter", n), o.push("pointer")
            }
            L.lastActivitySpoof = Object.assign({
                at: z(),
                reason: e
            }, {
                emitted: o,
                trackedListeners: R.listeners.length,
                coordinates: n
            });
            scheduleLightUiRefresh("activity-spoof");
            return !0
        } finally {
            R.emitting = !1
        }
    }

    function Xe(e) {
        if (!Le() || R.emitting) return !1;
        const now = z(), minGap = 900;
        R.pendingEmitReason = e || R.pendingEmitReason || "activity";
        if (R.emitTimer) return !0;
        const wait = Math.max(0, Math.min(minGap, (R.lastEmitAt || 0) + minGap - now));
        R.emitTimer = (R.nativeSetTimeout || window.setTimeout)(() => {
            const nextReason = R.pendingEmitReason || e || "activity";
            R.emitTimer = null;
            R.pendingEmitReason = null;
            try { emitActivitySpoofNow(nextReason); } catch (err) { q("error", "Activity spoof failed", { msg: Y(err && err.message || err, 160) }); }
        }, wait);
        return !0
    }

    function qe() {
        if (R.timer && R.nativeClearInterval && (R.nativeClearInterval(R.timer), R.timer = null), !Le() || !R.nativeSetInterval) return;
        const e = Me();
        e.syntheticEvents && !1 === e.syntheticEvents.enabled || (R.timer = R.nativeSetInterval(() => {
            Xe("timer")
        }, function() {
            const e = Number(Me().syntheticEvents && Me().syntheticEvents.intervalMs);
            return Number.isFinite(e) ? Math.min(Math.max(Math.round(e), 1e3), 6e4) : 15e3
        }()))
    }

    function Ge(e, t) {
        if (Le() && !R.emitting && ! function(e) {
                return !(!e || !e.__teamsHelperSynthetic)
            }(t)) {
            if (!1 !== Me().stopAwayEvents) {
                try {
                    t.stopImmediatePropagation()
                } catch {}
                try {
                    t.stopPropagation()
                } catch {}
            }
            Xe(e)
        }
    }

    function $e(e) {
        if (!isRuntimePolicyAllowed()) {
            L.lastActivitySpoof = null;
            if (R.timer && R.nativeClearInterval) R.nativeClearInterval(R.timer);
            R.timer = null;
            R.runtimeActive = false;
            return void scheduleLightUiRefresh("activity-policy-off")
        }
        if (!Le()) {
            L.lastActivitySpoof = null;
            if (R.timer && R.nativeClearInterval) R.nativeClearInterval(R.timer);
            R.timer = null;
            R.runtimeActive = false;
            return void scheduleLightUiRefresh("activity-off")
        }
        if (!R.runtimeActive) {
            R.runtimeActive = true;
            qe()
        }
        Xe(e || "activity-sync")
    }

    function Ke(e) {
        L.lastWorkerBootstrap = Object.assign({}, L.lastWorkerBootstrap || {}, {
            at: z(),
            changed: !1,
            bypassed: !0,
            reason: e || "trusted-script-url"
        }), ct()
    }

    function Qe() {
        const e = L.lastWorkerBootstrap && (L.lastWorkerBootstrap.rewritten || L.lastWorkerBootstrap.original);
        return e && "object" == typeof e ? e : {}
    }

    function parseWorkerBootstrapUrl(e) {
        let t = "";
        try {
            t = e instanceof URL ? e.toString() : String(e || "")
        } catch {
            return null
        }
        if (!t || !/precompiled-(?:telemetry-)?web-worker|\/v2\/worker\//i.test(t) || -1 === t.indexOf("#")) return null;
        let n = "";
        try {
            n = new URL(t, location.href).hash || ""
        } catch {
            const e = t.indexOf("#");
            n = e >= 0 ? t.slice(e) : ""
        }
        n = String(n || "").replace(/^#/, "");
        if (!n) return null;
        try {
            const e = G(decodeURIComponent(n));
            return E(e) ? e : null
        } catch {
            try {
                const e = G(n);
                return E(e) ? e : null
            } catch {
                return null
            }
        }
    }

    function rememberWorkerBootstrap(e, t, n = !1, o = null) {
        const r = parseWorkerBootstrapUrl(e);
        L.liveDiscoveryCache = null;
        L.lastWorkerBootstrap = Object.assign({}, L.lastWorkerBootstrap || {}, {
            at: z(),
            url: (() => { try { const t = new URL(String(e || ""), location.href); return t.origin + t.pathname } catch { return String(e || "").split("#")[0] } })(),
            changed: !!n,
            bypassed: !!t && /trusted-script-url|scan/i.test(String(t)),
            reason: t || null,
            original: r || Qe(),
            rewritten: E(o) ? o : n ? o : null
        });
        ct();
        return r
    }

    function scanWorkerBootstrap() {
        const e = Qe();
        if (Object.keys(e || {}).length >= 8) return e;
        const t = [];
        try {
            const e = performance && "function" == typeof performance.getEntriesByType ? performance.getEntriesByType("resource") : [];
            for (const n of e || []) n && n.name && t.push(n.name)
        } catch {}
        try {
            for (const [e, n] of ae()) /worker|bootstrap|telemetry|session|platform|device|build|ring|environment/i.test(e + "\n" + n) && t.push(n)
        } catch {}
        let n = Object.assign({}, e || {}), o = null;
        for (const e of t) {
            const t = parseWorkerBootstrapUrl(e);
            t && (Object.assign(n, t), o || (o = e))
        }
        return Object.keys(n || {}).length ? (o && rememberWorkerBootstrap(o, "scan", !1, null), n) : {}
    }

    function workerOverrideFields() {
        return j({}, L.spoofConfig && L.spoofConfig.worker && L.spoofConfig.worker.fields || {})
    }

    function liveWorkerFields() {
        const e = j(j(j({}, defaultWorkerFields()), collectLiveDiscoveryHints().worker || {}), scanWorkerBootstrap()),
            t = workerOverrideFields(),
            n = je(),
            o = collectLiveDiscoveryHints().telemetry || {};
        for (const [n, o] of Object.entries(t)) P(o) && (e[n] = O(o));
        !hasLiveValue(e.localeCode) && hasLiveValue(n.language) && (e.localeCode = n.language);
        !hasLiveValue(e.deviceId) && hasLiveValue(o.DeviceInfo_Id) && (e.deviceId = o.DeviceInfo_Id);
        !hasLiveValue(e.sessionId) && hasLiveValue(o.Session_Id) && (e.sessionId = o.Session_Id);
        !hasLiveValue(e.platformId) && hasLiveValue(o.AppInfo_PlatformId) && (e.platformId = o.AppInfo_PlatformId);
        !hasLiveValue(e.buildVersion) && hasLiveValue(o.AppInfo_Version) && (e.buildVersion = o.AppInfo_Version);
        !hasLiveValue(e.environment) && hasLiveValue(o.AppInfo_Environment || o.environment) && (e.environment = o.AppInfo_Environment || o.environment);
        !hasLiveValue(e.ring) && hasLiveValue(o.UserInfo_Ring) && (e.ring = o.UserInfo_Ring);
        return e
    }

    function Ze() {
        return "rewrite" === (L.spoofConfig && L.spoofConfig.telemetry && L.spoofConfig.telemetry.mode) ? "rewrite" : "suppress"
    }

    function et() {
        const e = j(collectLiveDiscoveryHints().telemetry || {}, L.spoofConfig && L.spoofConfig.telemetry && L.spoofConfig.telemetry.query || {}),
            t = liveWorkerFields(),
            n = je(),
            o = navigator.onLine ? "Online" : "Offline";
        return !hasLiveValue(e.userAgent) && hasLiveValue(n.userAgent) && (e.userAgent = n.userAgent), !hasLiveValue(e.Session_Id) && hasLiveValue(t.sessionId) && (e.Session_Id = t.sessionId), !hasLiveValue(e.DeviceInfo_Id) && hasLiveValue(t.deviceId) && (e.DeviceInfo_Id = t.deviceId), !hasLiveValue(e.AppInfo_PlatformId) && hasLiveValue(t.platformId) && (e.AppInfo_PlatformId = t.platformId), !hasLiveValue(e.AppInfo_Version) && hasLiveValue(t.buildVersion) && (e.AppInfo_Version = t.buildVersion), !hasLiveValue(e.AppInfo_ExperienceName) && hasLiveValue(t.experienceName) && (e.AppInfo_ExperienceName = t.experienceName), !hasLiveValue(e.AppInfo_Environment) && hasLiveValue(t.environment) && (e.AppInfo_Environment = t.environment), !hasLiveValue(e.environment) && hasLiveValue(t.environment) && (e.environment = t.environment), !hasLiveValue(e.UserInfo_Ring) && hasLiveValue(t.ring) && (e.UserInfo_Ring = t.ring), !hasLiveValue(e.UserInfo_Id) && L.endpointInfo && hasLiveValue(L.endpointInfo.loginUserMri) && (e.UserInfo_Id = L.endpointInfo.loginUserMri), !hasLiveValue(e.AppInfo_BootType) && (e.AppInfo_BootType = "cold"), !hasLiveValue(e.AppInfo_ClientType) && (e.AppInfo_ClientType = "web"), !hasLiveValue(e.AppInfo_ServiceWorkerState) && (e.AppInfo_ServiceWorkerState = serviceWorkerStateText()), !hasLiveValue(e.AppInfo_UxStatus) && (e.AppInfo_UxStatus = document.hidden ? "background" : "active"), !hasLiveValue(e.loaderNetworkPingState) && (e.loaderNetworkPingState = o), !hasLiveValue(e.navigatorNetworkState) && (e.navigatorNetworkState = o), !hasLiveValue(e.Session_TelemetryContext) && (e.Session_TelemetryContext = JSON.stringify({ sessionId: e.Session_Id || null, at: L.lastTelemetrySeenAt || z() })), !hasLiveValue(e.UserInfo_TenantId) && location.hostname.endsWith("teams.live.com") && (e.UserInfo_TenantId = "consumers"), !hasLiveValue(e.UserInfo_TelemetryRegion) && (e.UserInfo_TelemetryRegion = regionFromText(se()) || "noam"), e
    }

    function tt(e) {
        try {
            const t = new URL(String(e || ""), location.href),
                n = et();
            for (const [e, o] of Object.entries(n)) P(o) && t.searchParams.set(e, String(o));
            const o = t.toString();
            return L.lastTelemetryRewrite = {
                at: z(),
                mode: Ze(),
                originalUrl: String(e || ""),
                rewrittenUrl: o,
                query: n
            }, ct(), o
        } catch {
            return String(e || "")
        }
    }

    function nt() {
        const e = j(collectLiveDiscoveryHints().presenceHeaders || {}, L.spoofConfig && L.spoofConfig.presence && L.spoofConfig.presence.headers || {}),
            t = workerOverrideFields(),
            n = Object.assign({}, liveWorkerFields(), t),
            o = L.endpointInfo && L.endpointInfo.endpointId || L.lastEndpoint && L.lastEndpoint.endpointId || null;
        if (!hasLiveValue(e["x-ms-endpoint-id"]) && hasLiveValue(o) && (e["x-ms-endpoint-id"] = o), !hasLiveValue(e["x-ms-session-id"]) && hasLiveValue(n.sessionId) && (e["x-ms-session-id"] = n.sessionId), !hasLiveValue(e["x-ms-client-user-agent"]) && (e["x-ms-client-user-agent"] = "Teams-V2-Web"), !hasLiveValue(e["x-ms-client-version"])) {
            const t = function() {
                const e = liveWorkerFields(),
                    t = hasLiveValue(e.buildVersion) ? e.buildVersion : null;
                let n = hasLiveValue(e.platformId) ? e.platformId : null;
                if (!hasLiveValue(n)) try {
                    n = localStorage.getItem("platformId") || null
                } catch {
                    n = null
                }
                if (hasLiveValue(n) && hasLiveValue(t)) return String(n) + "/" + String(t);
                if (hasLiveValue(t)) return String(t);
                try {
                    const e = localStorage.getItem("react-web-client-version") || null;
                    return hasLiveValue(n) && hasLiveValue(e) ? String(n) + "/" + String(e) : hasLiveValue(e) ? String(e) : null
                } catch {
                    return null
                }
            }();
            hasLiveValue(t) && (e["x-ms-client-version"] = t)
        }
        return hasLiveValue(e["x-ms-client-type"]) || (e["x-ms-client-type"] = "cdlworker"), hasLiveValue(e.behavioroverride) || (e.behavioroverride = "redirectAs404"), e
    }

    function ot(e, t) {
        return j(e, L.spoofConfig && L.spoofConfig.presence && L.spoofConfig.presence[t] || {})
    }

    function rt(e) {
        try {
            return JSON.stringify(e, null, 2)
        } catch {
            return String(e)
        }
    }

    function it(e) {
        switch (e) {
            case "navigator":
                return {
                    native: H, effective: je(), overrides: O(L.spoofConfig.navigator)
                };
            case "worker":
                return {
                    effectiveFields: O(liveWorkerFields()), overrides: O(L.spoofConfig.worker), lastSeen: O(L.lastWorkerBootstrap)
                };
            case "telemetry":
                return {
                    mode: Ze(), query: et(), workerFields: O(liveWorkerFields()), lastRewrite: O(L.lastTelemetryRewrite)
                };
            case "presence":
                return {
                    overrides: O(L.spoofConfig.presence), effectiveHeaders: nt(), endpointInfo: O(L.endpointInfo), lastReplay: O(L.lastReplay)
                };
            case "activity":
                return {
                    overrides: O(L.spoofConfig.activity), effective: O(Me()), lastSynthetic: O(L.lastActivitySpoof), trackedListeners: R.listeners.length
                };
            default:
                return O(L.spoofConfig)
        }
    }

    function at() {
        return M(L.activeTab) ? L.activeTab : "all"
    }

    function st(e, t) {
        if (!L.gui) return;
        const n = e || "all";
        L.jsonScope = n, L.gui.elements.jsonScope.textContent = "all" === n ? "all sections" : n, L.gui.elements.json.value = rt(t)
    }

    function lt(e) {
        const t = e || at();
        st(t, O("all" === t ? L.spoofConfig : L.spoofConfig[t]))
    }

    function updateScheduleRule(e, t) {
        L.manager = normalizeManagerState({
            ...L.manager,
            scheduleRules: L.manager.scheduleRules.map((n => n.id === e ? {
                ...n,
                ...t
            } : n))
        })
    }

    function requestPresenceForce(reason, options = {}) {
        if (!isPresenceRuntimeEnabled()) return !1;
        const runReason = cleanForceReason(reason || "manager-update");
        const delay = Number.isFinite(Number(options.delayMs)) ? Math.max(0, Number(options.delayMs)) : isUserInitiatedForceReason(runReason) ? 80 : 0;
        const schedule = nextReason => {
            if (U.pendingForceTimer && U.nativeClearTimeout) U.nativeClearTimeout(U.pendingForceTimer);
            U.pendingForceReason = nextReason || runReason;
            U.pendingForceTimer = (U.nativeSetTimeout || window.setTimeout)(() => {
                const queuedReason = U.pendingForceReason || nextReason || runReason;
                U.pendingForceTimer = null;
                U.pendingForceReason = null;
                const start = () => Ce(queuedReason).catch((err => q("error", "Direct force failed", { reason: queuedReason, msg: Y(err && err.msg || err, 180) })));
                if (U.forcePromise) {
                    const activeForce = U.forcePromise;
                    U.forceAfterActiveReason = queuedReason;
                    if (!U.forceAfterActiveArmed) {
                        U.forceAfterActiveArmed = !0;
                        activeForce.finally(() => {
                            const followupReason = U.forceAfterActiveReason || queuedReason;
                            U.forceAfterActiveReason = null;
                            U.forceAfterActiveArmed = !1;
                            if (U.forcePromise === activeForce) U.forcePromise = null;
                            requestPresenceForce(followupReason, { delayMs: 50 });
                        });
                    }
                    return;
                }
                start();
            }, delay);
        };
        schedule(runReason);
        return !0
    }

    function scheduleImmediatePresenceForce(reason) {
        return requestPresenceForce(reason, { delayMs: isUserInitiatedForceReason(reason) ? 80 : 0 })
    }

    function persistManagerState(e, t = {}) {
        const __teamsHelperCloudBeforeTimelineEdit = "boolean" == typeof L.cloudEnabled ? !!L.cloudEnabled : null;
        L.manager = normalizeManagerState(L.manager), saveManagerState(L.manager), persistSelectedAccountState({ touch: true, preserveCloudState: isCloudStatePreservingTimelineReason(e), preferCurrentManager: !!(t && (t.preferCurrentManager || t.destructiveScheduleEdit || t.forceCurrentManager)), destructiveScheduleEdit: !!(t && t.destructiveScheduleEdit) });
        if (isCloudStatePreservingTimelineReason(e) && __teamsHelperCloudBeforeTimelineEdit !== null) {
            L.cloudEnabled = __teamsHelperCloudBeforeTimelineEdit;
            try {
                const registry = normalizeAccountRegistry(L.accountRegistry || null);
                const key = resolveAccountKeyForCurrentPage(registry, L.selectedAccountKey || registry.activeAccountKey);
                if (key && registry.accounts && registry.accounts[key]) {
                    registry.accounts[key].cloudEnabled = __teamsHelperCloudBeforeTimelineEdit;
                    L.accountRegistry = registry;
                    saveAccountRegistry(registry);
                }
            } catch {}
        }
        const active = document.activeElement;
        const scheduleList = L.gui && L.gui.elements && L.gui.elements.scheduleList;
        const reasonText = String(e || "");
        const forceScheduleRender = !!(t && t.forceRender) || /(?:schedule-drag|schedule-resize|timeline-resize|timeline-move)/i.test(reasonText);
        const holdScheduleRender = !forceScheduleRender && !!(scheduleList && active && scheduleList.contains(active));
        holdScheduleRender ? (D.pendingScheduleRender = !0) : scheduleFullUiRefresh(e || "manager-update", { renderRules: !0 });
        const runtimeReason = e || "manager-update";
        // The background owns Teams status writes. User/config edits are sent
        // immediately so local behavior never waits for cloud synchronization.
        const runtimeSent = isRuntimeMutationReason(runtimeReason) ? oe(runtimeReason) : scheduleRuntimeSync(runtimeReason, 150);
        if (!runtimeSent) scheduleRuntimeSync(runtimeReason, 150);
        resetScheduleTransitionTimer(runtimeReason);
        if (!1 !== t.force && maybeForceActiveSchedule(runtimeReason, { force: !0 })) {
            // maybeForceActiveSchedule routes through the same background owner.
        }
    }

    function scheduleMinuteValue(value, fallback) {
        const raw = String(value || "").trim();
        const match = /^(\d{1,2}):(\d{2})$/.exec(raw);
        if (!match) return fallback;
        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return fallback;
        return hours * 60 + minutes;
    }

    function scheduleTimeValue(minutes) {
        const value = Math.max(0, Math.min(1439, Math.round(Number(minutes) || 0)));
        const hours = String(Math.floor(value / 60)).padStart(2, "0");
        const mins = String(value % 60).padStart(2, "0");
        return `${hours}:${mins}`;
    }

    function scheduleSnapMinutes(minutes) {
        return Math.max(0, Math.min(1439, Math.round((Number(minutes) || 0) / 15) * 15));
    }

    function scheduleClamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function scheduleDayLabel(dayKey, short) {
        const key = Number(dayKey);
        if (short) {
            const label = SCHEDULE_DAY_FULL_LABELS[key] || String(key);
            return label.slice(0, 3);
        }
        return SCHEDULE_DAY_FULL_LABELS[key] || `Day ${key}`;
    }

    function scheduleRuleRange(rule) {
        const start = scheduleMinuteValue(rule && rule.start, 540);
        let end = scheduleMinuteValue(rule && rule.end, 1020);
        if (end <= start) end = Math.min(1439, start + 15);
        return { start, end, duration: Math.max(15, end - start) };
    }

    function schedulePriorityLabel(rule) {
        const priority = normalizeSchedulePriority(rule && rule.priority, 0);
        return priority > 0 ? "P" + priority + " · " : "";
    }

    function scheduleBlockTitle(rule) {
        const range = scheduleRuleRange(rule);
        return schedulePriorityLabel(rule) + getStatusPreset(rule && rule.statusKey).label + " " + scheduleTimeValue(range.start) + "-" + scheduleTimeValue(range.end);
    }

    function scheduleBlockLabel(rule, widthPx) {
        const range = scheduleRuleRange(rule);
        const key = normalizeStatusKey(rule && rule.statusKey);
        const shortLabels = { available: "Available", busy: "Busy", dnd: "DND", brb: "BRB", away: "Away", offline: "Offline" };
        const status = shortLabels[key] || getStatusPreset(key).label;
        const priority = schedulePriorityLabel(rule).replace(" · ", " ").trim();
        const compactPrefix = priority ? priority + " · " : "";
        const time = scheduleTimeValue(range.start) + "-" + scheduleTimeValue(range.end);
        const width = Number(widthPx) || 0;
        if (width && width < 56) return priority || status.slice(0, 3);
        if (width && width < 96) return compactPrefix + status;
        return compactPrefix + status + " " + time;
    }

    function scheduleRangesOverlap(startA, endA, startB, endB) {
        return Math.max(startA, startB) < Math.min(endA, endB);
    }

    function nextSchedulePriorityForRange(manager, dayKey, start, end) {
        let maxPriority = -1;
        for (const block of scheduleDayRules(manager, dayKey)) {
            if (scheduleRangesOverlap(start, end, block.start, block.end)) maxPriority = Math.max(maxPriority, normalizeSchedulePriority(block.rule && block.rule.priority, 0));
        }
        return maxPriority < 0 ? 0 : Math.min(999, maxPriority + 1);
    }

    function scheduleTimelineHourWidth() {
        const level = Math.max(0, Math.min(SCHEDULE_TIMELINE_ZOOM_STEPS.length - 1, Number(D.timelineZoomLevel) || 0));
        D.timelineZoomLevel = level;
        const base = SCHEDULE_TIMELINE_ZOOM_STEPS[level] || SCHEDULE_TIMELINE_ZOOM_STEPS[2];
        try {
            const scheduleHost = L.gui && L.gui.elements && L.gui.elements.scheduleList || L.gui && L.gui.host || null;
            const rect = scheduleHost && scheduleHost.getBoundingClientRect && scheduleHost.getBoundingClientRect();
            const available = rect && Number.isFinite(rect.width) ? Math.max(0, rect.width - 112) : 0;
            if (available > 260) return Math.max(base, Math.floor(available / 24));
        } catch {}
        return base;
    }

    function scheduleDayRules(manager, dayKey) {
        const rules = Array.isArray(manager && manager.scheduleRules) ? manager.scheduleRules : [];
        return rules.filter(rule => rule && !1 !== rule.enabled && normalizeScheduleDays(rule.days).includes(Number(dayKey))).map(rule => ({
            rule,
            ...scheduleRuleRange(rule)
        })).sort((a, b) => a.start - b.start || a.end - b.end || normalizeSchedulePriority(b.rule.priority, 0) - normalizeSchedulePriority(a.rule.priority, 0) || String(a.rule.id).localeCompare(String(b.rule.id)));
    }

    function assignScheduleLanes(blocks) {
        const laneEnds = [];
        return blocks.map(block => {
            let lane = laneEnds.findIndex(end => block.start >= end);
            if (lane < 0) lane = laneEnds.length;
            laneEnds[lane] = block.end;
            return { ...block, lane };
        });
    }

    function selectedScheduleRuleForDay(dayKey) {
        const selected = D.selectedScheduleBlock || null;
        if (!selected || Number(selected.dayKey) !== Number(dayKey)) return null;
        const rules = Array.isArray(L.manager && L.manager.scheduleRules) ? L.manager.scheduleRules : [];
        return rules.find(rule => rule && rule.id === selected.ruleId && normalizeScheduleDays(rule.days).includes(Number(dayKey))) || null;
    }

    function ensureSingleDayScheduleRule(dayKey, ruleId) {
        const normalizedDay = Number(dayKey);
        const manager = normalizeManagerState(L.manager);
        const rules = Array.isArray(manager.scheduleRules) ? manager.scheduleRules.slice() : [];
        const index = rules.findIndex(rule => rule && rule.id === ruleId);
        if (index < 0) return null;
        const rule = rules[index];
        const days = normalizeScheduleDays(rule.days);
        if (days.length === 1 && days[0] === normalizedDay) return rule;
        const remainingDays = days.filter(day => day !== normalizedDay);
        const clone = normalizeScheduleRule({
            ...rule,
            id: createScheduleRuleId(),
            days: [normalizedDay]
        }, rules.length, "weekly");
        const nextRules = remainingDays.length ? rules.map((entry, entryIndex) => entryIndex === index ? { ...entry, days: remainingDays } : entry).concat(clone) : rules.map((entry, entryIndex) => entryIndex === index ? clone : entry);
        L.manager = normalizeManagerState({
            ...manager,
            scheduleRules: nextRules
        });
        D.selectedScheduleBlock = { dayKey: normalizedDay, ruleId: clone.id };
        return (L.manager.scheduleRules || []).find(entry => entry.id === clone.id) || clone;
    }

    function updateSingleDayScheduleRule(dayKey, ruleId, patch, reason, options = {}) {
        const rule = ensureSingleDayScheduleRule(dayKey, ruleId);
        if (!rule) return;
        updateScheduleRule(rule.id, { ...patch, days: [Number(dayKey)] });
        D.selectedScheduleBlock = { dayKey: Number(dayKey), ruleId: rule.id };
        const forceNow = !!(options && options.forceRender) || Object.prototype.hasOwnProperty.call(patch || {}, "statusKey");
        if (forceNow) forceImmediateScheduleTimelineRefresh();
        persistManagerState(reason || "manager-rule-update", { ...options, forceRender: forceNow || !!(options && options.forceRender), preferCurrentManager: true });
        if (forceNow) forceImmediateScheduleTimelineRefresh();
    }


    function forceImmediateScheduleTimelineRefresh() {
        try { D.lastScheduleRulesSig = ""; } catch {}
        try { D.scheduleRenderHoldUntil = 0; } catch {}
        try { D.pendingScheduleRender = false; } catch {}
        try {
            const host = L.gui && L.gui.elements && L.gui.elements.scheduleList;
            if (host && host.dataset) host.dataset.renderedScheduleSig = "";
        } catch {}
        try { renderManagerRules({ forceRender: true }); } catch {}
        try {
            if (window.requestAnimationFrame) window.requestAnimationFrame(() => {
                try { D.lastScheduleRulesSig = ""; } catch {}
                try {
                    const host = L.gui && L.gui.elements && L.gui.elements.scheduleList;
                    if (host && host.dataset) host.dataset.renderedScheduleSig = "";
                } catch {}
                try { renderManagerRules({ forceRender: true }); } catch {}
            });
        } catch {}
    }

    function deleteSingleDayScheduleRule(dayKey, ruleId) {
        const normalizedDay = Number(dayKey);
        const manager = normalizeManagerState(L.manager);
        const rules = Array.isArray(manager.scheduleRules) ? manager.scheduleRules.slice() : [];
        let removed = false;
        const nextRules = [];
        for (const rule of rules) {
            if (!rule || rule.id !== ruleId) {
                nextRules.push(rule);
                continue;
            }
            const remainingDays = normalizeScheduleDays(rule.days).filter(day => day !== normalizedDay);
            if (remainingDays.length) nextRules.push({ ...rule, days: remainingDays });
            removed = true;
        }
        if (!removed) {
            D.selectedScheduleBlock = null;
            renderManagerRules();
            return;
        }
        L.manager = normalizeManagerState({ ...manager, scheduleRules: nextRules });
        D.selectedScheduleBlock = null;
        D.lastScheduleRulesSig = "";
        D.scheduleRenderHoldUntil = 0;
        D.pendingScheduleRender = false;
        try {
            const active = document.activeElement;
            if (active && active.blur && active.closest && active.closest(".schedule-detail-editor")) active.blur();
        } catch {}
        try {
            const host = L.gui && L.gui.elements && L.gui.elements.scheduleList;
            if (host && host.dataset) host.dataset.renderedScheduleSig = "";
        } catch {}
        try { renderManagerRules(); } catch {}
        try { window.requestAnimationFrame && window.requestAnimationFrame(() => { D.lastScheduleRulesSig = ""; renderManagerRules(); }); } catch {}
        // Deleting reduces the schedule weight, so force the current manager to win over the
        // stored account snapshot. Otherwise the registry merge can restore the deleted block.
        persistManagerState("manager-rule-delete", { forceRender: true, force: false, preferCurrentManager: true, destructiveScheduleEdit: true });
    }

    function addScheduleBlockAt(dayKey, minutes) {
        const now = Date.now();
        if (D.timelineSuppressAddUntil && now < D.timelineSuppressAddUntil) return;
        D.timelineSuppressAddUntil = now + 750;
        const normalizedDay = Number(dayKey);
        const blocks = scheduleDayRules(L.manager, normalizedDay);
        if (blocks.length >= MAX_SCHEDULE_BLOCKS_PER_DAY) {
            q("gui", "Schedule day is full", { day: normalizedDay, max: MAX_SCHEDULE_BLOCKS_PER_DAY });
            return;
        }
        const start = Math.min(1380, scheduleSnapMinutes(minutes));
        const end = Math.min(1439, start + 60);
        const rule = {
            id: createScheduleRuleId(),
            enabled: true,
            start: scheduleTimeValue(start),
            end: scheduleTimeValue(end),
            statusKey: normalizeStatusKey(L.manager && L.manager.manualStatusKey || "available"),
            days: [normalizedDay],
            note: "",
            priority: nextSchedulePriorityForRange(L.manager, normalizedDay, start, end),
            allowAvailableDuringCalls: !!(L.manager && L.manager.allowAvailableDuringCalls)
        };
        L.manager = normalizeManagerState({
            ...L.manager,
            scheduleEnabled: !!(L.manager && L.manager.scheduleEnabled),
            scheduleRules: [...(L.manager.scheduleRules || []), rule]
        });
        D.selectedScheduleBlock = { dayKey: normalizedDay, ruleId: rule.id };
        forceImmediateScheduleTimelineRefresh();
        persistManagerState("manager-rule-add-timeline", { force: false, forceRender: true, preferCurrentManager: true });
        forceImmediateScheduleTimelineRefresh();
    }

    function updateScheduleBlockPreview(block, rule, hourWidthOverride) {
        if (!block || !rule) return;
        const hourWidth = Number(hourWidthOverride) > 0 ? Number(hourWidthOverride) : scheduleTimelineHourWidth();
        const range = scheduleRuleRange(rule);
        const widthPx = Math.max(34, (range.duration / 60) * hourWidth);
        block.style.setProperty("left", `${(range.start / 60) * hourWidth}px`, "important");
        block.style.setProperty("width", `${widthPx}px`, "important");
        block.style.setProperty("max-width", "none", "important");
        block.classList.toggle("compact", widthPx < 108);
        block.classList.toggle("tiny", widthPx < 58);
        const label = block.querySelector(".schedule-block-label");
        if (label) label.textContent = scheduleBlockLabel(rule, widthPx);
        block.title = scheduleBlockTitle(rule);
        block.setAttribute("data-rule-id", rule.id);
    }

    function scheduleDayFromPointer(event, fallbackDay) {
        try {
            const host = L.gui && L.gui.elements && L.gui.elements.scheduleList || null;
            const lanes = host && host.querySelectorAll ? Array.from(host.querySelectorAll(".schedule-lanes[data-day]")) : [];
            if (!lanes.length) return Number(fallbackDay);
            const x = Number(event && event.clientX);
            const y = Number(event && event.clientY);
            let closestDay = Number(fallbackDay), closestDistance = Infinity;
            for (const lane of lanes) {
                const rect = lane.getBoundingClientRect && lane.getBoundingClientRect();
                if (!rect) continue;
                const day = Number(lane.getAttribute("data-day"));
                if (!Number.isInteger(day)) continue;
                const withinY = y >= rect.top - 12 && y <= rect.bottom + 12;
                const withinX = x >= rect.left - 32 && x <= rect.right + 32;
                if (withinY && withinX) return day;
                const dy = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
                const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
                const distance = dy * dy + dx * dx;
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestDay = day;
                }
            }
            return Number.isInteger(closestDay) ? closestDay : Number(fallbackDay);
        } catch {
            return Number(fallbackDay);
        }
    }

    function startScheduleBlockPointer(event, mode, dayKey, ruleId, block) {
        if (event.button != null && event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        const normalizedDay = Number(dayKey);
        const originalRule = (L.manager.scheduleRules || []).find(rule => rule && rule.id === ruleId);
        if (!originalRule) return;
        const originalManagerSnapshot = normalizeManagerState(L.manager);
        const dragMode = mode === "left" || mode === "right" ? mode : "move";
        D.selectedScheduleBlock = { dayKey: normalizedDay, ruleId };
        D.scheduleRenderHoldUntil = Date.now() + 5000;
        D.timelineSuppressAddUntil = Date.now() + 750;
        const pointerId = event.pointerId;
        const startClientX = event.clientX;
        const dragHourWidth = Math.max(1, scheduleTimelineHourWidth());
        const originalRange = scheduleRuleRange(originalRule);
        const snap = 15;
        const minDuration = 15;
        let activeRule = null;
        let changed = false;
        let moved = false;
        let latestStartText = scheduleTimeValue(originalRange.start);
        let latestEndText = scheduleTimeValue(originalRange.end);
        let latestRuleId = ruleId;
        let latestDayKey = normalizedDay;
        const originalLane = block && block.parentElement || null;
        const originalTop = block && block.style && block.style.top || "";
        if (block && block.classList) block.classList.add("dragging");
        const ensureActiveRule = () => {
            if (activeRule) return activeRule;
            activeRule = ensureSingleDayScheduleRule(normalizedDay, latestRuleId || ruleId) || originalRule;
            latestRuleId = activeRule.id;
            D.selectedScheduleBlock = { dayKey: latestDayKey, ruleId: activeRule.id };
            return activeRule;
        };
        const movePreviewToDay = moveEvent => {
            if (dragMode !== "move") return latestDayKey;
            const nextDay = scheduleDayFromPointer(moveEvent, latestDayKey);
            if (!Number.isInteger(nextDay) || nextDay < 0 || nextDay > 6) return latestDayKey;
            if (nextDay === latestDayKey) return latestDayKey;
            latestDayKey = nextDay;
            D.selectedScheduleBlock = { dayKey: latestDayKey, ruleId: latestRuleId || ruleId };
            try {
                const host = L.gui && L.gui.elements && L.gui.elements.scheduleList || null;
                const nextLane = host && host.querySelector && host.querySelector(`.schedule-lanes[data-day="${latestDayKey}"]`);
                if (nextLane && block && block.parentElement !== nextLane) {
                    nextLane.appendChild(block);
                    block.setAttribute("data-day", String(latestDayKey));
                    const laneIndex = Math.max(0, Number(block.getAttribute("data-drag-lane") || 0));
                    block.style.setProperty("top", `${8 + laneIndex * 36}px`, "important");
                }
            } catch {}
            return latestDayKey;
        };
        const computeNextRange = deltaPx => {
            const deltaMinutes = Math.round((deltaPx / dragHourWidth * 60) / snap) * snap;
            let nextStart = originalRange.start;
            let nextEnd = originalRange.end;
            if (dragMode === "left") {
                nextStart = scheduleClamp(originalRange.start + deltaMinutes, 0, originalRange.end - minDuration);
            } else if (dragMode === "right") {
                nextEnd = scheduleClamp(originalRange.end + deltaMinutes, originalRange.start + minDuration, 1439);
            } else {
                const duration = originalRange.duration;
                nextStart = scheduleClamp(originalRange.start + deltaMinutes, 0, 1439 - duration);
                nextEnd = Math.min(1439, nextStart + duration);
            }
            return { nextStart, nextEnd };
        };
        const onMove = moveEvent => {
            if (moveEvent && moveEvent.cancelable) moveEvent.preventDefault();
            const deltaPx = Number(moveEvent.clientX || 0) - startClientX;
            const beforeDay = latestDayKey;
            const targetDay = movePreviewToDay(moveEvent);
            if (!moved && Math.abs(deltaPx) < 3 && targetDay === normalizedDay) return;
            moved = true;
            D.scheduleRenderHoldUntil = Date.now() + 5000;
            D.timelineSuppressAddUntil = Date.now() + 750;
            const { nextStart, nextEnd } = computeNextRange(deltaPx);
            const nextStartText = scheduleTimeValue(nextStart);
            const nextEndText = scheduleTimeValue(nextEnd);
            if (nextStartText === latestStartText && nextEndText === latestEndText && targetDay === beforeDay) return;
            const rule = ensureActiveRule();
            latestStartText = nextStartText;
            latestEndText = nextEndText;
            changed = true;
            updateScheduleBlockPreview(block, { ...rule, start: latestStartText, end: latestEndText, days: [latestDayKey] }, dragHourWidth);
        };
        const finish = () => {
            try { block && block.releasePointerCapture && block.releasePointerCapture(pointerId); } catch {}
            try { block && block.classList && block.classList.remove("dragging"); } catch {}
            window.removeEventListener("pointermove", onMove, true);
            window.removeEventListener("pointerup", finish, true);
            window.removeEventListener("pointercancel", finish, true);
            D.scheduleRenderHoldUntil = 0;
            D.timelineSuppressAddUntil = Date.now() + 500;
            if (changed && latestStartText && latestEndText) {
                const rule = ensureActiveRule();
                const reason = dragMode === "move" ? "manager-schedule-drag" : "manager-schedule-resize";
                if (dragMode === "move") {
                    updateScheduleRule(rule.id, { start: latestStartText, end: latestEndText, days: [Number(latestDayKey)] });
                    D.selectedScheduleBlock = { dayKey: Number(latestDayKey), ruleId: rule.id };
                    persistManagerState(reason, { forceRender: true, force: false });
                } else {
                    updateSingleDayScheduleRule(normalizedDay, rule.id, { start: latestStartText, end: latestEndText }, reason, { forceRender: true, force: false });
                }
            } else {
                if (activeRule) {
                    L.manager = originalManagerSnapshot;
                    D.selectedScheduleBlock = { dayKey: normalizedDay, ruleId };
                }
                try {
                    if (originalLane && block && block.parentElement !== originalLane) originalLane.appendChild(block);
                    if (block && block.style) block.style.setProperty("top", originalTop || "", "important");
                } catch {}
                renderManagerRules();
                ct();
            }
        };
        try { block && block.setPointerCapture && block.setPointerCapture(pointerId); } catch {}
        window.addEventListener("pointermove", onMove, true);
        window.addEventListener("pointerup", finish, true);
        window.addEventListener("pointercancel", finish, true);
    }

    function buildSelectedScheduleEditor(dayKey, rule) {
        if (!rule) return null;
        const range = scheduleRuleRange(rule);
        const startInput = Oe("input", { className: "schedule-detail-input", type: "time", value: scheduleTimeValue(range.start) });
        const endInput = Oe("input", { className: "schedule-detail-input", type: "time", value: scheduleTimeValue(range.end) });
        const statusSelect = Oe("select", { className: "schedule-detail-input" });
        for (const key of STATUS_PRESET_KEYS) statusSelect.appendChild(Oe("option", { value: key, text: getStatusPreset(key).label }));
        statusSelect.value = normalizeStatusKey(rule.statusKey);
        const callsToggle = Oe("input", { type: "checkbox", checked: !!rule.allowAvailableDuringCalls });
        const priorityInput = Oe("input", { className: "schedule-detail-input", type: "number", value: String(normalizeSchedulePriority(rule.priority, 0)), attrs: { min: "0", max: "999", step: "1", title: "Priority: higher wins when blocks overlap" } });
        const noteInput = Oe("input", { className: "schedule-detail-input", type: "text", value: rule.note || "", placeholder: "Optional note" });
        const deleteBtn = Oe("button", { type: "button", text: "Delete" });
        startInput.addEventListener("change", event => updateSingleDayScheduleRule(dayKey, rule.id, { start: event.target.value || "09:00" }, "manager-rule-start"));
        endInput.addEventListener("change", event => updateSingleDayScheduleRule(dayKey, rule.id, { end: event.target.value || "17:00" }, "manager-rule-end"));
        statusSelect.addEventListener("change", event => updateSingleDayScheduleRule(dayKey, rule.id, { statusKey: normalizeStatusKey(event.target.value) }, "manager-rule-status", { forceRender: true, preferCurrentManager: true }));
        callsToggle.addEventListener("change", event => updateSingleDayScheduleRule(dayKey, rule.id, { allowAvailableDuringCalls: !!event.target.checked }, "manager-rule-calls"));
        priorityInput.addEventListener("change", event => updateSingleDayScheduleRule(dayKey, rule.id, { priority: normalizeSchedulePriority(event.target.value, 0) }, "manager-rule-priority"));
        noteInput.addEventListener("change", event => updateSingleDayScheduleRule(dayKey, rule.id, { note: String(event.target.value || "").trim().slice(0, 120) }, "manager-rule-note"));
        deleteBtn.addEventListener("click", event => {
            try { event.preventDefault(); event.stopPropagation(); } catch {}
            deleteSingleDayScheduleRule(dayKey, rule.id);
        });
        return Oe("div", { className: "schedule-detail-editor" }, [
            Oe("label", {}, [Oe("span", { text: "Start" }), startInput]),
            Oe("label", {}, [Oe("span", { text: "End" }), endInput]),
            Oe("label", {}, [Oe("span", { text: "Status" }), statusSelect]),
            Oe("label", {}, [Oe("span", { text: "Priority" }), priorityInput]),
            Oe("label", { className: "schedule-detail-check" }, [callsToggle, Oe("span", { text: "Allow status changes during calls" })]),
            Oe("label", {}, [Oe("span", { text: "Note" }), noteInput]),
            deleteBtn
        ]);
    }

    function renderManagerRules(options = {}) {
        if (!L.gui || !L.gui.elements) return;
        const forceRender = !!(options && options.forceRender);
        const {
            managerStatus: e,
            allowAvailableDuringCalls: t,
            scheduleEnabled: n,
            scheduleList: o,
            targetStatus: r,
            callState: i,
            targetAccountEmail: c
        } = L.gui.elements,
            a = normalizeManagerState(L.manager),
            s = managerTargetDescriptionForUi(a),
            l = L.lastBackendPresence;
        e && document.activeElement !== e && (e.value = a.manualStatusKey), t && (t.checked = !!a.allowAvailableDuringCalls), n && (n.checked = !!a.scheduleEnabled), r && (r.textContent = s.description, r.title = s.previewDescription ? "Actual runtime now: " + s.actualDescription + "\nSelected-day preview: " + s.previewDescription : s.description), L.gui.elements.selectedSchedulePreview && (L.gui.elements.selectedSchedulePreview.hidden = !s.previewDescription, L.gui.elements.selectedSchedulePreview.textContent = s.previewDescription ? "Selected preview only: " + s.previewDescription : ""), i && (i.textContent = l ? `${describeBackendPresence(l)} @ ${V(l.at)}` : "No status yet"), c && (c.textContent = L.targetAccountEmail || "Unknown");
        if (D && D.scheduleOverrideWarning) {
            const e = !!(L.enabled && a.scheduleEnabled && hasEnabledScheduleRules(a));
            D.scheduleOverrideWarning.hidden = !e;
            D.scheduleOverrideWarning.textContent = e ? "Manual override is on; schedule blocks are paused until override is turned off." : "";
        }
        if (!o) return;
        if (L.activeTab !== "activity") {
            D.pendingScheduleRender = true;
            return;
        }
        const selected = D.selectedScheduleBlock || null;
        const timelineWidthSig = (() => {
            try {
                const rect = o && o.getBoundingClientRect && o.getBoundingClientRect();
                return rect && Number.isFinite(rect.width) ? Math.round(rect.width) : 0;
            } catch { return 0 }
        })();
        const signature = JSON.stringify({
            zoom: D.timelineZoomLevel,
            timelineWidth: timelineWidthSig,
            selected,
            rules: a.scheduleRules.map(rule => [rule.id, rule.enabled, rule.start, rule.end, rule.statusKey, Array.isArray(rule.days) ? rule.days.join(",") : "", rule.note || "", !!rule.allowAvailableDuringCalls, normalizeSchedulePriority(rule.priority, 0)])
        });
        const active = document.activeElement;
        const hold = !!(D.scheduleRenderHoldUntil && Date.now() < D.scheduleRenderHoldUntil);
        if (!forceRender && (hold || active && o.contains(active) && /^(?:INPUT|SELECT|TEXTAREA)$/.test(active.tagName || "")) && o.childElementCount) {
            D.pendingScheduleRender = true;
            return;
        }
        if (!forceRender && D.lastScheduleRulesSig === signature && String(o.dataset.renderedScheduleSig || "") === signature) return;
        D.lastScheduleRulesSig = signature;
        const hourWidth = scheduleTimelineHourWidth();
        const timelineWidth = Math.round(24 * hourWidth);
        const zoomOut = Oe("button", { type: "button", text: "−", title: "Compress timeline" });
        const zoomIn = Oe("button", { type: "button", text: "+", title: "Expand timeline" });
        const hint = Oe("div", { className: "schedule-timeline-hint", text: "Wheel over the strip to zoom. Drag blocks to move. Use the side handles to resize." });
        zoomOut.addEventListener("click", () => {
            D.timelineZoomLevel = Math.max(0, (Number(D.timelineZoomLevel) || 0) - 1);
            renderManagerRules();
        });
        zoomIn.addEventListener("click", () => {
            D.timelineZoomLevel = Math.min(SCHEDULE_TIMELINE_ZOOM_STEPS.length - 1, (Number(D.timelineZoomLevel) || 0) + 1);
            renderManagerRules();
        });
        const root = Oe("div", { className: "schedule-timeline-editor" }, [
            Oe("div", { className: "schedule-timeline-toolbar" }, [
                Oe("div", { className: "muted", text: "Timeline editor" }),
                Oe("div", { className: "schedule-zoom-controls" }, [zoomOut, zoomIn])
            ]),
            hint
        ]);
        for (const dayKey of SCHEDULE_TIMELINE_DAY_ORDER) {
            const blocks = assignScheduleLanes(scheduleDayRules(a, dayKey));
            const laneCount = Math.max(1, blocks.reduce((max, block) => Math.max(max, block.lane + 1), 1));
            const axis = Oe("div", { className: "schedule-axis" });
            axis.style.width = `${timelineWidth}px`;
            for (let hour = 0; hour <= 24; hour += 2) {
                const tick = Oe("div", { className: "schedule-axis-tick", text: String(hour).padStart(2, "0") });
                tick.style.left = `${hour * hourWidth}px`;
                axis.appendChild(tick);
            }
            const lanes = Oe("div", { className: "schedule-lanes", attrs: { "data-day": dayKey } });
            lanes.style.width = `${timelineWidth}px`;
            lanes.style.height = `${Math.max(46, laneCount * 36 + 12)}px`;
            for (let hour = 0; hour <= 24; hour += 1) {
                const grid = Oe("span", { className: hour % 2 === 0 ? "schedule-grid major" : "schedule-grid" });
                grid.style.left = `${hour * hourWidth}px`;
                lanes.appendChild(grid);
            }
            let addStart = null;
            lanes.addEventListener("pointerdown", event => {
                if (event.target !== lanes) return;
                addStart = { x: event.clientX, y: event.clientY };
            });
            lanes.addEventListener("pointerup", event => {
                if (!addStart || event.target !== lanes) return;
                const moved = Math.abs(event.clientX - addStart.x) + Math.abs(event.clientY - addStart.y);
                addStart = null;
                if (moved > 8) return;
                const rect = lanes.getBoundingClientRect();
                addScheduleBlockAt(dayKey, ((event.clientX - rect.left) / hourWidth) * 60);
            });
            for (const blockData of blocks) {
                const rule = blockData.rule;
                const tone = normalizeStatusKey(rule.statusKey);
                const block = Oe("button", {
                    type: "button",
                    className: "schedule-block",
                    title: scheduleBlockTitle(rule),
                    attrs: { "data-rule-id": rule.id, "data-day": dayKey, "data-tone": tone, "data-drag-lane": String(blockData.lane || 0) }
                }, [
                    Oe("span", { className: "schedule-resize-handle left", attrs: { "data-resize": "left" } }),
                    Oe("span", { className: "schedule-block-label", text: scheduleBlockTitle(rule) }),
                    Oe("span", { className: "schedule-resize-handle right", attrs: { "data-resize": "right" } })
                ]);
                block.style.setProperty("left", `${(blockData.start / 60) * hourWidth}px`, "important");
                block.style.setProperty("top", `${8 + blockData.lane * 36}px`, "important");
                const blockWidthPx = Math.max(34, ((blockData.end - blockData.start) / 60) * hourWidth);
                block.style.setProperty("width", `${blockWidthPx}px`, "important");
                block.style.setProperty("max-width", "none", "important");
                block.classList.toggle("compact", blockWidthPx < 108);
                block.classList.toggle("tiny", blockWidthPx < 58);
                const blockLabel = block.querySelector(".schedule-block-label");
                if (blockLabel) blockLabel.textContent = scheduleBlockLabel(rule, blockWidthPx);
                if (selected && selected.ruleId === rule.id && Number(selected.dayKey) === Number(dayKey)) block.classList.add("selected");
                block.addEventListener("pointerdown", event => {
                    const resize = event.target && event.target.getAttribute && event.target.getAttribute("data-resize");
                    startScheduleBlockPointer(event, resize || "move", dayKey, rule.id, block);
                });
                lanes.appendChild(block);
            }
            const strip = Oe("div", { className: "schedule-time-strip" }, [axis, lanes]);
            strip.style.width = `${timelineWidth}px`;
            const wrap = Oe("div", { className: "schedule-time-wrap", attrs: { "data-day": dayKey } }, [strip]);
            wrap.addEventListener("scroll", () => {
                D.timelineScrollLeftByDay[dayKey] = wrap.scrollLeft;
            }, { passive: true });
            wrap.addEventListener("wheel", event => {
                if (Math.abs(event.deltaX || 0) > Math.abs(event.deltaY || 0)) return;
                event.preventDefault();
                D.timelineScrollLeftByDay[dayKey] = wrap.scrollLeft;
                D.timelineZoomLevel = Math.max(0, Math.min(SCHEDULE_TIMELINE_ZOOM_STEPS.length - 1, (Number(D.timelineZoomLevel) || 0) + (event.deltaY < 0 ? 1 : -1)));
                renderManagerRules();
            }, { passive: false });
            const selectedRule = selectedScheduleRuleForDay(dayKey);
            const row = Oe("div", { className: "schedule-day-row" }, [
                Oe("div", { className: "schedule-day-label" }, [
                    Oe("strong", { text: scheduleDayLabel(dayKey, true) }),
                    Oe("span", { text: `${blocks.length} block${blocks.length === 1 ? "" : "s"}` })
                ]),
                wrap,
                selectedRule ? buildSelectedScheduleEditor(dayKey, selectedRule) : null
            ]);
            root.appendChild(row);
            window.requestAnimationFrame && window.requestAnimationFrame(() => {
                wrap.scrollLeft = Number(D.timelineScrollLeftByDay[dayKey] || 0);
            });
        }
        o.replaceChildren(root);
        o.dataset.renderedScheduleSig = signature;
        D.pendingScheduleRender = false;
    }


    function stopRuntimeTimersForPolicy() {
        try { U.heartbeatTimer && U.nativeClearInterval && (U.nativeClearInterval(U.heartbeatTimer), U.heartbeatTimer = null) } catch {}
        try { U.refreshTimer && U.nativeClearTimeout && (U.nativeClearTimeout(U.refreshTimer), U.refreshTimer = null) } catch {}
        try { U.pendingForceTimer && U.nativeClearTimeout && (U.nativeClearTimeout(U.pendingForceTimer), U.pendingForceTimer = null) } catch {}
        try { U.scheduleTransitionTimer && U.nativeClearTimeout && (U.nativeClearTimeout(U.scheduleTransitionTimer), U.scheduleTransitionTimer = null) } catch {}
        try { R.timer && R.nativeClearInterval && (R.nativeClearInterval(R.timer), R.timer = null) } catch {}
    }

    function removeTeamsHelperGui(reason) {
        const gui = L.gui;
        try { gui && "function" == typeof gui.dispose && gui.dispose(reason || "remove"); } catch {}
        try {
            const host = gui && gui.host || document.getElementById("teams-helper-control-panel");
            host && host.remove && host.remove()
        } catch {}
        if (L.gui === gui) L.gui = null;
        try {
            D.guiMountObserver && D.guiMountObserver.disconnect();
            D.guiMountObserver = null;
            D.guiMountObserverTimer && clearTimeout(D.guiMountObserverTimer);
            D.guiMountObserverTimer = null;
        } catch {}
        if (reason) {
            const now = z(), sig = String(reason || "");
            if (D.lastGuiHiddenReason !== sig || now - Number(D.lastGuiHiddenAt || 0) > 10000) q("gui", "Teams page GUI hidden", { reason });
            D.lastGuiHiddenReason = sig;
            D.lastGuiHiddenAt = now;
        }
    }

    function applyPageLicensePolicy(enabled, policy, error) {
        const blocked = policyMetaBlocksRuntime(policy),
            allowed = !!enabled && !blocked,
            previousAllowed = !!L.policyAllowed;
        L.policyKnown = true;
        L.runtimePolicy = policy || null;
        L.policyAllowed = allowed;
        L.policyBlockReason = allowed ? null : describeRuntimePolicyBlock(policy, error || "controls-unavailable");
        if (!allowed) {
            stopRuntimeTimersForPolicy();
            if (L.enabled) {
                L.enabled = false;
                C(k.enabled, false);
                try { persistSelectedAccountState({ touch: true }) } catch {}
            }
            removeTeamsHelperGui(L.policyBlockReason || "controls-unavailable")
        } else {
            previousAllowed || q("license", "Runtime policy unlocked", { reason: "policy-allowed" });
            document.documentElement && (ut(), dt());
            Te()
        }
        q("license", allowed ? "Entitlement active" : "Runtime blocked", allowed ? policy || null : { reason: L.policyBlockReason, policy: policy || null, error: error || null });
        try { D && D.syncTabs && D.syncTabs() } catch {}
        ct()
    }

    function __twhBuildPageDeps() {
        return {
            e, t, n, o, r, i, a, s,
            l, c, u, d, p, f, m, g,
            y, b, v, h, w, I, ECS_TELEMETRY_NOISE, ZUSTAND_NOISE,
            AUTH_NOISE, S, POLICY_STATE_KEY_PAGE, k, x, C, setLocalStorageIfChanged, getCachedRuntimePolicyState,
            policyMetaBlocksRuntime, describeRuntimePolicyBlock, INITIAL_POLICY_STATE, isApprovedBetaRuntimePolicy, isFeedbackTabAllowed, T, A, E,
            O, _, B, P, j, N, M, STATUS_PRESETS,
            STATUS_PRESET_KEYS, SCHEDULE_DAY_LABELS, SCHEDULE_TIMELINE_DAY_ORDER, SCHEDULE_DAY_FULL_LABELS, SCHEDULE_TIMELINE_ZOOM_STEPS, MAX_SCHEDULE_BLOCKS_PER_DAY, MANAGER_STORAGE_KEY, ACCOUNT_CONFIGS_STORAGE_KEY,
            SELECTED_ACCOUNT_KEY_STORAGE_KEY, DEFAULT_MANAGER_STATE, STATUS_ALIASES, normalizeStatusKey, getStatusPreset, coerceStatusKey, createScheduleRuleId, normalizeSchedulePriority,
            normalizeScheduleTimeZone, normalizeScheduleTimezoneOffset, normalizeScheduleLocalDate, normalizeScheduleLocalDay, normalizeScheduleLocalMinutes, normalizeScheduleClockIso, scheduleClientTimeZoneName, scheduleLocalDateString,
            scheduleClientClockSnapshot, normalizeScheduleDays, normalizeScheduleRule, normalizeManagerState, attachScheduleClientClock, stripScheduleClientClock, shouldRefreshScheduleClientClock, maybeAttachScheduleClientClock,
            loadManagerState, saveManagerState, normalizeTeamsAccountType, stripAccountKeyPrefixes, accountFallbackId, buildAccountKey, accountKeyEmail, currentPageTeamsType,
            accountEntryTeamsType, accountMatchesCurrentPage, baseUrlMatchesTeamsType, resolveAccountKeyForCurrentPage, accountUpdatedAtValue, managerScheduleWeight, preferIncomingAccountEntry, mergeStoredAccountEntry,
            normalizeStoredAccountEntry, normalizeAccountRegistry, loadAccountRegistry, saveAccountRegistry, loadSelectedAccountKey, saveSelectedAccountKey, getCurrentAccountMeta, persistSelectedAccountState,
            applyAccountSelection, ensureDetectedAccountRegistered, buildRuntimeAccountRegistryPayload, scheduleTimeToMinutes, ruleMatchesNow, scheduleRulePrioritySuffix, scheduleRuleTimeSummary, collectMatchingScheduleRules,
            selectHighestPriorityRule, evaluateManagerSchedule, enabledScheduleRules, hasEnabledScheduleRules, dateForScheduleDay, selectedSchedulePreviewDescription, managerTargetDescriptionForUi, scheduleDayNameFromRule,
            nextScheduleRuleSummary, scheduleStoredElsewhereSummary, isManualOverrideActive, isPresenceRequestsEnabled, isRuntimePolicyAllowed, isPresenceRuntimeEnabled, resolveManagedStatus, forceAvailabilityExpiry,
            managedStatusAllowsAvailableDuringCalls, statusForceAvailabilityBody, buildManagedBodies, describeManagerTarget, L, U, D, R,
            F, H, J, W, z, V, Y, X,
            compactLogValue, compactLogExtra, pruneTimestampMap, isHeavyDebugRetentionEnabled, pageLogLimit, consoleLogLimit, trimArrayInPlace, shouldRetainPageLog,
            q, consoleArgToText, isRoutineSuppressedConsole, noteSuppressedConsoleNoise, recordConsole, formatLogLine, renderLogsPanel, scheduleLightUiRefresh,
            scheduleFullUiRefresh, scheduleRuntimeSync, exportLogs, copyLogs, G, $, K, Q,
            Z, remoteBridgeStateSignature, isRemoteManualOverrideEnableReason, isRemoteManualOverrideDisableReason, shouldIgnoreStaleRemoteManualOff, ee, isRuntimeMutationReason, isCloudStatePreservingTimelineReason,
            runtimeSyncStableSignature, shouldPostRuntimeSync, te, ne, buildRuntimeSyncPayload, oe, ie, ae,
            LIVE_WORKER_FIELDS, LIVE_TELEMETRY_KEYS, LIVE_PRESENCE_HEADER_KEYS, hasLiveValue, putLiveValue, normalizeHeaderMap, headersFromRequestLike, requestUrlOf,
            parseBodyObject, rememberTelemetryQueryFromUrl, queueLivePresenceCaptureForBackground, rememberPresenceRequest, observeNetworkRequest, pagePacketTraceFinish, pagePacketTracePromise, serviceWorkerStateText, regionFromText, collectLiveDiscoveryHints,
            defaultWorkerFields, livePresenceHeaders, pruneBridgePending, bridgeUiRequest, requestCapturedPresenceHeaders, normalizeAccountEmail, extractUrlEmail, decodeJwtPayload,
            collectAccountEmails, extractTeamsAccountEmail, forceAfterRemoteState, applyRemoteBridgeState, se, le, ce, ue,
            de, pe, fe, me, ge, ye, be, ve,
            he, we, Ie, getStableEndpointId, Se, ke, bridgeFailureSignature, noteBridgeProxyFailure,
            isForceAvailabilityRequestUrl, availabilityBridgeHeaderHints, xe, getAuthModeCandidates, getCurrentUserMri, CALL_ACTIVITY_RE, CALL_TEXT_RE, CALL_API_SIGNAL_TTL_MS,
            CALL_API_IDLE_GRACE_MS, CALL_API_STRONG_RE, CALL_API_CONTEXT_RE, CALL_API_BODY_RE, SEEN_MARKER_RE, SEEN_BODY_RE, collectCallText, isCallLikePresence,
            isStrongTeamsCallApiUrl, isCallContextApiUrl, isPresenceGetPresenceUrl, isTeamsCallApiUrl, isNotSeenModeEnabled, bodyTextForSeenMarker, shouldBlockSeenMarkerRequest, noteSeenMarkerBlocked,
            syntheticSeenMarkerResponse, describeTeamsCallApiUrl, freshCallApiState, pushCallApiRuntimeState, parsePresenceResponseBody, rememberPresenceApiResponse, rememberCallApiSignal, detectApiCallState,
            mergeCallStates, setLastCallState, formatCallStateForUi, refreshCallState, startCallStateMonitor, describeBackendPresence, isVerifierPresenceReason, presenceLooksOffline,
            fetchBackendPresence, cleanForceReason, responseTextOf, isPresenceRateLimitedResponse, isPresenceInvalidStateResponse, isPresenceAuthFailureText, isPresenceAuthFailureResponse, clearPresenceAuthFailure,
            recordPresenceAuthFailure, presenceAuthRecoveryActive, presenceForceBackoffActive, skipPresenceForceForBackoff, availabilityOnlyForceBody, directForceTargetSignature, normalizePresenceValue, presenceMatchesManagedStatus,
            isAutomaticForceReason, isUserInitiatedForceReason, manualStyleScheduleForceReason, shouldSkipRepeatedDirectForce, rememberDirectForceOutcome, recordPresenceForceOutcome, Ce, scheduleResolutionSignature,
            activeScheduleRuntimeSignature, activeScheduleForceDue, markActiveScheduleForceAttempt, requestBackgroundForceRun, maybeForceActiveSchedule, nextScheduleTransitionDate, resetScheduleTransitionTimer, Te,
            handleBackgroundPresenceForceMessage, notifyBackgroundAfkRuntime, Ae, Ee, Oe, _e, Be, Pe,
            je, Ne, Me, isActiveScheduleRuntimeNow, Le, Ue, De, Re,
            Fe, He, Je, We, ze, Ve, Ye, emitActivitySpoofNow,
            Xe, qe, Ge, $e, Ke, Qe, parseWorkerBootstrapUrl, rememberWorkerBootstrap,
            scanWorkerBootstrap, workerOverrideFields, liveWorkerFields, Ze, et, tt, nt, ot,
            rt, it, at, st, lt, updateScheduleRule, requestPresenceForce, scheduleImmediatePresenceForce,
            persistManagerState, scheduleMinuteValue, scheduleTimeValue, scheduleSnapMinutes, scheduleClamp, scheduleDayLabel, scheduleRuleRange, schedulePriorityLabel,
            scheduleBlockTitle, scheduleBlockLabel, scheduleRangesOverlap, nextSchedulePriorityForRange, scheduleTimelineHourWidth, scheduleDayRules, assignScheduleLanes, selectedScheduleRuleForDay,
            ensureSingleDayScheduleRule, updateSingleDayScheduleRule, forceImmediateScheduleTimelineRefresh, deleteSingleDayScheduleRule, addScheduleBlockAt, updateScheduleBlockPreview, scheduleDayFromPointer, startScheduleBlockPointer,
            buildSelectedScheduleEditor, renderManagerRules, stopRuntimeTimersForPolicy, removeTeamsHelperGui, applyPageLicensePolicy,
            re
        };
    }

    const { ut, ct, dt, pt, ft, mt } = window.__TWH_PAGE_MODULES__.ui.create(__twhBuildPageDeps());
    window.__TWH_PAGE_MODULES__.bootstrap.run({ ...__twhBuildPageDeps(), ut, ct, dt, pt, ft, mt });
})();
/* END merged source: src/page/page.js */
