import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MessageIcon from "@mui/icons-material/Message";
import SecurityIcon from "@mui/icons-material/Security";

export const featurePageContent = {
    title: "Everything You Need to Manage Your Studio",
    description:
        "Our comprehensive studio management platform helps you streamline operations, enhance client experience, and focus on growing your business.",
    featuresGrids: [
        {
            icon: CalendarTodayIcon,
            color: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            title: "Smart Scheduling",
            description:
                "Intuitive calendar system to manage classes, appointments, and events. Allow clients to book online 24/7 and reduce scheduling conflicts.",
            benefits: [
                "Real-time availability",
                "Conflict prevention",
                "Automated reminders",
                "Mobile booking",
            ],
        },
        {
            icon: CreditCardIcon,
            color: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            title: "Seamless Payments",
            description:
                "Process payments, manage subscriptions, and automate billing. Keep track of revenue with detailed financial reports.",
            benefits: [
                "Secure payment gateway",
                "Subscription management",
                "Automated invoicing",
                "Financial analytics",
            ],
        },
        {
            icon: PeopleIcon,
            color: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            title: "Member Management",
            description:
                "Track memberships, attendance, progress, and preferences. Build stronger relationships with personalized member experiences.",
            benefits: [
                "Complete member profiles",
                "Attendance tracking",
                "Progress monitoring",
                "Personalized communication",
            ],
        },
        {
            icon: TrendingUpIcon,
            color: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            title: "Studio Growth",
            description:
                "Marketing tools, analytics, and insights to help your studio reach more clients and increase retention rates.",
            benefits: [
                "Marketing automation",
                "Retention analytics",
                "Performance insights",
                "Growth strategies",
            ],
        },
        {
            icon: MessageIcon,
            color: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            title: "Communication Hub",
            description:
                "Centralized messaging system to keep members informed about classes, updates, and special offers.",
            benefits: ["Group messaging", "Email campaigns", "WhatsApp integration"],
        },
        {
            icon: SecurityIcon,
            color: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            title: "Security & Data Protection",
            description:
                "Enterprise-grade security and daily backups to keep your business and member data safe at all times.",
            benefits: ["Data encryption", "Daily backups", "Secure access", "Privacy protection"],
        },
    ],
    cta: {
        title: "Ready to Transform Your Studio?",
        description: "Join thousands of studios already using our platform to grow their business.",
        buttonText: "Learn How We Can Help",
    },
};
