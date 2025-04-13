import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddCommentForm from "./AddCommentForm";
import { ApiDomain } from "../data/ApiDomain";
import CommentReactionsBox from "./CommentReactionsBox";
import Spinner from "./Spinner";

const ReplyDetailsBox = ({userInSession, reply, userId, handleRefreshOfComments}) => {

    const [user, setUser] = useState([]);
    const [userPicture, setUserPicture] = useState([]);
    const [replyImages, setReplyImages] = useState([]);
    const [addCommentIsShown, setAddCommentIsShown] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readServicePictures(reply);
        readServiceUser(userId);
    }, [reply, userId, userInSession, handleRefreshOfComments]);


    const readServicePictures = async(reply)=>{
        
        if(reply.numberOfImages === 0){
            return;
        }
        
        let apiUrls = [];

        for (let i = 0; i < reply.numberOfImages; i++) {
            apiUrls.push(`${ApiDomain}/comments/${reply.commentId}/pictures/${i+1}`);
        }

        try{
            const blobs = await Promise.all(
                apiUrls.map( async(url) => {
                    const response = await fetch(url,{
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if(response.status === 200 || response.status === 404){
                        const blob = await response.blob();
                        return blob;
                    }
                })
            );
            
            const urls = blobs.map((blob) => URL.createObjectURL(blob));
            setReplyImages(urls);
        }
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

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
                readServiceUserPicture(response.userId);
                return;
            }
            
        } 
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    const readServiceUserPicture = async(id)=>{
        const apiUrl = `${ApiDomain}/users/${id}/pictures`;
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
                setIsLoading(false);
                return;
            }
        }
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    const deleteComment = async(id)=>{
        setIsLoading(true);
        const apiUrl = `${ApiDomain}/comments/${id}`;
        try{
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if(response.status === 200){
                handleRefreshOfComments();
                return;
            }
            setIsLoading(false);
        } 
        catch (error) {
            setIsLoading(false);
            // navigate("/serverError");
        }
    }

    const toggleAddCommentState = (event)=>{
        event.preventDefault();
        setAddCommentIsShown(!addCommentIsShown);
    }

    const hideAddCommentForm = () => {
        setAddCommentIsShown(false);
    };

    return (
            <div className="more-comment-displayed d-flex flex-row justify-content-between mb-5">
                <div className="d-flex flex-row gap-10 py-10">
                    {
                        isLoading
                        ?
                        < Spinner sizeLevel={2}/>
                        :
                        <>
                            <div className="">
                                <Link to={`/users/profile/${user.userId}`}>
                                    <img className="img-fluid comment-icon-sized-img circle-like-border" src={userPicture} alt={`${user.username}'s profile picture`} />
                                </Link>
                            </div>
                            <div className="">
                                <div className="d-flex flex-row align-items-center gap-10">
                                    <p>
                                        <b>
                                            <Link className="f-size-14 black-text" to={`/users/profile/${user.userId}`}>
                                                {user.username}
                                            </Link>
                                        </b>
                                    </p>
                                    <span className="little-gray-text f-size-12">
                                        {reply.publishDatetime}
                                    </span>
                                </div>
                                <div className="word-wrap-break">
                                    <p className="my-10 f-black-color f-size-14">
                                        {reply.description}
                                    </p>

                                    {
                                        reply.numberOfImages > 0
                                        ?
                                        <div className="post-details-comment-response-img per-row-3-col align-items-center gap-10 my-10">
                                            {
                                                replyImages.map((item, index)=>(
                                                    <img className="img-fluid mx-10" src={item} key={index} alt={`${user.username}'s comment picture`} />
                                                ))
                                            }
                                        </div>
                                        :
                                        null
                                    }
                                    <div className="d-flex flex-row align-items-center gap-10">
                                        
                                        < CommentReactionsBox comment={reply} handleRefreshOfComments={handleRefreshOfComments} />

                                        <div className="reply-to-comment mx-10">
                                            <Link className="little-gray-text like-dislike-icon"
                                                onClick={(event)=>toggleAddCommentState(event)}
                                            >Reply</Link>
                                        </div>
                                    </div>
                                    < AddCommentForm isMainComment={false} addCommentIsShown={addCommentIsShown} 
                                        hideAddCommentForm={hideAddCommentForm} postId={reply.postId} responseTo={reply.responseTo}
                                        onCommentSubmit={() => handleRefreshOfComments()}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </div>
                {
                    isLoading
                    ?
                    null
                    :
                        (userInSession.userId === user.userId) || (userInSession.hierarchyLevelId === 1)
                        ?
                        <div className="">
                            <i className="fa-solid fa-trash-can white-to-dark-red-icon" onClick={()=>deleteComment(reply.commentId)}></i>
                        </div>
                        :
                        null
                }
            </div>
            
    )
}

export default ReplyDetailsBox;