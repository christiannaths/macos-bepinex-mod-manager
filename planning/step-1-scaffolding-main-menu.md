# Valheim Mod Manager TUI — Step 1: Scaffolding & Main Menu

## Step 1: Initialize project
- [x] Create `package.json` and `tsconfig.json`
- [x] Run `bun install`
- [x] Verify `node_modules/ink` and `node_modules/react` exist

## Step 2: Create entry point and smoke test
- [x] Create `src/index.tsx` with shebang and `src/App.tsx` with `<Text>Hello</Text>`
- [x] Verify `bun src/index.tsx` prints "Hello"

## Step 3: Build custom SelectInput component
- [x] Create `src/components/SelectInput.tsx` with disabled item support
- [x] Verify arrow keys skip disabled items, Enter fires onSelect only on enabled items

## Step 4: Build Help screen
- [x] Create `src/screens/Help.tsx` with app info and ESC navigation
- [x] Verify ESC fires navigation callback

## Step 5: Build MainMenu screen
- [x] Create `src/screens/MainMenu.tsx` with 4 items (2 disabled)
- [x] Verify disabled items greyed out, Help and Exit work

## Step 6: Wire up screen router
- [x] Update `src/App.tsx` with `useState`-based screen routing
- [x] Verify full end-to-end flow (menu → help → back → exit)

## Step 7: Make executable
- [x] `chmod +x src/index.tsx`
- [x] Verify `./src/index.tsx` launches the app
