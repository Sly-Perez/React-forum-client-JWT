import './UserProfilePage.css';
import UserProfileBox from "../components/UserProfileBox";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApiDomain } from '../data/ApiDomain';
import { VerifyJWT } from '../utils/VerifyJWT';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    
    const [user, setUser] = useState([]);
    const [userInSession, setUserInSession] = useState([]);
    const [userPicture, setUserPicture] = useState(null);
    const [errorsList, setErrorsList] = useState([]);
    
    const token = localStorage.getItem("sessionToken") || "";
    
    useEffect(()=>{
        VerifyJWT(navigate, location.pathname);
        readService(userId);
    }, [userId]);

    const readService = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}`;
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setUser(data);
                readServicePictures(data.userId);
                readUserInSession();
                return;
            }

            const errors = data.errors;
            setErrorsList(errors);
        } 
        catch (error) {
            navigate("/serverError");
        }
    }

    const readServicePictures = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}/pictures`;
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(response.status === 200 || response.status === 404){
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setUserPicture(url);
                return;
            }

            const data = await response.json();
            const errors = data.errors;
            setErrorsList(errors);
        }
        catch (error) {
            navigate("/serverError");
        }
    }

    const readUserInSession = async()=>{
        const apiUrl = `${ApiDomain}/users/my/profile`;
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setUserInSession(data);
                return;
            }
            
        } 
        catch (error) {
            navigate("/serverError");
        }
    }

    return (
        <section id="section-1-user-profile" className="py-20 px-20 min-height-500 d-flex flex-column justify-content-start align-items-center">
            {/*<?php if(isset($success_message)):?>
                <ul className="d-flex flex-column success-box py-20 px-20 my-10">
                    <li className="f-size-14"><?= $success_message; ?></li>
                </ul>
            <?php endif; ?>*/}
        
            < UserProfileBox user={user} userPicture={userPicture} errors={errorsList} 
                    isEditButtonActive={userInSession.userId === user.userId} 
                    isDeleteButtonActive={(userInSession.userId === user.userId && userInSession.hierarchyLevelId === 2) || (userInSession.hierarchyLevelId === 1 && user.userId != userInSession.userId)}
                    userIsAdmin={userInSession.hierarchyLevelId == 1}        
            />
        </section>
    )
}

export default UserProfilePage;