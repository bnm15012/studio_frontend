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

const ContactUsPage: React.FC = () => {
    return (
        <Box
            sx={{
                background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
                pt: 10,
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative Elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(70px)",
                    animation: "float 10s ease-in-out infinite",
                    "@keyframes float": {
                        "0%, 100%": { transform: "translate(0, 0)" },
                        "50%": { transform: "translate(-20px, 20px)" },
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: -100,
                    left: -100,
                    width: 400,
                    height: 400,
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(70px)",
                    animation: "float 10s ease-in-out infinite reverse",
                }}
            />
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
                    elevation={0}
                    sx={{
                        p: 4,
                        maxWidth: "400px",
                        flexGrow: 1,
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 3,
                        animation: `${fadeIn} 0.6s ease-out`,
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                            background: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight={800} sx={{ color: "#ffffff", fontSize: "1.5rem" }}>
                        Contact Information
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    <Box display="flex" alignItems="center" mb={3}>
                        <EmailIcon sx={{ mr: 2, animation: `${pulse} 2s infinite`, color: "#a78bfa", fontSize: "1.5rem" }} />
                        <Typography variant="body1">
                            <Link
                                href="mailto:bookandmanage@gmail.com"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.9)",
                                    "&:hover": { color: "#a78bfa" },
                                    textDecoration: "none",
                                    fontWeight: 500,
                                }}
                            >
                                bookandmanage@gmail.com
                            </Link>
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={3}>
                        <PhoneIcon sx={{ mr: 2, animation: `${pulse} 2s infinite`, color: "#a78bfa", fontSize: "1.5rem" }} />
                        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>+91 73260 27500</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={3}>
                        <LocationOnIcon sx={{ mr: 2, animation: `${pulse} 2s infinite`, color: "#a78bfa", fontSize: "1.5rem" }} />
                        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>
                            Bangalore, Karnataka 560103
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: "#ffffff", fontSize: "1.25rem" }}>
                        Follow Us
                    </Typography>
                    <Box display="flex" gap={2}>
                        {[
                            {
                                href: "https://wa.me/+917326027500",
                                icon: <WhatsAppIcon />,
                                color: "#25D366",
                                bgColor: "rgba(37, 211, 102, 0.5)",
                            },
                            {
                                href: "https://www.linkedin.com/company/book-manage/",
                                icon: <LinkedInIcon />,
                                color: "#0A66C2",
                                bgColor: "rgba(10, 102, 194, 0.5)",
                            },
                            {
                                href: "https://www.facebook.com/",
                                icon: <FacebookIcon />,
                                color: "#1877F2",
                                bgColor: "rgba(24, 119, 242, 0.5)",
                            },
                        ].map(({ href, icon, color, bgColor }) => (
                            <Link href={href} target="_blank" rel="noopener" key={href}>
                                <IconButton
                                    sx={{
                                        bgcolor: bgColor,
                                        color: "#ffffff",
                                        border: "1px solid rgba(255, 255, 255, 0.4)",
                                        transition: "all 0.3s ease",
                                        fontSize: "1.5rem",
                                        "&:hover": {
                                            bgcolor: bgColor.replace("0.5", "0.7"),
                                            transform: "scale(1.15)",
                                            boxShadow: `0 0 20px ${color}40`,
                                            borderColor: color,
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
                    elevation={0}
                    sx={{
                        p: 4,
                        flexGrow: 2,
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 3,
                        animation: `${fadeIn} 0.6s ease-out 0.2s`,
                        animationFillMode: "backwards",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                            background: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight={800} sx={{ color: "#ffffff", fontSize: "1.5rem" }}>
                        Get in Touch
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    <Typography variant="body2" sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.7 }}>
                        Have questions or need assistance? Fill out the form below and our team will
                        get back to you within 24-48 hours.
                    </Typography>
                    <ContactForm />
                </Paper>

                {/* FAQ Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        flexGrow: 1,
                        maxWidth: "400px",
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 3,
                        animation: `${fadeIn} 0.6s ease-out 0.4s`,
                        animationFillMode: "backwards",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                            background: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight={800} sx={{ color: "#ffffff", fontSize: "1.5rem" }}>
                        Frequently Asked Questions
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />
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
                                background: "rgba(255, 255, 255, 0.05)",
                                mb: 2,
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px !important",
                                "&:before": {
                                    display: "none",
                                },
                                animation: `${fadeIn} 0.6s ease-out ${0.6 + index * 0.1}s`,
                                animationFillMode: "backwards",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(139, 92, 246, 0.1)",
                                    borderColor: "rgba(139, 92, 246, 0.3)",
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: "#a78bfa" }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                    },
                                }}
                            >
                                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>{question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.7 }}>
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
