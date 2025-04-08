import './PostBasicInfoBox.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiDomain } from "../data/ApiDomain";
import Spinner from "../components/Spinner";

const PostBasicInfoBox = ({post, userId, userBlankPicture}) => {

    const [user, setUser] = useState([]);
    const [userPicture, setUserPicture] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readService(userId);
    }, [post, userId, userBlankPicture]);

    const readService = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}`;
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const response = await data.json();

            if(data.status === 200){
                setUser(response);
                readServicePictures(response.userId);
                return;
            }
            
        } 
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    const readServicePictures = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}/pictures`;
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(data.status === 200){
                const blob = await data.blob();
                const url = URL.createObjectURL(blob);
                setUserPicture(url);
                setIsLoading(false);
                return;
            }
        }
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }
    
    return (
        <>
            {
                isLoading
                ?
                <Spinner marginWillBeAdded={true} />
                :
                <Link className="post-box d-flex flex-row align-items-center gap-10 px-20 py-20 my-20" to={`/details/posts/${post.postId}`}>
                    <div className="">
                        <img className="img-fluid icon-sized-img circle-like-border" src={userPicture ?? userBlankPicture} alt={`${user.username}'s profile picture`} />
                    </div>
                    <div className="w-80-percent">
                        <div className="">
                            <h1 className="single-line-text">
                                {post.header}
                            </h1>
                        </div>
                        <div className="d-flex flex-row gap-10 align-items-center">
                            <p>
                                By {user.username}
                            </p>
                        </div>
                    </div>
                </Link>
            }
        </>
    )
}

export default PostBasicInfoBox;