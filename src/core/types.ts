/** Central type definitions used across the core layer — AppDispatch, Entity, SelectOption, FieldDef, ActionItem, and Redux thunk types. */
import React from "react";
import type { AlertColor } from "@mui/material/Alert";
import { FieldTypes } from "./components/fields/FieldTypes";
import { Entity, FilterKeys } from "./state/stateTypes";
import { RootState } from "@/state";
export type { Entity, FilterKeys };

export type AppDispatch = (action: unknown) => unknown;

export type ViewMode = "LIST" | "CARD" | "FORM";

export interface SelectOption<T extends Entity = Entity> {
    key: string | number;
    value: string | number;
    row?: T;
}

export interface ApiResponse<T = unknown> {
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

export interface ExtraProp<T extends Entity = Entity> {
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

export interface FieldDef<
    T extends Entity = Entity,
    K extends string & keyof T = string & keyof T,
> {
    name: K;
    show?: boolean;
    view?: boolean;
    label?: string;
    type?: FieldTypes;
    section?: string;
    defaultValue?: T[K];
    getValue?(value: T[K], row: T, isEdit: boolean): React.ReactNode | { key: string; value: T[K] };
    setValue?: (value: T[K], row?: T) => void;
    editable?: (row: T) => boolean;
    extraProp?: ExtraProp<T>;
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

export interface ActionItem<T extends Entity = Entity> {
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

export interface GenericItem {
    id?: string | number;
    [key: string]: unknown;
}

export interface CrudState<T = GenericItem> {
    rootId: string | number;
    items: T[];
    recordById: Record<string | number, T>;
    searchTerm: string;
    filterKeys: Record<string, unknown>;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    [key: string]: unknown;
}

export interface CrudThunks<T extends Entity = Entity> {
    add: (
        newData: Partial<T>,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        prepend?: boolean,
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;
    update: (
        id: string | number | null,
        updatedData: Partial<T>,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;
    remove: (
        id: string | number | null,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
    ) => (dispatch: AppDispatch) => Promise<void>;
    getAll: (
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        token: string | null | undefined,
        params: RequestParams,
        rootId: string | number | null | undefined,
        infinite?: boolean,
        _force?: boolean,
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>;
    getById: (
        id: string | number,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        options?: { forceRefresh?: boolean },
    ) => (dispatch: AppDispatch, getState: () => RootState) => Promise<T | null>;
    refresh: (
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        token: string | null | undefined,
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
