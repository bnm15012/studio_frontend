---
name: component-patterns
description: Use when creating or modifying shared UI components in src/core/components/, working with the Field system, styled components, dialogs, cards, tables, layout primitives, or the feedback/alert system.
---

# Component Patterns

## Field System (`src/core/components/fields/`)

### Master Dispatcher: `Field.tsx`

```tsx
<Field
  type="SELECT" | "TEXT" | "NUMBER" | "DATE" | "DATETIME" | "BOOL" | ...
  value={row.name}
  setValue={(val) => handleChange(val, rowId, "name")}
  isEdit={editingId === rowId}
  label="Name"
  validation={{ required: true }}
  extraProp={{ getOptions: fetchOptions }}
  submitAttempted={submitAttempted}
/>
```

When `isEdit=false`, renders read-only display. When `isEdit=true`, renders the appropriate input.

### Available Field Types

| Type | Component | Notes |
|---|---|---|
| `TEXT` | `StyledTextField` | Built-in validation |
| `NUMBER` | `StyledTextField` type=number | |
| `SELECT` | `SelectionField` | Async `getOptions`, supports `saveType: "string" \| "object"` |
| `DATE` | `DateTime` format="DATE" | MUI DatePicker |
| `DATETIME` | `DateTime` format="DATETIME" | MUI DateTimePicker |
| `BOOL` | `StyledSwitch` | Toggle with label |
| `CHECK` | `StyledCheckbox` | |
| `IMAGE` | `ImageComponent` | Upload via S3 presigned URL |
| `IMAGE_DIALOG` | `ImageDialog` | View/upload in dialog |
| `EMAIL` | `StyledTextField` type=email | |
| `EDITOR` | `EditorInputBox` | Template textarea with `{{variable}}` autocomplete |
| `TEXTAREA` | `StyledTextField` multiline | |
| `CUSTOM` | CustomComponent prop | Injected component |
| `STATE` | Color-coded `Chip` | Uses `colorMap` for status colors |
| `VIEW` | Embedded `<Views>` | Nested CRUD via `ViewTabs` |
| `COMPONENT` | Direct render | Arbitrary JSX |

## Styled Components Convention

Reusable styled components live in `Styled*.tsx` files:
- `StyledCard.tsx` → `StyledMotionCard`, `StyledCardContainer`, `StyledCardContent`, `StyledCardActions`
- `StyledTableComponents.tsx` → `StyledTable`, `StyledTableRow`, `StyledTableCell`, `StyledTableContainer`
- `StyledField.tsx` → `FieldContainer`, `FieldLabel`
- `StyledCheckbox.tsx`, `StyledSwitch.tsx`

Pattern: `export const StyledX = styled(MuiComponent)(({ theme }) => ({ ... }));`

## Layout Primitives (`src/core/components/layout/`)

| Component | Purpose |
|---|---|
| `FlexBetween` | `display: flex; justify-content: space-between; align-items: center` |
| `FlexEvenly` | `display: flex; justify-content: space-evenly; align-items: center` |
| `FlexBetweenColumn` | Same as FlexBetween but `flex-direction: column` |
| `FlexEvenlyColumn` | Same as FlexEvenly but `flex-direction: column` |
| `ActionBar` | Top toolbar: search, filters, add, refresh, column visibility |
| `WidgetsOnPage` | App shell: Navbar + Sidebar + content area |
| `ColumnVisibilityButton` | Popover to show/hide table columns (persisted to localStorage) |

## Dialog System (`src/core/components/dialogs/`)

### `StyledDialog` — Base dialog
```tsx
<StyledDialog
  open={isOpen}
  onClose={handleClose}
  title="Confirm"
  titleBgColor="success" | "warning" | "error" | "info"
  confirmText="Save"
  onConfirm={handleSave}
  actions={[{ label: "Custom", onClick: handler }]}
>
  {children}
</StyledDialog>
```

### `DeleteDialog` — Delete confirmation
Wraps `StyledDialog` with "Confirm Deletion" title. Props: `open, onClose, onConfirm, displayData, id`.

### `MultiSelectDialog` — Generic multi-select
Props: `open, onClose, fetchOptions, data, setData, valueKey?, labelKey?`.

## Card Components (`src/core/components/cards/`)

| Component | Purpose |
|---|---|
| `CardHeader` | Avatar/icon + name + status badge chip + subtitle |
| `CardChip` | Icon + formatted value (date/string) |
| `CardInfoRow` | Icon + label + value row (supports compact mode) |
| `CardLocation` | Address display with pin icon |
| `ContactSection` | Phone/email with copy-to-clipboard and long-press to call |

Pages define a `CardContentComponent` that composes these:
```tsx
const StudentCard = ({ row, handleViewOpen }) => (
  <CardHeader image={row.imageUrl} fieldValue={row.membershipStatus} badge="Active">
    <CardInfoRow Icon={<Phone />} value={row.phone} />
    <CardInfoRow Icon={<Email />} value={row.email} />
  </CardHeader>
);
```

## Feedback System (`src/core/components/feedback/Alert.tsx`)

```tsx
// Wrap app with provider (done in App.tsx)
<AlertProvider>
  {children}
</AlertProvider>

// Use in any component
const showAlert = useAlert();
showAlert("Saved successfully", "success");
showAlert("Error occurred", "error");
```

## Table Components (`src/core/components/tables/`)

- `StyledTable` — base table with min-width
- `StyledTableRow` — animated (framer-motion), alternating colors, hover lift, selection highlighting
- `StyledTableCell` — sticky header, uppercase labels
- `StyledTableContainer` — rounded, max-height scroll

## Form Components (`src/core/components/forms/`)

- `FormBuilder` — Dynamic form from `FieldDef[]` config with sections and submit/cancel buttons
- `QrForm` — QR code generator with PDF download/print

## Key Files

| Path | Purpose |
|---|---|
| `src/core/components/fields/Field.tsx` | Master field dispatcher |
| `src/core/components/fields/SelectionField.tsx` | Async autocomplete dropdown |
| `src/core/components/fields/ImageComponent.tsx` | Image upload via S3 |
| `src/core/components/fields/EditorInputBox.tsx` | Template editor with `{{var}}` autocomplete |
| `src/core/components/dialogs/StyledDialog.tsx` | Base dialog |
| `src/core/components/cards/StyledCard.tsx` | Card styled components |
| `src/core/components/tables/StyledTableComponents.tsx` | Table styled components |
| `src/core/components/layout/ActionBar.tsx` | Top toolbar |
| `src/core/components/layout/FlexBox.tsx` | Flex layout primitives |
| `src/core/components/feedback/Alert.tsx` | Toast notification system |
