import PropTypes from "prop-types";
import { TextField, Button, Box } from "@mui/material";
import styled from "@emotion/styled";
import { useState } from "react";
import FlexBetween from "./FlexBetween";

const StyledSearchField = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[7],
  backgroundColor: theme.palette.background.paper,
}));

const SearchField = ({ handleSearch, placeHolder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <StyledSearchField flexGrow={1}>
      <TextField
        label={placeHolder}
        variant="standard"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ marginRight: 2 }}
      />
      <FlexBetween gap={2}>
        {searchTerm &&
          <Button variant="contained" onClick={() => { setSearchTerm(""); handleSearch(null); }}>
            Clear
          </Button>}
        <Button variant="contained" onClick={() => handleSearch(searchTerm)}>
          Search
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
