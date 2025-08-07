import { useState } from "react";
import Spinner from './Spinner';
import { ApiDomain } from "../data/ApiDomain";
import { preventDefaultEvent } from "../utils/PreventDefaultEvent";
import { Link } from "react-router-dom";

const ForgotPasswordBox = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [errorsList, setErrorsList] = useState([]);
    const [messagesList, setMessagesList] = useState([]);
    
    const [hideForm, setHideForm] = useState(false);
    
    const [userEmail, setUserEmail] = useState("");

    const [requesterUserId, setRequesterUserId] = useState(null);

    const submitForm = async(event)=>{
        preventDefaultEvent(event);
        setIsLoading(true);
        setErrorsList([]);
        setMessagesList([]);

        const apiUrl =  `${ApiDomain}/users/my/password`;

        const formData = new FormData();
        formData.append("jsonBody", JSON.stringify({
            email: userEmail
        }));

        try{
            const data = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });
            
            const response = await data.json();

            setIsLoading(false);
            if(data.status === 200){
                setMessagesList(response.message);
                setRequesterUserId(response.user.userId);
                setHideForm(true);

                setUserEmail("");
                return;
            }

            setErrorsList(response.errors);
            setRequesterUserId(null);
            setUserEmail("");
        } 
        catch (error) {
            setIsLoading(false);
            console.error("Error uploading data:", error);
        }
    }

    const resendEmail = async()=>{
        setIsLoading(true);
        setMessagesList([]);
        setErrorsList([]);

        const apiUrl =  `${ApiDomain}/verifications/emailResends`;

        const formData = new FormData();
        formData.append("jsonBody", JSON.stringify({
            userId: requesterUserId,
            purpose: 'changePassword'
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
                setMessagesList(response.message);
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
                                (messagesList.length > 0)
                                ?
                                    <ul className="d-flex flex-column success-box py-20 px-20 m-0">
                                        {
                                            messagesList.map((item, index)=>(
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
                            <button className="d-flex flex-row gap-10 pagination-item cursor-pointer text-align-center px-20 py-10" onClick={()=>resendEmail()}>
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
                                <input className="py-10 px-10" type="email" placeholder="Insert your email" 
                                    value={userEmail}
                                    onChange={(event)=>setUserEmail(event.target.value)}
                                />
                                <button className="w-100-percent pagination-item cursor-pointer px-20 py-10">Search</button>
                            </div>

                            <div className="d-flex flex-row align-items-center justify-content-center">
                                <Link className="WT-anchor w-fit-content cursor-pointer text-align-center" to="/">
                                    Cancel
                                </Link>
                            </div>
                            
                        </form>
                    }
                </>
            }
        </>
    )
}

export default ForgotPasswordBox;