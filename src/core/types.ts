/** Central type definitions used across the core layer — AppDispatch, SelectOption, FieldDef, ActionItem, and Redux thunk types. */
import React from "react";
import type { AlertColor } from "@mui/material/Alert";
import type { ViewsProps } from "@/core/crud/Views";
import { FilterKeys } from "@/core/state/stateTypes";
import { RootState, AppDispatch } from "@/state";
import type { CrudRecord } from "@/api/types";
export type { CrudRecord, FilterKeys, AppDispatch };

export type ViewMode = "LIST" | "CARD" | "FORM";

export interface FieldMeta {
    primary: string;
    root?: string;
}

/** Explicit boundary for rows whose schema is not statically typed yet
 *  (e.g. public form builders). FieldDef<LooseFormRecord> resolves to the
 *  LooseFieldDef branch because it declares no known keys. */
export interface LooseFormRecord {
    [key: string]: never;
}

export interface SelectOption<T = CrudRecord> {
    key: string | number;
    value: string;
    row?: T;
}

/** The set of values a form/field can hold while being edited. */
export type FieldValue =
    | string
    | number
    | boolean
    | SelectOption
    | null
    | undefined
    | Record<string, string | number | boolean | null | undefined>;

/** Nested map of template variable tokens whose leaves are display labels. */
export interface TemplateVariables {
    [key: string]: string | TemplateVariables;
}

export interface ApiResponse<T = CrudRecord> {
    success: boolean;
    data?: T;
    message?: string;
    totalCount?: number;
    status?: {
        totalCount: number;
        statusMessage: string;
    };
}

export type ShowAlertFn = (msg: string, type?: AlertColor) => void;
export type SetLoadingFn = (loading: boolean) => void;

/** Redux thunk action type — a function that receives dispatch and getState */
export type ThunkAction = (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;

// ─────────────────────────────────────────────────────────────────────────────
// Utility: extract only explicitly declared (non-index-signature) keys of T
// ─────────────────────────────────────────────────────────────────────────────

export type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : K]: T[K];
} &
    string;

// ─────────────────────────────────────────────────────────────────────────────
// Per-type ExtraProp interfaces
// Each field type only accepts the props that are relevant to it.
// TypeScript's excess property checking will reject invalid props at definition sites.
// ─────────────────────────────────────────────────────────────────────────────

export type FieldVariant = "standard" | "outlined" | "filled";

/** ExtraProp for SELECT fields. `getOptions` is REQUIRED. */
export interface SelectExtraProp {
    readOnly?: boolean;
    addValue?: boolean;
    saveType?: "string" | "object";
    variant?: FieldVariant;
}

/** ExtraProp for TEXT / EMAIL fields. */
export interface TextExtraProp {
    readOnly?: boolean;
    variant?: FieldVariant;
    multiline?: boolean;
}

/** ExtraProp for TEXTAREA fields. */
export interface TextareaExtraProp {
    readOnly?: boolean;
    rows?: number;
    variant?: FieldVariant;
}

/** ExtraProp for NUMBER fields. */
export interface NumberExtraProp {
    readOnly?: boolean;
    min?: string | number;
    max?: string | number;
    variant?: FieldVariant;
}

/** ExtraProp for DATE / DATETIME fields. */
export interface DateExtraProp {
    readOnly?: boolean;
    includeCurrentTime?: boolean;
    min?: string | number;
    max?: string | number;
}

/** ExtraProp for BOOL fields. */
export interface BoolExtraProp {
    readOnly?: boolean;
}

/** ExtraProp for CHECK fields. */
export interface CheckExtraProp {
    readOnly?: boolean;
}

/** ExtraProp for IMAGE / IMAGE_DIALOG fields. */
export interface ImageExtraProp {
    size?: string | number;
    defaultImage?: string;
    readOnly?: boolean;
}

/** ExtraProp for EDITOR fields. */
export interface EditorExtraProp {
    readOnly?: boolean;
    rows?: number;
    variables?: TemplateVariables;
    disableVars?: boolean;
    variant?: FieldVariant;
    multiline?: boolean;
}

/** ExtraProp for CUSTOM fields. `CustomComponent` is REQUIRED. */
export interface CustomExtraProp<T = CrudRecord> {
    CustomComponent: React.ComponentType<{
        data?: T;
        field?: FieldDef<T>;
        value?: FieldValue;
        setValue?: (val: FieldValue) => void;
        onChange?: (val: FieldValue) => void;
        label?: string;
        isEdit?: boolean;
        [key: string]: unknown;
    }>;
    readOnly?: boolean;
}

/**
 * Superset object containing all possible extraProp fields.
 * Used by internal UI components/renderers (Field.tsx, fieldHelpers.ts)
 * so they can access property fields without manual union checks.
 */
