/** Central type definitions used across the core layer — AppDispatch, Entity, SelectOption, FieldDef, ActionItem, and Redux thunk types. */
import React from "react";
import type { AlertColor } from "@mui/material/Alert";
import { FieldTypes } from "./components/fields/FieldTypes";
import { Entity, FilterKeys } from "./state/stateTypes";
import { RootState } from "@/state";
export type { Entity, FilterKeys };

export type AppDispatch = (action: unknown) => unknown;

export type ViewMode = "LIST" | "CARD" | "FORM";

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

export interface FieldDef<T = GenericItem, K extends string & keyof T = string & keyof T> {
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
