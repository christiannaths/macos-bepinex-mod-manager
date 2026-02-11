# macOS Mod Manager

A terminal UI for managing Valheim BepInEx mods on macOS. Search Thunderstore, install mods, and enable/disable them — all without leaving your terminal.

**⚠️ Currently supports Valheim only!**


## Features

- [x] Search mods on [Thunderstore](https://thunderstore.io/c/valheim/)
- [x] Install mods directly from search results
- [x] View installed mods with version info (parsed from BepInEx logs)
- [x] Enable / disable mods (renames `.dll` <-> `.dll.disabled`)
- [ ] Cross-platform binaries
- [ ] Uninstall mods
- [ ] Manage mod dependencies
- [ ] **⚠️ Support for other games**
- [ ] Configurable game directory
- [ ] Auto-install BepInEx

## Install

**Prerequisites:**

- [Bun](https://bun.sh) runtime
- [BepInEx 5](https://github.com/BepInEx/BepInEx/releases) installed in your Valheim directory (see [gib](https://github.com/toebeann/gib) for an automated installer)
- Valheim installed via Steam

```bash
git clone https://github.com/christiannaths/install-bipinex-mac.git
cd install-bipinex-mac
bun install
bun start
```

## Contribute

```bash
# clone
git clone git@github.com:christiannaths/macos-bepinex-mod-manager.git

# cd
cd macos-bepinex-mod-manager

# install dependencies
bun install

# run in watch mode (restarts on file changes)
bun dev
```

The project uses TypeScript (via [Bun](https://bun.sh)) and React (via [Ink](https://github.com/vadimdemedes/ink)) to render a fullscreen terminal UI.

Source code lives in `src/`:

- `src/index.tsx` — entry point
- `src/App.tsx` — screen router
- `src/screens/` — individual screens (main menu, search, installed mods, help)
- `src/lib/` — core logic (Thunderstore API, mod installation, filesystem operations)

## Credits

- Inspired by the amazing [gib](https://github.com/toebeann/gib)
