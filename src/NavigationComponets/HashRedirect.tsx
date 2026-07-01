import { useEffect } from "react";

const HashRedirect: React.FC = () => {
    useEffect(() => {
        const { pathname, search } = window.location;
        if (!window.location.hash && pathname.startsWith("/form/")) {
            window.location.replace(`/#${pathname}${search}`);
        }
    }, []);

    return null;
};

export default HashRedirect;
