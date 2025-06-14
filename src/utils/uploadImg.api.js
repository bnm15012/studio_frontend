import api from "./api";

export const uploadImageApiCall = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/uploadImage/student", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    });
    const data = response.data;
    return { success: true, data, message: "Image uploaded successfully!" };
  } catch (error) {
    const message =
      error?.response?.data?.status?.statusMessage || "Failed to upload image.";
    return { success: false, message };
  }
};
