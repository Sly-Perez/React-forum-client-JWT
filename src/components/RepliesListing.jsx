import './RepliesListing.css';
import { useEffect, useState } from "react";
import { ApiDomain } from "../data/ApiDomain";
import ReplyDetailsBox from "./ReplyDetailsBox";
import { Link } from "react-router-dom";

const RepliesListing = ({userInSession, comment, handleRefreshOfComments}) => {

    const [replies, setReplies] = useState([]);
    const [errorsList, setErrorsList] = useState([]);
    const [repliesBoxIsOpen, setRepliesBoxIsOpen] = useState(false);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readService(comment);
    }, [userInSession, comment, handleRefreshOfComments]);

    const readService = async(comment)=>{
        const apiUrl = `${ApiDomain}/comments/${comment.commentId}/replies`;
        
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setReplies(data);
                return;
            }

            const errors = data.errors;
            setErrorsList(errors);
        } 
        catch (error) {
            //navigate("/serverError");
        }
    }

    const openRepliesBox = (event)=>{
        event.preventDefault();
        
        setRepliesBoxIsOpen(!repliesBoxIsOpen);
    }

    return (
        <div className="more-comments-section w-fit-content ml-60 mb-20">
            <Link className="more-comments-icon cursor-pointer py-5 px-20 f-anchor-color d-flex flex-row gap-10 align-items-center w-fit-content mb-5"
                onClick={(event)=>openRepliesBox(event)}
            >
                <i className={`fa-solid fa-square-caret-down ${repliesBoxIsOpen ? "d-none" : ""}`}></i>
                <i className={`fa-solid fa-square-caret-up ${repliesBoxIsOpen ? "" : "d-none"}`}></i>
                <p>
                    {comment.repliesQuantity} {comment.repliesQuantity === 1 ? "Reply" : "Replies"}
                </p>
            </Link>
            <div className={`more-comments-displayed px-40 ${repliesBoxIsOpen ? "" : "d-none"}`}>
                {
                    replies.map((item)=>(
                        <ReplyDetailsBox key={item.commentId} userInSession={userInSession} reply={item} userId={item.userId} handleRefreshOfComments={handleRefreshOfComments}/>
                    ))
                }
            </div>
        </div>
    )
}

export default RepliesListing;