import { useEffect, useState } from "react";
import { ApiDomain } from "../data/ApiDomain";
import { useNavigate, useParams } from "react-router-dom";
import PostCompleteInfoBox from "../components/PostCompleteInfoBox";

const PostDetailsPage = () => {

    const navigate = useNavigate();

    const { postId } = useParams();

    const [post, setPost] = useState([]);
    const [errorsList, setErrorsList] = useState([]);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readService(postId);
    }, [postId]);

    const readService = async(id)=>{
        const apiUrl = `${ApiDomain}/posts/${id}`;
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setPost(data);
                return;
            }

            const errors = data.errors;
            setErrorsList(errors);
        } 
        catch (error) {
            navigate("/serverError");
        }
    }

    return (
        <section id="section-1-wt" className="py-20 px-20 min-height-500 d-flex flex-row justify-content-center">
            < PostCompleteInfoBox post={post} userId={post.userId} errors={errorsList}/>
        </section>
    )
}

export default PostDetailsPage;