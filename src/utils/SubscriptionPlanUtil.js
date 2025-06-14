import { addDays } from "./DateUtil"

const subscriptionPlans = {
    REGISTRATION: 0,
    TRIAL: 7,
    MONTHLY: 30,
    QUARTERLY: 90,
    HALF_YEARLY: 180,
    YEARLY: 365
}

const getEndDateBySubscriptionPlan = (startDate, planName) => {
    return addDays(startDate, subscriptionPlans[planName])
}

export { getEndDateBySubscriptionPlan }