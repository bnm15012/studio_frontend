/** Image upload API call using FormData and multipart POST to /uploadImage/:dirName. */
import api from "@/core/utils/api";

export interface UploadImageResponse {
    success: boolean;
    data?: unknown;
    message: string;
}

export const uploadImageApiCall = async (
    file: File,
    token: string | null | undefined,
    dirName = "default",
): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post(`/uploadImage/${dirName}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token ?? "",
            },
        });
        const data = response.data;
        return { success: true, data, message: "Image uploaded successfully!" };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { status?: { statusMessage?: string } } } };
        const message = err?.response?.data?.status?.statusMessage || "Failed to upload image.";
        return { success: false, message };
    }
};
