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

export const uploadToS3 = async (file, uploadUrl) => {
    if (!file || !uploadUrl) {
        console.error("Missing file or upload URL");
        return;
    }

    try {
        const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });

        if (response.ok) {
            return {
                success: true,
                message: "File uploaded successfully",
            };
        } else {
            throw new Error("Failed to upload file: " + response.statusText);
        }
    } catch (err) {
        return {
            success: false,
            message: err.message || "An error occurred while uploading the file",
        }
    }
};
