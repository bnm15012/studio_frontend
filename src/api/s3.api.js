import api from '../utils/api';

export const generatePresignUrl = async (fileName, token, contentType = "application/pdf") => {
    const data = {
        data: {
            fileName,
            contentType,
        }
    };

    try {
        const response = await api.post("/generatePresignUrl", data, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
        });
        return {
            success: true,
            data: response.data.data,
            message: response.status.statusMessage
        };
    } catch (error) {
        const message =
            error?.response?.data?.status?.statusMessage ||
            "Failed to fetch dashboard data";
        return { success: false, message };
    }
};

export const uploadToS3 = async (file, uploadUrl, token, showAlert) => {
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
    } catch (err) {
        showAlert("Error uploading file: " + err.message, "error");
        console.error("Error uploading file:", err);
         // Return a structured error response
         return false;
    }
};
