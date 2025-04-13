import './SignUpForm.css';
import { useState } from 'react';
import { preventDefaultEvent } from '../utils/PreventDefaultEvent';
import { Link, useNavigate } from 'react-router-dom';

import { ApiDomain } from '../data/ApiDomain';

import Spinner from './Spinner';

const SignUpForm = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPicture, setUserPicture] = useState("");

    const [errorsList, setErrorsList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

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
                navigate('/', { state: { successMessage: "Account Created Successfully. Log In!" } });

                setUsername("");
                setUserEmail("");
                setUserPassword("");
                setUserPicture("");
                return;
            }

            const message = await response.errors;
            setErrorsList(message);
            setUserPassword("");
        } 
        catch (error) {
            setIsLoading(false);
            console.error("Error uploading data:", error);
        }
    }

    return (
        <>
            {
                isLoading
                ?
                < Spinner />
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
                        <h2>Profile Picture: </h2>
                        <input className="upload-file-input cursor-pointer w-fit-content mt-10 mb-10" type="file" 
                            id="userPicture" 
                            onChange={(event)=>setUserPicture(event.target.files[0])}
                            accept=".gif, .jpeg, .jpg, .png, .webp"
                        />
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
    )
}

export default SignUpForm;