import './SignUpForm.css';
import { useRef, useState } from 'react';
import { preventDefaultEvent } from '../utils/PreventDefaultEvent';
import { Link } from 'react-router-dom';

import { ApiDomain } from '../data/ApiDomain';

import Spinner from './Spinner';
import ImageCropper from './ImageCropper';

const SignUpForm = () => {
    
    const [username, setUsername] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPicture, setUserPicture] = useState("");

    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);

    const [errorsList, setErrorsList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [hideForm, setHideForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState([]);

    const [signedUpUserId, setSignedUpUserId] = useState(null);

    const token = localStorage.getItem("sessionToken") || "";

    const submitForm = async(event)=>{
        preventDefaultEvent(event);
        setIsLoading(true);
        setErrorsList([]);

        const apiUrl =  `${ApiDomain}/users/signup`;

        const formData = new FormData();
        formData.append("picture", userPicture);
        formData.append("jsonBody", JSON.stringify({
            username: username,
            email: userEmail,
            password: userPassword
        }));

        try{
            const data = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });
            
            const response = await data.json();

            setIsLoading(false);
            if(data.status === 201){
                setSuccessMessage(response.message);
                setSignedUpUserId(response.user.userId);
                setHideForm(true);

                setUsername("");
                setUserEmail("");
                setUserPassword("");
                setUserPicture("");
                return;
            }

            const message = await response.errors;
            setErrorsList(message);
            setUserPassword("");
            setUserPicture("");
        } 
        catch (error) {
            setIsLoading(false);
            console.error("Error uploading data:", error);
        }
    }

    const resendConfirmationEmail = async()=>{
        setIsLoading(true);
        setSuccessMessage([]);
        setErrorsList([]);

        const apiUrl =  `${ApiDomain}/verifications/emailResends`;

        const formData = new FormData();
        formData.append("jsonBody", JSON.stringify({
            userId: signedUpUserId,
            purpose: 'verifyEmail'
        }));

        try{
            const data = await fetch(apiUrl, {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            
            const response = await data.json();

            setIsLoading(false);

            if(data.status == 200){
                setSuccessMessage(response.message);
                return;
            }

            setErrorsList(response.errors);
            return;
        } 
        catch (error) {
            setIsLoading(false);
            console.error("Error uploading data:", error);
        }
    }

    const handleImageUpload = (image)=>{
        
        setUserPicture(image);
        setShowModal(false)

        if(image.type !== "image/gif"){
            setShowModal(true);
        }
    }

    const clearFileInput = ()=>{
        fileInputRef.current.value = "";
    }

    const handleClickOnAddImgIcon = (event)=>{
        event.preventDefault();
        
        let target = event.target;

        if (event.target.tagName.toLowerCase() === 'span') {
            target = event.target.parentElement;
        }

        target.nextElementSibling.click();
    }

    return (
        <>
            {
                isLoading
                ?
                < Spinner />
                :
                <>
                    {
                        hideForm
                        ?
                        <div className="sign-up-form w-25-percent squared-border d-flex flex-column py-20 px-20 gap-10">
                            { 
                                (successMessage.length > 0)
                                ?
                                    <ul className="d-flex flex-column success-box py-20 px-20 m-0">
                                        {
                                            successMessage.map((item, index)=>(
                                                <li className="f-size-14" key={index}>{item}</li>
                                            ))
                                        }
                                    </ul>
                                :
                                    (errorsList.length > 0)
                                    ?
                                        <ul className="d-flex flex-column alert-box py-20 px-20 m-0">
                                            {
                                                errorsList.map((item, index)=>(
                                                    <li className="f-size-14" key={index}>{item}</li>
                                                ))
                                            }
                                        </ul>
                                    :
                                        null
                            }
                            <button className="d-flex flex-row gap-10 pagination-item cursor-pointer text-align-center px-20 py-10" onClick={()=>resendConfirmationEmail()}>
                                <span>Resend email</span>
                            </button>
                        </div>
                        :
                        <form className="sign-up-form w-25-percent squared-border d-flex flex-column py-20 px-20 gap-10" action="" onSubmit={(event)=>submitForm(event)}>

                            {
                                (errorsList.length > 0)
                                ?
                                <ul className="d-flex flex-column alert-box py-20 px-20 m-0">
                                    {
                                        errorsList.map((item, index)=>(
                                            <li className="f-size-14 list-style-circle" key={index}>{item}</li>
                                        ))
                                    }
                                </ul>
                                :
                                null
                            }

                            <div className="d-flex flex-column gap-10">
                                <h2>Username: </h2>
                                <input type="text" minLength="1" maxLength="30" id="username" className="add-header-input" value={username} onChange={(event)=>setUsername(event.target.value)}/>
                            </div>
                            <div className="d-flex flex-column gap-10">
                                <h2>Email: </h2>
                                <input type="email" minLength="1" maxLength="100" id="userEmail" className="add-header-input" value={userEmail} onChange={(event)=>setUserEmail(event.target.value)}/>
                            </div>
                            <div className="d-flex flex-column gap-10">
                                <h2>Password: </h2>
                                <input type="password" minLength="1" maxLength="30" id="userPassword" className="add-header-input" value={userPassword} onChange={(event)=>setUserPassword(event.target.value)}/>
                            </div>
                            <div className="d-flex flex-column gap-10">
                                <div className="">
                                    <h2>Profile Picture: </h2>
                                    <p className="f-size-12">(optional)</p>
                                </div>
                                <i className="fa-solid fa-images cursor-pointer pagination-item p-4 w-50-percent" onClick={(event)=>handleClickOnAddImgIcon(event)}>
                                    <span className="f-size-12">  Add Image</span>
                                </i>
                                <input className="d-none upload-file-input cursor-pointer w-fit-content mt-10 mb-10" type="file" 
                                    id="userPicture" 
                                    ref={fileInputRef}
                                    onChange={(event)=>handleImageUpload(event.target.files[0])}
                                    accept=".gif, .jpeg, .jpg, .png, .webp"
                                />
                                <p className="f-size-12">[In case of gifs, they need to have the same width as height]</p>
                            </div>
                            <div className="d-flex flex-column align-items-center gap-10 mt-10 mb-10">
                                <button type="submit" className="w-100-percent pagination-item cursor-pointer px-20 py-10">Sign Up</button>
                                <Link className="WT-anchor w-fit-content cursor-pointer" to="/">
                                    Have an account already?
                                </Link>
                            </div>
                        </form>
                    }
                </>
            }

            {
                showModal
                ?
                    <ImageCropper loadedImage={userPicture} setCroppedImage={setUserPicture} setShowModal={setShowModal} clearFileInput={clearFileInput}/>
                :
                    null
            }
        </>
    )
}

export default SignUpForm;