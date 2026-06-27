import { Typography, Box, Stack, Divider, useTheme } from "@mui/material";
import Footer from "../../Components/Footer";
import { Navbar } from "../../NavigationComponets/Navbar/Navbar";
import { useEffect } from "react";

const PrivacyPolicyPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    const theme = useTheme();
    return (
        <>
            <Navbar />
            <Box sx={{ background: theme.palette.background.paper, p: 2, pt: 15 }}>
                <Stack spacing={3}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Privacy Policy
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        At Book & Manage, we are committed to protecting your privacy. This Privacy
                        Policy explains how we collect, use, disclose, and safeguard your
                        information when you visit our platform and use our services.
                    </Typography>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            1. Information We Collect
                        </Typography>
                        <Typography variant="body2">
                            We collect information from you when you register on our platform,
                            subscribe to our services, or contact us. The types of personal
                            information we collect include:
                            <ul>
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Payment information (if applicable)</li>
                                <li>Usage data (such as browsing behavior on our platform)</li>
                            </ul>
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            2. How We Use Your Information
                        </Typography>
                        <Typography variant="body2">
                            The information we collect is used for the following purposes:
                            <ul>
                                <li>To provide and personalize our services</li>
                                <li>To process payments</li>
                                <li>To improve our platform and services</li>
                                <li>To communicate with you, including CUSTOMr support</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            3. Data Security
                        </Typography>
                        <Typography variant="body2">
                            We implement a variety of security measures to maintain the safety of
                            your personal information. All sensitive data is transmitted through
                            secure socket layer (SSL) technology and stored in our encrypted
                            databases.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            4. Sharing of Information
                        </Typography>
                        <Typography variant="body2">
                            We do not sell, trade, or rent your personal information to third
                            parties. However, we may share your information with trusted third-party
                            service providers who assist in operating our platform and providing our
                            services, under strict confidentiality agreements.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            5. Cookies and Tracking Technologies
                        </Typography>
                        <Typography variant="body2">
                            We use cookies and similar tracking technologies to enhance your
                            experience on our platform, analyze site traffic, and improve our
                            services. You can control the use of cookies through your browser
                            settings.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            6. Your Rights and Choices
                        </Typography>
                        <Typography variant="body2">
                            You have the right to:
                            <ul>
                                <li>Access, correct, or delete your personal data</li>
                                <li>Withdraw consent for marketing communications</li>
                                <li>Request the restriction of processing in certain cases</li>
                            </ul>
                            To exercise these rights, please contact us at:{" "}
                            <a
                                href="mailto:bookandmanage@gmail.com"
                                style={{
                                    color: "inherit",
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                }}
                            >
                                bookandmanage@gmail.com
                            </a>
                            .
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            7. Changes to This Privacy Policy
                        </Typography>
                        <Typography variant="body2">
                            We may update this Privacy Policy from time to time to reflect changes
                            in our practices or legal requirements. When changes are made, we will
                            update the &quot;Effective Date&quot; at the bottom of this page.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            8. Contact Us
                        </Typography>
                        <Typography variant="body2">
                            If you have any questions about this Privacy Policy or our practices,
                            please contact us at: <br />
                            Email:{" "}
                            <a
                                href="mailto:bookandmanage@gmail.com"
                                style={{
                                    color: theme.palette.primary.main,
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                }}
                            >
                                bookandmanage@gmail.com
                            </a>{" "}
                            <br />
                            Phone:
                            <span style={{ color: theme.palette.primary.main }}>
                                +91 73260 27500
                            </span>
                        </Typography>
                    </Box>
                </Stack>
            </Box>
            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;
