import { useEffect, useState } from "react";
import CommentDetailsBox from "./CommentDetailsBox";
import { ApiDomain } from "../data/ApiDomain";

const CommentsListing = ({post, userInSession, refreshTrigger, handleRefreshOfComments}) => {

    const [comments, setComments] = useState([]);
    const [commentsQuantity, setCommentsQuantity] = useState(post.commentsQuantity);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readService(post);
        readServicePostCommentsQty(post);
    }, [post, userInSession, refreshTrigger, handleRefreshOfComments]);

    const readService = async(post)=>{
        const apiUrl = `${ApiDomain}/posts/${post.postId}/comments`;
        
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setComments(data);
                return;
            }

        } 
        catch (error) {
            //navigate("/serverError");
        }
    }

    const readServicePostCommentsQty = async(post)=>{
        const apiUrl = `${ApiDomain}/posts/${post.postId}`;
        
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setCommentsQuantity(data.commentsQuantity);
                return;
            }

        } 
        catch (error) {
            //navigate("/serverError");
        }
    }

    return (
        <>
            <h2 className="f-weight-500">
                { commentsQuantity } {commentsQuantity === 1 ? "Comment" : "Comments"}
            </h2>
            <div className="post-details-comments my-20">
                {
                    comments.map((item)=>(
                        < CommentDetailsBox  key={item.commentId} userInSession={userInSession} comment={item} userId={item.userId} handleRefreshOfComments={handleRefreshOfComments}/>
                    ))
                }
            </div>
        </>
    )
}

export default CommentsListing;