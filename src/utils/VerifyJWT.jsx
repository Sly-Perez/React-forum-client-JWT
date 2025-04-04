import { ApiDomain } from "../data/ApiDomain";

export const VerifyJWT = async(navigate, currentPath) => {
    
    const apiUrl = `${ApiDomain}/users/login`;
    try {
        const token = localStorage.getItem("sessionToken") || "";
        
        const data = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        //if the JWT has not expired and the client is in any other page that is not "/" nor "/signup", they will be redirected to the login page ("/")
        if(currentPath != "/" && currentPath != "/signup"){
            if(data.status === 400){
                navigate(currentPath);
                return;
            }

            if(data.status === 401){
                navigate("/");
                return;
            }
        }
        
        //otherwise, if they want to go to "/" or "/signup" and their JWT is still valid, they will be redirected to the home page
        if(data.status === 400){
            navigate("/home");
            return;
        }
        
    } catch (error) {
        navigate("/serverError");
        return;
    }

}