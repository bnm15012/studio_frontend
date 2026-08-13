const BTN_SIZE = "2.5rem";

export const iconBtnSx = {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: "10px",
    flexShrink: 0,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
    },
} as const;

export const iconBtnFilledSx = {
    ...iconBtnSx,
    bgcolor: "primary.main",
    color: "primary.contrastText",
    "&:hover": {
        ...iconBtnSx["&:hover"],
        bgcolor: "primary.dark",
    },
} as const;
