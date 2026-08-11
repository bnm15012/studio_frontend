/** Global error boundary: catches React render errors plus uncaught errors and unhandled promise rejections, then shows a dialog with a "Copy Error" button that copies the full traceback to the clipboard. */
import React from "react";
import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";

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

const buildTrace = (error: Error, extra?: string | null): ErrorTrace => {
    const message = error?.message || String(error || "Unknown error");
    const stack = error?.stack ? `\n${error.stack}` : "";
    return { message, stack: `${extra ? `\n${extra}` : ""}${stack}` };
};

const formatTrace = (trace: ErrorTrace): string =>
    `Error: ${trace.message}\n\nStack trace:\n${trace.stack || "(no stack trace available)"}`;

interface ErrorDialogProps {
    trace: ErrorTrace;
    renderError: boolean;
    onClose: () => void;
    onReload: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ trace, renderError, onClose, onReload }) => {
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
        <Dialog
            open
            fullWidth
            maxWidth="md"
            onClose={renderError ? undefined : onClose}
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
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
                    Unexpected Error
                </Typography>
                {!renderError && (
                    <IconButton aria-label="close" onClick={onClose} sx={{ color: "white" }}>
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                    Something went wrong. Copy the error details below and share them to help fix
                    the issue.
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
            <DialogActions sx={{ px: 2, pb: 2, justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={copied ? <Check /> : <ContentCopy />}
                    onClick={handleCopy}
                >
                    {copied ? "Copied!" : "Copy Error"}
                </Button>
                {renderError && (
                    <Button variant="outlined" color="error" onClick={onReload}>
                        Reload App
                    </Button>
                )}
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

    componentDidMount() {
        window.addEventListener("error", this.handleWindowError);
        window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
    }

    componentWillUnmount() {
        window.removeEventListener("error", this.handleWindowError);
        window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
    }

    private handleWindowError = (event: ErrorEvent) => {
        event.preventDefault();
        this.showTrace(
            event.error instanceof Error
                ? event.error
                : new Error(event.message || `Uncaught error at ${event.filename}:${event.lineno}`),
        );
    };

    private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        event.preventDefault();
        const reason = event.reason;
        this.showTrace(reason instanceof Error ? reason : new Error(String(reason)));
    };

    private showTrace = (error: Error) => {
        this.setState({ trace: buildTrace(error) });
    };

    private handleClose = () => {
        this.setState({ trace: null });
    };

    private handleReload = () => {
        window.location.reload();
    };

    render() {
        const { renderError, trace } = this.state;
        if (renderError) {
            return (
                <ErrorDialog
                    trace={trace!}
                    renderError
                    onClose={this.handleClose}
                    onReload={this.handleReload}
                />
            );
        }
        return (
            <>
                {this.props.children}
                {trace && (
                    <ErrorDialog
                        trace={trace}
                        renderError={false}
                        onClose={this.handleClose}
                        onReload={this.handleReload}
                    />
                )}
            </>
        );
    }
}

export default ErrorBoundary;
