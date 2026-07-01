import React, { useState, useEffect, useRef, useCallback } from "react";
import { DialogContent, ListItemText, Checkbox, MenuItem, CircularProgress } from "@mui/material";
import StyledDialog from "./StyledDialog";

import { GenericItem } from "../../types";

interface MultiSelectDialogProps {
    open: boolean;
    onClose: () => void;
    fetchOptions: (page: number, size: number) => Promise<{ data: GenericItem[]; totalCount: number }>;
    data: GenericItem[];
    setData: (val: GenericItem[]) => void;
    valueKey?: string;
    labelKey?: string;
}

const MultiSelectDialog: React.FC<MultiSelectDialogProps> = ({
    open,
    onClose,
    fetchOptions,
    data,
    setData,
    valueKey = "value",
    labelKey = "label",
}) => {
    const [options, setOptions] = useState<GenericItem[]>([]);
    const [selected, setSelected] = useState<GenericItem[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const size = 10;
    const pageFetched = useRef<number[]>([]);
    const [totalRecords, setTotalRecords] = useState<number | undefined>();

    const fetchMoreOptions = useCallback(
        async (page = 1) => {
            if (pageFetched.current.includes(page)) return;
            setLoading(true);
            const { data, totalCount } = await fetchOptions(page, size);
            setTotalRecords(totalCount);
            setOptions((prev) => {
                const merged = [...prev, ...data];
                const uniqueMap = new Map<string | number | undefined, GenericItem>();
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
                    fetchMoreOptions(Math.floor(options.length / size) + 1);
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
                {options.map((option, index) => (
                    <MenuItem
                        key={option[labelKey] as string | number}
                        onClick={() => {
                            const exists = selected.some(
                                (sel) => sel[valueKey] === option[valueKey],
                            );
                            if (exists) {
                                setSelected((prev) =>
                                    prev.filter((sel) => sel[valueKey] !== option[valueKey]),
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
                            checked={selected.some((sel) => sel[valueKey] === option[valueKey])}
                            tabIndex={-1}
                            disableRipple
                        />
                        <ListItemText primary={option[labelKey] as React.ReactNode} />
                    </MenuItem>
                ))}
                <div ref={observerRef} style={{ height: 40, textAlign: "center" }}>
                    {loading && <CircularProgress />}
                    {options.length === totalRecords && <>No more record to show</>}
                </div>
            </DialogContent>
        </StyledDialog>
    );
};

export default MultiSelectDialog;
