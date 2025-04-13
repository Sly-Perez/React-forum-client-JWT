import './PostBasicInfoBox.css';

const NoPostsFoundErrorBox = ({dataWasFiltered = false, customExplanation = null}) => {
    return (
        <div className="post-box d-flex flex-row align-items-center gap-10 px-20 py-20 my-20">
            <div className="w-80-percent">
                <div className="">
                    <h1 className="single-line-text">
                        {
                            (dataWasFiltered)
                            ?
                            "No posts found"
                            :
                            "No posts yet"
                        }
                    </h1>
                </div>
                <div className="d-flex flex-row gap-10 align-items-center">
                    <p>
                        {
                            (customExplanation)
                            ?
                            `${customExplanation}`
                            :
                                (dataWasFiltered)
                                ?
                                "Try different words or check your spelling."
                                :
                                "Go ahead and create a new post!"
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NoPostsFoundErrorBox;