import { Activity } from "@/api/types";
import { validMembershipTypes } from "./Activities.constants";

export function sortMembershipPlans(activity: Activity) {
    if (
        !activity ||
        !activity.membershipPlanRequest ||
        !Array.isArray(activity.membershipPlanRequest.membershipPlanEntryList)
    ) {
        return activity;
    }

    const clonedActivity = structuredClone(activity);

    clonedActivity.membershipPlanRequest!.membershipPlanEntryList!.sort(
        (
            a: { membershipType: string; daysPerWeek: number },
            b: { membershipType: string; daysPerWeek: number },
        ) => {
            const typeOrderA = validMembershipTypes.indexOf(a.membershipType);
            const typeOrderB = validMembershipTypes.indexOf(b.membershipType);

            if (typeOrderA !== typeOrderB) return typeOrderA - typeOrderB;
            return (a.daysPerWeek ?? 0) - (b.daysPerWeek ?? 0);
        },
    );

    return clonedActivity;
}
