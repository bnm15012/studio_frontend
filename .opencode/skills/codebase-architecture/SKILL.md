---
name: codebase-architecture
description: Use when navigating or modifying the overall app structure, routing, entry points, theming, or cross-cutting concerns. Covers App.tsx, main.tsx, AllRoutes, UIContext, theme system, and the relationship between all top-level directories.
---

# Codebase Architecture

## Entry Flow
`main.tsx` → `<Provider store>` → `<PersistGate>` → `<App>` → `AlertProvider` > `HashRouter` > `ThemeContextProvider` > `AllRoutes`

`App.tsx` calls `clearCacheIfNewDay()` on mount and dispatches `loadInitialDataAPI()` if token exists.

## Routing (`src/NavigationComponets/AllRoutes.tsx`)

| Auth State | Provider | Key Routes |
|---|---|---|
| Loading | None | `AuthTransitionOverlay` splash |
| Authenticated | `AppUIProvider` | `/` Dashboard, `/management/:page`, `/management/:page/:ID` |
| Unauthenticated | `NonAuthUIProvider` | `/` HomePage, `/form/:formId/:branchId`, `/invoice/:invoiceToken` |

Management page router (`src/Pages/Management/Management.tsx`) uses a `switch` on `params.page` to lazy-load the correct entity page. Each page is wrapped in `<WidgetsOnPage>` (Navbar + Sidebar + content).

## App UI Context (`src/context/UIContext.tsx`)

```tsx
const { user, currentBranch, token, studio, permissions, isAdmin, isMobile } = useAppUI();
```

`permissions` is derived from `useFeatureFlags(settings, user.userAccessEntry)`. The context returns `null` until all values are loaded.

## Theme System (`src/core/utils/theme/`)

- `theme.ts`: Full MUI theme with light/dark palette, custom gradients, Rubik font, `background.odd`, `background.alt` tokens
- `ThemeHook.ts`: `useThemeMode()` → `{ mode, isDark, toggle }` reads/writes Redux `auth.mode`
- `ThemeProvider.tsx`: `ThemeContextProvider` wraps MUI ThemeProvider + CssBaseline

## localStorage Strategy

- Persisted via redux-persist: `auth` + `branch` only
- `ls` helper in `localStorageHelper.ts` with typed `get/set/remove`
- `clearCacheIfNewDay()` wipes non-essential keys daily
- Preserved keys: `persist:root`, `lastCacheClearDate`, `ui.sidebarCollapsed`, `ui.themeMode`

## Key File Locations

| Concern | File |
|---|---|
| Entry point | `src/main.tsx` |
| Root component | `src/App.tsx` |
| Routing | `src/NavigationComponets/AllRoutes.tsx` |
| Management routing | `src/Pages/Management/Management.tsx` |
| App context | `src/context/UIContext.tsx` |
| Theme | `src/core/utils/theme/theme.ts` |
| Axios instance | `src/core/utils/api.ts` |
| Store config | `src/state/index.ts` |
| Auth state | `src/state/authSlice.ts` |
