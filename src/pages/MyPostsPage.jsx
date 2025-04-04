import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiDomain } from "../data/ApiDomain";
import WeekieTalkieSideBar from "../components/WeekieTalkieSideBar";
import PostsListing from "../components/PostsListing";

const MyPostsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [errorsList, setErrorsList] = useState([]);
    const [postsList, setPostsList] = useState([]);

    const successMessage = location.state?.successMessage || null;

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        readService();
    }, []);

    const readService = async()=>{
        const apiUrl = `${ApiDomain}/posts/my/list`;
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setPostsList(data);
                return;
            }

            const errors = data.errors;
            setErrorsList(errors);
        } 
        catch (error) {
            //navigate("/serverError");
        }
    }

    return (
        <>
            <section id="section-1-wt" className="py-20 px-20 min-height-500">
                <div className="d-flex flex-row mx-auto gap-10">
                    < WeekieTalkieSideBar />
                    <div className="post-list-section w-60-percent px-20 py-20 gap-10">
                        <div className="d-flex flex-row justify-content-between align-items-center">
                            <h1 className="f-size-30">My Posts</h1>
                            <button className="d-flex flex-row align-items-center gap-10 pagination-item cursor-pointer px-20 py-10" onClick={()=>navigate("/createPost")}>
                                <i className="fa-solid fa-circle-plus"></i>
                                <span>Create Post</span>
                            </button>
                        </div>
                        <div className={`posts-list ${errorsList.length === 0 ? "" : "d-flex justify-content-center align-items-center"}`}>
                            
                            {
                                successMessage !== null
                                ?
                                <ul className="d-flex flex-column success-box py-20 px-20 my-10">
                                    <li className="f-size-14">
                                        {successMessage}
                                    </li>
                                </ul>
                                :
                                null
                            }

                            {
                                errorsList.length === 0
                                ?
                                    (postsList.length === 0)
                                    ? 
                                    <div className="post-box d-flex flex-row align-items-center gap-10 px-20 py-20 my-20">
                                        <div className="w-80-percent">
                                            <div className="">
                                                <h1 className="single-line-text">
                                                    No posts yet
                                                </h1>
                                            </div>
                                            <div className="d-flex flex-row gap-10 align-items-center">
                                                <p>
                                                    Go ahead and create a new post!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    < PostsListing posts={postsList} />
                                :
                                <div className="post-box d-flex flex-row align-items-center gap-10 px-20 py-20 my-20">
                                    <div className="">
                                        
                                    </div>
                                    <div className="">
                                        <div className="post-information-header mb-10">
                                            <h1>
                                                Whoops! it seems there was an error while fetching posts data. Refresh the page or come back later.
                                            </h1>
                                        </div>
                                        <div className="">
                                            <Link className="WT-anchor" to="/home">Go Back To Home</Link>
                                        </div>
                                    </div>
                                </div>
                                
                            }
                        </div>
                    </div>
                    <aside className="wt-advertisement px-20">

                    </aside>
                </div>
            </section>
        </>
    )
}

export default MyPostsPage;