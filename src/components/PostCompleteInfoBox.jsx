import { useEffect, useState } from "react";

import PostDetailsBox from "./PostDetailsBox";
import { ApiDomain } from "../data/ApiDomain";
import AddCommentForm from "./AddCommentForm";
import CommentsListing from "./CommentsListing";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";


const PostCompleteInfoBox = ({post, userId, errors}) => {

    const navigate = useNavigate();

    const [user, setUser] = useState([]);
    const [userInSession, setUserInSession] = useState([]);
    const [userPicture, setUserPicture] = useState(null);

    const [userPictureVersion, setUserPictureVersion] = useState(Date.now());

    const [isLoading, setIsLoading] = useState(true);

    const [refreshComments, setRefreshComments] = useState(false);

    const token = localStorage.getItem("sessionToken") || "";
    
    useEffect(()=>{
        readServiceUser(userId);
    }, [userId]);

    const readServiceUser = async(id)=>{
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
                readServiceUserPictures(response.userId);
                readUserInSession();
                setIsLoading(false);
                return;
            }
            
        } 
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    const readServiceUserPictures = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}/pictures/${userPictureVersion}`;
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(data.status === 200 || data.status === 404){
                const blob = await data.blob();
                const url = URL.createObjectURL(blob);
                setUserPicture(url);
                return;
            }
        }
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    const readUserInSession = async()=>{
        const apiUrl = `${ApiDomain}/users/my/profile`;
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setUserInSession(data);
                return;
            }
            
        } 
        catch (error) {
            navigate("/serverError");
        }
    }

    const deletePost = async(id)=>{
        const apiUrl = `${ApiDomain}/posts/${id}`;
        setIsLoading(true);

        try{

            const data = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if(data.status === 200){
                navigate(`/weekieTalkie`, { state: { successMessage: "Post Deleted Successfully!" } });
                return;
            }

            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            console.error("Error uploading data:", error);
        }
    }

    const handleRefreshOfComments = ()=>{
        setRefreshComments(!refreshComments);
    }

    const loadPostData = () =>{
        return (
            <>
                {
                    (userInSession.userId === user.userId) || (userInSession.hierarchyLevelId === 1)
                    ?
                    <div className="d-flex flex-row justify-content-f-end mb-5">
                        <button className="white-to-dark-red-btn squared-border cursor-pointer" onClick={()=>deletePost(post.postId)}>
                            Delete
                        </button>
                    </div>
                    :
                    null
                }
                <PostDetailsBox post={post} user={user} userPicture={userPicture} />
                <AddCommentForm isMainComment={true} addCommentIsShown={true} postId={post.postId} onCommentSubmit={() => handleRefreshOfComments()}/>
                <div className="post-comments-box py-20 px-20 mt-10">
                    < CommentsListing post={post} userInSession={userInSession} refreshTrigger={refreshComments} handleRefreshOfComments={handleRefreshOfComments}/>
                </div>
            </>
        )
    }

    return (
        <div className={`post-details-box w-60-percent px-20 py-20 my-20 gap-10 ${errors.length > 0 ? "d-flex justify-content-center align-items-center" : ""}`}>
            {
                errors.length === 0
                ?
                <>
                    {
                        isLoading
                        ?
                        < Spinner />
                        :
                            (post && user && userInSession && userPicture)
                            ?
                            loadPostData()
                            :
                            null
                    }
                </>
                :
                <div className="error-box movie-poster py-20 px-20 text-center">
                {
                    errors.map((item, index)=>(
                        <div key={index}>
                            <p className="mb-10">Whoops! {item}</p>
                            <Link className="WT-anchor" to="/WeekieTalkie">Go Back to Home</Link>
                        </div>
                ))
                }
                </div>
            }
        </div>
    )
}

export default PostCompleteInfoBox;