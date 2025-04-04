import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerifyJWT } from "../utils/VerifyJWT";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(()=>{
        VerifyJWT(navigate, location.pathname);
    }, []);

    return (
        <div>HomePage</div>
    )
}

export default HomePage;