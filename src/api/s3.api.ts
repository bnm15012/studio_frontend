import api from "@/core/utils/api";
import { getApiMessage } from "@/core/api/helper";

export interface PresignUrlResponse {
    success: boolean;
    data?: unknown;
    message: string;
}

export const generatePresignUrl = async (
    fileName: string,
    token: string | null | undefined,
    contentType = "application/pdf",
): Promise<PresignUrlResponse> => {
    const data = {
        data: {
            fileName,
            contentType,
        },
    };

    try {
        const response = await api.post("/generatePresignUrl", data, {
            headers: {
                Authorization: token ?? "",
                "Content-Type": "application/json",
            },
        });
        return {
            success: true,
            data: response.data.data,
            message: response.data.status?.statusMessage || "Success",
        };
    } catch (err: unknown) {
        const message = getApiMessage(err as { response?: { data?: { status?: { statusMessage?: string } } } }, "Failed to fetch dashboard data");
        return { success: false, message };
    }
};

export const uploadToS3 = async (
    file: File,
    uploadUrl: string,
    token: string | null | undefined,
    showAlert: (msg: string, type: string) => void,
): Promise<boolean> => {
    if (!file || !uploadUrl) {
        showAlert("Missing file or upload URL", "error");
        return false;
    }

    try {
        const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });

        if (!response.ok) {
            throw new Error("Failed to upload file: " + response.statusText);
        }
        showAlert("File uploaded successfully!", "success");
        return true;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        showAlert("Error uploading file: " + message, "error");
        console.error("Error uploading file:", err);
        return false;
    }
};
