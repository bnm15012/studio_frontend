import React from "react";
import ContactForm from "./ContactForm";
import {
    Box,
    Typography,
    Link,
    IconButton,
    Paper,
    Divider,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    keyframes,
    useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Navbar } from "@/NavigationComponets/Navbar/Navbar";
import Footer from "../../Components/Footer";

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Define color gradients
const gradients = {
    contact: "rgb(249, 212, 152)",
    form: "linear-gradient(135deg, #aed581 0%, #7cb342 100%)",
    faq: "rgb(249, 212, 152)",
};

const ContactUsPage: React.FC = () => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                pt: 10,
                minHeight: "100vh",
            }}
        >
            <Navbar />
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ p: 2 }}
            >
                {/* Contact Information Section */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        maxWidth: "400px",
                        flexGrow: 1,
                        background: gradients.contact,
                        animation: `${fadeIn} 0.6s ease-out`,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-5px)",
                        },
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Contact Information
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                    <Box display="flex" alignItems="center" mb={2}>
                        <EmailIcon sx={{ mr: 1, animation: `${pulse} 2s infinite` }} />
                        <Typography variant="body1">
                            <Link
                                href="mailto:bookandmanage@gmail.com"
                                sx={{
                                    color: "black",
                                    "&:hover": { color: "blue" },
                                    textDecoration: "none",
                                }}
                            >
                                bookandmanage@gmail.com
                            </Link>
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <PhoneIcon sx={{ mr: 1, animation: `${pulse} 2s infinite` }} />
                        <Typography variant="body1">+91 73260 27500</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <LocationOnIcon sx={{ mr: 1, animation: `${pulse} 2s infinite` }} />
                        <Typography variant="body1">
                            Bangalore, Karnataka 560103
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Follow Us
                    </Typography>
                    <Box display="flex" gap={1}>
                        {[
                            {
                                href: "https://wa.me/+917326027500",
                                icon: <WhatsAppIcon />,
                                color: "#25D366",
                            },
                            {
                                href: "https://www.linkedin.com/company/book-manage/",
                                icon: <LinkedInIcon />,
                                color: "#0A66C2",
                            },
                            {
                                href: "https://www.facebook.com/",
                                icon: <FacebookIcon />,
                                color: "#1877F2",
                            },
                        ].map(({ href, icon, color }) => (
                            <Link href={href} target="_blank" rel="noopener" key={href}>
                                <IconButton
                                    sx={{
                                        bgcolor: "rgba(255, 255, 255, 0.2)",
                                        color: color,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            bgcolor: "white",
                                            transform: "scale(1.1)",
                                        },
                                    }}
                                >
                                    {icon}
                                </IconButton>
                            </Link>
                        ))}
                    </Box>
                </Paper>

                {/* Contact Form Section */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        flexGrow: 2,
                        backgroundColor: "#f5f5f5",
                        animation: `${fadeIn} 0.6s ease-out 0.2s`,
                        animationFillMode: "backwards",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-5px)",
                        },
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Get in Touch
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Have questions or need assistance? Fill out the form below and our team will
                        get back to you within 24-48 hours.
                    </Typography>
                    <ContactForm />
                </Paper>

                {/* FAQ Section */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        flexGrow: 1,
                        maxWidth: "400px",
                        background: gradients.faq,
                        animation: `${fadeIn} 0.6s ease-out 0.4s`,
                        animationFillMode: "backwards",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-5px)",
                        },
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Frequently Asked Questions
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                    {[
                        {
                            question: "What services do you offer?",
                            answer: "We provide booking and management solutions tailored for businesses of all sizes.",
                        },
                        {
                            question: "How can I reset my account password?",
                            answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
                        },
                        {
                            question: "Do you offer support for multiple languages?",
                            answer: "Yes, our platform supports multiple languages to cater to diverse user needs.",
                        },
                    ].map(({ question, answer }, index) => (
                        <Accordion
                            key={question}
                            sx={{
                                background: "rgba(255, 255, 255, 0.1)",
                                mb: 1,
                                "&:before": {
                                    display: "none",
                                },
                                animation: `${fadeIn} 0.6s ease-out ${0.6 + index * 0.1}s`,
                                animationFillMode: "backwards",
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                <Typography variant="body1">{question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">{answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>
            </Stack>
            <Footer />
        </Box>
    );
};

export default ContactUsPage;
