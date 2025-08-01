import { useEffect, useState } from "react";

import Spinner from './Spinner';
import { ApiDomain } from "../data/ApiDomain";

const VerifyEmailBox = ({verificationToken}) => {

    const [messagesList, setMessagesList] = useState([]);
    const [errorsList, setErrorsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        verifyEmail(verificationToken);
    }, [verificationToken]);

    const verifyEmail = async(verificationToken)=>{
        setMessagesList([]);
        setErrorsList([]);

        const apiUrl =  `${ApiDomain}/verifications/emails`;

        const formData = new FormData();
        formData.append("jsonBody", JSON.stringify({
            verificationToken: verificationToken
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
            console.error("Error verifying email:", error);
        }
    }

    return (
        <>
            {
                isLoading
                ?
                    < Spinner />
                :
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
                            null
                        }
                        {
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
                    </div>
            }
        </>
    )
}

export default VerifyEmailBox;