import { Link, useLocation, useNavigate } from 'react-router-dom';
import './MainNavbar.css';
import WMIconNavBar from './../assets/images/page/WM-icon-nav-bar.webp';

import { NavbarData } from '../data/NavbarData';

import { useEffect, useRef, useState } from 'react';
import { preventDefaultEvent } from '../utils/PreventDefaultEvent';
import { ApiDomain } from '../data/ApiDomain';


const MainNavbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState([]);
    const [userPicture, setUserPicture] = useState(null);

    const token = localStorage.getItem("sessionToken") || "";
    
    //dropdown list state
    const [dropdownIsActive, setDropdownIsActive] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(()=>{
        readService();
        
        document.addEventListener("click", handleClickOutside);

        return ()=>{
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
        const apiUrl = `${ApiDomain}/users/${id}/pictures`;
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(data.status === 200){
                const blob = await data.blob();
                const url = URL.createObjectURL(blob);
                setUserPicture(url);
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

    return (
        <header>
            <nav className="nav-bar py-20 mx-auto">
                <div className="d-flex flex-row align-items-center justify-content-between px-20">
                    <Link to="/home">
                        <div className="d-flex align-items-center">
                            <span className="f-size-22 text-shadow-sm f-black-color">WeekieMochi</span>
                            <img className="img-fluid icon-sized-img png-border" src={WMIconNavBar} alt="Weekie Mochi icon: cat playing"/>
                        </div>
                    </Link>
                    <ul className="navbar-regular-options d-flex px-20">
                        {
                            NavbarData.map((item, index)=>(
                                <li className="mx-15" key={index}>
                                    <Link to={item.url} title={item.title} className={(location.pathname === item.url) ? "wt-custom-animation" : ""}>
                                        {item.option}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
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

                </div>
            </nav>
        </header>
    )
}

export default MainNavbar;