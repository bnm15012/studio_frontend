import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/");
    }, [navigate]);

    return null;
};

export default PageNotFound;
