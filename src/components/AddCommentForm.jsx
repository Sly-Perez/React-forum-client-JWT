import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiDomain } from "../data/ApiDomain";

const AddCommentForm = ({isMainComment = false, addCommentIsShown = false, hideAddCommentForm, postId, responseTo = null, index = null, onCommentSubmit}) => {

    const [errorsList, setErrorsList] = useState([]);
    const [addImgIconIsShown, setAddImgIconIsShown] = useState(false);

    const [user, setUser] = useState([]);
    const [userPicture, setUserPicture] = useState(null);

    const [commentDescription, setCommentDescription] = useState("");
    const [commentPictures, setCommentPictures] = useState([]);

    const token = localStorage.getItem("sessionToken") || "";
    const [fileInputId, setFileInputId] = useState("");

    useEffect(()=>{
        readServiceUser();
        generateFileInputId();
    }, [postId, responseTo]);

    const readServiceUser = async()=>{

        const apiUrl = `${ApiDomain}/users/my/profile`;
        
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
            }
        }
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    const generateFileInputId = () => {
        let baseId = `add-comment-file-input-${responseTo != null ? `c-${responseTo}` : `p-${postId}`}`;
        let newFileInputId = baseId;
        
        while (document.getElementById(newFileInputId)) {
            newFileInputId = `${baseId}-${index}`;
        }
        
        setFileInputId(newFileInputId);
    };

    const submitForm = async(event)=>{
        event.preventDefault();

        setErrorsList([]);

        const formData = new FormData();

        for (let i = 0; i < commentPictures.length; i++) {
            formData.append("pictures[]", commentPictures[i]);
        }

        formData.append("jsonBody", JSON.stringify({
            description: commentDescription
        }));

        try{

            let apiUrl;
        
            //if the comment prop is null, it means the user is trying to post a regular comment
            //therefore, we will not need a commentId
            if(responseTo === null){
                apiUrl = `${ApiDomain}/posts/${postId}/comments/`;
            }
            //otherwise, it means the user is trying to post a reply kind of comment
            //in this case, we will need a commentId
            else{
                apiUrl = `${ApiDomain}/comments/${responseTo}/replies/`;
            }

            const data = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if(data.status === 201){
                setCommentDescription("");
                setCommentPictures([]);
                setAddImgIconIsShown(false);

                if(!isMainComment && addCommentIsShown){
                    hideAddCommentForm();
                }

                if(onCommentSubmit){
                    onCommentSubmit();
                }
                return;
            }

            if(data.status === 400){
                const response = await data.json();
                setErrorsList(response.errors);
                return;
            }
        } 
        catch (error) {
            console.error("Error uploading data:", error);
        }
    }

    const handleCommentPictures = (event) => {
        const files = Array.from(event.target.files);
        setCommentPictures(files);
    };

    const handleCommentDescriptionKeyUp = ()=>{
        
        if(commentDescription.trim().length <= 0){
            setAddImgIconIsShown(false);
        }
        else{
            setAddImgIconIsShown(true);
        }
    }

    const handleClickOnAddImgIcon = (event)=>{
        event.preventDefault();
        document.getElementById(fileInputId).click();
    }

    const clearInputs = (event)=>{
        event.preventDefault();
        setCommentDescription("");
        setCommentPictures([]);

        if(!isMainComment && addCommentIsShown){
            hideAddCommentForm();
        }
    }

    return (
        <div className={`post-details-add-comment ${isMainComment ? "post-details-add-comment-main" : ""} ${ (addCommentIsShown === true) ? "" : "d-none"} my-20 mx-15`}>
                
                {
                    errorsList.length > 0
                    ?
                    <ul className="d-flex flex-column alert-box py-20 px-20 my-10">
                        {
                            errorsList.map((item, index)=>(
                                <li className="f-size-14 list-style-circle" key={index}>
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                    :
                    null
                }

                <div className="add-comment-box">
                    <form className="d-flex flex-row gap-10 align-items-center" action="" onSubmit={(event)=>submitForm(event)}>

                        <div className="d-flex flex-row gap-10 align-items-center w-70-percent">
                            <Link className="add-comment-user-picture" to={`/users/profile/${user.userId}`}>
                                <img className="img-fluid icon-sized-img circle-like-border" src={userPicture} alt={`${user.username}'s profile picture`} />
                            </Link>
                            <div className="w-100-percent">
                                <textarea className="w-90-percent resize-none search-var-input transition-all-ease-in-5ms" 
                                    rows="2" minLength="1" maxLength="300" placeholder="Add a comment..."
                                    value={commentDescription} onChange={(event)=>setCommentDescription(event.target.value)} onKeyUp={()=>handleCommentDescriptionKeyUp()}
                                />
                            </div>
                            <div className="add-comment-file-input-box">
                                <label htmlFor={fileInputId} className={`${addImgIconIsShown ? "" : "d-none"}`} >
                                    <i className="fa-solid fa-images cursor-pointer pagination-item p-4" onClick={(event)=>handleClickOnAddImgIcon(event)}></i>
                                </label>
                                <input type="file" id={fileInputId} name="pictures[]"
                                    className="d-none" accept=".gif, .jpeg, .jpg, .png, .webp" multiple
                                    onChange={(event)=>handleCommentPictures(event)}
                                />
                            </div>
                        </div>

                        <Link className="transparent-to-white-btn cancel-comment-button" onClick={(event)=>clearInputs(event)}>
                            Cancel
                        </Link>
                        <button className="green-btn cursor-pointer" type="submit">Comment</button>
                    </form>
                </div>
        </div>
    )
}

export default AddCommentForm;