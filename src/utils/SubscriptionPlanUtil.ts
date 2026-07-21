import { MembershipPackage } from "@/api/types";
import { addDays } from "@/core/utils/DateUtil";

const subscriptionPlans: Record<string, number> = {
    REGISTRATION: 0,
    TRIAL: 7,
    MONTHLY: 30,
    QUARTERLY: 90,
    HALF_YEARLY: 180,
    YEARLY: 365,
    AMC: 365,
};

const parsePlanDays = (planName: string, membershipTypes: MembershipPackage[]): number => {
    if (!planName) return 0;

    const name = planName.toLowerCase();

    for (const key in subscriptionPlans) {
        if (name.includes(key.toLowerCase())) {
            return subscriptionPlans[key];
        }
    }
    const packag = membershipTypes.filter((m) => m.membershipPackage === planName)[0];
    if (packag) return packag.days || 0;

    return 0;
};

const getEndDateBySubscriptionPlan = (
    startDate: string,
    planName: string,
    membershipTypes: MembershipPackage[] = [],
): string | null => {
    const days = parsePlanDays(planName, membershipTypes);
    return addDays(startDate, days);
};

export { getEndDateBySubscriptionPlan };
