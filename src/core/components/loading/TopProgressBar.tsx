import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

interface TopProgressBarProps {
    loading: boolean;
}

const TopProgressBar: React.FC<TopProgressBarProps> = ({ loading }) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);
    const [fading, setFading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        if (loading) {
            setFading(false);
            setVisible(true);
            setWidth(0);
            rafRef.current = requestAnimationFrame(() => {
                setWidth(70);
            });
        } else {
            setWidth(100);
            timerRef.current = setTimeout(() => {
                setFading(true);
                timerRef.current = setTimeout(() => {
                    setVisible(false);
                    setWidth(0);
                    setFading(false);
                }, 300);
            }, 200);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [loading]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                height: 3,
                background: alpha(theme.palette.primary.main, 0.12),
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${width}%`,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    transition: loading
                        ? "width 0.8s cubic-bezier(0.1, 0.2, 0.4, 1)"
                        : "width 0.2s ease-out",
                    opacity: fading ? 0 : 1,
                    borderRadius: "0 2px 2px 0",
                    boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`,
                }}
            />
        </div>
    );
};

export default TopProgressBar;
