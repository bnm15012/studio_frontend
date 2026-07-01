import React, { useEffect, useState } from "react";
import { Select, MenuItem, CircularProgress, Typography } from "@mui/material";

interface InfiniteSelectOption {
    [key: string]: unknown;
}

interface InfiniteSelectFieldProps {
    currentValue: unknown;
    onChange: (val: unknown) => void;
    getOptions: (page: number, size: number) => Promise<{ data: InfiniteSelectOption[]; total: number }>;
    valueField?: string;
    keyField?: string;
}

const InfiniteSelectField: React.FC<InfiniteSelectFieldProps> = ({
    currentValue,
    onChange,
    getOptions,
    valueField = "name",
    keyField = "id",
}) => {
    const [options, setOptions] = useState<InfiniteSelectOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [size] = useState<number>(7);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await getOptions(page, size);
                setOptions((prev) => {
                    const existingIds = new Set(prev.map((opt) => opt[keyField]));
                    const uniqueNewOptions = response.data.filter(
                        (opt) => !existingIds.has(opt[keyField]),
                    );
                    return [...prev, ...uniqueNewOptions];
                });
                setTotal(response.total);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch options");
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, [page, size, getOptions, keyField]);

    const handleScroll = (event: React.UIEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
        if (bottom && !loading && options.length < total) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <>
            <Select
                value={currentValue}
                onChange={(e) => onChange(e.target.value)}
                variant="standard"
                fullWidth
                displayEmpty
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 250,
                            overflowY: "auto",
                        },
                        onScroll: handleScroll,
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option[keyField] as string | number} value={option[keyField] as number}>
                        {(option[valueField] ?? option.name) as React.ReactNode}
                    </MenuItem>
                ))}
                {loading && (
                    <MenuItem disabled>
                        <CircularProgress size={20} />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                            Loading...
                        </Typography>
                    </MenuItem>
                )}
            </Select>
            {error && <Typography color="error">{error}</Typography>}
        </>
    );
};

export default InfiniteSelectField;
