import { useEffect, useState } from 'react';
import { Select, MenuItem, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const InfiniteSelectField = ({
    currentValue,
    onChange,
    getOptions,
    valueField = "name",
    keyField = "id"
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size] = useState(7);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await getOptions(page, size);
                setOptions((prev) => {
                    const existingIds = new Set(prev.map((opt) => opt[keyField]));
                    const uniqueNewOptions = response.data.filter((opt) => !existingIds.has(opt[keyField]));
                    return [...prev, ...uniqueNewOptions];
                });
                setTotal(response.total);
            } catch (err) {
                setError(err.message || 'Failed to fetch options');
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, [page, size, getOptions, keyField]);

    const handleScroll = (event) => {
        const bottom = event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight-10;
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
                            overflowY: 'auto' // Ensures that the menu is scrollable
                        },
                        onScroll: handleScroll // Attach onScroll handler here
                    }
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option[keyField]} value={option[keyField]}>
                        {option[valueField] ?? option.name}
                    </MenuItem>
                ))}
                {loading && (
                    <MenuItem disabled>
                        <CircularProgress size={20} />
                        <Typography variant="caption" sx={{ ml: 1 }}>Loading...</Typography>
                    </MenuItem>
                )}
            </Select>
            {error && <Typography color="error">{error}</Typography>}
        </>
    );
};
InfiniteSelectField.propTypes = {
    currentValue: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
    valueField: PropTypes.string,
    keyField: PropTypes.string
};

export default InfiniteSelectField;
