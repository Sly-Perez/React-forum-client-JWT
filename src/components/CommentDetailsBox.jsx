import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddCommentForm from "./AddCommentForm";
import { ApiDomain } from "../data/ApiDomain";
import RepliesListing from "./RepliesListing";
import CommentReactionsBox from "./CommentReactionsBox";
import Spinner from "./Spinner";

const CommentDetailsBox = ({userInSession, comment, userId, handleRefreshOfComments}) => {

    const [user, setUser] = useState([]);
    const [userPicture, setUserPicture] = useState(null);

    const [userPictureVersion, setUserPictureVersion] = useState(Date.now());

    const [commentImages, setCommentImages] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [addCommentIsShown, setAddCommentIsShown] = useState(false);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readServicePictures(comment);
        readServiceUser(userId);
    }, [userInSession, comment, userId, handleRefreshOfComments]);

    const readServicePictures = async(comment)=>{
        
        if(comment.numberOfImages === 0){
            return;
        }
        
        let apiUrls = [];

        for (let i = 0; i < comment.numberOfImages; i++) {
            apiUrls.push(`${ApiDomain}/comments/${comment.commentId}/pictures/${i+1}`);
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
            setCommentImages(urls);
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
        <>
            <div className="post-details-comment px-20 py-20 pb-10">
                <div className="d-flex flex-row gap-10 mb-5">
                    {
                        isLoading
                        ?
                        < Spinner />
                        :
                        <>
                            <div className="">
                                <Link to={`/users/profile/${user.userId}`}>
                                    <img className="img-fluid icon-sized-img circle-like-border" src={userPicture} alt={`${user.username}'s profile picture`} />
                                </Link>
                            </div>
                            <div className="">
                                <div className="d-flex flex-row align-items-center white-space-no-wrap gap-10">
                                    <p>
                                        <b>
                                            <Link className="black-text" to={`/users/profile/${user.userId}`}>
                                                {user.username}
                                            </Link>
                                        </b>
                                    </p>
                                    <span className="little-gray-text">
                                        {comment.publishDatetime}
                                    </span>
                                </div>
                                <div className="word-wrap-break">
                                    <p className="my-10">
                                        {comment.description}
                                    </p>
                                    
                                    {
                                        comment.numberOfImages > 0
                                        ?
                                        <div className="post-details-comment-img per-row-3-col align-items-center gap-10 mx-10 my-10">
                                            {
                                                commentImages.map((item, index)=>(
                                                    <img className="img-fluid mx-10" src={item} alt={`${user.username}'s comment picture`} key={index} />
                                                ))
                                            }
                                        </div>
                                        :
                                        null
                                    }
                                    
                                    
                                    <div className="d-flex flex-row align-items-center gap-10">

                                        < CommentReactionsBox comment={comment} handleRefreshOfComments={handleRefreshOfComments} />

                                        <div className="reply-to-comment mx-10">
                                            <Link className="little-gray-text like-dislike-icon" 
                                                onClick={(event)=>toggleAddCommentState(event)}
                                            >
                                                Reply
                                            </Link>
                                        </div>
                                    </div>
                                    < AddCommentForm addCommentIsShown={addCommentIsShown} hideAddCommentForm={hideAddCommentForm} 
                                        postId={comment.postId} responseTo={comment.commentId} onCommentSubmit={() => handleRefreshOfComments()}
                                    />
                                    
                                </div>
                            </div>

                            {
                                (userInSession.userId === user.userId) || (userInSession.hierarchyLevelId === 1)
                                ?
                                <div className="">
                                    <i className="fa-solid fa-trash-can white-to-dark-red-icon" onClick={()=>deleteComment(comment.commentId)}></i>
                                </div>
                                :
                                null
                            }
                        </>
                    }
                </div>
            </div>

            {
                isLoading
                ?
                null
                :
                    comment.repliesQuantity > 0
                    ?
                    < RepliesListing userInSession={userInSession} comment={comment} handleRefreshOfComments={handleRefreshOfComments}/>
                    :
                    null
            }
        </>
    )
}

export default CommentDetailsBox;