import './UserProfilePage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EditUserProfileBox from '../components/EditUserProfileBox';
import { ApiDomain } from '../data/ApiDomain';
import { VerifyJWT } from '../utils/VerifyJWT';

const EditUserProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [user, setUser] = useState([]);
    const [userPicture, setUserPicture] = useState(null);

    const [userPictureVersion, setUserPictureVersion] = useState(Date.now());

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        VerifyJWT(navigate, location.pathname);
        readService();
    }, []);
    
    const readService = async()=>{
        const apiUrl = `${ApiDomain}/users/my/profile`;
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
                return;
            }
            
        } 
        catch (error) {
            navigate("/serverError");
        }
    }

    const readServicePictures = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}/pictures/${userPictureVersion}`;
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
        }
        catch (error) {
            navigate("/serverError");
        }
    }


    return (
        <section id="section-1-user-profile" className="py-20 px-20 min-height-500 d-flex flex-column align-items-center">
            <EditUserProfileBox user={user} userPicture={userPicture}/>
        </section>
    )
}

export default EditUserProfilePage;