import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  ListItemText,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import Loading from "./Loading/Loading";
import PropTypes from "prop-types";

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
  const hasMore = useRef(true);
  const pageRef = useRef(1); // Ref for page to avoid rerendering

  // Fetch more options with pagination support
  const fetchMoreOptions = useCallback(async () => {
    if (loading || !hasMore.current) return;
    setLoading(true);
    const { data, totalCount } = await fetchOptions(pageRef.current, size);
    if (totalCount < size) {
      hasMore.current = false;
    }
    setOptions((prev) => {
      const merged = [...prev, ...data];
      const uniqueMap = new Map();
      merged.forEach((item) => {
        uniqueMap.set(item[valueKey], item); // keep latest item with the same key
      });
      return Array.from(uniqueMap.values());
    });

    pageRef.current += 1;
    setLoading(false);
  }, [fetchOptions, loading, size, valueKey]);

  // Reset and fetch options when dialog opens
  useEffect(() => {
    if (open) {
      pageRef.current = 1; // Reset page
      hasMore.current = true; // Reset loading state
      fetchMoreOptions(); // Fetch options when the dialog opens
    }
  }, [open]); // Trigger effect only when `open` or `data` changes

  // IntersectionObserver to trigger pagination when user scrolls near the bottom
  const observerRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchMoreOptions();
      },
      { rootMargin: "100px" }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

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
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogContent dividers style={{ maxHeight: "400px", overflow: "auto" }}>
        {options.map((option, index) => (
          <MenuItem
            key={option[valueKey]}
            onClick={() => {
              const exists = selected.some(
                (sel) => sel[valueKey] === option[valueKey]
              );
              if (exists) {
                setSelected((prev) =>
                  prev.filter((sel) => sel[valueKey] !== option[valueKey])
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
              checked={selected.some(
                (sel) => sel[valueKey] === option[valueKey]
              )}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={option[labelKey]} />
          </MenuItem>
        ))}
        <div ref={observerRef} style={{ height: 40, textAlign: "center" }}>
          {loading && <Loading />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk} variant="contained" disabled={loading}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
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
