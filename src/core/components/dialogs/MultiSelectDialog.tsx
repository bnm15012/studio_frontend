/** Multi-select dialog with infinite-scroll option loading, checkbox selection, and save/cancel. */
import { useState, useEffect, useRef, useCallback } from "react";
import { DialogContent, ListItemText, Checkbox, MenuItem, CircularProgress } from "@mui/material";
import StyledDialog from "./StyledDialog";

import { GenericItem } from "../../types";

interface MultiSelectDialogProps<T extends GenericItem = GenericItem> {
    open: boolean;
    onClose: () => void;
    fetchOptions: (page: number, size: number) => Promise<{ data: T[]; totalCount: number }>;
    data: T[];
    setData: (val: T[]) => void;
    valueKey?: string;
    labelKey?: string;
}

export function MultiSelectDialog<T extends GenericItem = GenericItem>({
    open,
    onClose,
    fetchOptions,
    data,
    setData,
    valueKey = "value",
    labelKey = "label",
}: MultiSelectDialogProps<T>) {
    const [options, setOptions] = useState<T[]>([]);
    const [selected, setSelected] = useState<T[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const LIMIT = 10;
    const pageFetched = useRef<number[]>([]);
    const [totalRecords, setTotalRecords] = useState<number | undefined>();

    const fetchMoreOptions = useCallback(
        async (page = 1) => {
            if (pageFetched.current.includes(page)) return;
            setLoading(true);
            const { data: fetchedData, totalCount } = await fetchOptions(page, LIMIT);
            setTotalRecords(totalCount);
            setOptions((prev) => {
                const merged = [...prev, ...fetchedData];
                const uniqueMap = new Map<string | number | undefined, T>();
                merged.forEach((item) => {
                    uniqueMap.set(item[valueKey] as string | number | undefined, item);
                });
                return Array.from(uniqueMap.values());
            });
            pageFetched.current.push(page);
            setLoading(false);
        },
        [fetchOptions, valueKey],
    );

    useEffect(() => {
        if (open) {
            fetchMoreOptions(1);
        }
    }, [fetchMoreOptions, open]);

    const observerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchMoreOptions(Math.floor(options.length / LIMIT) + 1);
                }
            },
            { rootMargin: "100px" },
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [fetchMoreOptions, open, options.length]);

    const handleOk = () => {
        setData(selected);
        onClose();
    };

    const handleCancel = () => {
        setSelected(data);
        onClose();
    };

    return (
        <StyledDialog
            onConfirm={handleOk}
            confirmText="OK"
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
        >
            <DialogContent dividers style={{ maxHeight: "400px", overflow: "auto" }}>
                {options.map((option, index) => {
                    const optVal = option[valueKey];
                    const optLabel = option[labelKey];
                    return (
                        <MenuItem
                            key={String(optLabel ?? index)}
                            onClick={() => {
                                const exists = selected.some((sel) => sel[valueKey] === optVal);
                                if (exists) {
                                    setSelected((prev) =>
                                        prev.filter((sel) => sel[valueKey] !== optVal),
                                    );
                                } else {
                                    setSelected((prev) => [...prev, option]);
                                }
                            }}
                            style={{ display: "flex", alignItems: "center", gap: 10 }}
                        >
                            <span>{index + 1}.</span>
                            <Checkbox
                                edge="start"
                                checked={selected.some((sel) => sel[valueKey] === optVal)}
                                tabIndex={-1}
                                disableRipple
                            />
                            <ListItemText primary={String(optLabel ?? "")} />
                        </MenuItem>
                    );
                })}
                <div ref={observerRef} style={{ height: 40, textAlign: "center" }}>
                    {loading && <CircularProgress />}
                    {options.length === totalRecords && <>No more record to show</>}
                </div>
            </DialogContent>
        </StyledDialog>
    );
}

export default MultiSelectDialog;
