import './PostDetailsPage.css';
import CreatePostForm from "../components/CreatePostForm";

const CreatePostPage = () => {
    return (
        <section id="section-1-wt" className="py-20 px-20 min-height-500 d-flex flex-row justify-content-center">
            <article className="post-details-box px-20 py-20 my-20 gap-10">
                <h2 className="my-10 f-size-40">Create Post</h2>
                <div className="post-details-post squared-border py-20 px-20">
                    <div className="">
                        < CreatePostForm />
                    </div>
                </div>
            </article>
        </section>
    )
}

export default CreatePostPage;