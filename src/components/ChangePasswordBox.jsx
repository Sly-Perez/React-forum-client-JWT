import { useState } from "react";
import Spinner from "./Spinner";
import { Link, useNavigate } from "react-router-dom";
import { ApiDomain } from "../data/ApiDomain";


const ChangePasswordBox = ({verificationToken}) => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [hideForm, setHideForm] = useState(false);

    const token = localStorage.getItem("sessionToken") || "";

    const [messagesList, setMessagesList] = useState([]);
    const [errorsList, setErrorsList] = useState([]);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeated, setNewPasswordRepeated] = useState("");

    const [passwordsAreVisible, setPasswordsAreVisible] = useState(false);


    const requestPasswordReset = async()=>{
        
        setIsLoading(true);
        setMessagesList([]);
        setErrorsList([]);

        if(newPassword != newPasswordRepeated){
            const errorsList = ["Both passwords must coincide"];
            setErrorsList(errorsList);
            setIsLoading(false);
            return;
        }

        const apiUrl = `${ApiDomain}/verifications/passwordChanges`;

        const formData = new FormData();
        formData.append("jsonBody", JSON.stringify({
            verificationToken: verificationToken,
            password: newPassword
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
                setErrorsList([]);
                setMessagesList(response.message);
                setHideForm(true);
                return;
            }

            if(data.status == 400 || data.status == 500){
                setMessagesList([]);
                setErrorsList(response.errors);
                return;
            }
        } 
        catch (error) {
            setIsLoading(false);
            console.error("Error reseting password:", error);
        }
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
                            (hideForm)
                            ?
                                <div className="sign-up-form w-25-percent squared-border d-flex flex-column py-20 px-20 gap-10">
                                    {
                                        (messagesList.length > 0)
                                        ?
                                        <>
                                            <ul className="d-flex flex-column success-box py-20 px-20 m-0">
                                            {
                                                messagesList.map((item, index)=>(
                                                    <li className="f-size-14" key={index}>{item}</li>
                                                ))
                                            }
                                            </ul>
                                            <div className="pagination-item cursor-pointer text-align-center px-20 py-10" onClick={()=>navigate("/weekieTalkie")}>
                                                <span>Go to home</span>
                                            </div>
                                        </>
                                        :
                                        null
                                    }
                                </div>
                            :
                                <div className="sign-up-form w-25-percent squared-border d-flex flex-column py-20 px-20 gap-10">
                                    {
                                        (errorsList.length > 0)
                                        ?
                                        <>
                                            <ul className="d-flex flex-column alert-box py-20 px-20 m-0">
                                                {
                                                    errorsList.map((item, index)=>(
                                                        <li className="f-size-14" key={index}>{item}</li>
                                                    ))
                                                }
                                            </ul>
                                        </>
                                        :
                                        null
                                    }
                                    <div className="d-flex flex-column align-items-center gap-10">
                                        <label htmlFor="newPassword">Insert your new password: </label>
                                        <div className="d-flex flex-row">
                                            <input className="py-10 px-10" type={`${passwordsAreVisible ? 'text' : 'password'}`} placeholder="New password" 
                                                value={newPassword}
                                                onChange={(event)=>setNewPassword(event.target.value)}
                                                id="newPassword"
                                            />
                                            <i className={`fa-solid ${passwordsAreVisible ? 'fa-eye-slash' : 'fa-eye'} border-3 py-10 px-10 f-white-color bg-black cursor-pointer`} onClick={()=>setPasswordsAreVisible(!passwordsAreVisible)} />
                                        </div>

                                        <label htmlFor="newPasswordRepeated">Repeate your new password: </label>
                                        <div className="d-flex flex-row">
                                            <input className="py-10 px-10" type={`${passwordsAreVisible ? 'text' : 'password'}`} placeholder="Repeate new password" 
                                                value={newPasswordRepeated}
                                                onChange={(event)=>setNewPasswordRepeated(event.target.value)}
                                                id="newPasswordRepeated"
                                            />
                                            <i className={`fa-solid ${passwordsAreVisible ? 'fa-eye-slash' : 'fa-eye'} border-3 py-10 px-10 f-white-color bg-black cursor-pointer`} onClick={()=>setPasswordsAreVisible(!passwordsAreVisible)} />
                                        </div>

                                        <div className="">
                                            <button className="w-100-percent pagination-item cursor-pointer px-20 py-10" onClick={()=>requestPasswordReset()}>Save changes</button>
                                        </div>

                                    </div>
                                </div>
                        }
                    </>
            }
        </>
    )
    
}

export default ChangePasswordBox;