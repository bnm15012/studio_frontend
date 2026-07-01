/**
 * FlexBox.tsx — Barrel re-export for all Flex layout primitives.
 *
 * Consolidates FlexBetween, FlexEvenly, FlexBetweenColumn, FlexEvenlyColumn
 * into a single import. Individual files remain for backwards compatibility.
 *
 * Usage:
 *   import { FlexBetween, FlexEvenly, FlexBetweenColumn, FlexEvenlyColumn } from "../FlexBox";
 */
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const commonProps = { display: "flex", position: "relative" };

export const FlexBetween = styled(Box)(commonProps, { justifyContent: "space-between" });

export const FlexEvenly = styled(Box)(commonProps, {
    justifyContent: "space-evenly",
    alignItems: "center",
});

export const FlexEvenlyColumn = styled(Box)(commonProps, {
    justifyContent: "space-evenly",
    flexDirection: "column",
    height: "100%",
});

export const FlexBetweenColumn = styled(Box)(commonProps, {
    justifyContent: "space-between",
    flexDirection: "column",
});
