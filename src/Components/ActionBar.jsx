import FlexBetween from "./FlexBetween";
import SearchField from "./SearchField";
import { usePageSearch } from "../hooks/useSearch";
import RefreshIcon from "@mui/icons-material/Refresh";
import QrForm from "./QrForm";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ActionBar = ({
    filterOptions,
    search = true,
    qrProps,
    api,
    tableName,
    add = true,
    refresh = true,
    children,
}) => {
    const navigate = useNavigate();
    const { triggerSearch } = usePageSearch();
    return (
        <FlexBetween paddingBottom={2} gap={1} height={"5.5rem"}>
            {search ? (
                <SearchField handleSearch={triggerSearch} filterOptions={filterOptions} />
            ) : (
                <Box flexGrow={1} />
            )}
            {qrProps && <QrForm {...qrProps} />}
            {api && (
                <>
                    {refresh && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                api.current?.refreshData();
                            }}
                            sx={{ fontWeight: "bold", padding: ".8rem" }}
                        >
                            <RefreshIcon sx={{ padding: 0, margin: "auto" }} />
                        </Button>
                    )}
                    {add && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                tableName
                                    ? navigate(`/management/${tableName}/NEW`)
                                    : api.current?.addNewRow();
                            }}
                            sx={{ fontWeight: "bold", padding: ".8rem" }}
                        >
                            <Add sx={{ padding: 0, margin: "auto" }} />
                        </Button>
                    )}{" "}
                </>
            )}
            {children}
        </FlexBetween>
    );
};

ActionBar.propTypes = {
    tableName: PropTypes.string,
    filterOptions: PropTypes.object,
    add: PropTypes.bool,
    refresh: PropTypes.bool,
    search: PropTypes.bool,
    children: PropTypes.node,
    qrProps: PropTypes.object,
    api: PropTypes.shape({
        current: PropTypes.object,
    }),
};
export default ActionBar;
