import { useLocation, useNavigate } from "react-router-dom";
import LogInForm from "./../components/LogInForm";
import WMIconNavBar from './../assets/images/page/WM-icon-nav-bar.webp';
import { useEffect } from "react";
import { VerifyJWT } from "../utils/VerifyJWT";

const LogInPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(()=>{
        VerifyJWT(navigate, location.pathname);
    }, []);

    return (
        <section className="bg-cat-gif py-20 px-20">
            <div className="px-20 py-20">
                <div className="d-flex flex-column align-items-center my-20">
                    <div className="d-flex align-items-center wt-custom-animation w-fit-content">
                        <span className="f-size-22 text-shadow-sm">WeekieMochi</span>
                        <img className="img-fluid icon-sized-img png-border" src={WMIconNavBar} alt="Weekie Mochi icon: cat playing"/>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <h2 className="f-size-40 mb-10">Login</h2>
                    <LogInForm />
                </div>
            </div>
        </section>
    )
}

export default LogInPage;