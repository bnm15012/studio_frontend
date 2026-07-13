/** Central type definitions used across the core layer — AppDispatch, Entity, SelectOption, FieldDef, ActionItem, and Redux thunk types. */
import React from "react";
import type { AlertColor } from "@mui/material/Alert";
import { FieldTypes } from "./components/fields/FieldTypes";

export type AppDispatch = (action: unknown) => unknown;

export type ViewMode = "LIST" | "CARD" | "FORM";

export interface Entity {
    [key: string]: unknown;
}

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
export type ThunkAction = (dispatch: AppDispatch, getState: () => unknown) => Promise<void>;

export interface ExtraProp<T extends Entity = Entity> {
    getOptions?: (
        search: string,
        page: number,
        limit: number,
        row?: T,
    ) => Promise<SelectOption<T>[]>;
    CustomComponent?: React.ComponentType<Record<string, unknown>>;
    readOnly?: boolean;
    addValue?: boolean;
    saveType?: string;
    [key: string]: unknown;
}

export interface FieldDef<T extends Entity = Entity> {
    name: string;
    show?: boolean;
    view?: boolean;
    label?: string;
    type?: FieldTypes;
    section?: string;
    defaultValue?: unknown;
    getValue?(raw: unknown, row: T, isEdit: boolean): unknown;
    setValue?: (value: unknown, row?: T) => void;
    editable?: (row: T) => boolean;
    extraProp?: ExtraProp<T>;
    validation?: {
        required?: boolean;
        regex?: string | RegExp;
        message?: string;
        [key: string]: unknown;
    };
    CustomComponent?: React.ComponentType<{
        data: T;
        field: FieldDef<T>;
    }>;
    [key: string]: unknown;
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
        newData: Partial<T> | Record<string, unknown>,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        prepend?: boolean,
    ) => (dispatch: AppDispatch, getState: () => unknown) => Promise<void>;
    update: (
        id: string | number | null,
        updatedData: Partial<T> | Record<string, unknown>,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
    ) => (dispatch: AppDispatch, getState: () => unknown) => Promise<void>;
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
        params: Record<string, unknown>,
        rootId: string | number | null | undefined,
        infinite?: boolean,
        _force?: boolean,
    ) => (dispatch: AppDispatch, getState: () => unknown) => Promise<void>;
    getById: (
        id: string | number,
        token: string | null | undefined,
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        options?: { forceRefresh?: boolean },
    ) => (dispatch: AppDispatch, getState: () => unknown) => Promise<T | null>;
    refresh: (
        showAlert: ShowAlertFn,
        setLoading: SetLoadingFn,
        token: string | null | undefined,
        infinite?: boolean,
    ) => (dispatch: AppDispatch, getState: () => unknown) => Promise<void>;
    [key: string]: unknown;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    searchTerm?: string;
    [key: string]: unknown;
}
