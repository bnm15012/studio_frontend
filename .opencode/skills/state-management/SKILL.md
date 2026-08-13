---
name: state-management
description: Use when modifying Redux slices, adding new CRUD modules, working with API thunks, changing the store configuration, understanding the auth flow, or debugging state issues. Covers src/state/, src/core/state/, src/core/api/, and src/api/.
---

# State Management & API Layer

## Store Structure (`src/state/index.ts`)

17 slices total:
- **Persisted (localStorage):** `auth`, `branch`
- **CRUD entities (14):** `activities`, `users`, `instructors`, `instructorActivities`, `students`, `studentActivities`, `clients`, `booking`, `expenses`, `payments`, `membershipPackages`, `enquiries`, `genericTemplate`
- **UI:** `analysis`, `dialog`, `notifications`

Root state shape:
```ts
interface RootState {
  auth: AuthState;
  branch: BranchState;        // GenericState<Branch> + currentBranch + selectedBranch
  [key: string]: GenericState<Entity>;  // All CRUD entities share this shape
  analysis: AnalysisState;
  dialog: DialogState;
  notifications: NotificationsState;
}
```

## Generic CRUD State (`src/core/state/stateTypes.ts`)

```ts
interface GenericState<T> {
  rootId: string | number;
  items: T[];
  recordById: Record<string | number, T>;
  searchTerm: string;
  filterKeys: Entity;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
```

## Creating a CRUD Module

### Step 1: Define entity type (`src/api/types.ts`)
```ts
export interface Student extends Entity {
  studentId: number;
  branchId: number;
  name: string;
  // ...
}
```

### Step 2: Create CRUD module (`src/api/all.api.ts`)
```ts
export const studentsCruds = createCrudModule<Student>()({
  route: "students",
  idKey: "studentId",
});
```

For custom endpoints, use `extraCruds`:
```ts
export const studentsAssignmentsCruds = createCrudModule<StudentAssignment>()({
  route: "studentActivities",
  idKey: "assignmentId",
  extraCruds: ({ actions, getHeader, route }) => ({
    markAttendanceBulk: (payload, token, showAlert, setLoading) => async (dispatch) => {
      await withLoading(setLoading, async () => {
        const { data } = await api.put(`/${route}/mark_attendance/bulk`, payload, getHeader(token));
        dispatch(actions.updateItems(data.data));
      });
    },
  }),
});
```

### Step 3: Add reducer to store (`src/state/index.ts`)
```ts
const rootReducer = combineReducers({
  auth: authPersistedReducer,
  students: studentsCruds.reducer,
  // ...
});
```

## CRUD Thunks (`src/core/api/thunk.ts`)

Auto-generated for every module:

| Thunk | HTTP | Route | Cache? |
|---|---|---|---|
| `add(data, token, showAlert, setLoading, prepend?)` | POST | `/${route}/add` | No |
| `update(id, data, token, showAlert, setLoading)` | PUT | `/${route}/update/${id}` | No |
| `remove(id, token, showAlert, setLoading)` | DELETE | `/${route}/delete/${id}` | No |
| `getAll(showAlert, setLoading, token, params, rootId, infinite?, force?)` | GET | `/${route}/getAll/${rootId}?page=...` | Yes |
| `getById(id, token, showAlert, setLoading, {forceRefresh?})` | GET | `/${route}/get/${id}` | Yes |
| `refresh(showAlert, setLoading, token, infinite?)` | GET | re-fetches current page | Yes (force) |

All thunks use `withLoading(setLoading, async () => { ... })` pattern.

## API Layer

### Axios Instance (`src/core/utils/api.ts`)
- `baseURL`: `import.meta.env.VITE_APP_REST_API`
- Headers: `Content-Type: application/json`, `User-Timezone: <browser>`
- Rate limiting: 10 calls/10s per endpoint
- GET deduplication: collapses identical concurrent requests
- 401 interceptor: auto-refresh token (5 retries) → logout on failure

### Request/Response Flow
```
Component → dispatch(thunk) → api.get/post/put/delete
  → Rate limit check → GET dedup check
  → Server request
  → 401? → refreshToken loop → retry
  → Success? → dispatch(slice actions) → Redux state updated
```

## Auth State (`src/state/authSlice.ts`)

```ts
interface AuthState {
  mode: "light" | "dark";
  user: User | null;
  token: string | null;         // Always "Bearer <jwt>"
  studio: Studio | null;
  subscriptionPlan: SubscriptionPlan | null;
  settings: Setting;            // Feature flags map
  authenticated: boolean;
  loading: boolean;
}
```

Key actions: `setLogin`, `setToken`, `toggleMode`, `setSettings`, `clearAuthState` (preserves `loading` for logout animation).

## Dialog State (`src/state/dialogSlice.ts`)

Stack-based: `openDialog(name)` pushes, `closeDialog(name)` removes, `closeLastDialog()` pops. Allowlisted names: `forgotPassDialog`, `loginDialog`, `signupDialog`, `subscriptionDialog`, `profileDialog`, `settingsDialog`, etc.

## Helper Utilities

| File | Key Exports |
|---|---|
| `src/core/api/helper.ts` | `getHeader(token)`, `withLoading(setLoading, fn)`, `getApiMessage(err)`, `isCacheValid()` |
| `src/core/api/apiGuard.ts` | `installRateLimitInterceptor()`, `wrapGetWithDedupe()`, `tryAcquireThunk()`, `releaseThunk()` |
| `src/api/s3.api.ts` | `generatePresignUrl()`, `uploadToS3()` |
| `src/api/enquiry.api.ts` | `addEnquiryAPI()` — standalone, uses `Form-Authorization` header |
