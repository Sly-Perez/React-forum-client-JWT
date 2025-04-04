import PostBasicInfoBox from "./PostBasicInfoBox";
import { useEffect, useState } from "react";
import { ApiDomain } from "../data/ApiDomain";

const PostsListing = ({posts}) => {

    const [userBlankPicture, setUserBlankPicture] = useState([]);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readServiceBlankPictures();
    }, [posts]);

    const readServiceBlankPictures = async()=>{
        const apiUrl = `${ApiDomain}/users/zero/pictures`;
        try{
            const data = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(data.status === 200){
                const blob = await data.blob();
                const url = URL.createObjectURL(blob);
                setUserBlankPicture(url);
                return;
            }
        }
        catch (error) {
            //navigate("/serverError");
            return;
        }
    }

    return (
        posts.map((item)=>(
            < PostBasicInfoBox post={item} userId={item.userId} userBlankPicture={userBlankPicture} key={item.postId} />
        ))
    )
}

export default PostsListing;