import { setLogin, setStudio, setSubscriptionPlan } from "../../state/authSlice";
import api from "@/core/utils/api";
import axios from "axios";
import { transformRegisterData } from "./auth.util";
import { branchCruds } from "../../api/all.api";

export const registerApiCall = async (values: any) => {
    try {
        const response = await axios.post(
            `${(import.meta as any).env.VITE_APP_REST_API}/studios/add`,
            transformRegisterData(values),
            { headers: { "Content-Type": "application/json" } },
        );
        return {
            success: true,
            message:
                response.data.message ||
                "You will receive an email which contains password! please login with that password!",
        };
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error while registering";
        return { success: false, message };
    }
};

interface LoginApiParams {
    values: any;
    dispatch: any;
    navigate: any;
}

export const loginApiCall = async ({ values, dispatch, navigate }: LoginApiParams) => {
    try {
        const loggedInResponse = await axios.post(
            `${(import.meta as any).env.VITE_APP_REST_API}/users/login`,
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
                authData.studioEntry.branchList.filter((branch: any) => branch.isActive)[0],
            ),
        );
        dispatch(
            setSubscriptionPlan({
                subscriptionPlan: authData.subscriptionEntry,
            }),
        );
        navigate(`/dashboard`);
        return { success: true, message: authData.message || "Login successful!" };
    } catch (error: any) {
        const message = error?.response?.data?.status?.statusMessage || "Error logging in";
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
            `${(import.meta as any).env.VITE_APP_REST_API}/password/verify`,
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
    } catch (error: any) {
        const message = error?.response?.data?.message || "Failed to change password";
        return { success: false, message };
    }
};

interface UpdateProfileParams {
    values: any;
    dispatch: any;
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
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error updating profile";
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
    } catch (error: any) {
        const message = error?.response?.data?.status.statusMessage || "Failed to send OTP";
        return { success: false, message };
    }
};

interface UpdateStudioParams {
    values: any;
    dispatch: any;
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
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error updating studio";
        return { success: false, message };
    }
};
