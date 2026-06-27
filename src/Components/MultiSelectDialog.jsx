import { DialogContent, ListItemText, Checkbox, MenuItem, CircularProgress } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import StyledDialog from "../core/components/StyledDialog";

const MultiSelectDialog = ({
    open,
    onClose,
    fetchOptions, // should support pagination: (page, size) => Promise<array>
    data,
    setData,
    valueKey = "value",
    labelKey = "label",
}) => {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(data);
    const [loading, setLoading] = useState(false);
    const size = 10;
    const pageFetched = useRef([]);
    const [totalRecords, setTotalRecords] = useState();
    // Fetch more options with pagination support
    const fetchMoreOptions = useCallback(
        async (page = 1) => {
            if (pageFetched.current.includes(page)) return;
            setLoading(true);
            const { data, totalCount } = await fetchOptions(page, size);
            setTotalRecords(totalCount);
            setOptions((prev) => {
                const merged = [...prev, ...data];
                const uniqueMap = new Map();
                merged.forEach((item) => {
                    uniqueMap.set(item[valueKey], item); // keep latest item with the same key
                });
                return Array.from(uniqueMap.values());
            });
            pageFetched.current.push(page);

            setLoading(false);
        },
        [fetchOptions, valueKey],
    );

    // Reset and fetch options when dialog opens
    useEffect(() => {
        if (open) {
            fetchMoreOptions(1); // Fetch options when the dialog opens
        }
    }, [fetchMoreOptions, open]); // Trigger effect only when `open` or `data` changes

    // IntersectionObserver to trigger pagination when user scrolls near the bottom
    const observerRef = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchMoreOptions(parseInt(options.length / size) + 1);
                }
            },
            { rootMargin: "100px" },
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [fetchMoreOptions, open, options.length]);

    // Handle OK button click
    const handleOk = () => {
        setData(selected); // Send selected data to parent
        onClose();
    };

    // Handle Cancel button click
    const handleCancel = () => {
        setSelected(data); // Revert to previous selection
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
                        key={option[labelKey]}
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
                        <ListItemText primary={option[labelKey]} />
                    </MenuItem>
                ))}
                <div ref={observerRef} style={{ height: 40, textAlign: "center" }}>
                    {loading && <CircularProgress />}
                    {options.length == totalRecords && <>No more record to show</>}
                </div>
            </DialogContent>
        </StyledDialog>
    );
};
MultiSelectDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchOptions: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    setData: PropTypes.func.isRequired,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
};

export default MultiSelectDialog;
