/** Compact icon + value chip for displaying dates or string values with an associated icon. */
import { Box, Typography, useTheme } from "@mui/material";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { CalendarMonth } from "@mui/icons-material";

/**
 * CardChip — Compact icon + value display row. No label by default.
 * Icons communicate the field type.
 */
interface CardChipProps {
    label?: string;
    value?: React.ReactNode;
    type?: "DATE" | "DATETIME" | "STR";
    ChipIcon?: React.ComponentType<Record<string, unknown>>;
}

const CardChip: React.FC<CardChipProps> = ({ value, type = "STR", ChipIcon = CalendarMonth }) => {
    const theme = useTheme();
    const displayValue =
        type === "STR" ? value || "-" : getLocalDateTime(value as string | null | undefined, type);

    return (
        <Box display="flex" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
            <ChipIcon
                sx={{ fontSize: "0.9375rem", color: theme.palette.text.secondary, flexShrink: 0 }}
            />
            <Typography
                sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 450,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1.4,
                }}
            >
                {displayValue}
            </Typography>
        </Box>
    );
};

export default CardChip;
