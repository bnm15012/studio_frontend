import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
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
            <Typography variant="h4" color="primary" textAlign="center" gutterBottom>
                Send Us a Message
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    icon={<ErrorOutlineIcon />}
                    sx={{ mb: 2 }}
                    action={
                        <IconButton size="small" onClick={() => setError(null)}>
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
                    sx={{ mb: 2 }}
                    action={
                        <IconButton size="small" onClick={() => setSubmitted(false)}>
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
                    style: { color: "#333" },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
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
                    style: { color: "#333" },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
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
                    style: { color: "#333" },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    mt: 3,
                    p: 1.5,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
