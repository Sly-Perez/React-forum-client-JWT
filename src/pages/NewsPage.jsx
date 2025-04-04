import { useLocation, useNavigate } from "react-router-dom";
import { VerifyJWT } from "../utils/VerifyJWT";
import { useEffect } from "react";

const NewsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(()=>{
        VerifyJWT(navigate, location.pathname);
    }, []);

    return (
        <div>News</div>
    )
}

export default NewsPage;