/** Axios instance configured with base URL, auth interceptor, token refresh logic (401 handling with retry), and automatic logout on refresh failure. */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AnyAction } from "@reduxjs/toolkit";
import { store, RootState } from "../../state";
import { setToken } from "../../state/authSlice";
import { logoutUser } from "../../state/thunks";
import { installRateLimitInterceptor, wrapGetWithDedupe } from "../api/apiGuard";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_REST_API,
    headers: {
        "Content-Type": "application/json",
        "User-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
});

// ── Security layer: rate-limit + GET deduplication ───────────────────────────
// Rate limiter runs first so blocked calls never hit the deduplication map.
installRateLimitInterceptor(api);
wrapGetWithDedupe(api);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomRequestConfig;
        const status = error.response ? error.response.status : null;

        console.info("Token expired and Trying to refresh it");

        // Check if the error is a 401 (Unauthorized) and if retry count is less than 5
        if (originalRequest && status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            originalRequest._retryCount = 0; // Initialize retry count

            const state = store.getState() as RootState;
            const refreshToken = state.auth?.token;
            const email = state.auth?.user?.email;
            if (refreshToken && email) {
                try {
                    // Attempt to refresh the token with a maximum of 5 retries
                    while (
                        originalRequest._retryCount !== undefined &&
                        originalRequest._retryCount < 5
                    ) {
                        originalRequest._retryCount++;

                        try {
                            const response = await axios.post(
                                `${import.meta.env.VITE_APP_REST_API}/password/refreshToken`,
                                { token: refreshToken, email: email },
                                { headers: { "Content-Type": "application/json" } },
                            );

                            const newToken = response.data.data[0];

                            store.dispatch(setToken({ token: String(newToken) }));
                            console.info("Token updated successfully...");

                            // Retry the original request with the new token
                            if (originalRequest.headers) {
                                originalRequest.headers["Authorization"] = newToken;
                            }

                            return axios(originalRequest); // Retry the request
                        } catch (refreshError) {
                            console.error("Error refreshing token:", refreshError);

                            if (originalRequest._retryCount >= 5) {
                                // If refresh fails after 5 attempts, remove data from localStorage and redirect to home page
                                console.error("Token refresh failed after 5 attempts.");

                                // Remove data from localStorage
                                store.dispatch(logoutUser() as unknown as AnyAction);

                                // Redirect to home page
                                window.location.href = "/"; // Redirect to the home page
                                return Promise.reject(refreshError);
                            }
                        }
                    }
                } catch (e) {
                    return Promise.reject(e);
                }
            }
        }

        return Promise.reject(error);
    },
);

export default api;
