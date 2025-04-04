import './UserProfileBox.css';
import { useEffect, useState } from "react";
import { ApiDomain } from "../data/ApiDomain";
import { Link, useNavigate } from "react-router-dom";
import { preventDefaultEvent } from '../utils/PreventDefaultEvent';

const EditUserProfileBox = ({user, userPicture, errors}) => {
    const navigate = useNavigate();
    
    const [newUsername, setNewUsername] = useState(user.username ?? "");
    const [newUserEmail, setNewUserEmail] = useState(user.email ?? "");
    const [newUserPicture, setNewUserPicture] = useState("");

    useEffect(()=>{
        setNewUsername(user.username ?? "");
        setNewUserEmail(user.email ?? "");
    }, [user]);

    
    const token = localStorage.getItem("sessionToken") || "";

    const submitForm = async(event)=>{
        preventDefaultEvent(event);
        errors = [];

        const apiUrl =  `${ApiDomain}/users/my/profile`;

        const formData = new FormData();
        formData.append("picture", newUserPicture);
        formData.append("jsonBody", JSON.stringify({
            username: newUsername,
            email: newUserEmail          
        }));

        try{
            const data = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            
            const response = await data.json();

            if(data.status === 200){
                navigate(`/users/profile/${user.userId}`);
                setNewUsername("");
                setNewUserEmail("");
                setNewUserPicture("");
                return;
            }
            
            const message = await response.errors;
            errors = message;
        }
        catch (error) {
            console.error("Error uploading data:", error);
        }
    }

    return (
        <article className={`user-profile-box max-height-360 d-flex flex-row gap-10 ${errors.length > 0 ? "justify-content-center align-items-center" : ""} w-60-percent px-20 py-20 my-20`}>

                {
                    errors.length > 0
                    ? 
                        <ul className="w-60-percent d-flex flex-column alert-box py-20 px-20 my-10">
                            { 
                                errors.map((item, index)=>(
                                    <li className="f-size-14 list-style-circle" key={index}>{item}</li>
                                ))
                            }
                        </ul>
                    : 
                    null
                }

                <div className="user-profile-picture w-40-percent">
                    <img className="w-90-percent img-fluid" src={userPicture} alt={`${user.username}'s picture`}/>
                </div>
                <form className="user-profile-information d-flex flex-column gap-10" action="" onSubmit={(event)=>submitForm(event)}>
                    <div className="d-flex flex-column gap-10">
                        <h2>Username: </h2>
                        <input type="text" minLength="1" maxLength="30" 
                            className="add-header-input" 
                            value={newUsername} onChange={(event)=>setNewUsername(event.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-column gap-10">
                        <h2>Email: </h2>
                        <input type="email" minLength="1" maxLength="100" 
                            className="add-header-input" 
                            value={newUserEmail} onChange={(event)=>setNewUserEmail(event.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-column gap-10">
                        <h2>Profile Picture: </h2>
                        <input className="upload-file-input cursor-pointer w-fit-content mt-10 mb-10" 
                            type="file" accept=".gif, .jpeg, .jpg, .png, .webp"
                            onChange={(event)=>setNewUserPicture(event.target.files[0])}
                        />
                    </div>
                    <div className="d-flex flex-row gap-10">
                        <Link className="transparent-to-white-btn squared-border" type="button" to={`/users/profile/${user.userId}`}>
                            Cancel
                        </Link>
                        <button type="submit" className="pagination-item cursor-pointer px-20 py-10">
                            Save Changes
                        </button>
                    </div>
                </form>
        </article>
    )
}

export default EditUserProfileBox;