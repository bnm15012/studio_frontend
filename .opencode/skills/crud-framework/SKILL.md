---
name: crud-framework
description: Use when adding/modifying CRUD entities, editing Views/CardView/FormView/ListView, changing FieldDef configurations, working with useCrudAction/useTableData/useDeleteHandler hooks, or understanding how the generic CRUD lifecycle works. Covers the entire src/core/crud/ directory.
---

# CRUD Framework

## Core Flow

Every management page renders `<Views>` which orchestrates all CRUD operations:

```
Views (orchestrator)
├── useTableData        → data fetching, pagination, search
├── useCrudAction       → add/edit/save/cancel state machine
├── useDeleteHandler    → delete dialog flow
├── useMergedActions    → merge default + custom actions
├── useRowSelection     → multi-select
│
├── [formKey defined] → FormView (full-page form)
├── [currentView=LIST] → ListView (table + pagination)
├── [currentView=CARD] → CardView (grid + infinite scroll)
├── [editMode=DIALOG or CARD view] → DialogForm (modal)
└── DeleteDialog (on confirm)
```

## Views Props (`src/core/crud/Views.tsx`)

```tsx
interface ViewsProps<T extends Entity> {
  formKey?: number;           // 0=new, >0=edit, undefined=list mode
  tableName: string;          // Redux slice key
  size: number;               // Page size
  rootId: number;             // Branch/parent FK (0 = skip fetch)
  tableCruds: CrudThunks<T>;  // From all.api.ts
  fields: FieldDef<T>[];      // Field definitions
  fieldsMeta: FieldMeta;      // { primary: "id", root?: "branchId" }
  currentView: ViewMode;      // "LIST" | "CARD" | "FORM"
  editMode?: "INLINE" | "DIALOG" | "FORM";
  actions?: ActionItem<T>[];  // Custom actions (merge with defaults)
  CardContentComponent?: ComponentType<{row, handleViewOpen?}>;
  actionBarProps?: Omit<ActionBarProps, "api">;
  beforeAdd?: (row: T) => T | Promise<T>;
  beforeUpdate?: (row: T) => T | Promise<T>;
  apiRef?: MutableRefObject<ViewsApiRef>;
  infiniteScroll?: boolean;
  multi?: boolean;
  customView?: ComponentType<BaseViewProps<T>>;
}
```

## FieldDef System (`src/core/types.ts`)

16 typed variants via discriminated union on `type`:

| type | Component | Required ExtraProp |
|---|---|---|
| `TEXT` / undefined | `StyledTextField` | - |
| `NUMBER` | `StyledTextField` (type=number) | - |
| `SELECT` | `SelectionField` | `getOptions` (required) |
| `DATE` / `DATETIME` | `DateTime` | - |
| `BOOL` | `StyledSwitch` | - |
| `CHECK` | `StyledCheckbox` | - |
| `IMAGE` | `ImageComponent` | - |
| `IMAGE_DIALOG` | `ImageDialog` | - |
| `EMAIL` | `StyledTextField` (type=email) | - |
| `EDITOR` | `EditorInputBox` | - |
| `TEXTAREA` | `StyledTextField` (multiline) | - |
| `CUSTOM` | `CustomComponent` (injected) | `CustomComponent` (required) |
| `VIEW` | Embedded `<Views>` via `ViewTabs` | - |
| `COMPONENT` | Inline component render | - |
| `STATE` | Color-coded `Chip` | `isState`, `colorMap?` |

### Common Field Properties

```tsx
{
  name: KnownKeys<T>;          // Entity key (type-safe)
  label: string;
  type?: FieldType;
  show?: boolean;              // Visible in list/card
  view?: boolean;              // Shows "View" button → opens detail
  section?: string;            // Grouping header in FormView (default: "General")
  validation?: { required?, regex?, message?, minLength?, maxLength? };
  defaultValue?: unknown;
  getValue?: (row, isEdit) => unknown;  // Computed value override
  editable?: (row) => boolean;          // Dynamic editability
  getOptions?: (row) => Promise<SelectOption[]>;  // For SELECT
  // ...plus per-type extra props
}
```

## Edit Lifecycle

**INLINE (ListView):** click edit icon → `editingId = row.pk` → cells become editable → Save/Cancel icons appear → `handleSave()` validates + dispatches thunks

**DIALOG (CardView):** click card → `editingId = row.pk` → `DialogForm` modal opens → edit fields → Save/Close

**FORM (full page):** click form icon → `navigate(/management/:page/:id)` → `FormView` renders with sticky header → save/cancel buttons

## Hooks

### `useCrudAction` (`src/core/crud/hooks/useCrudAction.ts`)
Returns: `{ editingId, record, setRecord, handleEdit, handleCancel, handleSave, addNewRow, handleChange, submitAttempted }`

- `handleSave(id)`: validates → calls `beforeAdd`/`beforeUpdate` → dispatches `tableCruds.add`/`tableCruds.update`
- `handleChange(value, id, fieldPath)`: supports dot-notation nested paths

### `useTableData` (`src/core/crud/hooks/useTableData.ts`)
Returns: `{ data, setData, tableState, fetchOne, handlePageChange, loadMore }`

- Subscribes to `usePageSearch()` for search/filter changes
- Lazy-inits from Redux store to avoid flash on back-navigation

### `useDeleteHandler` (`src/core/crud/hooks/useDeleteHandler.ts`)
Returns: `{ handleDeleteClick, deleteDialogOpen, deleteId, closeDeleteDialog, handleDeleteConfirm }`

## ActionItem Pattern

```tsx
interface ActionItem<T> {
  name: string;
  icon?: ReactNode;
  onClick?: (row: T | T[]) => void;
  sx?: SxProps;
  hide?: boolean | ((row: T) => boolean);
  enabled?: boolean | ((row: T) => boolean);
  multi?: boolean;      // Shown in SelectionToolbar for bulk ops
  help?: string;        // Tooltip text
}
```

Default actions: `edit` (Edit icon), `delete` (Delete icon), `form` (OpenInNew icon). User actions merge by `name` — override defaults or add new ones.

## Key Files

| File | Purpose |
|---|---|
| `src/core/crud/Views.tsx` | Top-level orchestrator (entry point) |
| `src/core/crud/ListView.tsx` | Table-based view (memoized) |
| `src/core/crud/CardView.tsx` | Card grid with infinite scroll (memoized) |
| `src/core/crud/FormView.tsx` | Full-page form (memoized) |
| `src/core/crud/DialogForm.tsx` | Modal edit form |
| `src/core/crud/ViewTabs.tsx` | Tabbed sub-views for nested CRUD |
| `src/core/crud/hooks/useCrudAction.ts` | CRUD operations state machine |
| `src/core/crud/hooks/useTableData.ts` | Data fetching + pagination |
| `src/core/crud/hooks/useDeleteHandler.ts` | Delete flow |
| `src/core/types.ts` | All type definitions (FieldDef, ActionItem, CrudThunks, etc.) |
