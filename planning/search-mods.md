# Search Mods Feature

## Step 1: Add `ink-text-input` dependency

- [x] `bun add ink-text-input`
- [x] Verify: App still starts with `bun dev`

## Step 2: Create `src/lib/thunderstore.ts`

- [x] Define `ThunderstorePackage` type (API response shape)
- [x] Define lightweight `CachedPackage` type
- [x] Implement `fetchPackages()` — fetch, map to CachedPackage, cache in module-level variable
- [x] Implement `searchPackages(query)` — filter cached packages, sort by downloads, return top 100
- [x] Verify: Quick test script — call `searchPackages("build")`, log results

## Step 3: Create `src/screens/SearchMods.tsx`

- [x] Implement state: query, focusMode, results, focusIndex, scrollOffset, selectedPackage, isLoading, dbReady
- [x] Pre-fetch package database on mount
- [x] Implement `useInput` handler with ESC/navigation per focus mode
- [x] Implement search submission via TextInput `onSubmit`
- [x] Implement results list (scrollable, 10 visible, with ↑/↓ indicators)
- [x] Implement detail view (name, owner, version, description, downloads, dependencies)
- [x] Implement contextual footer hints
- [ ] Verify: Full UX flow — type query, see results, navigate, view detail, ESC back

## Step 4: Wire up routing

- [x] `src/App.tsx`: Add `"search-mods"` to Screen type, import SearchMods, add switch case
- [x] `src/screens/MainMenu.tsx`: Remove `disabled: true`, add `case "search"` navigation
- [ ] Verify: Full flow from main menu through search and back

## Step 5: Polish and edge cases

- [x] Handle empty search query
- [x] Handle fetch errors (show error message, allow retry)
- [x] Truncate long descriptions in results list
- [x] Format download counts (e.g., "12.3k")
- [x] Filter out deprecated packages from results
- [ ] Verify: Test empty query, no-results query, and error handling
