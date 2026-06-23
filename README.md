# Teams Helper

Teams Helper is a Chrome/Edge Manifest V3 browser extension for managing Microsoft Teams presence across one or more signed-in Teams accounts. It provides a small control center where users can discover their Teams sessions, set manual presence, build weekly presence schedules, keep accounts separate, view schedule history, and sync supported settings through the Teams Helper cloud runtime.

**Suggested GitHub repository description:**

> Chrome/Edge extension for Microsoft Teams presence scheduling, manual status control, account management, diagnostics, and cloud-backed settings.

## What it does

Teams Helper is designed for people who need predictable Teams presence behavior without repeatedly opening Teams and changing status by hand. The extension works with Teams web sessions and includes background/offscreen extension components so schedules and account checks can run from the browser extension environment.

Core capabilities included in this package:

- **Presence control:** set Teams availability states such as Available, Busy, Do not disturb, Be right back, Away, and Appear offline.
- **Weekly scheduling:** create time blocks for different days, accounts, statuses, priorities, notes, and “allow during calls” behavior.
- **Multiple-account support:** discover and manage separate Teams accounts instead of mixing schedules and manual settings together.
- **Manual and scheduled modes:** use direct manual status control or let the weekly timeline drive changes.
- **Diagnostics:** review schedule history, copy logs, refresh runtime/package data, and send feedback from the extension UI.
- **Cloud-backed settings:** sync supported settings and subscription/beta access state through the Teams Helper runtime endpoints.
- **No build step:** the repository contains the packaged Manifest V3 extension files ready to load unpacked in Chrome or Edge.

## Project details

- Extension name: Teams Helper
- Version: 3.74.40
- Manifest version: 3
- Minimum Chrome version: 116
- Browser target: Chrome and Microsoft Edge
- Microsoft Teams targets:
  - `teams.live.com`
  - `teams.microsoft.com`
  - `teams.cloud.microsoft`
- Main files:
  - `manifest.json`
  - `background.js`
  - `content.js`
  - `page.js`
  - `popup.html`, `popup.css`, `popup.js`
  - `offscreen.html`, `offscreen.js`
  - `oauth_callback.html`
  - `account_bootstrap.js`, `account_inventory.js`
  - `assets/`

## Repository description for GitHub

GitHub’s short repository description is edited on the repository page after upload. Use this text:

```text
Chrome/Edge extension for Microsoft Teams presence scheduling, manual status control, account management, diagnostics, and cloud-backed settings.
```

Suggested GitHub topics:

```text
chrome-extension edge-extension manifest-v3 microsoft-teams teams-helper presence-scheduling productivity
```

## Upload to GitHub using only the website

1. Extract the ZIP file you downloaded from ChatGPT.
2. Create a new empty GitHub repository in your browser.
   - Do not initialize it with a README, license, or `.gitignore`; this package already includes the repo files.
3. Open the new repository page on GitHub.
4. Choose **Add file** → **Upload files**.
5. Open the extracted `teams-helper-extension-github-upload` folder on your computer.
6. Drag everything inside that folder into the GitHub upload page:
   - `manifest.json`
   - all `.js`, `.html`, `.css`, `.json`, and image files
   - the `assets/` folder
   - this `README.md`
7. Commit the upload in GitHub's web interface.

Do not upload the outer ZIP file as a single file unless you intentionally want the repository to contain only an archive. GitHub's normal web upload page stores the files you drag onto it; it does not unpack a ZIP file into repository contents for you.

## Load locally as an unpacked extension

1. Extract this repository folder.
2. Open Chrome or Edge.
3. Go to `chrome://extensions` or `edge://extensions`.
4. Enable **Developer mode**.
5. Choose **Load unpacked**.
6. Select the extracted `teams-helper-extension-github-upload` folder.

No build step is required for the packaged extension files in this repository.
