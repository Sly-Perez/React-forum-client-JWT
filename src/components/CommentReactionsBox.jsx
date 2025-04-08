import { useEffect, useState } from 'react';
import './CommentReactionsBox.css';
import { ApiDomain } from '../data/ApiDomain';
import Spinner from './Spinner';

const CommentReactionsBox = ({comment, handleRefreshOfComments}) => {

    const [existingCommentReaction, setExistingCommentReaction] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readService(comment);
    }, [comment, handleRefreshOfComments]);

    const readService = async(comment)=>{
        const apiUrl = `${ApiDomain}/comments/${comment.commentId}/my/reactions`;
                
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const response = await data.json();

            if(data.status === 200){
                setExistingCommentReaction(response);
                setIsLoading(false);
                return;
            }

            if(data.status === 404){
                setIsLoading(false);
            }
        } 
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    const reactToComment = async(event, comment, reactionName)=>{
        
        if(reactionName !== "isLike" && reactionName !== "isDislike"){
            return;
        }
        
        //we set the value of the new reaction based off if the icon was bold or not
        //if the icon is bold, it suggests the reaction value is 1. Therefore, the new reaction value will be 0
        //otherwise, the new reaction will be 1
        let newReactionValue;
        if(event.currentTarget.classList.contains("fa-solid")){
            newReactionValue = 0;
        }
        else{
            newReactionValue = 1;
        }
        
        setIsLoading(true);
        
        const formData = new FormData();
        if(reactionName === "isLike"){
            formData.append("jsonBody", JSON.stringify({
                isLike: newReactionValue
            }));
        }
        else{
            formData.append("jsonBody", JSON.stringify({
                isDislike: newReactionValue
            }));
        }

        
        const apiUrl = `${ApiDomain}/comments/${comment.commentId}/my/reactions`;
        
        try{
            const data = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if(data.status === 200){
                handleRefreshOfComments();
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
                < Spinner sizeLevel={1} />
                :
                <>
                    <div className="d-flex flex-row">                  
                        <i className={`${existingCommentReaction.isLike && existingCommentReaction.isLike === 1 ? "fa-solid" : "fa-regular"} fa-thumbs-up f-black-color like-dislike-icon mx-10 cursor-pointer`}
                            onClick={(event)=>reactToComment(event, comment, "isLike")}
                        ></i>

                        <p className="little-gray-text">
                            {comment.likesQuantity}
                        </p>
                    </div>
                    <div className="d-flex flex-row">
                        <i className={`${existingCommentReaction.isDislike && existingCommentReaction.isDislike === 1 ? "fa-solid" : "fa-regular"} fa-thumbs-down f-black-color like-dislike-icon mx-10 cursor-pointer`}
                            onClick={(event)=>reactToComment(event, comment, "isDislike")}
                        ></i>
                        
                        <p className="little-gray-text">
                            {comment.dislikesQuantity}
                        </p>
                    </div>
                </>
            }
        </>
    )
}

export default CommentReactionsBox;