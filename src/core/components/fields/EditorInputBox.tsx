/**
 * TemplateEditor — textarea with smart `{{variable}}` autocomplete.
 *
 * Suggestions appear at the exact caret position when:
 *  - the user types `{{` (or `{{partial`)
 *  - the cursor clicks/moves into an existing `{{token}}`
 *
 * Navigation: ↑/↓ to move, Enter/Tab to insert, Escape to close.
 */
import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Box, MenuItem, Popper, Paper, TextField, Typography } from "@mui/material";
import { TemplateVariables } from "@/core/types";

// ── Caret pixel position via mirror-div technique ────────────────────────────

const MIRROR_CSS_PROPS = [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontWeight",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "letterSpacing",
    "wordSpacing",
    "textAlign",
    "textTransform",
    "textIndent",
    "whiteSpace",
    "wordBreak",
    "overflowWrap",
] as const;

function getCaretPixelPos(el: HTMLTextAreaElement, pos: number): { top: number; left: number } {
    const cs = getComputedStyle(el);
    const mirror = document.createElement("div");

    // Position off-screen but still measurable
    Object.assign(mirror.style, {
        position: "absolute",
        visibility: "hidden",
        top: "-9999px",
        left: "-9999px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
    });
    MIRROR_CSS_PROPS.forEach((p) => {
        mirror.style[p] = cs[p as keyof CSSStyleDeclaration] as string;
    });

    // Text before cursor + zero-width marker span
    mirror.textContent = el.value.slice(0, pos);
    const marker = document.createElement("span");
    marker.textContent = "\u200b"; // zero-width space
    mirror.appendChild(marker);
    document.body.appendChild(mirror);

    const elRect = el.getBoundingClientRect();
    const lineH = parseInt(cs.lineHeight || "18", 10);

    // marker.offsetTop is relative to mirror div origin
    const result = {
        top: elRect.top + marker.offsetTop - el.scrollTop + lineH,
        left: elRect.left + marker.offsetLeft - el.scrollLeft,
    };

    document.body.removeChild(mirror);
    return result;
}

// ── Variable helpers ─────────────────────────────────────────────────────────

interface Token {
    key: string; // e.g. "student_name"   → inserted as {{student_name}}
    label: string; // e.g. "Student Name"   → shown as hint
}

function flattenVariables(obj: TemplateVariables, prefix = ""): Token[] {
    return Object.entries(obj).flatMap(([k, v]) =>
        typeof v === "object" && v !== null
            ? flattenVariables(v as TemplateVariables, `${prefix}${k}_`)
            : [{ key: `${prefix}${k}`, label: String(v) }],
    );
}

/**
 * If the cursor is just after `{{` or `{{partial`, return the partial string.
 * e.g. "Hello {{stu" at cursor 11 → "stu"
 */
