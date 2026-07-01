import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import styled from "@emotion/styled";
import { FlexBetween } from "./FlexBox";
import { SearchIcon } from "lucide-react";
import Filter from "../fields/Filter";

const StyledSearchField = styled(Box)(({ theme }: any) => ({
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

const buttonSx = {
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

interface SearchFieldProps {
    handleSearch: (term: string, filterKeys: Record<string, any>) => void;
    filterOptions?: any[];
    placeHolder?: string;
    handleFilterKeys?: (keys: Record<string, any>) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
    handleSearch,
    filterOptions = [],
    placeHolder = "Search...",
    handleFilterKeys = () => {},
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterKeys, setFilterKeys] = useState<Record<string, any>>({});

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
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
                    <Button
                        variant="contained"
                        onClick={() => handleSearch(searchTerm, filterKeys)}
                        sx={buttonSx}
                    >
                        <SearchIcon size={18} />
                    </Button>
                </FlexBetween>
            </StyledSearchField>
            {filterOptions.length > 0 && (
                <Filter
                    filterOptions={filterOptions}
                    onChange={(o: Record<string, any>) => {
                        setFilterKeys(o);
                        handleFilterKeys(o);
                        handleSearch(searchTerm, o);
                    }}
                />
            )}
        </>
    );
};

export default SearchField;
