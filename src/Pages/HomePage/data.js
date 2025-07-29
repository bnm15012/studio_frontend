import {
    CalendarToday as CalendarIcon,
    CreditCard as CreditCardIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Message as MessageIcon,
    Security as SecurityIcon,
} from "@mui/icons-material";

export const featurePageContent = {
    title: "Everything You Need to Manage Your Studio",
    description: "Our comprehensive studio management platform helps you streamline operations, enhance client experience, and focus on growing your business.",
    featuresGrids: [
        {
            icon: CalendarIcon,
            title: "Smart Scheduling",
            description: "Intuitive calendar system to manage classes, appointments, and events. Allow clients to book online 24/7 and reduce scheduling conflicts.",
            benefits: ["Real-time availability", "Conflict prevention", "Automated reminders", "Mobile booking"]
        },
        {
            icon: CreditCardIcon,
            title: "Seamless Payments",
            description: "Process payments, manage subscriptions, and automate billing. Keep track of revenue with detailed financial reports.",
            benefits: ["Secure payment gateway", "Subscription management", "Automated invoicing", "Financial analytics"]
        },
        {
            icon: PeopleIcon,
            title: "Member Management",
            description: "Track memberships, attendance, progress, and preferences. Build stronger relationships with personalized member experiences.",
            benefits: ["Complete member profiles", "Attendance tracking", "Progress monitoring", "Personalized communication"]
        },
        {
            icon: TrendingUpIcon,
            title: "Studio Growth",
            description: "Marketing tools, analytics, and insights to help your studio reach more clients and increase retention rates.",
            benefits: ["Marketing automation", "Retention analytics", "Performance insights", "Growth strategies"]
        },
        {
            icon: MessageIcon,
            title: "Communication Hub",
            description: "Centralized messaging system to keep members informed about classes, updates, and special offers.",
            benefits: ["Group messaging", "Email campaigns", "WhatsApp integration"]
        },
        {
            icon: SecurityIcon,
            title: "Security & Compliance",
            description: "Enterprise-grade security with GDPR compliance and data protection to keep your business and members safe.",
            benefits: ["Data encryption", "GDPR compliance", "Secure access", "Privacy protection"]
        }
    ],
    cta: {
        title: "Ready to Transform Your Studio?",
        description: "Join thousands of studios already using our platform to grow their business.",
        buttonText: "Learn How We Can Help"
    }
};