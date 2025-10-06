import { Typography, Box, Stack, Divider, useTheme } from "@mui/material";
import { Navbar } from "../../NavigationComponets/Navbar/Navbar";
import { useEffect } from "react";
import Footer from "../../Components/Footer";

const TermsConditionPage = () => {
    const theme = useTheme();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return (
        <>
            <Navbar />
            <Box sx={{ background: theme.palette.background.paper, p: 2, pt: 15 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Terms & Conditions
                </Typography>
                <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                <Stack spacing={3}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Welcome to Book & Manage! These terms and conditions outline the rules and
                        regulations for the use of our software platform. By accessing or using our
                        services, you agree to be bound by the following terms and conditions.
                    </Typography>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            1. License to Use
                        </Typography>
                        <Typography variant="body2">
                            Subject to your compliance with these terms, we grant you a limited,
                            non-exclusive, non-transferable license to use our platform solely for
                            your business purposes.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            2. User Responsibilities
                        </Typography>
                        <Typography variant="body2">
                            Users are responsible for maintaining the confidentiality of their
                            account credentials and ensuring that any information provided is
                            accurate and up-to-date.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            3. Prohibited Activities
                        </Typography>
                        <Typography variant="body2">
                            You agree not to engage in any unauthorized use of our platform,
                            including, but not limited to, attempting to hack, reverse engineer, or
                            disrupt the functionality of the services.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            4. Limitation of Liability
                        </Typography>
                        <Typography variant="body2">
                            Book & Manage will not be held liable for any indirect, incidental, or
                            consequential damages arising from your use of the platform.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            5. Modifications to Terms
                        </Typography>
                        <Typography variant="body2">
                            We reserve the right to modify these terms at any time. Users will be
                            notified of significant changes via email or platform notifications.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            6. Governing Law
                        </Typography>
                        <Typography variant="body2">
                            These terms and conditions shall be governed by and construed in
                            accordance with the laws of [Your Jurisdiction].
                        </Typography>
                    </Box>
                </Stack>
            </Box>
            <Footer />
        </>
    );
};

export default TermsConditionPage;
