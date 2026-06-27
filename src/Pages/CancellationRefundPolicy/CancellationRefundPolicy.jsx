import { Typography, Box, Stack, Divider, useTheme } from "@mui/material";
import Footer from "../../Components/Footer";
import { Navbar } from "../../NavigationComponets/Navbar/Navbar";
import { useEffect } from "react";

const CancellationRefundPolicy = () => {
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
                        Cancellation & Refund Policy
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        At Book & Manage, we strive to provide the best possible service to our
                        CUSTOMrs. However, we understand that there might be situations requiring
                        cancellations or refunds. Below are the terms governing our cancellation and
                        refund process.
                    </Typography>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            1. Cancellation Policy
                        </Typography>
                        <Typography variant="body2">
                            - CUSTOMrs can cancel their subscriptions or bookings by contacting us
                            at least 24 hours before the scheduled service or renewal date. <br />-
                            Cancellations made less than 24 hours in advance may not be eligible for
                            a refund, subject to the discretion of Book & Manage.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            2. Refund Policy
                        </Typography>
                        <Typography variant="body2">
                            - Refunds will be processed within 7-10 business days from the date of
                            approval. <br />
                            - A refund request must include valid reasons and supporting documents,
                            if applicable. <br />- Only the amount paid for the service or
                            subscription will be refunded; additional fees (e.g., transaction or
                            convenience fees) are non-refundable.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            3. Non-Refundable Scenarios
                        </Typography>
                        <Typography variant="body2">
                            - No refunds will be issued for partial usage of services or
                            subscriptions. <br />
                            - Payments made for promotional offers or discounted packages are
                            non-refundable. <br />- Failure to cancel a booking or subscription on
                            time will not qualify for a refund.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            4. Modification of Policy
                        </Typography>
                        <Typography variant="body2">
                            We reserve the right to update or modify this policy at any time.
                            Changes will be notified via our platform or email.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            5. Contact Information
                        </Typography>
                        <Typography variant="body2">
                            If you have any questions about our cancellation or refund policy,
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

export default CancellationRefundPolicy;