function getPartialToken(text: string, cursor: number): string | null {
    const m = text.slice(0, cursor).match(/{{\w*$/);
    return m ? m[0].slice(2) : null;
}

/**
 * If the cursor sits inside a complete `{{token}}`, return { token, start, end }.
 */
function getCompleteTokenUnderCursor(
    text: string,
    cursor: number,
): { token: string; start: number; end: number } | null {
    const re = /{{(\w+)}}/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const start = m.index;
        const end = start + m[0].length;
        if (start <= cursor && cursor <= end) {
            return { token: m[1]!, start, end };
        }
    }
    return null;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TemplateEditorProps {
    value: string;
    setValue: (val: string) => void;
    /** Nested or flat map whose leaf values are human-readable labels. */
    variables?: TemplateVariables | undefined;
    rows?: number | undefined;
    label?: string | undefined;
    /** When true, tokens whose key contains "Activity_" are hidden. */
    disableVars?: boolean | undefined;
}

// ── Component ─────────────────────────────────────────────────────────────────

const EditorInputBox: React.FC<TemplateEditorProps> = ({
    value,
    setValue,
    variables,
    rows = 1,
    label = "Enter Text",
    disableVars = false,
}) => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const [caretPos, setCaretPos] = useState<{ top: number; left: number } | null>(null);
    const textRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    const allTokens = useMemo(() => (variables ? flattenVariables(variables) : []), [variables]);

    const filteredTokens = useMemo(
        () =>
            allTokens
                .filter((t) => (disableVars ? !t.key.includes("Activity_") : true))
                .filter(
                    (t) =>
                        filter === "" ||
                        t.key.toLowerCase().includes(filter.toLowerCase()) ||
                        t.label.toLowerCase().includes(filter.toLowerCase()),
                ),
        [allTokens, disableVars, filter],
    );

    // Reset highlighted row when list changes
    useEffect(() => setActiveIdx(0), [filteredTokens.length]);

    // Scroll active item into view inside the Popper list
    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.children[activeIdx]?.scrollIntoView({ block: "nearest" });
    }, [activeIdx]);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const evaluateCursor = useCallback((el: HTMLTextAreaElement) => {
        const cursor = el.selectionStart ?? 0;
        const text = el.value;

        // Actively typing {{partial
        const partial = getPartialToken(text, cursor);
        if (partial !== null) {
            setCaretPos(getCaretPixelPos(el, cursor));
            setFilter(partial);
            setOpen(true);
            return;
        }

        // Cursor inside an existing {{token}}
        const existing = getCompleteTokenUnderCursor(text, cursor);
        if (existing) {
            setCaretPos(getCaretPixelPos(el, existing.start));
            setFilter(existing.token);
            setOpen(true);
            return;
        }

        setOpen(false);
        setFilter("");
    }, []);

    const commitToken = useCallback(
        (token: string) => {
            const el = textRef.current as HTMLTextAreaElement | null;
            if (!el) return;

            const cursor = el.selectionStart ?? 0;
            const text = el.value;
            let newValue: string;
            let newCursor: number;

            // Replace partial `{{xxx` before cursor
            const partial = getPartialToken(text, cursor);
            if (partial !== null) {
                const before = text.slice(0, cursor).replace(/{{\w*$/, `{{${token}}}`);
                newValue = before + text.slice(cursor);
                newCursor = before.length;
            } else {
                // Replace complete `{{token}}` under cursor
                const existing = getCompleteTokenUnderCursor(text, cursor);
                if (existing) {
                    const replacement = `{{${token}}}`;
                    newValue =
                        text.slice(0, existing.start) + replacement + text.slice(existing.end);
                    newCursor = existing.start + replacement.length;
                } else {
                    return;
                }
            }

            setValue(newValue);
            setOpen(false);
            setFilter("");

            requestAnimationFrame(() => {
                el.focus();
                el.selectionStart = el.selectionEnd = newCursor;
            });
        },
        [setValue],
    );

    // ── Event handlers ─────────────────────────────────────────────────────────

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setValue(e.target.value);
            evaluateCursor(e.target as HTMLTextAreaElement);
        },
        [setValue, evaluateCursor],
    );

    const handleClick = useCallback(() => {
        const el = textRef.current as HTMLTextAreaElement | null;
        if (el) evaluateCursor(el);
    }, [evaluateCursor]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!open || filteredTokens.length === 0) return;
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIdx((i) => Math.min(i + 1, filteredTokens.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setActiveIdx((i) => Math.max(i - 1, 0));
                    break;
                case "Enter":
                case "Tab":
                    e.preventDefault();
                    commitToken(filteredTokens[activeIdx]?.key ?? "");
                    break;
                case "Escape":
                    e.preventDefault();
                    setOpen(false);
                    setFilter("");
                    break;
                default:
                    break;
            }
        },
        [open, filteredTokens, activeIdx, commitToken],
    );

    // Delay close so a menu-item click fires before blur
    const handleBlur = useCallback(() => setTimeout(() => setOpen(false), 150), []);

    // ── Virtual anchor at caret position ──────────────────────────────────────

    const virtualAnchor = useMemo(() => {
        if (!caretPos) return null;
        return {
            getBoundingClientRect: () =>
                DOMRect.fromRect({ x: caretPos.left, y: caretPos.top, width: 0, height: 0 }),
        };
    }, [caretPos]);

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <Box width="100%" onKeyDown={handleKeyDown}>
            <TextField
                inputRef={textRef}
                label={label}
                placeholder={`Type your ${label} here… use {{variable}} to insert`}
                multiline={rows > 1}
                {...(rows > 1 && { rows })}
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                onBlur={handleBlur}
                fullWidth
                size="small"
            />

            {variables && virtualAnchor && (
                <Popper
                    open={open && filteredTokens.length > 0}
                    anchorEl={virtualAnchor}
                    placement="bottom-start"
                    style={{ zIndex: 1400 }}
                    modifiers={[{ name: "flip", enabled: true }]}
                >
                    <Paper elevation={6} sx={{ maxHeight: 260, minWidth: 240, overflow: "auto" }}>
                        <Box ref={listRef} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                            {filteredTokens.map((token, idx) => (
                                <MenuItem
                                    key={token.key}
                                    component="li"
                                    dense
                                    selected={idx === activeIdx}
                                    onMouseDown={(e) => {
                                        // preventDefault stops the textarea losing focus (blur)
                                        // before this handler fires — eliminates the race condition
                                        e.preventDefault();
                                        commitToken(token.key);
                                    }}
                                    onMouseEnter={() => setActiveIdx(idx)}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        py: 0.75,
                                        px: 1.5,
                                    }}
                                >
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "primary.main",
                                        }}
                                    >
                                        {`{{${token.key}}}`}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        sx={{ fontSize: 11, color: "text.secondary" }}
                                    >
                                        {token.label}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Box>
                    </Paper>
                </Popper>
            )}
        </Box>
    );
};

export default EditorInputBox;
