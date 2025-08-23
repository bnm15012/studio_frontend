import api from "../utils/api";

const getHeader = (token) => ({ headers: { Authorization: `${token}` } });

export const addDataAPI = ({ newData, token, showAlert, route, setData, setLoading }) => async (dispatch) => {
    try {
        setLoading(true);
        const response = await api.post(`/${route}/add`, newData, getHeader(token));
        const { data } = response.data;
        dispatch(setData(data[0]));
        setLoading(false);
    } catch (error) {
        console.error(`Error adding data to ${route}:`, error);
        const message = error.response?.data?.status?.statusMessage || "Failed to add data!";
        showAlert(message, "error");
        setLoading(false);
    }
};

export const updateDataAPI = ({ updatedData, token, showAlert, route, id, setData, setLoading }) => async (dispatch) => {
    try {
        setLoading(true);
        const response = await api.put(`/${route}/update/${id}`, updatedData, getHeader(token));
        const { data } = response.data;
        dispatch(setData(data[0]));
        setLoading(false);
    } catch (error) {
        console.error(`Error updating data in ${route}:`, error);
        const message = error.response?.data?.status?.statusMessage || `Failed to update ${route}!`;
        showAlert(message, "error");
        setLoading(false);
    }
};

export const deleteDataAPI = ({ id, token, showAlert, route, setData, setLoading }) => async (dispatch) => {
    try {
        setLoading(true);
        await api.delete(`/${route}/delete/${id}`, getHeader(token));
        dispatch(setData(id));
        setLoading(false);
    } catch (error) {
        console.error(`Error deleting data from ${route}:`, error);
        const message = error?.response?.data?.status?.statusMessage || `Error deleting ${route}`;
        showAlert(message, "error");
        setLoading(false);
    }
};

export const getAllDataAPI = ({ rootId, token, showAlert, route, setData, params, setTotalCount, setLoading }) => async (dispatch) => {
    try {
        setLoading(true);
        const response = await api.get(`/${route}/getAll/${rootId}`, { ...getHeader(token), params });
        const { data, status } = response.data;
        dispatch(setData(data));
        if (setTotalCount)
            setTotalCount(status.totalCount)
        setLoading(false);
    } catch (error) {
        console.error(`Error fetching data from ${route}:`, error);
        const message = error.response?.data?.status?.statusMessage || `Failed to get all ${route}!`;
        showAlert(message, "error");
        setLoading(false);
    }
};
