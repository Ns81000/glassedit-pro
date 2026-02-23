/* ============================================================
   GlassEdit Pro — Service Worker (MV3)
   Icon click toggles edit mode.
   Injects content script on demand.
   ============================================================ */

'use strict';

// ---- Icon Click — Toggle Edit Mode ----
chrome.action.onClicked.addListener((tab) => {
  toggleEditMode(tab);
});

// Prevent rapid double-clicks
let toggling = false;

async function toggleEditMode(tab) {
  if (!tab || !tab.id || toggling) return;
  toggling = true;

  try {
    // Skip restricted pages
    if (!tab.url || /^(chrome|edge|chrome-extension|about):/.test(tab.url)) return;

    // Ask the content script if it's already active.
    // This survives service-worker restarts (MV3 kills SW after idle).
    const isActive = await queryContentScript(tab.id);

    if (isActive) {
      // Turn OFF
      updateBadge(tab.id, false);
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'deactivate' });
      } catch (_) { /* content script gone */ }
    } else {
      // Turn ON — inject then activate
      updateBadge(tab.id, true);
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content/styles.css']
        });
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/content.js']
        });
        await chrome.tabs.sendMessage(tab.id, { action: 'activate' });
      } catch (e) {
        console.warn('[GlassEdit Pro]', e.message);
        updateBadge(tab.id, false);
      }
    }
  } finally {
    setTimeout(() => { toggling = false; }, 300);
  }
}

/**
 * Ask the content script whether edit mode is currently on.
 * Returns true/false. Returns false if no content script is loaded.
 */
async function queryContentScript(tabId) {
  try {
    const res = await chrome.tabs.sendMessage(tabId, { action: 'getState' });
    return !!(res && res.editModeActive);
  } catch (_) {
    return false;
  }
}

// ---- Badge Helper ----
function updateBadge(tabId, active) {
  chrome.action.setBadgeText({ text: active ? 'ON' : '', tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#2d8cff', tabId });
}

// ---- Clean up badge when tab navigates ----
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'loading') {
    updateBadge(tabId, false);
  }
});
