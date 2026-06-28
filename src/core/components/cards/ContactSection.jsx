import { useState } from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Phone, Copy, Mail } from "lucide-react";
import PropTypes from "prop-types";
import CardInfoRow from "./CardInfoRow";

const ContactSection = ({ contact }) => {
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    const isEmail = contact.includes("@");

    const handleCopy = (e) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(contact);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (!contact) return;
        const link = isEmail ? `mailto:${contact}` : `tel:${contact}`;
        window.open(link, "_self");
    };

    const iconColor = theme.palette.primary.main;
    const IconComponent = isEmail ? (
        <Mail size={18} color={iconColor} />
    ) : (
        <Phone size={18} color={iconColor} />
    );

    const copyButtonAction = (
        <Tooltip title={copied ? "Copied!" : "Copy"} arrow>
            <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ color: theme.palette.primary.main }}
            >
                <Copy size={14} />
            </IconButton>
        </Tooltip>
    );

    return (
        <CardInfoRow
            Icon={IconComponent}
            label={isEmail ? "Email" : "Phone"}
            value={contact}
            onClick={handleClick}
            action={copyButtonAction}
            hoverable={true}
        />
    );
};

ContactSection.propTypes = {
    contact: PropTypes.string.isRequired,
};

export default ContactSection;
