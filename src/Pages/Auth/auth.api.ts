import { setLogin, setStudio, setSubscriptionPlan } from "../../state/authSlice";
import api from "@/core/utils/api";
import type { AppDispatch } from "@/state";
import axios from "axios";
import { transformRegisterData } from "./auth.util";
import { branchCruds } from "../../api/all.api";

export const registerApiCall = async (values: Record<string, unknown>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_APP_REST_API as string}/studios/add`,
            transformRegisterData(values),
            { headers: { "Content-Type": "application/json" } },
        );
        return {
            success: true,
            message:
                response.data.message ||
                "You will receive an email which contains password! please login with that password!",
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, message };
    }
};

interface LoginApiParams {
    values: Record<string, unknown>;
    dispatch: AppDispatch;
    navigate: (path: string) => void;
}

export const loginApiCall = async ({ values, dispatch, navigate }: LoginApiParams) => {
    try {
        const loggedInResponse = await axios.post(
            `${import.meta.env.VITE_APP_REST_API as string}/users/login`,
            values,
            {
                headers: { "Content-Type": "application/json" },
            },
        );
        const authData = loggedInResponse.data.data[0];
        dispatch(
            setLogin({
                user: authData,
                token: authData.token,
                studio: authData.studioEntry,
                settings: authData.studioEntry.configuration.configrationEntryList,
            }),
        );
        dispatch(
            branchCruds.actions.setItems({
                data: authData.studioEntry.branchList,
                rootId: authData.studioEntry.studioId,
            }),
        );
        dispatch(
            (branchCruds.actions as any).setCurrentBranch(
                authData.studioEntry.branchList.filter((branch: Record<string, unknown>) => branch.isActive)[0],
            ),
        );
        dispatch(
            setSubscriptionPlan({
                subscriptionPlan: authData.subscriptionEntry,
            }),
        );
        navigate(`/dashboard`);
        return { success: true, message: authData.message || "Login successful!" };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, message };
    }
};

interface ChangePasswordApiParams {
    email: string;
    password: string;
    otp: string;
    OTPToken: string | null;
}

export const changePasswordApiCall = async ({ email, password, otp, OTPToken }: ChangePasswordApiParams) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_APP_REST_API as string}/password/verify`,
            JSON.stringify({
                otpToken: OTPToken,
                otp,
                userEntry: { email, password },
            }),
            {
                headers: { "Content-Type": "application/json" },
            },
        );
        return {
            success: true,
            message: response?.data?.message || "Password changed successfully!",
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, message };
    }
};

interface UpdateProfileParams {
    values: Record<string, unknown>;
    dispatch: AppDispatch;
    token: string | null | undefined;
}

export const updateProfile = async ({ values, dispatch, token }: UpdateProfileParams) => {
    try {
        const savedUserResponse = await api.put(`/users/update/${values["userId"]}`, values, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });

        const savedUser = savedUserResponse.data;

        if (savedUser) {
            dispatch(
                setLogin({
                    user: savedUser.data[0],
                    token: token?.split("Bearer ")[1] || "",
                    studio: savedUser.data[0].studioEntry,
                    settings: savedUser.data[0].studioEntry.configuration.configrationEntryList,
                }),
            );
            return { success: true, message: "Profile updated successfully!" };
        } else {
            return { success: true, message: savedUser.message || "Profile updated" };
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, message };
    }
};

export const sendOTPRequest = async (email: string) => {
    try {
        const response = await api.post(`/password/reset?email=${email}`);
        return {
            success: true,
            otpToken: response.data.data[0].otpToken || "OTP sent successfully to your email!",
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, message };
    }
};

interface UpdateStudioParams {
    values: Record<string, unknown>;
    dispatch: AppDispatch;
    token: string | null | undefined;
}

export const updateStudio = async ({ values, dispatch, token }: UpdateStudioParams) => {
    try {
        const response = await api.put(`/studios/update/${values["studioId"]}`, values, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });
        const savedStudio = response.data;
        if (savedStudio) {
            dispatch(setStudio({ studio: savedStudio.data[0] }));
            return {
                success: true,
                data: savedStudio.data[0],
                message: "Studio updated successfully!",
            };
        } else {
            return { success: false, message: savedStudio.message || "Studio updated" };
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, message };
    }
};
