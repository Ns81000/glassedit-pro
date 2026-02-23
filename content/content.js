/* ============================================================
   GlassEdit Pro  Content Script
   Simple & fun: hover to see elements, click to edit text.
   No panels, no toolbars, no saving. Just edit and enjoy.
   ============================================================ */

(function () {
  'use strict';

  // Prevent double-injection
  if (window.__glassEditProLoaded) return;
  window.__glassEditProLoaded = true;

  /* ==========================================================
     STATE
     ========================================================== */
  let editModeActive = false;
  let currentEditable = null;
  let highlightOverlay = null;
  let highlightLabel = null;

  /* ==========================================================
     HELPERS
     ========================================================== */
  const BLOCKED_TAGS = new Set([
    'HTML', 'BODY', 'HEAD', 'SCRIPT', 'STYLE', 'LINK',
    'META', 'NOSCRIPT', 'SVG', 'IFRAME', 'OBJECT', 'EMBED'
  ]);

  function isOwnElement(el) {
    return el && el.closest && el.closest('.ge-highlight-overlay');
  }

  function isEditable(el) {
    if (!el || !el.tagName) return false;
    if (BLOCKED_TAGS.has(el.tagName)) return false;
    if (isOwnElement(el)) return false;
    return true;
  }

  /* ==========================================================
     HIGHLIGHT OVERLAY  follows hovered element
     ========================================================== */
  function createOverlay() {
    if (highlightOverlay) return;
    highlightOverlay = document.createElement('div');
    highlightOverlay.className = 'ge-highlight-overlay';
    highlightLabel = document.createElement('span');
    highlightLabel.className = 'ge-highlight-label';
    highlightOverlay.appendChild(highlightLabel);
    document.body.appendChild(highlightOverlay);
  }

  function showOverlay(el) {
    createOverlay();
    var rect = el.getBoundingClientRect();
    highlightOverlay.style.top = rect.top + 'px';
    highlightOverlay.style.left = rect.left + 'px';
    highlightOverlay.style.width = rect.width + 'px';
    highlightOverlay.style.height = rect.height + 'px';
    highlightOverlay.style.display = 'block';

    var tag = el.tagName.toLowerCase();
    if (el.id) tag += '#' + el.id;
    else if (el.className && typeof el.className === 'string') {
      var cls = el.className.trim().split(/\s+/).filter(function (c) { return !c.startsWith('ge-'); });
      if (cls.length) tag += '.' + cls[0];
    }
    highlightLabel.textContent = tag;
    // Hide label if element is at very top of viewport
    highlightLabel.style.display = rect.top < 30 ? 'none' : '';
  }

  function hideOverlay() {
    if (highlightOverlay) highlightOverlay.style.display = 'none';
  }

  /* ==========================================================
     EDIT MODE  Make elements contentEditable on click
     ========================================================== */
  function onMouseOver(e) {
    var el = e.target;
    if (!isEditable(el)) return;
    // Don't show overlay on the element being edited
    if (el === currentEditable) return;
    showOverlay(el);
  }

  function onMouseOut() {
    hideOverlay();
  }

  function onClick(e) {
    var el = e.target;
    if (!isEditable(el)) return;
    if (el === currentEditable) return; // already editing this one

    e.preventDefault();
    e.stopPropagation();

    // Stop editing previous element
    stopEditing();

    // Start editing this element
    startEditing(el);
    hideOverlay();
  }

  function startEditing(el) {
    currentEditable = el;
    el.contentEditable = 'true';
    el.classList.add('ge-editing');
    el.focus();

    // Place cursor at end
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function stopEditing() {
    if (!currentEditable) return;
    currentEditable.contentEditable = 'false';
    currentEditable.classList.remove('ge-editing');
    currentEditable.blur();
    currentEditable = null;
  }

  // Click outside the editable element stops editing it
  function onDocClick(e) {
    if (!currentEditable) return;
    if (isOwnElement(e.target)) return;
    // If clicking somewhere else, stop current edit
    if (!currentEditable.contains(e.target)) {
      stopEditing();
    }
  }

  /* ==========================================================
     ACTIVATE / DEACTIVATE
     ========================================================== */
  function activate() {
    if (editModeActive) return;
    editModeActive = true;
    createOverlay();

    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('click', onDocClick, false);

    document.body.classList.add('ge-active-mode');
  }

  function deactivate() {
    if (!editModeActive) return;
    editModeActive = false;

    stopEditing();

    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('mouseout', onMouseOut, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('click', onDocClick, false);

    hideOverlay();
    document.body.classList.remove('ge-active-mode');
  }

  /* ==========================================================
     ESCAPE KEY  stop editing current element (stays in mode)
     ========================================================== */
  document.addEventListener('keydown', function (e) {
    if (!editModeActive) return;
    if (e.key === 'Escape') {
      if (currentEditable) {
        stopEditing();
      }
    }
  }, true);

  /* ==========================================================
     MESSAGE LISTENER  from Service Worker
     ========================================================== */
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === 'activate') {
      activate();
      sendResponse({ ok: true });
    } else if (msg.action === 'deactivate') {
      deactivate();
      sendResponse({ ok: true });
    } else if (msg.action === 'getState') {
      sendResponse({ editModeActive: editModeActive });
    }
    return true;
  });

})();
