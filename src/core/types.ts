import React from "react";

export interface SelectOption {
    key: string | number;
    value: string;
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

export type ShowAlertFn = (msg: string, type?: string) => void;
export type SetLoadingFn = (loading: boolean) => void;

export interface ExtraProp {
    getOptions?: (
        search: string,
        page: number,
        limit: number,
        row?: Record<string, unknown>,
    ) => Promise<SelectOption[]>;
    CustomComponent?: React.ComponentType<Record<string, unknown>>;
    readOnly?: boolean;
    addValue?: boolean;
    saveType?: string;
    [key: string]: unknown;
}

export interface FieldDef {
    name: string;
    show?: boolean;
    view?: boolean;
    label?: string;
    type?: string;
    section?: string;
    defaultValue?: unknown;
    getValue?: (
        raw: unknown,
        row: Record<string, unknown>,
        isEdit: boolean,
    ) => unknown;
    setValue?: (value: unknown, row?: Record<string, unknown>) => void;
    editable?: (row: Record<string, unknown>) => boolean;
    extraProp?: ExtraProp;
    CustomComponent?: React.ComponentType<{
        data: Record<string, unknown>;
        field: FieldDef;
    }>;
    [key: string]: unknown;
}

export interface ActionItem {
    name: string;
    onClick?: (row: unknown) => void;
    icon?: React.ReactNode;
    sx?: {
        color?: string;
        [key: string]: unknown;
    };
    hide?: boolean;
    enabled?: boolean | ((row: unknown) => boolean);
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

export interface CrudThunks {
    add: (
        newData: unknown,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        prepend?: boolean,
    ) => (dispatch: unknown, getState: unknown) => Promise<void>;
    update: (
        id: unknown,
        updatedData: unknown,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
    ) => (dispatch: unknown, getState: unknown) => Promise<void>;
    remove: (
        id: unknown,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
    ) => (dispatch: unknown) => Promise<void>;
    getAll: (
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        token: string | null | undefined,
        params: Record<string, unknown>,
        rootId: string | number,
        infinite?: boolean,
    ) => (dispatch: unknown, getState: unknown) => Promise<void>;
    getById: (
        id: unknown,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        options?: { forceRefresh?: boolean },
    ) => (dispatch: unknown, getState: unknown) => Promise<unknown>;
    refresh: (
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        token: string | null | undefined,
        infinite?: boolean,
    ) => (dispatch: unknown, getState: unknown) => Promise<void>;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    searchTerm?: string;
    [key: string]: unknown;
}
