import { useEffect } from "react";

const HashRedirect = () => {
    useEffect(() => {
        const { pathname, search } = window.location;
        if (!window.location.hash && pathname.startsWith("/form/")) {
            window.location.replace(`/#${pathname}${search}`);
        }
    }, []);

    return null;
};

export default HashRedirect;
