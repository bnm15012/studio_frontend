/**
 * Global React Error Boundary:
 * Catches unhandled React render errors that would otherwise crash the UI and cause a blank screen.
 * Displays an error dialog with the complete component stack trace and a "Copy Error" button.
 */
import React from "react";
import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Check from "@mui/icons-material/Check";

interface ErrorTrace {
    message: string;
    stack: string;
}

interface ErrorBoundaryState {
    renderError: boolean;
    trace: ErrorTrace | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

const buildTrace = (error: Error, componentStack?: string | null): ErrorTrace => {
    const message = error?.message || String(error || "Unknown error");
    const stack = error?.stack ? `\n${error.stack}` : "";
    return {
        message,
        stack: `${componentStack ? `\nComponent Stack:\n${componentStack}` : ""}${stack}`,
    };
};

const formatTrace = (trace: ErrorTrace): string =>
    `Error: ${trace.message}\n\nStack trace:\n${trace.stack || "(no stack trace available)"}`;

interface ErrorDialogProps {
    trace: ErrorTrace;
    onReload: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ trace, onReload }) => {
    const [copied, setCopied] = React.useState(false);
    const text = formatTrace(trace);

    const handleCopy = () => {
        const copy = () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(copy).catch(copy);
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            copy();
        }
    };

    return (
        <Dialog open fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "white",
                    background: (theme) => theme.palette.error.dark,
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Application Error
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography color="text.secondary" sx={{ mb: 1, mt: 1 }}>
                    Something unexpected caused the application to stop rendering. Copy the error
                    details below to share:
                </Typography>
                <Box
                    component="pre"
                    sx={{
                        p: 1.5,
                        borderRadius: 1,
                        overflow: "auto",
                        maxHeight: 320,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        bgcolor: "action.hover",
                    }}
                >
                    {text}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 2, pb: 2, justifyContent: "center", gap: 1.5 }}>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={copied ? <Check /> : <ContentCopy />}
                    onClick={handleCopy}
                >
                    {copied ? "Copied!" : "Copy Error"}
                </Button>
                <Button variant="outlined" color="error" onClick={onReload}>
                    Reload App
                </Button>
            </DialogActions>
        </Dialog>
    );
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { renderError: false, trace: null };

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { renderError: true, trace: buildTrace(error) };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        this.setState({ trace: buildTrace(error, info.componentStack) });
    }

    private handleReload = () => {
        window.location.reload();
    };

    render() {
        const { renderError, trace } = this.state;
        if (renderError && trace) {
            return <ErrorDialog trace={trace} onReload={this.handleReload} />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