export interface ExtraProp<T = CrudRecord> {
    min?: string | number;
    max?: string | number;
    rows?: number;
    getOptions?: (
        search: string,
        page: number,
        limit: number,
        row?: T,
    ) => Promise<SelectOption<T>[]>;
    CustomComponent?: React.ComponentType<{
        data?: T;
        field?: FieldDef<T>;
        value?: FieldValue;
        setValue?: (val: FieldValue) => void;
        onChange?: (val: FieldValue) => void;
        label?: string;
        isEdit?: boolean;
        [key: string]: unknown;
    }>;
    readOnly?: boolean;
    addValue?: boolean;
    saveType?: "string" | "object";
    size?: string | number;
    variant?: FieldVariant;
    includeCurrentTime?: boolean;
    variables?: TemplateVariables;
    multiline?: boolean;
    defaultImage?: string;
    disableVars?: boolean;
    colorMap?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Common base interfaces
// ─────────────────────────────────────────────────────────────────────────────

interface FieldDefCommon<T, K extends string> {
    name: K;
    label: string;
    show?: boolean;
    view?: boolean;
    section?: string;
    editable?: (row: T) => boolean;
    setValue?: (value: FieldValue, row?: T) => void;
    validation?: {
        required?: boolean;
        regex?: RegExp;
        message?: string;
        minLength?: number;
        maxLength?: number;
    };
    api?: React.RefObject<ViewsApiRef>;
    viewProps?: Partial<ViewsProps<CrudRecord>>;
    CustomComponent?: React.ComponentType<{
        data: T;
        field: FieldDef<T>;
    }>;
    /** When true, this field is treated as the entity's primary status/state.
     *  FormView will display its value as a color-coded chip in the sticky header.
     */
    isState?: boolean;
    /** Maps each possible state value to a color string (hex / CSS variable / theme token).
     *  Used together with `isState`. Falls back to theme.palette.text.secondary for unknown values.
     */
    colorMap?: Record<string, string>;
}

interface FieldDefTyped<T, K extends KnownKeys<T> & string> extends FieldDefCommon<T, K> {
    defaultValue?: T[K];
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-type FieldDef interfaces for known keys K in KnownKeys<T>
// ─────────────────────────────────────────────────────────────────────────────

export interface SelectFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "SELECT";
    getOptions: (
        search: string,
        page: number,
        limit: number,
        row?: T,
    ) => Promise<SelectOption<T>[]>;
    extraProp: SelectExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): { key: string | number; value: T[K] };
}

export interface TextFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type?: "TEXT";
    extraProp?: TextExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface TextareaFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "TEXTAREA";
    extraProp?: TextareaExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface NumberFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "NUMBER";
    extraProp?: NumberExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface DateFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "DATE";
    extraProp?: DateExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface DatetimeFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "DATETIME";
    extraProp?: DateExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface BoolFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "BOOL";
    extraProp?: BoolExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface CheckFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "CHECK";
    extraProp?: CheckExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface ImageFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "IMAGE";
    extraProp?: ImageExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface ImageDialogFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<
    T,
    K
