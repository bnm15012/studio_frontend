import {
  Box,
  Typography,
  Link,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContactUsDialog from "../Pages/ContactUs/ContactUsDialog";
import { useState } from "react";
import { openDialog } from "../state/dialogSlice";

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openContactUsForm, setOpenContactUsForm] = useState(false);
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#333",
        color: "white",
        textAlign: "center",
        pt: 4,
        pb: 2,
      }}
    >
      {/* Call to Action Section */}
      <Box
        sx={{
          color: "white",
          padding: "40px 20px",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Grow Your Studio with Us!
        </Typography>
        <Typography variant="body1" sx={{ my: 2 }}>
          Join studio owners across the world who trust us to manage and grow
          their businesses.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenContactUsForm(true)}
          size="large"
        >
          Leave a Message for Us
        </Button>
      </Box>

      {/* Main Footer Section */}
      <FlexBetween
        p={2}
        gap={5}
        sx={{
          flexWrap: "wrap",
        }}
      >
        {/* About Section */}
        <Box
          sx={{
            flex: 1,
            textAlign: "left",
            minWidth: "250px",
            maxWidth: "400px",
            mb: { xs: 4, sm: 0 },
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Book & Manage
          </Typography>
          <Typography variant="body2" lineHeight={1.8}>
            StudioApp provides tailored solutions for studio owners to
            streamline operations, manage clients, and foster community growth.
          </Typography>
        </Box>

        {/* Quick Links */}

        <Box sx={{ minWidth: "250px" }}>
          <Typography variant="h6" mx={1} textAlign="left" gutterBottom>
            Quick Links
          </Typography>
          <Box display="flex" alignItems="left">
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/");
              }}
              variant="text"
              color="white"
              sx={{ cursor: "pointer" }}
            >
              Home
            </Button>
          </Box>
          <Box display="flex" alignItems="left">
            <Button variant="text" color="white" sx={{ cursor: "pointer" }}>
              Features
            </Button>
          </Box>
          <Box display="flex" alignItems="left">
            <Button
              variant="text"
              color="white"
              onClick={() => dispatch(openDialog("loginDialog"))}
              sx={{ cursor: "pointer" }}
            >
              Login
            </Button>
          </Box>
        </Box>

        {/* Legal Section */}
        <Box sx={{ minWidth: "250px" }}>
          <Typography variant="h6" mx={1} textAlign="left" gutterBottom>
            Legal
          </Typography>
          <Box display="flex" alignItems="left">
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/terms-conditions");
              }}
              variant="text"
              color="white"
              sx={{ cursor: "pointer" }}
            >
              Terms & Conditions
            </Button>
          </Box>
          <Box display="flex" alignItems="left">
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/privacy-policy");
              }}
              variant="text"
              color="white"
              sx={{ cursor: "pointer" }}
            >
              Privacy Policy
            </Button>
          </Box>
          <Box display="flex" alignItems="left">
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/cancellation-refund-policy");
              }}
              variant="text"
              color="white"
              sx={{ cursor: "pointer" }}
            >
              Refund/Cancellation Policy
            </Button>
          </Box>
        </Box>

        {/* Contact Information Section */}
        <Box sx={{ minWidth: "250px" }}>
          <Typography variant="h6" textAlign="left" gutterBottom>
            Contact Information
          </Typography>
          <Box display="flex" alignItems="left">
            <EmailIcon sx={{ mr: 1 }} />
            <Typography variant="body2">bookandmanage@gmail.com</Typography>
          </Box>
          <Box display="flex" alignItems="left">
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography variant="body2">+91 73260 27500</Typography>
          </Box>
          <FlexBetween alignItems="center" mb={2}>
            <LocationOnIcon sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2">
                89, 2nd cross Road, Kaverappa layout
              </Typography>
              <Typography variant="body2" textAlign="left">
                Bangalore, Karnataka 560103
              </Typography>
            </Box>
          </FlexBetween>
          {/* Social Media Links */}
          <Box display="flex" gap={1}>
                {[
                  {
                    href: "https://wa.me/+917326027500",
                    icon: <WhatsAppIcon />,
                    color: '#25D366'
                  },
                  {
                    href: "https://www.linkedin.com/company/book-manage/",
                    icon: <LinkedInIcon />,
                    color: '#0A66C2'
                  },
                  {
                    href: "https://www.facebook.com/",
                    icon: <FacebookIcon />,
                    color: '#1877F2'
                  },
                ].map(({ href, icon, color }) => (
                  <Link href={href} target="_blank" rel="noopener" key={href}>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'white',
                        color: color,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'white',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      {icon}
                    </IconButton>
                  </Link>
                ))}
              </Box>
        </Box>
      </FlexBetween>

      <Divider />

      {/* Copyright */}
      <Box sx={{ py: 2 }}>
        <Typography variant="body2">
          &copy; 2024 StudioApp. All rights reserved. | Powered by{" "}
          <Link href="" color="inherit" underline="hover">
            Book & Manage
          </Link>
        </Typography>
      </Box>

      <ContactUsDialog
        open={openContactUsForm}
        setOpenContactUsForm={setOpenContactUsForm}
      />
    </Box>
  );
};

export default Footer;
