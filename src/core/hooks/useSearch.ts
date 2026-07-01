import { useState, useCallback } from "react";

type SearchHandler = (term: string, filter: any) => void;

const subscribers = new Set<SearchHandler>();

export const usePageSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<any>({});

    const subscribe = useCallback((handler: SearchHandler) => {
        subscribers.add(handler);

        return () => {
            subscribers.delete(handler);
        };
    }, []);

    const triggerSearch = (term: string, filter: any) => {
        setSearchTerm(term);
        setFilter(filter);
        subscribers.forEach((handler) => handler(term, filter));
    };

    return { filter, searchTerm, subscribe, triggerSearch };
};
