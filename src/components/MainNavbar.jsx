import { Link, useLocation, useNavigate } from 'react-router-dom';
import './MainNavbar.css';
import WMIconNavBar from './../assets/images/page/WM-icon-nav-bar.webp';

import { NavbarData } from '../data/NavbarData';

import { useEffect, useRef, useState } from 'react';
import { preventDefaultEvent } from '../utils/PreventDefaultEvent';
import { ApiDomain } from '../data/ApiDomain';

import Spinner from "./Spinner";

const MainNavbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [showResponsiveNavbar, setShowResponsiveNavbar] = useState(false);
    const [user, setUser] = useState([]);
    const [userPicture, setUserPicture] = useState(null);

    const [userPictureVersion, setUserPictureVersion] = useState(Date.now());

    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("sessionToken") || "";
    
    //dropdown list state
    const [dropdownIsActive, setDropdownIsActive] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(()=>{
        readService();
        handleResizeScreen();
        
        window.addEventListener("resize", handleResizeScreen);
        document.addEventListener("click", handleClickOutside);

        return ()=>{
            window.removeEventListener("resize", handleResizeScreen);
            document.removeEventListener("click", handleClickOutside);
        }
    }, []);

    const readService = async()=>{
        const apiUrl = `${ApiDomain}/users/my/profile`;
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const response = await data.json();

            if(data.status === 200){
                setUser(response);
                readServicePictures(response.userId);
                return;
            }

            if(data.status === 401){
                navigate("/");
                return;
            }
            
        } 
        catch (error) {
            navigate("/serverError");
            return;
        }
    }

    const readServicePictures = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}/pictures/${userPictureVersion}`;
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(data.status === 200 || data.status === 404){
                const blob = await data.blob();
                const url = URL.createObjectURL(blob);
                setUserPicture(url);
                setIsLoading(false);
            }
        }
        catch (error) {
            navigate("/serverError");
            return;
        }
    }

    const logout = async(event)=>{
        preventDefaultEvent(event);

        const apiUrl = `${ApiDomain}/users/logout`;
        try {
            
            const data = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if(data.status === 200){
                localStorage.removeItem("sessionToken");
                navigate("/");
                return;
            }

        } catch (error) {
            navigate("/serverError");
            return;
        }
    }

    const toggleDropdownIsActive = (event)=>{
        preventDefaultEvent(event);
        setDropdownIsActive(!dropdownIsActive);
    }

    const handleClickOutside = (event)=>{
        if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
            setDropdownIsActive(false);
        }
    }

    const handleResizeScreen = ()=>{
        if(window.innerWidth <= 850){
            setShowResponsiveNavbar(true);
        }
        else{
            setShowResponsiveNavbar(false);
        }
    }

    return (
        <header>
            <nav className="nav-bar py-20 mx-auto">
                <input type="checkbox" name="" id="navbar-checkbox" />
                <div className="d-flex flex-row navbar-container align-items-center justify-content-between px-20">
                    
                    <div className="d-flex flex-row justify-content-between">
                        <Link to="/weekieTalkie">
                            <div className="d-flex align-items-center">
                                <span className="f-size-22 text-shadow-sm f-black-color">WeekieMochi</span>
                                <img className="img-fluid icon-sized-img png-border" src={WMIconNavBar} alt="Weekie Mochi icon: cat playing"/>
                            </div>
                        </Link>
                        <div className="navbar-checkbox-icon">
                            <label htmlFor="navbar-checkbox"/>
                        </div>
                    </div>


                    <ul className="navbar-regular-options d-flex px-20">
                        {
                            (isLoading && showResponsiveNavbar)
                            ?
                            < Spinner sizeLevel={2}/>
                            :
                                (showResponsiveNavbar)
                                ?
                                    <>
                                        <Link to={`/users/profile/${user.userId}`} className="my-20">
                                            <div className="d-flex flex-row align-items-center user-nav-bar-option mx-15 gap-10">
                                                <img className="img-fluid icon-sized-img circle-like-border" src={userPicture} alt={`${user.username}'s picture`}/>
                                                <span>{user.username}</span>
                                            </div>
                                        </Link>
                                    </>
                                :
                                    null
                        }
                        {
                            NavbarData.map((item, index)=>(
                                <li className="mx-15" key={index}>
                                    <Link to={item.url} title={item.title} className={(location.pathname === item.url) ? "wt-custom-animation" : ""}>
                                        {item.option}
                                    </Link>
                                </li>
                            ))
                        }
                        {
                            (isLoading && showResponsiveNavbar)
                            ?
                            < Spinner sizeLevel={2}/>
                            :
                                (showResponsiveNavbar)
                                ?
                                    <>
                                        <li className="mx-15"></li>
                                        <Link to="" className="mx-15 my-20" onClick={(event)=>logout(event)}>
                                            <span className="f-black-color">Log out</span>
                                        </Link>
                                    </>
                                :
                                    null
                        }
                    </ul>

                    {
                        (isLoading && !showResponsiveNavbar)
                        ?
                            < Spinner sizeLevel={2}/>
                        :
                            (!showResponsiveNavbar)
                            ?
                                <div className="dropdown-list" ref={dropdownRef}>
                                    <Link to="" className="d-flex flex-row align-items-center user-nav-bar-option mx-15 gap-10" onClick={(event)=>toggleDropdownIsActive(event)}>
                                        <span>{user.username}</span>
                                        <img className="img-fluid icon-sized-img circle-like-border" src={userPicture} alt={`${user.username}'s picture`}/>
                                    </Link>
                                    <ul className={`d-flex flex-column dropdown-list-content ${dropdownIsActive ? "" : "d-none"} gap-10 p-15`}>
                                        <li className="pt-5">
                                            <Link to={`/users/profile/${user.userId}`}>
                                                Profile
                                            </Link>
                                        </li> 
                                        <li className="border-top-1 pt-5" onClick={(event)=>logout(event)}>
                                            <Link to="">
                                                Log out
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            :
                                null
                    }

                </div>
            </nav>
        </header>
    )
}

export default MainNavbar;