import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

interface ScrollAnimationProps {
    children?: React.ReactNode;
    className?: string;
    delay?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
    children,
    className = "",
    delay = 0,
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("is-visible");
                        }, delay);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px",
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    return (
        <Box ref={ref} className={`fade-in-section ${className}`}>
            {children}
        </Box>
    );
};

export default ScrollAnimation;
