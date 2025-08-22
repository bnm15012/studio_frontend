import { addDays } from "./DateUtil";

const subscriptionPlans = {
    REGISTRATION: 0,
    TRIAL: 7,
    MONTHLY: 30,
    QUARTERLY: 90,
    HALF_YEARLY: 180,
    YEARLY: 365,
};

const parsePlanDays = (planName) => {
    if (!planName) return 0;

    const name = planName.toLowerCase();

    for (const key in subscriptionPlans) {
        if (name.includes(key.toLowerCase())) {
            return subscriptionPlans[key];
        }
    }

    if (name.includes("day")) {
        const match = name.match(/(\d+)\s*day/);
        return match ? parseInt(match[1], 10) : 1;
    }

    if (name.includes("week")) {
        const match = name.match(/(\d+)\s*week/);
        return (match ? parseInt(match[1], 10) : 1) * 7;
    }

    if (name.includes("month")) {
        const match = name.match(/(\d+)\s*month/);
        return (match ? parseInt(match[1], 10) : 1) * 30;
    }

    if (name.includes("quarter")) {
        return 90;
    }

    if (name.includes("half") || name.includes("6 month")) {
        return 180;
    }

    if (name.includes("year") || name.includes("annual")) {
        const match = name.match(/(\d+)\s*year/);
        return (match ? parseInt(match[1], 10) : 1) * 365;
    }

    return 0;
};

const getEndDateBySubscriptionPlan = (startDate, planName) => {
    const days = parsePlanDays(planName);
    return addDays(startDate, days);
};

export { getEndDateBySubscriptionPlan };
