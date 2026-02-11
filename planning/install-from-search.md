# Install Mod from Search Results

## Context

The search mods screen (`src/screens/SearchMods.tsx`) currently lets users search Thunderstore, browse results, and view mod details — but there's no way to install a mod. We need to add an install action from the detail view.

Thunderstore packages are ZIP archives downloaded from a `download_url` in the API response. The current types don't include this field, so we need to extend them. Installation means downloading the ZIP, extracting only `.dll` files, and placing them flat into `BepInEx/plugins` (matching the existing mod structure in `src/lib/mods.ts`).

We'll use macOS's built-in `unzip` CLI for extraction (no new dependencies needed).

## Steps

### Step 1: Add `downloadUrl` to Thunderstore types

- [x] Add `download_url: string` to `ThunderstoreVersion` type
- [x] Add `downloadUrl: string` to `CachedPackage` type
- [x] Update `mapToCached()` to include `downloadUrl: latest.download_url`
- [x] **Verify**: Run quick test script to confirm `downloadUrl` is populated on a fetched package

### Step 2: Create `src/lib/install.ts`

- [x] Export `installMod(pkg: CachedPackage): Promise<string[]>`
- [x] Download ZIP from `pkg.downloadUrl` using `fetch` into temp file
- [x] List ZIP contents with `unzip -l` and identify `.dll` entries
- [x] Extract only `.dll` files flat into `PLUGINS_DIR` using `unzip -j -o`
- [x] Clean up temp file in `finally` block
- [x] Return array of installed `.dll` filenames
- [x] Throw on errors (download failure, no DLLs found, extraction failure)
- [x] **Verify**: Run a test script that calls `installMod()` with a known small mod

### Step 3: Add install action to SearchMods detail view

- [x] Add `installStatus` and `installMessage` state
- [x] `i` key handler in detail focus mode — calls `installMod`, manages status transitions
- [x] Reset `installStatus` on ESC back to results or selecting different package
- [x] Status line in detail view JSX (idle/installing/installed/error)
- [x] Update footer hints: `"i: install  ESC: back to results"`
- [ ] **Verify**: Full flow — search, view details, press `i`, confirm DLLs installed

### Step 4: Edge cases

- [x] Prevent double-install (ignore `i` while `installStatus === "installing"`)
- [x] Handle mods with zero `.dll` files (show descriptive error)
- [x] Ensure temp file cleanup happens even on error (`finally`)
- [ ] **Verify**: Press `i` rapidly — only one install runs. Non-DLL package shows error.
