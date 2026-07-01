/** Build the Authorization header object. */
export const getHeader = (token: string | null | undefined) => ({
    headers: { Authorization: token ?? "" },
});

/**
 * Extract a human-readable error message from an Axios error response,
 * falling back to `fallback` when the server provides no message.
 */
export const getApiMessage = (err: any, fallback: string): string =>
    err?.response?.data?.status?.statusMessage ?? fallback;

/**
 * Wrap an async `fn` with setLoading(true) / setLoading(false) lifecycle.
 * Always calls setLoading(false) even if `fn` throws.
 */
export const withLoading = async <T>(
    setLoading: (loading: boolean) => void,
    fn: () => Promise<T>,
): Promise<T> => {
    setLoading(true);
    try {
        return await fn();
    } finally {
        setLoading(false);
    }
};

/**
 * Returns true when the slice state already contains the data being requested,
 * meaning the thunk can safely skip a network call.
 */
export const isCacheValid = (state: any, rootId: any, params: any): boolean =>
    state.rootId === rootId &&
    state.currentPage === params?.page &&
    params?.searchTerm === state.searchTerm &&
    JSON.stringify(params) === JSON.stringify(state.filterKeys);
