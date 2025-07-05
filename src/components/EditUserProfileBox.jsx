import './UserProfileBox.css';
import { useEffect, useRef, useState } from "react";
import { ApiDomain } from "../data/ApiDomain";
import { Link, useNavigate } from "react-router-dom";
import { preventDefaultEvent } from '../utils/PreventDefaultEvent';
import Spinner from './Spinner';
import ImageCropper from './ImageCropper';

const EditUserProfileBox = ({user, userPicture}) => {
    const navigate = useNavigate();
    
    const [newUsername, setNewUsername] = useState(user.username ?? "");
    const [newUserEmail, setNewUserEmail] = useState(user.email ?? "");
    const [newUserPicture, setNewUserPicture] = useState("");
    const [newUserPictureSrc, setNewUserPictureSrc] = useState("");

    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);

    const [isInitialFetchLoading, setIsInitialFetchLoading] = useState(true);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);

    const [errorsList, setErrorsList] = useState([]);

    useEffect(()=>{
        setNewUsername(user.username ?? "");
        setNewUserEmail(user.email ?? "");
    }, [user]);

    
    const token = localStorage.getItem("sessionToken") || "";

    const submitForm = async(event)=>{
        preventDefaultEvent(event);
        setIsInitialFetchLoading(false);
        setIsUpdateLoading(true);
        setErrorsList([]);

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
            
            setIsUpdateLoading(false);
            const message = await response.errors;
            setErrorsList(message);
        }
        catch (error) {
            setIsUpdateLoading(false);
            console.error("Error uploading data:", error);
        }
    }

    const handleImageUpload = (image)=>{
        setNewUserPicture(image);
        setShowModal(false)

        if(image.type !== "image/gif"){
            setShowModal(true);
        }
    }

    const clearFileInput = ()=>{
        fileInputRef.current.value = "";
    }

    const handleClickOnEditPicture = (event)=>{
        event.preventDefault();

        const parent = event.target.parentElement;

        const form = parent.nextElementSibling;

        form.querySelector('input[type="file"]').click();
    }

    const loadUserData = ()=>{
        return (
            <article className="user-profile-box w-60-percent px-20 py-20 my-20">

                {
                    errorsList.length > 0
                    ? 
                        <ul className="w-60-percent d-flex flex-column alert-box py-20 px-20 my-10">
                            { 
                                errorsList.map((item, index)=>(
                                    <li className="f-size-14 list-style-circle" key={index}>{item}</li>
                                ))
                            }
                        </ul>
                    : 
                    null
                }

                <div className="d-flex flex-row gap-10">
                    <div className="user-profile-picture w-40-percent position-relative">
                        <img className="w-90-percent img-fluid" src={(newUserPictureSrc != "") ? newUserPictureSrc : userPicture} alt={`${user.username}'s picture`}/>
                        <i className="fa-solid fa-pen position-absolute icon-top-right cursor-pointer" to="" onClick={(event)=>handleClickOnEditPicture(event)}></i>
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
                            <div className="">
                                <p className="f-size-12">[For profile pictures, in case of gifs, they need to have the same width as height]</p>
                            </div>
                            <input className="upload-file-input cursor-pointer w-fit-content mt-10 mb-10 d-none" type="file" 
                                id="userPicture" 
                                ref={fileInputRef}
                                onChange={(event)=>handleImageUpload(event.target.files[0])}
                                accept=".gif, .jpeg, .jpg, .png, .webp"
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
                </div>

            </article>
        )
    } 

    return (
        <>
            {
                isInitialFetchLoading
                ?
                    (user && userPicture)
                    ?
                    loadUserData()
                    :
                    < Spinner />
                :
                    (isUpdateLoading)
                    ?
                    < Spinner />
                    :
                    loadUserData()
            }
            {
                showModal
                ?
                    <ImageCropper loadedImage={newUserPicture} setCroppedImage={setNewUserPicture} setShowModal={setShowModal} clearFileInput={clearFileInput} setCroppedImageSrc={setNewUserPictureSrc}/>
                :
                    null
            }
        </>
    )
}

export default EditUserProfileBox;