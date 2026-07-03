import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError("All fields are required.");
            return;
        }
        setError(null);
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 4,
                borderRadius: 2,
                maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            <Typography 
                variant="h4" 
                sx={{ 
                    textAlign: "center", 
                    mb: 4,
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.75rem",
                }}
            >
                Send Us a Message
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    icon={<ErrorOutlineIcon />}
                    sx={{ 
                        mb: 2,
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#ffffff",
                        "& .MuiAlert-icon": {
                            color: "#EF4444",
                        },
                    }}
                    action={
                        <IconButton size="small" onClick={() => setError(null)} sx={{ color: "#ffffff" }}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            )}

            {submitted && (
                <Alert
                    severity="success"
                    icon={<CheckCircleOutlineIcon />}
                    sx={{ 
                        mb: 2,
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        color: "#ffffff",
                        "& .MuiAlert-icon": {
                            color: "#10B981",
                        },
                    }}
                    action={
                        <IconButton size="small" onClick={() => setSubmitted(false)} sx={{ color: "#ffffff" }}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    Message sent successfully!
                </Alert>
            )}

            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                    sx: { color: "rgba(255, 255, 255, 0.7)" },
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "8px",
                        "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#8B5CF6",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "#ffffff",
                    },
                }}
            />
            <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                type="email"
                variant="outlined"
                InputLabelProps={{
                    sx: { color: "rgba(255, 255, 255, 0.7)" },
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "8px",
                        "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#8B5CF6",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "#ffffff",
                    },
                }}
            />
            <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                required
                variant="outlined"
                InputLabelProps={{
                    sx: { color: "rgba(255, 255, 255, 0.7)" },
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "8px",
                        "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#8B5CF6",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "#ffffff",
                    },
                }}
            />

            <Button
                type="submit"
                variant="contained"
                sx={{
                    mt: 3,
                    p: 1.5,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)",
                    },
                }}
                endIcon={<SendIcon />}
                fullWidth
            >
                Submit
            </Button>
        </Box>
    );
};

export default ContactForm;
