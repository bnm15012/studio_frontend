// usePageSearch.js
import { useState, useCallback } from "react";

const subscribers = new Set();

export const usePageSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const subscribe = useCallback((handler) => {
        subscribers.add(handler);

        return () => {
            subscribers.delete(handler);
        };
    }, []);

    const triggerSearch = (term) => {
        setSearchTerm(term);
        subscribers.forEach((handler) => handler(term));
    };

    return { searchTerm, subscribe, triggerSearch };
};
