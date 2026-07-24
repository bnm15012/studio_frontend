export interface SubscriptionFeature {
    name: string;
    include: boolean;
}

export interface SubscriptionPlanDef {
    id: string;
    name: string;
    price: number;
    days: number;
    features: SubscriptionFeature[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanDef[] = [
    {
        id: "MONTHLY",
        name: "Monthly Plan",
        price: 499,
        days: 30,
        features: [
            {
                name: "Rs. 449",
                include: true,
            },
            {
                name: "Student Details",
                include: true,
            },
            {
                name: "Payment Details",
                include: true,
            },
            {
                name: "Client booking",
                include: false,
            },
            {
                name: "Statistics & Analysis",
                include: false,
            },
            {
                name: "Sales Report",
                include: false,
            },
        ],
    },
    {
        id: "QUARTERLY",
        name: "Quarterly Plan",
        price: 1399,
        days: 90,
        features: [
            {
                name: "Rs. 449",
                include: true,
            },
            {
                name: "Student Details",
                include: true,
            },
            {
                name: "Payment Details",
                include: true,
            },
            {
                name: "Client booking",
                include: true,
            },
            {
                name: "Statistics & Analysis",
                include: false,
            },
            {
                name: "Sales Report",
                include: false,
            },
        ],
    },
    {
        id: "HALF_YEARLY",
        name: "Half Yearly Plan",
        price: 2499,
        days: 180,
        features: [
            {
                name: "Rs. 2499",
                include: true,
            },
            {
                name: "Student Details",
                include: true,
            },
            {
                name: "Payment Details",
                include: true,
            },
            {
                name: "Client booking",
                include: true,
            },
            {
                name: "Statistics & Analysis",
                include: true,
            },
            {
                name: "Sales Report",
                include: false,
            },
        ],
    },
    {
        id: "YEARLY",
        name: "Annual Plan",
        price: 4999,
        days: 365,
        features: [
            {
                name: "Rs. 4999",
                include: true,
            },
            {
                name: "Student Details",
                include: true,
            },
            {
                name: "Payment Details",
                include: true,
            },
            {
                name: "Client booking",
                include: true,
            },
            {
                name: "Statistics & Analysis",
                include: true,
            },
            {
                name: "Sales Report",
                include: true,
            },
        ],
    },
];
