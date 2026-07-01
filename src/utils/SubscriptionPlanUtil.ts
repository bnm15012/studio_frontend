import { addDays } from "../core/utils/DateUtil";

const subscriptionPlans = {
    REGISTRATION: 0,
    TRIAL: 7,
    MONTHLY: 30,
    QUARTERLY: 90,
    HALF_YEARLY: 180,
    YEARLY: 365,
    AMC: 365,
};

const parsePlanDays = (planName, membershipTypes) => {
    if (!planName) return 0;

    const name = planName.toLowerCase();

    for (const key in subscriptionPlans) {
        if (name.includes(key.toLowerCase())) {
            return subscriptionPlans[key];
        }
    }
    const packag = membershipTypes.filter(m => m.membershipPackage === planName)?.[0];
    if (packag) return packag?.days;

    return 0;
};

const getEndDateBySubscriptionPlan = (startDate, planName, membershipTypes) => {
    const days = parsePlanDays(planName, membershipTypes);
    return addDays(startDate, days);
};

export { getEndDateBySubscriptionPlan };
