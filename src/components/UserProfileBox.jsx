import { useNavigate } from 'react-router-dom';
import './UserProfileBox.css';
import { ApiDomain } from '../data/ApiDomain';
import { useState } from 'react';
import Spinner from './Spinner';

const UserProfileBox = ({user, userPicture, errors, isEditButtonActive = false, isDeleteButtonActive = false, userIsAdmin = false}) => {

    const navigate = useNavigate();
    const token = localStorage.getItem("sessionToken") || "";

    const [errorsList, setErrorsList] = useState([]);

    const [isInitialFetchLoading, setIsInitialFetchLoading] = useState(true);
    const [isDeletionLoading, setIsDeletionLoading] = useState(false);

    const deleteProfile = async(id)=>{
        setIsInitialFetchLoading(false)
        setIsDeletionLoading(true);
        
        const apiUrl = userIsAdmin
                        ? `${ApiDomain}/users/${id}`
                        : `${ApiDomain}/users/my/profile`;

        try{

            const data = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            const response = await data.json();

            if(data.status === 200){
                navigate("/weekieTalkie");
                return;
            }
            
            const message = await response.errors;
            setErrorsList(message);

            
        }
        catch (error) {
            console.error("Error uploading data:", error);
        }
    }

    const loadUserData = ()=>{
        return (
            <article className={`d-flex user-profile-box gap-10 px-20 py-20 my-20 gap-10`}>
                {
                    (errors.length > 0 && user.length === 0)
                    ? 
                    <div className="w-100-percent d-flex flex-row justify-content-center align-items-center">
                        <div className="movie-poster py-20 px-20 text-center">
                            { 
                                errors.map((item, index)=>(
                                    <p className="mb-10" key={index}>Whoops! {item} </p>
                                ))
                            }
                        </div>
                    </div>
                    : 
                    <>
                        <div className="user-profile-picture">
                            <img className="img-fluid" src={userPicture} alt={`${user.username}'s picture`}/>
                        </div>
                        <div className="user-profile-information d-flex flex-column gap-10">
                            <div className="d-flex flex-column">
                                <h2>Username: </h2>
                                <span className="f-size-22">{user.username}</span>
                            </div>
                            <div className="d-flex flex-column">
                                <h2>Joined at: </h2>
                                <span className="f-size-22">{user.joinedAt}</span>
                            </div>
                            <div className="d-flex flex-column">
                                <h2>Amount of posts: </h2>
                                <span className="f-size-22">{user.amountOfPosts}</span>
                            </div>
                            <div className="d-flex flex-row gap-10">
                                {
                                    isEditButtonActive
                                    ?
                                    <button className="pagination-item w-fit-content cursor-pointer px-20 py-10" onClick={()=>navigate("/users/my/settings")}>
                                        Edit
                                    </button>
                                    :
                                    null
                                }
                                {
                                    isDeleteButtonActive
                                    ?
                                    <button className="white-to-dark-red-btn squared-border cursor-pointer" onClick={()=>deleteProfile(user.userId)}>
                                        Delete
                                    </button>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </>
                }
            </article>
        )
    }

    return (
        <>
            {
                (errorsList.length > 0)
                ?
                <ul className="d-flex flex-column alert-box py-20 px-20 m-0">
                    {
                        errorsList.map((item, index)=>(
                            <li className="f-size-14 list-style-circle" key={index}>{item}</li>
                        ))
                    }
                </ul>
                :
                null
            }
            
            {
                isInitialFetchLoading
                ?
                    errors.length === 0
                    ?
                        (user && userPicture)
                        ?
                        loadUserData()
                        :
                        <Spinner />
                    :
                        (errors)
                        ?
                        loadUserData()
                        :
                        < Spinner />
                :
                    isDeletionLoading
                    ?
                    < Spinner />
                    :
                    loadUserData()
            }
        </>
    )
}

export default UserProfileBox;