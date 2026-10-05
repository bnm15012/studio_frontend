import api from "@/core/utils/api";
import { store, RootState } from "@/state";
import { getHeader } from "@/core/api/helper";

export interface StudioListItem {
    studioId: number;
    studioName: string;
    location: string;
    email: string;
    logo?: string;
    amcEnabled: boolean;
    subscriptionEntry?: {
        subscriptionPlan: string;
        startDate: string;
        endDate: string;
        status: string;
        price: number;
    };
}

export interface StudioPlanItem {
    id?: number;
    studioId: number;
    planId: number;
    customAmount: number;
}

export interface MonthlyTrend {
    month: string;
    revenue: number;
}

export interface DashboardStats {
    totalStudios: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    trialStudios: number;
    totalRevenue: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    monthlyTrend: MonthlyTrend[];
    revenueByPlan: Record<string, number>;
}

const authHeader = () => getHeader((store.getState() as RootState).auth.token);

export const fetchDashboardStats = async () => {
    try {
        const response = await api.get("/super-admin/dashboard", authHeader());
        return { data: response.data as DashboardStats, success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};

export const fetchAllStudios = async () => {
    try {
        const response = await api.get("/super-admin/studios", authHeader());
        return { data: response.data.data as StudioListItem[], success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};

export const loginAsStudio = async (studioId: number) => {
    try {
        const response = await api.post(`/super-admin/login-as/${studioId}`, {}, authHeader());
        return { data: response.data.data[0], success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};

export const fetchStudioPlans = async (studioId: number) => {
    try {
        const response = await api.get(`/super-admin/studio-plans/${studioId}`, authHeader());
        return { data: response.data.data as StudioPlanItem[], success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};

export const upsertStudioPlan = async (entry: StudioPlanItem) => {
    try {
        const response = await api.post("/super-admin/studio-plans", entry, authHeader());
        return { data: response.data.data[0] as StudioPlanItem, success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};

export const deleteStudioPlan = async (id: number) => {
    try {
        await api.delete(`/super-admin/studio-plans/${id}`, authHeader());
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

export interface PaymentItem {
    subscriptionId: number;
    studioName: string;
    studioId: number;
    plan: string;
    amount: number;
    startDate: string;
    endDate: string;
    status: string;
    orderId: string;
    paymentId: string;
}

export interface RevenueData {
    month: number;
    year: number;
    totalAmount: number;
    totalPayments: number;
    payments: PaymentItem[];
}

export const fetchRevenue = async (month?: number, year?: number) => {
    try {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        const query = params.toString() ? `?${params.toString()}` : "";
        const response = await api.get(`/super-admin/revenue${query}`, authHeader());
        return { data: response.data as RevenueData, success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};

export interface PlanItem {
    id: number;
    planType: string;
    amount: number;
    description: string;
    popular: boolean;
    smsQuota: number;
    remindBeforeDays: number;
    countryCode: string;
    enabledFeatures: string[];
    disabledFeatures: string[];
}

export const createPlan = async (entry: Partial<PlanItem>) => {
    try {
        const response = await api.post("/plans/add", entry, authHeader());
        return { data: response.data?.data?.[0] as PlanItem, success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};

export const updatePlan = async (id: number, entry: Partial<PlanItem>) => {
    try {
        const response = await api.put(`/super-admin/plans/update/${id}`, entry, authHeader());
        return { data: response.data.data[0] as PlanItem, success: true };
    } catch (error) {
        console.error(error);
        return { data: null, success: false };
    }
};
