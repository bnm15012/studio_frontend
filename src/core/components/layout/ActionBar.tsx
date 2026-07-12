/** Action bar with search field, filter, QR code, refresh, and add buttons — the top toolbar for list views. */
import React, { useState } from "react";
import { FlexBetween } from "./FlexBox";
import SearchField from "./SearchField";
import { usePageSearch } from "../../hooks/useSearch";
import RefreshIcon from "@mui/icons-material/Refresh";
import QrForm from "../forms/QrForm";
import { Box, IconButton, Slide, Tooltip, useTheme } from "@mui/material";
import { Add, Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUI } from "@/context/UIContext";
import { FilterOption } from "../fields/Filter";
import { QrFormProps } from "../forms/QrForm";
import { iconBtnFilledSx, iconBtnSx } from "./ActionButtonStyle";
import ColumnVisibilityButton from "./ColumnVisibilityButton";
import { ColumnVisibilityButtonProps } from "./columnVisibilityHelper";

interface CrudApi {
    current?: {
        refreshData?: () => void;
        addNewRow?: () => void;
    } | null;
}

export interface ActionBarProps {
    filterOptions?: FilterOption[];
    handleFilterKeys?: (keys: Record<string, string>) => void;
    search?: boolean;
    qrProps?: QrFormProps;
    api?: CrudApi;
    columnVisibility?: Omit<ColumnVisibilityButtonProps, "fields"> & {
        fields: ColumnVisibilityButtonProps["fields"];
    };
    tableName?: string;
    addBtnText?: string;
    add?: boolean;
    refresh?: boolean;
    children?: React.ReactNode;
}

const ActionBar: React.FC<ActionBarProps> = ({
    filterOptions,
    handleFilterKeys,
    search = true,
    qrProps,
    api,
    tableName,
    addBtnText,
    add = true,
    refresh = true,
    columnVisibility,
    children,
}) => {
    const navigate = useNavigate();
    const { triggerSearch } = usePageSearch();
    const { isMobile } = useUI();
    const theme = useTheme();
    const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);

    // Mobile: full-width search overlay
    if (isMobile && mobileSearchOpen && search) {
        return (
            <FlexBetween gap={1} sx={{ height: "3rem", alignItems: "center" }}>
                <Slide direction="left" in={mobileSearchOpen} mountOnEnter unmountOnExit>
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}>
                        <SearchField
                            handleSearch={triggerSearch}
                            filterOptions={filterOptions}
                            handleFilterKeys={handleFilterKeys}
                        />
                        <Tooltip title="Close search">
                            <IconButton
                                onClick={() => setMobileSearchOpen(false)}
                                sx={{
                                    ...iconBtnSx,
                                    color: "white",
                                    backgroundColor: theme.palette.error.main,
                                }}
                            >
                                <CloseIcon sx={{ fontSize: "1.25rem" }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Slide>
            </FlexBetween>
        );
    }

    return (
        <FlexBetween gap={1} sx={{ height: "3rem", alignItems: "center" }}>
            {/* ── Left: search field (desktop) or spacer ── */}
            {search && !isMobile ? (
                <SearchField
                    handleSearch={triggerSearch}
                    filterOptions={filterOptions}
                    handleFilterKeys={handleFilterKeys}
                />
            ) : (
                <Box sx={{ flexGrow: 1 }} />
            )}

            {/* ── Right: action buttons ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                {qrProps && <QrForm {...qrProps} />}

                {api && refresh && (
                    <Tooltip title="Refresh">
                        <IconButton
                            onClick={() => api.current?.refreshData?.()}
                            sx={iconBtnFilledSx}
                        >
                            <RefreshIcon sx={{ fontSize: "1.25rem" }} />
                        </IconButton>
                    </Tooltip>
                )}

                {api && add && (
                    <Tooltip title={addBtnText ?? "Add"}>
                        <IconButton
                            onClick={() => {
                                if (tableName) {
                                    navigate(`/management/${tableName}/NEW`);
                                } else {
                                    api.current?.addNewRow?.();
                                }
                            }}
                            sx={iconBtnFilledSx}
                        >
                            <Add sx={{ fontSize: "1.25rem" }} />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Mobile search toggle */}
                {isMobile && search && (
                    <Tooltip title="Search">
                        <IconButton onClick={() => setMobileSearchOpen(true)} sx={iconBtnFilledSx}>
                            <SearchIcon sx={{ fontSize: "1.25rem" }} />
                        </IconButton>
                    </Tooltip>
                )}

                {children}
                {columnVisibility && columnVisibility.currentView === "LIST" && (
                    <ColumnVisibilityButton {...columnVisibility} />
                )}
            </Box>
        </FlexBetween>
    );
};

export default ActionBar;
