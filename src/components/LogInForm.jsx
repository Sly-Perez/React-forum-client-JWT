import { useState } from 'react';
import { preventDefaultEvent } from '../utils/PreventDefaultEvent';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiDomain } from '../data/ApiDomain';

const LogInForm = () => {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const [errorsList, setErrorsList] = useState([]);

    const location = useLocation();
    const successMessage = location.state?.successMessage ?? null;


    const submitForm = async(event)=>{
        preventDefaultEvent(event);

        const apiUrl = `${ApiDomain}/users/login`;
        const JSONBody = JSON.stringify({
            email: userEmail,
            password: userPassword
        });

        try{
            const data = await fetch(apiUrl, {
                method: "POST",
                body: JSONBody,
            });

            const response = await data.json();

            if(data.status === 200){
                const token = await response.token;
                localStorage.setItem("sessionToken", token);
                navigate("/home");
                return;
            }
            
            const message = await response.errors;
            setErrorsList(message);
        } 
        catch (error) {
            console.error("Error uploading data:", error);
        }
    }

    return (    
        <form className="sign-up-form w-25-percent squared-border d-flex flex-column py-20 px-20 gap-10" action="" method="post" onSubmit={(event)=>submitForm(event)}>
            
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

            {
                (successMessage != null)
                ?
                <ul className="d-flex flex-column success-box py-20 px-20 m-0">
                    <li className="f-size-14">{successMessage}</li>
                </ul>
                :
                null
            }

            <div className="d-flex flex-column gap-10">
                <h2>Email: </h2>
                <input type="email" minLength="1" maxLength="100" className="add-header-input" onChange={(event)=>setUserEmail(event.target.value)}/>
            </div>
            <div className="d-flex flex-column gap-10">
                <h2>Password: </h2>
                <input type="password" minLength="1" maxLength="30" className="add-header-input" onChange={(event)=>setUserPassword(event.target.value)}/>
            </div>
            <div className="d-flex flex-column align-items-center gap-10 mt-10 mb-10">
                <button type="submit" className="w-100-percent pagination-item cursor-pointer px-20 py-10">Login</button>
                <Link className="WT-anchor w-fit-content cursor-pointer" to="/signup">
                    Don't have an account yet?
                </Link>
            </div>
        </form>
    )
}

export default LogInForm;