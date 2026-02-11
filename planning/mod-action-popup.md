# Mod Action — Enable/Disable Toggle

## Step 1: Add `toggleMod` to `src/lib/mods.ts`

- [x] Add `import { rename } from "fs/promises"`
- [x] Add `toggleMod(mod)` function that renames `.dll` <-> `.dll.disabled`
- [x] Return updated `InstalledMod` with flipped `enabled` and new `fileName`
- [x] **Verify:** Build passes with no type errors

## Step 2: Add inline footer confirmation to `src/screens/InstalledMods.tsx`

- [x] Add `selectedMod` state (`InstalledMod | null`, default `null`)
- [x] On Enter keypress (when no confirmation active): set `selectedMod` to focused mod
- [x] When `selectedMod` is set, footer shows confirmation prompt (e.g. `Disable "Backpacks"?  y: confirm  ESC: cancel`)
- [x] `y` confirms: calls `toggleMod`, refreshes mod list, clears `selectedMod`
- [x] ESC cancels: clears `selectedMod`
- [x] Guard all other keys (j/k/arrows/o) when confirmation is active
- [x] List stays visible during confirmation
- [x] Update default footer hints to show `Enter: actions`
- [ ] **Verify:** End-to-end manual test
