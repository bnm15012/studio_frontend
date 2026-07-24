import React from "react";

/**
 * Full-screen branded overlay shown while auth state is being hydrated
 * (login, logout, or initial page load with a persisted token).
 *
 * Accepts a `show` prop so it can be driven by any parent — typically
 * `AppUIProvider` which gates on whether all required context values are ready.
 */
const AuthTransitionOverlay: React.FC = () => (
    <div
        style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
                "linear-gradient(135deg, rgb(20,5,30) 0%, rgb(37,10,49) 60%, rgb(55,15,75) 100%)",
        }}
    >
        {/* Glow ring behind logo */}
        <div style={{ position: "relative", width: 96, height: 96, marginBottom: 28 }}>
            <div style={glowRingStyle} />
            <img
                src="/logo.png"
                alt="Studio logo"
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "50%",
                    animation: "auth-pulse 1.6s ease-in-out infinite",
                }}
            />
        </div>

        {/* Ripple dots spinner */}
        <div style={dotsContainerStyle}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        ...dotStyle,
                        animationDelay: `${i * 0.18}s`,
                    }}
                />
            ))}
        </div>

        {/* Injected keyframes */}
        <style>{`
                @keyframes auth-pulse {
                    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(180,80,255,0.5)); }
                    50%       { transform: scale(1.07); filter: drop-shadow(0 0 22px rgba(180,80,255,0.9)); }
                }
                @keyframes auth-dot-bounce {
                    0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
                    40%           { transform: scale(1.1); opacity: 1; }
                }
            `}</style>
    </div>
);

const glowRingStyle: React.CSSProperties = {
    position: "absolute",
    inset: -8,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(180,80,255,0.25) 0%, transparent 70%)",
    animation: "auth-pulse 1.6s ease-in-out infinite",
};

const dotsContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: 10,
};

const dotStyle: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #b450ff, #7b2fff)",
    animation: "auth-dot-bounce 1.1s ease-in-out infinite",
};

export default AuthTransitionOverlay;
