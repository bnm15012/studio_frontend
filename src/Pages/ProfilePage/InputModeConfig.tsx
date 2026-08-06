import { alpha, Box, Chip, Typography, useTheme } from "@mui/material";
import { Mouse, Smartphone, AutoAwesome, CheckCircle } from "@mui/icons-material";
import { useAppUI } from "@/context/UIContext";

type OptionDef = {
    value: "auto" | "mouse" | "touch";
    icon: React.ReactNode;
    label: string;
    description: string;
};

const InputModeConfig = () => {
    const { inputMode, setInputMode, isTouchMode } = useAppUI();
    const theme = useTheme();

    const options: OptionDef[] = [
        {
            value: "auto",
            icon: <AutoAwesome />,
            label: "Auto-detect",
            description: "Follows your device's pointer type automatically.",
        },
        {
            value: "mouse",
            icon: <Mouse />,
            label: "Mouse",
            description: "Hover actions, right-click menus, inline edits.",
        },
        {
            value: "touch",
            icon: <Smartphone />,
            label: "Touch",
            description: "Tap cards to open, long-press for actions.",
        },
    ];

    return (
        <Box
            sx={{
                mt: 3,
                pt: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Input Mode
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Controls how cards &amp; rows behave — actions, click, and long-press.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 1.5,
                }}
            >
                {options.map((opt) => {
                    const isSelected = inputMode === opt.value;
                    const isAutoActive = opt.value === "auto";

                    return (
                        <Box
                            key={opt.value}
                            onClick={() => setInputMode(opt.value)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setInputMode(opt.value);
                            }}
                            sx={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.75,
                                p: 2,
                                borderRadius: 2,
                                cursor: "pointer",
                                border: `2px solid ${
                                    isSelected ? theme.palette.primary.main : theme.palette.divider
                                }`,
                                bgcolor: isSelected
                                    ? alpha(theme.palette.primary.main, 0.06)
                                    : "transparent",
                                transition: "all 0.18s ease",
                                "&:hover": {
                                    borderColor: theme.palette.primary.light,
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                },
                                "&:focus-visible": {
                                    outline: `2px solid ${theme.palette.primary.main}`,
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            {isSelected && (
                                <CheckCircle
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        fontSize: 18,
                                        color: "primary.main",
                                    }}
                                />
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    color: isSelected ? "primary.main" : "text.secondary",
                                }}
                            >
                                {opt.icon}
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    color={isSelected ? "primary.main" : "text.primary"}
                                >
                                    {opt.label}
                                </Typography>

                                {isAutoActive && (
                                    <Chip
                                        size="small"
                                        label={isTouchMode ? "Touch" : "Mouse"}
                                        icon={
                                            isTouchMode ? (
                                                <Smartphone sx={{ fontSize: "12px !important" }} />
                                            ) : (
                                                <Mouse sx={{ fontSize: "12px !important" }} />
                                            )
                                        }
                                        sx={{
                                            ml: "auto",
                                            height: 20,
                                            fontSize: "0.65rem",
                                            fontWeight: 600,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: "primary.main",
                                            "& .MuiChip-icon": { color: "primary.main" },
                                        }}
                                    />
                                )}
                            </Box>

                            <Typography variant="caption" color="text.secondary" lineHeight={1.4}>
                                {opt.description}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {inputMode !== "auto" && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1.25, display: "block" }}
                >
                    Manually overridden — takes effect immediately without a page reload.
                </Typography>
            )}
        </Box>
    );
};

export default InputModeConfig;
