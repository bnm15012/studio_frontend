import PropTypes from "prop-types";
import { TextField, Button, Box } from "@mui/material";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import FlexBetween from "./FlexBetween";
import { SearchIcon } from "lucide-react";
import { Close } from "@mui/icons-material";

const StyledSearchField = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40rem",
    height: "2.2rem",
    margin: "0.5rem 1rem",
    padding: theme.spacing(0, 2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.alt,
}));

const ButtonProps = {
    height: "2rem",
    width: "2rem",
    minWidth: "unset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 0,
};

const SearchField = ({ handleSearch, placeHolder = "Search..." }) => {
    const [searchTerm, setSearchTerm] = useState("");
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
        <StyledSearchField>
            <TextField
                placeholder={placeHolder}
                variant="standard"
                value={searchTerm}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{
                    "& .MuiInputBase-root": { height: "1.7rem" },
                    "& .MuiInputBase-input": { padding: 1 },
                }}
            />
            <FlexBetween gap={1} ml={2}>
                {searchTerm && (
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSearchTerm("");
                            handleSearch(null);
                        }}
                        sx={ButtonProps}
                    >
                        <Close />
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={() => handleSearch(searchTerm)}
                    sx={ButtonProps}
                >
                    <SearchIcon size={18} />
                </Button>
            </FlexBetween>
        </StyledSearchField>
    );
};

SearchField.propTypes = {
    placeHolder: PropTypes.string,
    handleSearch: PropTypes.func.isRequired,
};

export default SearchField;
