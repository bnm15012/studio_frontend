---
name: page-development
description: Use when creating new management pages, adding entity pages to the Management router, defining FieldDef arrays for new entities, or modifying existing page components in src/Pages/. Covers the complete pattern for building CRUD pages.
---

# Page Development

## Adding a New Entity Page

### 1. Define the type (`src/api/types.ts`)
```ts
export interface MyEntity extends Entity {
  myEntityId: number;
  branchId: number;
  name: string;
  status: string;
}
```

### 2. Create CRUD module (`src/api/all.api.ts`)
```ts
export const myEntityCruds = createCrudModule<MyEntity>()({
  route: "myEntities",
  idKey: "myEntityId",
});
```

### 3. Add reducer (`src/state/index.ts`)
```ts
const rootReducer = combineReducers({
  // ...
  myEntity: myEntityCruds.reducer,
});
```

### 4. Create page (`src/Pages/Management/MyEntity/MyEntity.tsx`)
```tsx
import Views from "@/core/crud/Views";
import { useAppUI } from "@/context/UIContext";
import { myEntityCruds } from "@/api/all.api";
import type { MyEntity } from "@/api/types";
import type { FieldDef, FieldMeta } from "@/core/types";
import { useRef } from "react";
import type { ViewsApiRef } from "@/core/types";

const LIMIT = 10;
const FIELD_META: FieldMeta = { primary: "myEntityId", root: "branchId" };

const FIELDS: FieldDef<MyEntity>[] = [
  { name: "name", label: "Name", validation: { required: true } },
  { name: "status", label: "Status", type: "SELECT", getOptions: async () => [...] },
  { name: "createdAt", label: "Created", type: "DATE", show: true },
];

export default function MyEntityPage() {
  const { currentBranch } = useAppUI();
  const apiRef = useRef<ViewsApiRef>({});

  return (
    <Views<MyEntity>
      tableName="myEntity"
      tableCruds={myEntityCruds}
      fields={FIELDS}
      fieldsMeta={FIELD_META}
      size={LIMIT}
      rootId={currentBranch.branchId}
      currentView="CARD"
    />
  );
}
```

### 5. Register in router (`src/Pages/Management/Management.tsx`)
```tsx
case "my_entity":
  return <MyEntityPage />;
```

### 6. Add navigation entry
Add to sidebar/navbar in `src/NavigationComponets/Sidebar/Sidebar.tsx`.

## Page Patterns by Complexity

### Simple (Expenses)
- Flat `FieldDef[]`, no nested CRUD
- No custom actions
- Direct `<Views>` render

### Medium (Bookings)
- Custom `CardContentComponent` for card display
- Custom actions (e.g., dropdown menu)
- `beforeAdd` opens payment dialog
- Additional dialogs rendered outside `<Views>`

### Complex (Students)
- Nested CRUD via `VIEW` type field (student assignments)
- `overRideOnChange` for cascading field updates
- `awaitForDialog` pattern for promise-based dialog flows
- Multiple supplementary dialogs (payment, invoice, attendance, WhatsApp template)
- Custom `beforeAdd` with dialog interaction

## Common Page Patterns

### Custom Actions
```tsx
const ACTIONS: ActionItem<Student>[] = [
  {
    name: "invoice",
    icon: <Receipt />,
    onClick: (row) => setOpenInvoice(row),
    help: "View Invoice",
  },
  {
    name: "whatsapp",
    icon: <WhatsAppIcon sx={{ color: "green" }} />,
    onClick: (row) => handleWhatsApp(row),
    multi: true,  // Available in bulk selection toolbar
  },
];
```

### beforeAdd with Dialog
```tsx
const beforeAdd = async (row: Student) => {
  const paymentData = await openPaymentDialog(row);
  return { ...row, ...paymentData };
};
```

### overRideOnChange for Cascading Updates
```tsx
const overRideOnChange = (value: unknown, obj: Student, field: string) => {
  if (field === "activityName") {
    const activity = activities.find(a => a.name === value);
    return { ...obj, activityName: value, batchName: "", price: activity?.price ?? 0 };
  }
  return { ...obj, [field]: value };
};
```

### Filter Options for ActionBar
```tsx
const FILTER_OPTIONS: FilterOption[] = [
  { label: "Status", key: "status", options: ["Active", "Inactive", "Expired"] },
  { label: "Gender", key: "gender", options: ["Male", "Female", "Other"] },
];
```

## File Organization per Entity

```
src/Pages/Management/MyEntity/
├── MyEntity.tsx           # Main page (FIELDS + Views)
├── MyEntityCardView.tsx   # Custom CardContentComponent (optional)
├── MyEntity.api.ts        # Extra API calls (optional, beyond CRUD)
└── MyEntityDialogs.tsx    # Supplementary dialogs (optional)
```

## Hooks Available in Pages

| Hook | Source | Purpose |
|---|---|---|
| `useAppUI()` | `@/context/UIContext` | `token, currentBranch, user, studio, permissions, isMobile` |
| `useAppDispatch()` | `@/state` | Typed Redux dispatch |
| `useAppSelector()` | `@/state` | Typed Redux selector |
| `useAlert()` | `@/core/components/feedback/Alert` | Toast notifications |
| `useLongPress(cb, opts)` | `@/core/hooks/useLongPress` | Long-press handler (700ms default) |
| `useFeatureFlags(settings, access)` | `@/core/hooks/useFeatureFlags` | Compute permissions |