> {
    type: "IMAGE_DIALOG";
    extraProp?: ImageExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface EmailFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "EMAIL";
    extraProp?: TextExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface EditorFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "EDITOR";
    extraProp?: EditorExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface CustomFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "CUSTOM";
    extraProp: CustomExtraProp<T>;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface ViewFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "VIEW";
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface ComponentFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "COMPONENT";
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface StateFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "STATE";
    /** When true, this field is treated as the entity's primary status/state.
     *  FormView will display its value as a color-coded chip in the sticky header.
     */
    isState?: boolean;
    /** Maps each possible state value to a color string (hex / CSS variable / theme token).
     *  Used together with `isState`. Falls back to theme.palette.text.secondary for unknown values.
     */
    colorMap?: Record<string, string>;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

type FieldDefForKey<T, K extends KnownKeys<T> & string> =
    | SelectFieldDef<T, K>
    | TextFieldDef<T, K>
    | TextareaFieldDef<T, K>
    | NumberFieldDef<T, K>
    | DateFieldDef<T, K>
    | DatetimeFieldDef<T, K>
    | BoolFieldDef<T, K>
    | CheckFieldDef<T, K>
    | ImageFieldDef<T, K>
    | ImageDialogFieldDef<T, K>
    | EmailFieldDef<T, K>
    | EditorFieldDef<T, K>
    | CustomFieldDef<T, K>
    | ViewFieldDef<T, K>
    | ComponentFieldDef<T, K>
    | StateFieldDef<T, K>;

// ─────────────────────────────────────────────────────────────────────────────
// LooseFieldDef: for arbitrary string field names (e.g. "paymentEntry.paymentDate")
// Discriminated on `type` so extraProp rules still apply strictly!
// ─────────────────────────────────────────────────────────────────────────────

interface LooseFieldCommon<T> {
    name: string;
    label: string;
    show?: boolean;
    view?: boolean;
    section?: string;
    defaultValue?: FieldValue;
    editable?: (row: T) => boolean;
    setValue?: (value: FieldValue, row?: T) => void;
    validation?: {
        required?: boolean;
        regex?: RegExp;
        message?: string;
        minLength?: number;
        maxLength?: number;
    };
    api?: React.RefObject<ViewsApiRef>;
    viewProps?: Partial<ViewsProps<CrudRecord>>;
    CustomComponent?: React.ComponentType<{
        data: T;
        field: FieldDef<T>;
    }>;
    /** When true, this field is treated as the entity's primary status/state.
     *  FormView will display its value as a color-coded chip in the sticky header.
     */
    isState?: boolean;
    /** Maps each possible state value to a color string (hex / CSS variable / theme token).
     *  Used together with `isState`. Falls back to theme.palette.text.secondary for unknown values.
     */
    colorMap?: Record<string, string>;
}

export type LooseFieldDef<T> =
    | ({
          type: "SELECT";
          getOptions: (
              search: string,
              page: number,
              limit: number,
              row?: T,
          ) => Promise<SelectOption<T>[]>;
          extraProp?: SelectExtraProp;
          getValue?(
              value: FieldValue,
              row: T,
              isEdit: boolean,
          ): { key: string | number; value: FieldValue };
      } & LooseFieldCommon<T>)
    | ({
          type?: "TEXT";
          extraProp?: TextExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "TEXTAREA";
          extraProp?: TextareaExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "NUMBER";
          extraProp?: NumberExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "DATE";
          extraProp?: DateExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "DATETIME";
          extraProp?: DateExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "BOOL";
          extraProp?: BoolExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "CHECK";
          extraProp?: CheckExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "IMAGE";
          extraProp?: ImageExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "IMAGE_DIALOG";
          extraProp?: ImageExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "EMAIL";
          extraProp?: TextExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "EDITOR";
          extraProp?: EditorExtraProp;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "CUSTOM";
          extraProp: CustomExtraProp<T>;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "VIEW";
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "COMPONENT";
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>)
    | ({
          type: "STATE";
          isState?: boolean;
          colorMap?: Record<string, string>;
          getValue?(value: FieldValue, row: T, isEdit: boolean): FieldValue | React.ReactNode;
      } & LooseFieldCommon<T>);

// ─────────────────────────────────────────────────────────────────────────────
// FieldDef<T>: Main union type
// ─────────────────────────────────────────────────────────────────────────────

export type FieldDef<T = LooseFormRecord> = [KnownKeys<T>] extends [never]
    ? LooseFieldDef<T>
    : { [K in KnownKeys<T>]: FieldDefForKey<T, K> }[KnownKeys<T>] | LooseFieldDef<T>;

// ─────────────────────────────────────────────────────────────────────────────
// defineField<T>() helper
// ─────────────────────────────────────────────────────────────────────────────

export const defineField =
    <T>() =>
    <K extends KnownKeys<T> & string>(field: FieldDefForKey<T, K>): FieldDefForKey<T, K> =>
        field;

// ─────────────────────────────────────────────────────────────────────────────
// Remaining types
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionItem<T = CrudRecord> {
    name: string;
    onClick?: (row: T) => void;
    icon?: React.ReactNode;
    sx?: {
        color?: string;
    };
    hide?: boolean | ((row: T) => boolean);
    enabled?: boolean | ((row: T) => boolean);
    multi?: boolean;
    help?: string;
    views?: (ViewMode | string)[] | undefined;
    view?: ViewMode | string | (ViewMode | string)[] | undefined;
}

export interface CrudState<T = CrudRecord> {
    rootId: number;
    items: T[];
    recordById: Record<number, T>;
    searchTerm: string;
    filterKeys: FilterKeys;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface CrudThunks<T = CrudRecord> {
    add: (
        newData: Partial<T>,
        token: string,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        prepend?: boolean,
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;
    update: (
        id: number,
        updatedData: Partial<T>,
        token: string,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;
    remove: (
        id: number,
        token: string,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
    ) => (dispatch: AppDispatch) => Promise<void>;
    getAll: (
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        token: string,
        params: RequestParams,
        rootId: number,
        infinite?: boolean,
        _force?: boolean,
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;
    getById: (
        id: number,
        token: string,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        options?: { forceRefresh?: boolean },
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<T | null>;
    refresh: (
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        token: string,
        infinite?: boolean,
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;
}

export interface RequestParams {
    page?: number;
    size?: number;
    searchTerm?: string;
}

export interface ViewsApiRef {
    addNewRow?: () => void;
    refreshData?: () => void;
}

export interface BaseViewProps<T extends CrudRecord = CrudRecord> {
    data: T[];
    tableState: CrudState;
    loading?: boolean | undefined;
    fields: FieldDef<T>[];
    fieldsMeta: FieldMeta;
    editingId?: number | undefined;
    submitAttempted?: boolean | undefined;
    handleChange: (value: FieldValue, rowId: number, fieldName: string) => void;
    handleSave?: ((rowId: number) => void | Promise<void>) | undefined;
    handleCancel?: (() => void) | undefined;
    handlePageChange: (page: number) => void;
    handleViewOpen?: ((row: T) => void) | undefined;
    onClickRow?: ((row: T) => void) | undefined;
    addNewRow?: (() => void) | undefined;
    actions: ActionItem<T>[];
    tableName: string;
    currentView: ViewMode;
    multi?: boolean | undefined;
    infiniteScroll?: boolean | undefined;
}
