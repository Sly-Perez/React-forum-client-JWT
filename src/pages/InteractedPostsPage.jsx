import { Link, useLocation, useNavigate } from "react-router-dom";
import PostsListing from "../components/PostsListing";
import { ApiDomain } from "../data/ApiDomain";
import { useEffect, useState } from "react";
import { VerifyJWT } from "../utils/VerifyJWT";
import NoPostsFoundErrorBox from "../components/NoPostsFoundErrorBox";
import PaginationBox from "../components/PaginationBox";

const InteractedPostsPage = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [errorsList, setErrorsList] = useState([]);
    const [postsList, setPostsList] = useState([]);

    const [filterValue, setFilterValue] = useState("");
    const [postsFilterList, setPostsFilterList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const [successMessage, setSuccessMessage] = useState(null);

    const token = localStorage.getItem("sessionToken") || "";

    useEffect(()=>{
        VerifyJWT(navigate, location.pathname);
        readService();
        setSuccessMessage(location.state?.successMessage ?? null);
    }, []);

    const readService = async()=>{
        const apiUrl = `${ApiDomain}/posts/my/interacted`;
        try{
            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(response.status === 200){
                setPostsList(data);
                setPostsFilterList(data);

                if(data.length > 0){
                    const totalPages = Math.ceil(data.length / rowsPerPage);
                    setTotalPages(totalPages);
                    setCurrentPage(1);
                }
                else{
                    setTotalPages(0);
                    setCurrentPage(0);
                }

                return;
            }

            const errors = data.errors;
            setErrorsList(errors);
        } 
        catch (error) {
            //navigate("/serverError");
        }
    }

    const filterPosts = (text)=>{
        setFilterValue(text);

        const posts = postsList.filter(post => 
            post.header.toLowerCase().includes(text.trim().toLowerCase()) ||
            post.description.toLowerCase().includes(text.trim().toLowerCase())
        );
        setPostsFilterList(posts);
        setTotalPages(Math.ceil(posts.length / rowsPerPage));
        setCurrentPage(1);
    }

    const changePage = (page)=>{
        if((page > 0) && !(page > totalPages)){
            setCurrentPage(page);
        }
    }

    return (
            <>
                <section id="section-1-wt" className="py-20 px-20 min-height-500">
                    <div className="d-flex flex-column align-items-center gap-10">
                        <div className="post-list-section w-90-percent px-20 py-20 gap-10">
                            <div className="create-post-button my-10">
                                <button className="d-flex flex-row gap-10 pagination-item cursor-pointer px-20 py-10" onClick={()=>navigate("/posts/add")}>
                                    <i className="fa-solid fa-circle-plus d-flex align-items-center"></i>
                                    <span>Create Post</span>
                                </button>
                            </div>

                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <h1 className="f-size-30">Interacted</h1>
                                
                                <div className="d-flex flex-row">
                                    <input className="py-10 px-10" type="text" placeholder="Search" 
                                        value={filterValue}
                                        onChange={(event)=>filterPosts(event.target.value)}
                                    />
                                    <i className="fa-solid fa-magnifying-glass border-3 py-10 px-10 f-white-color bg-black"></i>
                                </div>
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
                                            < NoPostsFoundErrorBox customExplanation={"Go ahead and comment on any post!"} />
                                        :
                                            (postsFilterList.length === 0)
                                            ?
                                            < NoPostsFoundErrorBox dataWasFiltered={true} />
                                            :
                                            <>
                                                < PostsListing posts={postsFilterList} page={currentPage} rowsPerPage={rowsPerPage} />
                                                < PaginationBox currentPage={currentPage} totalPages={totalPages} changePage={changePage} />
                                            </>
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
                                                <Link className="WT-anchor" to="/weekieTalkie">Go Back To Home</Link>
                                            </div>
                                        </div>
                                    </div>
                                    
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
}

export default InteractedPostsPage;