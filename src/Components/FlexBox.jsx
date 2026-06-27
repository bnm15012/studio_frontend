/**
 * FlexBox.jsx — Barrel re-export for all Flex layout primitives.
 *
 * Consolidates FlexBetween, FlexEvenly, FlexBetweenColumn, FlexEvenlyColumn
 * into a single import. Individual files remain for backwards compatibility.
 *
 * Usage:
 *   import { FlexBetween, FlexEvenly, FlexBetweenColumn, FlexEvenlyColumn } from "../FlexBox";
 */

export { default as FlexBetween } from "./FlexBetween";
export { default as FlexBetweenColumn } from "./FlexBetweenColumn";
export { default as FlexEvenly } from "./FlexEvenly";
export { default as FlexEvenlyColumn } from "./FlexEvenlyColumn";
