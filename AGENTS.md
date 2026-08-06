# Studio Frontend - Project Guide

## Tech Stack
- React 18 + TypeScript 5.9 + Vite 6
- Material UI v6 (MUI)
- Redux Toolkit + redux-persist
- React Router v7 (HashRouter)
- Axios for HTTP
- Framer Motion for animations

## Path Alias
All imports use `@/` which maps to `src/`. Never use relative imports for cross-directory access. Only use relative `./` for same-directory files.

```
import { useAppDispatch } from "@/state"
import Views from "@/core/crud/Views"
import { Student } from "@/api/types"
```

## Project Structure

```
src/
├── api/                    # Entity types + CRUD module declarations
│   ├── types.ts            # All domain entity interfaces (Student, Booking, etc.)
│   ├── all.api.ts          # createCrudModule() calls for all 14 entities
│   ├── enquiry.api.ts      # Standalone API functions
│   └── s3.api.ts           # S3 presigned URL + upload
├── context/
│   ├── UIContext.tsx        # App-wide UI context (user, token, branch, permissions)
│   └── feature_keys.ts     # Feature flag key constants
├── core/                   # Shared library (DO NOT put page-specific code here)
│   ├── api/                # createCrudModule, createCrudThunks, apiGuard, helper
│   ├── components/         # Reusable UI: cards/, dialogs/, feedback/, fields/, forms/, layout/, tables/
│   ├── context/            # createUIContext factory
│   ├── crud/               # CRUD framework: Views, ListView, CardView, FormView, DialogForm, hooks
│   ├── hooks/              # useFeatureFlags, useLongPress, useSearch
│   ├── state/              # createGenericSlice factory, stateTypes
│   ├── types.ts            # Central type definitions (FieldDef, ActionItem, CrudThunks, etc.)
│   └── utils/              # api.ts, cacheManager, DateUtil, fieldHelpers, theme/, validation
├── NavigationComponets/    # Navbar, Sidebar, AllRoutes, HashRedirect
├── Pages/                  # Feature pages
│   ├── Management/         # CRUD pages (Students, Bookings, Expenses, etc.)
│   ├── Auth/               # Login, Signup, ForgotPassword, SubscriptionPopup
│   ├── HomePage/           # Landing page sections
│   ├── DashBoard/          # Dashboard widgets
│   ├── ProfilePage/        # User profile, settings, subscription
│   └── ...                 # Invoice, Pricing, Analysis, etc.
├── state/                  # Redux store setup
│   ├── index.ts            # Store config, rootReducer, typed hooks
│   ├── authSlice.ts        # Auth state (user, token, studio, settings, theme)
│   ├── dialogSlice.ts      # Dialog stack management
│   ├── notificationSlice.ts
│   ├── analysisSlice.ts
│   └── thunks.ts           # logoutUser, clearAllstate
├── utils/                  # App-level utilities
├── App.tsx                 # Root: AlertProvider > HashRouter > ThemeProvider > AllRoutes
└── main.tsx                # Entry: Provider > PersistGate > App
```

## Key Patterns

### Adding a New CRUD Entity
1. Define type in `src/api/types.ts`
2. Add `createCrudModule<EntityType>()` in `src/api/all.api.ts`
3. Add reducer to `rootReducer` in `src/state/index.ts`
4. Create page in `src/Pages/Management/` with `FieldDef<T>[]` + `<Views>`

### Views Component (Core CRUD Entry Point)
Every management page renders `<Views>` which auto-generates list/card/form views from config:
```tsx
<Views
  tableName="students"
  tableCruds={studentsCruds}
  fields={FIELDS}
  fieldsMeta={{ primary: "studentId", root: "branchId" }}
  size={10}
  rootId={currentBranch.branchId}
  currentView="CARD"
/>
```

### Field Definitions
Fields use `FieldDef<T>` discriminated union - typed per-entity-key with 16 variants: TEXT, NUMBER, SELECT, DATE, DATETIME, BOOL, CHECK, IMAGE, IMAGE_DIALOG, EMAIL, EDITOR, CUSTOM, VIEW, COMPONENT, STATE, TEXTAREA.

### Edit Modes
- `INLINE` - edit in table row (default for LIST)
- `DIALOG` - edit in modal (default for CARD)
- `FORM` - full-page form (via `formKey` prop or route `/management/:page/:id`)

### State Management
- Redux store with 17 slices (auth + 14 CRUD entities + dialog + analysis + notifications)
- `auth` and `branch` persisted to localStorage; others ephemeral
- Generic CRUD state: `{ items, recordById, totalCount, totalPages, currentPage, pageSize }`

### API Layer
- Single Axios instance at `@/core/utils/api` with rate limiting + GET dedup
- 401 interceptor auto-refreshes token (up to 5 retries), then logout
- All thunks use `withLoading(setLoading, async () => { ... })` pattern

## Conventions
- **No comments** in code unless explicitly asked
- **TypeScript strict mode** - always type props, state, and function signatures
- **Named exports** preferred over default exports (except React components and Views)
- **memo()** used on performance-critical components (ListView, CardView, FormView)
- **framer-motion** for list/card animations
- **MUI styled()** for reusable styled components (in `Styled*.tsx` files)
- Use `useAppUI()` for app context, `useAppDispatch/useAppSelector` for Redux
- Use `useAlert()` for toast notifications, never `alert()`
