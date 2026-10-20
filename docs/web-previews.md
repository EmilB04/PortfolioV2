# Website previews

Known sites use compressed, checked-in JPEG captures from `public/previews/`.
The showcase, featured projects and project detail pages share the same images.
Visitors download an ordinary image instead of asking a screenshot service to
start a browser. Images load lazily and filenames include a content hash, so a
new capture gets a new URL without stale browser caches.

## Refresh captures

```bash
npm install
npx playwright install chromium
npm run previews:refresh
```

The command reads public project URLs using the same `.env` settings as the
build, and includes SpillArena and Tools from the domain showcase. To refresh
specific sites:

```bash
npm run previews:refresh -- spillarena tools
```

Review the images, then commit `public/previews/` and
`src/data/site-previews.json` with the site changes. Refresh after updating a
showcased website; captures are snapshots, not live views.

The capture browser is disposable, declines optional storage, and blocks ad
requests. It dismisses remaining consent prompts before capturing and refuses
to replace an image if a consent dialog is still visible. Failed sites retain
their previous captures; the command exits with an error so failures are clear.

`PREVIEW_BROWSER_EXECUTABLE_PATH` can point to an existing Chromium executable.
The capture tool is a development dependency and is not shipped to visitors.

An explicit image or existing project screenshot is also used directly. Only
URLs with no saved image fall back to Microlink. Broken saved images fall back
to the next saved source, then to a text placeholder; repeated rendering
requests and retry timers are avoided.
