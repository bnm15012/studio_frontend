import api from "../../../utils/api";

export const generatePresignUrl = async (fileName, contentType) => {
    try {
        const response = await api.post('/generatePresignUrl', {
            data: {
                fileName,
                contentType
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Presigned URL generated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : 'Failed to generate presigned URL'
        };
    }
};