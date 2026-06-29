import { useState, useCallback } from "react";

const subscribers = new Set();

export const usePageSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState({});

    const subscribe = useCallback((handler) => {
        subscribers.add(handler);

        return () => {
            subscribers.delete(handler);
        };
    }, []);

    const triggerSearch = (term, filter) => {
        setSearchTerm(term);
        setFilter(filter);
        subscribers.forEach((handler) => handler(term, filter));
    };

    return { filter, searchTerm, subscribe, triggerSearch };
};
