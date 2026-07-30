/** Central type definitions used across the core layer — AppDispatch, Entity, SelectOption, FieldDef, ActionItem, and Redux thunk types. */
import React from "react";
import type { AlertColor } from "@mui/material/Alert";
import { Entity, FilterKeys } from "@/core/state/stateTypes";
import { RootState, AppDispatch } from "@/state";
export type { Entity, FilterKeys, AppDispatch };

export type ViewMode = "LIST" | "CARD" | "FORM";

export interface FieldMeta {
    primary: string;
    root?: string;
}

export interface GenericItem {
    id?: number;
    [key: string]: unknown;
}

export interface SelectOption<T = GenericItem> {
    key: string | number;
    value: string | number;
    row?: T;
}

export interface ApiResponse<T = GenericItem> {
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

export interface CustomComponentProps {
    value?: unknown;
    setValue?: (val: unknown) => void;
    label?: string;
    isEdit?: boolean;
    [key: string]: unknown;
}

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
    variables?: Record<string, unknown>;
    disableVars?: boolean;
    variant?: FieldVariant;
    multiline?: boolean;
}

/** ExtraProp for CUSTOM fields. `CustomComponent` is REQUIRED. */
export interface CustomExtraProp {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CustomComponent: React.ComponentType<any>;
    readOnly?: boolean;
}

/**
 * Superset object containing all possible extraProp fields.
 * Used by internal UI components/renderers (Field.tsx, fieldHelpers.ts)
 * so they can access property fields without manual union checks.
 */
export interface ExtraProp<T = GenericItem> {
    min?: string | number;
    max?: string | number;
    rows?: number;
    getOptions?: (
        search: string,
        page: number,
        limit: number,
        row?: T,
    ) => Promise<SelectOption<T>[]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CustomComponent?: React.ComponentType<any>;
    readOnly?: boolean;
    addValue?: boolean;
    saveType?: "string" | "object";
    size?: string | number;
    variant?: FieldVariant;
    includeCurrentTime?: boolean;
    variables?: Record<string, unknown>;
    multiline?: boolean;
    defaultImage?: string;
    disableVars?: boolean;
    colorMap?: Record<string, string>;
}

export type AnyExtraProp<T = GenericItem> = ExtraProp<T>;

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
    setValue?: (value: T[keyof T & string], row?: T) => void;
    validation?: {
        required?: boolean;
        regex?: string | RegExp;
        message?: string;
    };
    api?: unknown;
    viewProps?: unknown;
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
    extraProp: CustomExtraProp;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface ViewFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "VIEW";
    extraProp?: Record<string, unknown>;
    getValue?(value: T[K], row: T, isEdit: boolean): T[K] | React.ReactNode;
}

export interface ComponentFieldDef<T, K extends KnownKeys<T> & string> extends FieldDefTyped<T, K> {
    type: "COMPONENT";
    extraProp?: Record<string, unknown>;
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
    extraProp?: Record<string, unknown>;
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
    defaultValue?: unknown;
    editable?: (row: T) => boolean;
    setValue?: (value: unknown, row?: T) => void;
    validation?: {
        required?: boolean;
        regex?: string | RegExp;
        message?: string;
    };
    api?: unknown;
    viewProps?: unknown;
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
              value: unknown,
              row: T,
              isEdit: boolean,
          ): { key: string | number; value: unknown };
      } & LooseFieldCommon<T>)
    | ({
          type?: "TEXT";
          extraProp?: TextExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "TEXTAREA";
          extraProp?: TextareaExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "NUMBER";
          extraProp?: NumberExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "DATE";
          extraProp?: DateExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "DATETIME";
          extraProp?: DateExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "BOOL";
          extraProp?: BoolExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "CHECK";
          extraProp?: CheckExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "IMAGE";
          extraProp?: ImageExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "IMAGE_DIALOG";
          extraProp?: ImageExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "EMAIL";
          extraProp?: TextExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "EDITOR";
          extraProp?: EditorExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "CUSTOM";
          extraProp: CustomExtraProp;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "VIEW";
          extraProp?: Record<string, unknown>;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "COMPONENT";
          extraProp?: Record<string, unknown>;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>)
    | ({
          type: "STATE";
          isState?: boolean;
          colorMap?: Record<string, string>;
          extraProp?: Record<string, unknown>;
          getValue?(value: unknown, row: T, isEdit: boolean): unknown;
      } & LooseFieldCommon<T>);

// ─────────────────────────────────────────────────────────────────────────────
// FieldDef<T>: Main union type
// ─────────────────────────────────────────────────────────────────────────────

export type FieldDef<T = GenericItem> = [KnownKeys<T>] extends [never]
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

export interface ActionItem<T = GenericItem> {
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
}

export interface CrudState<T = GenericItem> {
    rootId: number;
    items: T[];
    recordById: Record<number, T>;
    searchTerm: string;
    filterKeys: Record<string, unknown>;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    [key: string]: unknown;
}

export interface CrudThunks<T = GenericItem> {
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

export interface BaseViewProps<T extends Entity = GenericItem> {
    data: T[];
    tableState: Record<string, unknown>;
    loading?: boolean;
    fields: FieldDef<T>[];
    fieldsMeta: FieldMeta;
    editingId?: number;
    submitAttempted?: boolean;
    handleChange: (value: unknown, rowId: number, fieldName: string) => void;
    handleSave?: (rowId: number) => void | Promise<void>;
    handleCancel?: () => void;
    handlePageChange: (page: number) => void;
    handleViewOpen?: (row: T) => void;
    onClickRow?: (row: T) => void;
    addNewRow?: () => void;
    actions: ActionItem<T>[];
    tableName: string;
    currentView: ViewMode;
    multi?: boolean;
    infiniteScroll?: boolean;
}
