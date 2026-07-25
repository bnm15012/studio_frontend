/** Central type definitions used across the core layer — AppDispatch, Entity, SelectOption, FieldDef, ActionItem, and Redux thunk types. */
import React from "react";
import type { AlertColor } from "@mui/material/Alert";
import { FieldTypes } from "./components/fields/FieldTypes";
import { Entity, FilterKeys } from "./state/stateTypes";
import { RootState } from "@/state";
export type { Entity, FilterKeys };

export type AppDispatch = (action: unknown) => unknown;

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
    saveType?: string;
    size?: string | number;
    variant?: string;
    includeCurrentTime?: boolean;
    variables?: unknown;
    multiline?: boolean;
    defaultImage?: string;
    disableVars?: boolean;
}

/** Shared properties across all field types */
interface FieldDefBase<T = GenericItem, K extends string & keyof T = string & keyof T> {
    name: K;
    show?: boolean;
    view?: boolean;
    label: string;
    section?: string;
    defaultValue?: T[K];
    setValue?: (value: T[K], row?: T) => void;
    editable?: (row: T) => boolean;
    validation?: {
        required?: boolean;
        regex?: string | RegExp;
        message?: string;
    };
    CustomComponent?: React.ComponentType<{
        data: T;
        field: FieldDef<T>;
    }>;
    api?: unknown;
    viewProps?: unknown;
}

/**
 * SELECT field — getOptions is required.
 *
 * `V` is the value type passed to `getValue`. It defaults to `T[K]` but since
 * `T` usually extends `Entity` (i.e. `{ [key: string]: unknown }`), `T[K]`
 * collapses to `unknown`.  Annotate `V` explicitly on individual fields to get
 * proper inference:
 *
 * ```ts
 * // inferred as `unknown` — bad
 * getValue: (value) => ({ key: value, value })
 *
 * // explicit V = string — good
 * getValue: (value: string) => ({ key: value, value })
 * ```
 */
export interface SelectFieldDef<
    T = GenericItem,
    K extends string & keyof T = string & keyof T,
    V = T[K],
> extends FieldDefBase<T, K> {
    type: "SELECT";
    extraProp: ExtraProp<T> & {
        getOptions: (
            search: string,
            page: number,
            limit: number,
            row?: T,
        ) => Promise<SelectOption<T>[]>;
    };
    /**
     * Map the raw field value to a `{ key, value }` pair for the SelectionField.
     * Annotate the `value` parameter with the actual type (e.g. `string`) to
     * avoid `unknown`.
     *
     * @default (v) => v && { key: v, value: v }
     */
    /** @default (v) => v && { key: v, value: v } */
    getValue?(value: V, row: T, isEdit: boolean): { key: string | number; value: V };
}

/**
 * All non-SELECT field types — getOptions is not relevant.
 *
 * `V` is the value type passed to `getValue`. Annotate it explicitly when
 * TypeScript infers `unknown` due to the `Entity` index signature.
 */
export interface BaseFieldDef<
    T = GenericItem,
    K extends string & keyof T = string & keyof T,
    V = T[K],
> extends FieldDefBase<T, K> {
    /** @default "TEXT" */
    type?: Exclude<FieldTypes, "SELECT">;
    extraProp?: Omit<ExtraProp<T>, "getOptions">;
    getValue?(value: V, row: T, isEdit: boolean): V | React.ReactNode;
}

export type FieldDef<T = GenericItem, K extends string & keyof T = string & keyof T> =
    | SelectFieldDef<T, K>
    | BaseFieldDef<T, K>;

export interface ActionItem<T = GenericItem> {
    name: string;
    onClick?: (row: T) => void;
    icon?: React.ReactNode;
    sx?: {
        color?: string;
        [key: string]: unknown;
    };
    hide?: boolean;
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
    /** id=0 means "nothing selected" — callers must guard before calling remove */
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

/**
 * BaseViewProps — the contract every pluggable view component must satisfy.
 *
 * `Views.tsx` computes all of these once and passes them down via
 * `commonStableProps` + `commonProps`.  Any custom view registered
 * through `ViewsProps.customView` will receive exactly this shape.
 *
 * Usage:
 * ```tsx
 * import type { BaseViewProps } from "@/core/types";
 *
 * function MyCustomView<T extends Entity>(props: BaseViewProps<T>) {
 *   const { data, fields, actions, onClickRow, loading } = props;
 *   // ... your rendering logic
 * }
 * ```
 */
export interface BaseViewProps<T extends Entity = GenericItem> {
    // ── Data ───────────────────────────────────────────────────────────────
    /** The current page / visible slice of entity records. */
    data: T[];
    /** Redux / hook table state: currentPage, pageSize, totalCount, recordById, … */
    tableState: Record<string, unknown>;
    /** True while a network request is in-flight. */
    loading?: boolean;

    // ── Fields ────────────────────────────────────────────────────────────
    /** Visibility-filtered field definitions for this view. */
    fields: FieldDef<T>[];
    /** Primary-key and optional root-key metadata. */
    fieldsMeta: FieldMeta;

    // ── Edit state ────────────────────────────────────────────────────────
    /**
     * -1 = nothing being edited
     *  0 = new (unsaved) row
     *  positive = ID of the row currently being edited
     */
    editingId?: number;
    /** Whether the user has attempted to submit an invalid form. */
    submitAttempted?: boolean;

    // ── Handlers ──────────────────────────────────────────────────────────
    /** Update a single field value for a row. */
    handleChange: (value: unknown, rowId: number, fieldName: string) => void;
    /** Persist edits for the given row ID. */
    handleSave?: (rowId: number) => void | Promise<void>;
    /** Discard in-progress edits. */
    handleCancel?: () => void;
    /** Navigate to a different page of results. */
    handlePageChange: (page: number) => void;
    /** Open the detail-view dialog for a row. */
    handleViewOpen?: (row: T) => void;
    /**
     * Navigates into the form view for a row.
     * Computed once in Views.tsx from the "form" action to avoid duplication.
     */
    onClickRow?: (row: T) => void;
    /** Append a fresh empty row ready for input (only present when showAddButton=true). */
    addNewRow?: () => void;

    // ── Actions ───────────────────────────────────────────────────────────
    /** Merged action items (edit / delete / custom) wired by Views.tsx. */
    actions: ActionItem<T>[];

    // ── Layout hints ──────────────────────────────────────────────────────
    tableName: string;
    currentView: ViewMode;
    /** Enable multi-select / batch-action mode. */
    multi?: boolean;
    /** Use IntersectionObserver-based auto-load instead of a "Load more" button. */
    infiniteScroll?: boolean;
}
