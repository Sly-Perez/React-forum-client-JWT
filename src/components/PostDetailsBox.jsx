import './PostDetailsBox.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiDomain } from "../data/ApiDomain";

const PostDetailsBox = ({post, user, userPicture}) => {
    const [postImages, setPostImages] = useState([]);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readServicePictures(post);
    }, [post]);

    const readServicePictures = async(post)=>{

        if(post.numberOfImages === 0){
            return;
        }
        
        let apiUrls = [];

        for (let i = 0; i < post.numberOfImages; i++) {
            apiUrls.push(`${ApiDomain}/posts/${post.postId}/pictures/${i+1}`);
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
            setPostImages(urls);
        }
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    return (
        <div className="post-details-post py-20 px-20">
            <div className="d-flex flex-row align-items-center gap-10">
                <div className="">
                    <Link to={`/users/profile/${user.userId}`}>
                        <img className="img-fluid icon-sized-img circle-like-border" src={userPicture} alt={`${user.username}'s profile picture`} />
                    </Link>
                </div>
                <div className="">
                    <p>
                        <Link className="black-text" to={`/users/profile/${user.userId}`}>
                            By {user.username}
                        </Link>
                    </p>
                </div>
            </div>
            <div className="post-details-information">
                <h2 className="word-wrap-break my-10">
                    {post.header}
                </h2>
                <p className="word-wrap-break my-10">
                    {post.description}
                </p>

                {
                    post.numberOfImages > 0
                    ?
                        <div className="post-details-img per-row-3-col align-items-center gap-10 mx-10">
                            {
                                postImages.map((item, index)=>(
                                    <img className="img-fluid mx-10" src={item} alt={`${user.username}'s post image`} key={index}/>
                                ))
                            }
                        </div>
                    :
                    null
                }

            </div>
        </div>
    )
}

export default PostDetailsBox;