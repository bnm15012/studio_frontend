import PropTypes from "prop-types";
import { TextField, Button, Box } from "@mui/material";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { FlexBetween } from "./FlexBox";
import { SearchIcon } from "lucide-react";
import Filter from "../fields/Filter";

const StyledSearchField = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    margin: 0,
    padding: theme.spacing(0, 2),
    borderRadius: "12px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
}));

const ButtonProps = {
    height: "3.3rem",
    width: "3.3rem",
    minWidth: "unset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 0,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
};

const SearchField = ({
    handleSearch,
    filterOptions = [],
    placeHolder = "Search...",
    handleFilterKeys = () => {},
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterKeys, setFilterKeys] = useState({});

    useEffect(() => {
        const handleKey = (e) => {
            if ((e.ctrlKey && e.key === "k") || e.key === "/") {
                e.preventDefault();
                document.getElementById("navbar-search")?.focus();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <>
            <StyledSearchField>
                <TextField
                    placeholder={placeHolder}
                    variant="standard"
                    value={searchTerm}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm, filterKeys)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{
                        "& .MuiInputBase-root": { height: "2rem" },
                        "& .MuiInputBase-input": { padding: 1 },
                    }}
                />
                <FlexBetween gap={1} ml={2}>
                    {/* {searchTerm && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                setSearchTerm("");
                                handleSearch(null, filterKeys);
                            }}
                            sx={ButtonProps}
                        >
                            <Close />
                        </Button>
                    )} */}
                    <Button
                        variant="contained"
                        onClick={() => handleSearch(searchTerm, filterKeys)}
                        sx={ButtonProps}
                    >
                        <SearchIcon size={18} />
                    </Button>
                </FlexBetween>
            </StyledSearchField>
            {filterOptions.length > 0 && (
                <Filter
                    filterOptions={filterOptions}
                    onChange={(o) => {
                        setFilterKeys(o);
                        handleFilterKeys(o);
                        handleSearch(searchTerm, o);
                    }}
                />
            )}
        </>
    );
};

SearchField.propTypes = {
    placeHolder: PropTypes.string,
    handleSearch: PropTypes.func.isRequired,
    filterOptions: PropTypes.array,
    handleFilterKeys: PropTypes.func,
};

export default SearchField;
