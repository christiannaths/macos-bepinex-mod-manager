# Install BepInEx 5 on macOS (Apple Silicon) for Valheim

## Context

Valheim is installed at `~/Library/Application Support/Steam/steamapps/common/Valheim/` as a clean Unity/Mono game with no existing mod infrastructure. The game binary is a universal Mach-O (x86_64 + arm64). BepInEx 5 only ships x86_64 macOS builds, so Rosetta 2 is required on Apple Silicon. We'll use the **`gib`** automated installer to handle file placement, permissions, and Steam integration.

---

## Step 1: Ensure Rosetta 2 is installed

- [x] Complete
- [x] Verified

BepInEx 5 has no native ARM64 build — it requires Rosetta 2 to run on Apple Silicon.

```bash
softwareupdate --install-rosetta --agree-to-license
```

(If already installed, this is a no-op.)

**Verification:** Run `arch -x86_64 /usr/bin/true && echo "Rosetta OK"` — should print "Rosetta OK".

---

## Step 2: Download the BepInEx package

- [x] Complete
- [x] Verified

Download **`BepInEx_macos_x64_5.4.23.4.zip`** (or latest 5.4.x) from:
https://github.com/BepInEx/BepInEx/releases

Then unzip it in your Downloads folder so gib can find it:

```bash
cd ~/Downloads
curl -LO https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.4/BepInEx_macos_x64_5.4.23.4.zip
unzip BepInEx_macos_x64_5.4.23.4.zip -d BepInEx_macos_x64
```

**Verification:** Run `ls ~/Downloads/BepInEx_macos_x64/` — should contain a `BepInEx/` folder, `libdoorstop.dylib`, and `run_bepinex.sh`.

---

## Step 3: Open the Valheim game folder in Finder

- [x] Complete
- [x] Verified

gib needs a Finder window showing the game directory. Open it with:

```bash
open "$HOME/Library/Application Support/Steam/steamapps/common/Valheim/"
```

**Verification:** A Finder window opens showing `valheim.app` and `steam_appid.txt`.

---

## Step 4: Install and run gib

- [x] Complete
- [x] Verified

Run the gib installer, which will:
- Detect the Valheim game folder from the open Finder window
- Find the BepInEx package in Downloads
- Copy files into the game directory
- Set permissions and configure doorstop
- Set up Steam launch options automatically
- Run an automated test to confirm BepInEx loads

```bash
curl -fsSL https://cdn.jsdelivr.net/gh/toebeann/gib/gib.sh | bash
```

Follow any interactive prompts from gib (it may ask you to confirm the game and BepInEx package it detected).

**Verification:** gib prints a success message and reports that BepInEx loaded correctly during its automated test.

---

## Step 5: Verify BepInEx is installed in the game directory

- [x] Complete
- [x] Verified

Check that the BepInEx files were placed correctly:

```bash
ls "$HOME/Library/Application Support/Steam/steamapps/common/Valheim/BepInEx"
```

**Verification:** Should show directories like `core/`, `plugins/`, `config/`, and `patchers/`.

---

## Step 6: Launch Valheim through Steam and verify BepInEx loads

- [x] Complete
- [x] Verified

1. Launch Valheim normally through the Steam desktop app
2. Play until you reach the main menu, then quit

**Verification:** Check that BepInEx created its log file and initialized successfully:

```bash
cat "$HOME/Library/Application Support/Steam/steamapps/common/Valheim/BepInEx/LogOutput.log" | head -20
```

Should show BepInEx initialization messages like `[Info : BepInEx] BepInEx 5.4.x.x - valheim` and `[Message: BepInEx] Chainloader ready`.

---

## Step 7: Install a mod (optional, to fully validate the pipeline)

- [ ] Complete
- [ ] Verified

To confirm the full mod pipeline works, place a mod `.dll` into the plugins folder:

```bash
ls "$HOME/Library/Application Support/Steam/steamapps/common/Valheim/BepInEx/plugins/"
```

Any `.dll` plugin placed here will be loaded by BepInEx on next launch. After launching with a mod installed, check `BepInEx/LogOutput.log` for `[Info : BepInEx] Loading [ModName ...]` entries.

**Verification:** The log file shows the mod was detected and loaded without errors.

---

## Step 8: Install ComfyQuickSlots mod

- [x] Complete
- [x] Verified

Download **ComfyQuickSlots v1.9.0** from Thunderstore and place the DLL in the BepInEx plugins folder.

```bash
cd ~/Downloads
curl -LO https://thunderstore.io/package/download/ComfyMods/ComfyQuickSlots/1.9.0/
unzip -o 1.9.0 -d ComfyQuickSlots
cp ComfyQuickSlots/ComfyQuickSlots.dll "$HOME/Library/Application Support/Steam/steamapps/common/Valheim/BepInEx/plugins/"
```

Then launch Valheim through Steam, reach the main menu, and quit.

**Verification:** Check `BepInEx/LogOutput.log` for `Loading [ComfyQuickSlots ...]` — confirms the mod was detected and loaded.

Source: https://thunderstore.io/c/valheim/p/ComfyMods/ComfyQuickSlots/

---

## Step 9: Install mod pack

- [x] Remove ComfyQuickSlots (replaced by AzuExtendedPlayerInventory)
- [x] AzuClock v1.0.5
- [x] InteractWhileBuilding v1.0.0
- [x] PlantEasily v2.0.3
- [x] AzuExtendedPlayerInventory v2.3.3
- [x] AzuCraftyBoxes v1.8.12
- [x] PetPantry v1.0.5
- [x] Backpacks v1.3.7
- [x] SmarterContainers v1.7.0
- [x] Build_Camera_Custom_Hammers_Edition v1.2.10
- [x] PlantEverything v1.20.0
- [x] Official_BepInEx_ConfigurationManager v18.4.1
- [x] All mods verified loading in BepInEx log

**Verification:** Launch Valheim, reach main menu, quit. Check `BepInEx/LogOutput.log` shows all 11 mods loaded with no errors.
