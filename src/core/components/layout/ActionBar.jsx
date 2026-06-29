import { FlexBetween } from "./FlexBox";
import SearchField from "./SearchField";
import { usePageSearch } from "../../../hooks/useSearch";
import RefreshIcon from "@mui/icons-material/Refresh";
import QrForm from "../../../Components/QrForm";
import { Box, Button, IconButton, Slide } from "@mui/material";
import { Add, Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import { useUI } from "../../../context/UIContext";

const ActionBar = ({
    filterOptions,
    handleFilterKeys,
    search = true,
    qrProps,
    api,
    tableName,
    addBtnText,
    add = true,
    refresh = true,
    children,
}) => {
    const navigate = useNavigate();
    const { triggerSearch } = usePageSearch();
    const { isMobile } = useUI();
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const getButtonSx = (hasText = false) => ({
        height: "3.3rem",
        width: isMobile || !hasText ? "3.3rem" : "auto",
        minWidth: "3.3rem",
        borderRadius: "12px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        p: isMobile || !hasText ? 0 : "0 1.2rem",
        fontWeight: "bold",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        textTransform: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        gap: 1,
    });

    // Mobile: full-width search overlay
    if (isMobile && mobileSearchOpen && search) {
        return (
            <FlexBetween paddingBottom={2} gap={1} height={"4rem"}>
                <Slide direction="left" in={mobileSearchOpen} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            gap: 1,
                        }}
                    >
                        <SearchField
                            handleSearch={triggerSearch}
                            filterOptions={filterOptions}
                            handleFilterKeys={handleFilterKeys}
                        />
                        <IconButton
                            onClick={() => setMobileSearchOpen(false)}
                            sx={{
                                color: "text.primary",
                                flexShrink: 0,
                                width: "3.3rem",
                                height: "3.3rem",
                                borderRadius: "12px",
                                transition: "all 0.2s",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: "1.4rem" }} />
                        </IconButton>
                    </Box>
                </Slide>
            </FlexBetween>
        );
    }

    return (
        <FlexBetween paddingBottom={2} gap={1.5} height={"4rem"}>
            {search ? (
                isMobile ? (
                    // Mobile: show search icon button instead of full search field
                    <Box flexGrow={1} />
                ) : (
                    <SearchField
                        handleSearch={triggerSearch}
                        filterOptions={filterOptions}
                        handleFilterKeys={handleFilterKeys}
                    />
                )
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
                            sx={getButtonSx(false)}
                        >
                            <RefreshIcon sx={{ fontSize: "1.4rem" }} />
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
                            sx={getButtonSx(!!addBtnText)}
                        >
                            <Add sx={{ fontSize: "1.4rem" }} />
                            {!isMobile && addBtnText && <span>{addBtnText}</span>}
                        </Button>
                    )}{" "}
                </>
            )}
            {isMobile && search && (
                <Button
                    onClick={() => setMobileSearchOpen(true)}
                    variant="contained"
                    color="primary"
                    sx={getButtonSx(false)}
                >
                    <SearchIcon sx={{ fontSize: "1.4rem" }} />
                </Button>
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
    addBtnText: PropTypes.string,
    handleFilterKeys: PropTypes.func,
    qrProps: PropTypes.object,
    api: PropTypes.shape({
        current: PropTypes.object,
    }),
};
export default ActionBar;
