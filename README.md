<p align="center">
  <img src="icons/icon128.png" alt="GlassEdit Pro" width="100" />
</p>

<h1 align="center">GlassEdit Pro</h1>

<p align="center">
  <strong>Click. Edit. Done.</strong><br/>
  A dead-simple Chrome extension that lets you edit any text on any webpage — just for fun.
</p>

<p align="center">
  <a href="https://github.com/Ns81000/glassedit-pro/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Ns81000/glassedit-pro?style=flat-square&color=blue" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/manifest-v3-brightgreen?style=flat-square" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/version-2.1.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/chrome-extension-yellow?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/size-~12%20KB-green?style=flat-square" alt="Size" />
</p>

---

## ✨ What It Does

**GlassEdit Pro** turns any webpage into an editable canvas with a single click.

> Click the extension icon → hover any element → click to edit its text → click the icon again to stop. That's it.

No popups. No panels. No toolbars. No accounts. No saving. Just pure, instant text editing for fun, screenshots, prototyping, or pranks.

---

## 🎯 Features

| Feature | Description |
|---|---|
| **One-Click Toggle** | Click the extension icon to turn editing on/off |
| **Hover Highlight** | Elements glow with a subtle blue overlay as you hover |
| **Tag Labels** | See the element tag (e.g. `h1`, `p.title`) on hover |
| **Inline Editing** | Click any text element to edit it in place |
| **Escape to Deselect** | Press `Esc` to stop editing the current element |
| **Zero Footprint** | No data collection, no storage, no network requests |
| **Lightweight** | Only 7 files, ~12 KB total |
| **Manifest V3** | Built on Chrome's latest extension platform |

---

## � Installation

### Step 1 — Download

Clone the repo or [download the ZIP](https://github.com/Ns81000/glassedit-pro/archive/refs/heads/main.zip) and extract it.

```bash
git clone https://github.com/Ns81000/glassedit-pro.git
```

### Step 2 — Load into Chrome

1. Open **Chrome** and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `glassedit-pro` folder

### Step 3 — Pin It

Click the **puzzle piece** icon (Extensions) in Chrome's toolbar and **pin** GlassEdit Pro for quick access.

---

## 🎮 How to Use

```
1. Click the GlassEdit Pro icon in your toolbar
2. Hover over any element — it highlights with a blue glow
3. Click on any text — it becomes editable
4. Type your changes
5. Press Esc to deselect, or click another element to edit it
6. Click the icon again to turn off editing
```

> **Note:** Changes are temporary and only exist in your current tab. Refreshing the page restores the original content.

---

## 📁 Project Structure

```
glassedit-pro/
├── manifest.json          # Extension configuration (MV3)
├── service-worker.js      # Background script — handles icon click & injection
├── content/
│   ├── content.js         # Content script — hover highlights & inline editing
│   └── styles.css         # Minimal CSS — overlay, highlight, cursor styles
└── icons/
    ├── icon16.png         # Toolbar icon
    ├── icon48.png         # Extensions page icon
    └── icon128.png        # Chrome Web Store icon
```

---

## 🔒 Permissions

GlassEdit Pro requests the absolute minimum permissions:

| Permission | Why |
|---|---|
| `activeTab` | Access the current tab only when you click the icon |
| `scripting` | Inject the editor script into the page on demand |

**No** `host_permissions`. **No** `storage`. **No** background network activity. **No** data leaves your browser. Ever.

---

## ⚙️ Technical Details

- **Manifest V3** — Chrome's latest and most secure extension platform
- **On-demand injection** — Scripts are only injected when you click the icon, not on every page load
- **Service worker resilient** — Survives Chrome's automatic SW termination by querying content script state directly
- **Double-click protection** — Debounce lock prevents rapid clicks from desynchronizing state
- **Namespace isolation** — All CSS classes prefixed with `ge-` to avoid conflicts with page styles
- **IIFE-wrapped** — Content script runs in an isolated closure, zero global pollution

---

## 🌐 Browser Compatibility

| Browser | Supported |
|---|---|
| Google Chrome 110+ | ✅ |
| Microsoft Edge 110+ | ✅ |
| Brave | ✅ |
| Opera | ✅ |
| Vivaldi | ✅ |
| Firefox | ❌ (MV3 differences) |
| Safari | ❌ |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](https://github.com/Ns81000/glassedit-pro/blob/main/LICENSE) file for details.

---

## 👤 Author

**Ns81000** — [github.com/Ns81000](https://github.com/Ns81000)

---

<p align="center">
  <sub>Built with ❤️ for fun · No data collected · No tracking · Just vibes</sub>
</p>
