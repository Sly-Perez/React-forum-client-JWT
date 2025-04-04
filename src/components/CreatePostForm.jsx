import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { preventDefaultEvent } from "../utils/PreventDefaultEvent";
import { ApiDomain } from "../data/ApiDomain";

const CreatePostForm = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("sessionToken") || "";

    const [postHeader, setPostHeader] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postPictures, setPostPictures] = useState([]);

    const [errorsList, setErrorsList] = useState([]);

    const submitForm = async(event)=>{
        preventDefaultEvent(event);
        setErrorsList([]);

        const apiUrl =  `${ApiDomain}/posts`;

        const formData = new FormData();

        for (let i = 0; i < postPictures.length; i++) {
            formData.append("pictures[]", postPictures[i]);
        }

        formData.append("jsonBody", JSON.stringify({
            header: postHeader,
            description: postDescription
        }));

        try{
            const data = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            
            const response = await data.json();

            if(data.status === 201){
                navigate('/my/posts', { state: { successMessage: "Post Created Successfully!" } });
                setPostHeader("");
                setPostDescription("");
                setPostPictures([]);
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
        <form className="d-flex flex-column w-100-percent" action="" onSubmit={(event)=>submitForm(event)}>
            
            {
                (errorsList.length > 0)
                ?
                <ul className="d-flex flex-column alert-box py-20 px-20 my-10">
                    {
                        errorsList.map((item, index)=>(
                            <li className="f-size-14 list-style-circle" key={index}>{item}</li>
                        ))
                    }
                </ul>
                :
                null
            }

            <label htmlFor="postHeader">Header: </label>
            <textarea className="w-90-percent resize-none add-header-input mt-10 mb-10" id="postHeader" 
                rows="1" minLength="1" maxLength="100" placeholder="Add a header..."
                value={postHeader}
                onChange={(event)=>setPostHeader(event.target.value)}
            />
            <label htmlFor="postDescription">Description: </label>
            <textarea className="w-90-percent resize-none add-header-input mt-10 mb-10" id="postDescription" 
                rows="25" minLength="1" maxLength="1000" placeholder="Add a description..."
                value={postDescription}
                onChange={(event)=>setPostDescription(event.target.value)}
            />
            <span>Attach Image(s): </span>
            <input className="upload-file-input cursor-pointer w-fit-content mt-10 mb-10" type="file" id="pictures" 
                name="pictures[]" accept=".gif, .jpeg, .jpg, .png, .webp" multiple 
                onChange={(event)=>setPostPictures(event.target.files)}
            />
            <div className="d-flex flex-row gap-10 mt-10 mb-10">
                <Link className="transparent-to-white-btn squared-border" type="button" to="/weekieTalkie">
                    Cancel
                </Link>
                <button type="submit" className="pagination-item cursor-pointer px-20 py-10">Post</button>
            </div>
        </form>
    )
}

export default CreatePostForm;