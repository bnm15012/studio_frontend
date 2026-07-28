/** Styled search input field with search icon button and filter integration, with a slide-up animation. */
import React, { useEffect, useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SearchIcon } from "lucide-react";
import Filter from "@/core/components/fields/Filter";
import { FilterOption } from "@/core/components/fields/Filter";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { FilterKeys } from "@/core/types";

const StyledSearchField = styled(FlexBetween)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    gap: 10,
    margin: 0,
    padding: theme.spacing(0, 1, 0, 2),
    borderRadius: "12px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
}));

interface SearchFieldProps {
    handleSearch: (term: string, filterKeys: FilterKeys) => void;
    filterOptions?: FilterOption[];
    placeHolder?: string;
    handleFilterKeys?: (keys: FilterKeys) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
    handleSearch,
    filterOptions = [],
    placeHolder = "Search...",
    handleFilterKeys = () => {},
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterKeys, setFilterKeys] = useState<FilterKeys>({});

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
                        "& .MuiInputBase-root": { height: "1rem" },
                    }}
                />
                <IconButton
                    sx={{ ...iconBtnFilledSx, width: "2rem", height: "2rem" }}
                    onClick={() => handleSearch(searchTerm, filterKeys)}
                >
                    <SearchIcon size={18} />
                </IconButton>
            </StyledSearchField>
            {filterOptions.length > 0 && (
                <Filter
                    filterOptions={filterOptions}
                    onChange={(o: FilterKeys) => {
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
