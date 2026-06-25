import {
    Box,
    Typography,
    Container,
    TextField,
    Button,
    IconButton,
    Link,
    Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";
import ImageComponent from "./ImageComponent";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    return (
        <Box
            component="footer"
            id="contact"
            sx={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative Elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 384,
                    height: 384,
                    background:
                        "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(-50%, -50%)",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 384,
                    height: 384,
                    background:
                        "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(50%, 50%)",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Main Footer Content */}
                <Box sx={{ padding: "2rem 0" }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr 1fr 1fr" },
                            gap: 4,
                            alignItems: "flex-start",
                        }}
                    >
                        {/* Company Info */}
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "48px",
                                    mb: 3,
                                }}
                            >
                                <ImageComponent
                                    size={"48px"}
                                    value={"/logo.png"}
                                    isCircular={false}
                                    sx={{ flexShrink: 0 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "white",
                                        lineHeight: "48px",
                                        ml: 1.5,
                                    }}
                                >
                                    Book & Manage
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    lineHeight: 1.6,
                                    mb: 3,
                                }}
                            >
                                The comprehensive studio management platform that helps you
                                streamline operations, enhance client experience, and grow your
                                business.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton
                                    href="https://www.facebook.com/"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        "&:hover": {
                                            color: "primary.main",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <FacebookIcon />
                                </IconButton>
                                <IconButton
                                    href="https://x.com"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        "&:hover": {
                                            color: "primary.main",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <XIcon />
                                </IconButton>
                                <IconButton
                                    href="https://www.instagram.com/book_and_manage"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        "&:hover": {
                                            color: "primary.main",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <InstagramIcon />
                                </IconButton>
                                <IconButton
                                    href="https://wa.me/+917326027500"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        "&:hover": {
                                            color: "primary.main",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <WhatsAppIcon />
                                </IconButton>
                                <IconButton
                                    href="https://www.linkedin.com/company/book-manage/"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        "&:hover": {
                                            color: "primary.main",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Quick Links */}
                        <Box>
                            <Box
                                sx={{
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "white",
                                        lineHeight: "48px",
                                    }}
                                >
                                    Quick Links
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {["Home", "Features", "Pricing", "Testimonials"].map((item) => {
                                    const sectionId = item === "Home" ? "" : item.toLowerCase();
                                    return (
                                        <Link
                                            key={item}
                                            href={`#${sectionId}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (sectionId) {
                                                    const element =
                                                        document.getElementById(sectionId);
                                                    if (element) {
                                                        element.scrollIntoView({
                                                            behavior: "smooth",
                                                        });
                                                    }
                                                } else {
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }
                                            }}
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                textDecoration: "none",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            {item}
                                        </Link>
                                    );
                                })}
                            </Box>
                        </Box>

                        {/* Support */}
                        <Box>
                            <Box
                                sx={{
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "white",
                                        lineHeight: "48px",
                                    }}
                                >
                                    Support
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {[
                                    "Contact Us",
                                    "System Status",
                                    "Training Resources",
                                    "Community Forum",
                                ].map((item) => {
                                    const isNonActionable = [
                                        "System Status",
                                        "Training Resources",
                                        "Community Forum",
                                    ].includes(item);

                                    return (
                                        <Link
                                            key={item}
                                            href={isNonActionable ? "#" : "/contactus"}
                                            onClick={(e) => {
                                                if (isNonActionable) {
                                                    e.preventDefault();
                                                } else {
                                                    // Let the default navigation handle it
                                                }
                                            }}
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                textDecoration: "none",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            {item}
                                        </Link>
                                    );
                                })}
                            </Box>
                        </Box>

                        {/* Newsletter */}
                        <Box>
                            <Box
                                sx={{
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "white",
                                        lineHeight: "48px",
                                    }}
                                >
                                    Stay Updated
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 3 }}
                            >
                                Get the latest updates, tips, and insights delivered to your inbox.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                <TextField
                                    placeholder="Enter your email"
                                    type="email"
                                    size="small"
                                    sx={{
                                        flex: 1,
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            color: "white",
                                            "& fieldset": {
                                                borderColor: "rgba(255, 255, 255, 0.3)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "rgba(255, 255, 255, 0.5)",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "primary.main",
                                            },
                                        },
                                        "& .MuiOutlinedInput-input::placeholder": {
                                            color: "rgba(255, 255, 255, 0.7)",
                                            opacity: 1,
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        minWidth: "auto",
                                        px: 2,
                                        background:
                                            "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                    }}
                                >
                                    <ArrowForwardIcon />
                                </Button>
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                                By subscribing, you agree to our Privacy Policy and consent to
                                receive updates.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Contact Info */}
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
                <Box sx={{ py: 4 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                            gap: 3,
                        }}
                    >
                        {/* 89, 2nd Cross Road, Kaverappa Layout, */}
                        {[
                            { icon: EmailIcon, title: "Email", content: "bookandmanage@gmail.com" },
                            { icon: PhoneIcon, title: "Phone", content: "+91 73260 27500" },
                            {
                                icon: LocationOnIcon,
                                title: "Office",
                                content: "Bangalore, Karnataka 560103",
                            },
                        ].map((contact, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2,
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 2,
                                    transition: "background-color 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1,
                                        background:
                                            "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                        borderRadius: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <contact.icon sx={{ color: "white", fontSize: "1.25rem" }} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 500, color: "white" }}
                                    >
                                        {contact.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                    >
                                        {contact.content}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Bottom Footer */}
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
                <Box
                    sx={{
                        py: 3,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        © {currentYear} Book & Manage. All rights reserved.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3 }}>
                        {[
                            "Privacy Policy",
                            "Terms and Condition",
                            "Cancellation Refund Policy",
                        ].map((item) => (
                            <Link
                                key={item}
                                onClick={() => {
                                    navigate(`/${item.toLowerCase().replaceAll(" ", "-")}`);
                                }}
                                sx={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    textDecoration: "none",
                                    fontSize: "0.875rem",
                                    "&:hover": {
                                        color: "white",
                                    },
                                    cursor: "pointer",
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
