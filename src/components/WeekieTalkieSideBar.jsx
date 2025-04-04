import './WeekieTalkieSideBar.css';
import { Link } from "react-router-dom";

const WeekieTalkieSideBar = () => {
    return (
        <div className="post-sections box-border min-height-500 py-20 px-20">
            <div className="d-flex flex-column gap-10">
                <Link className="WT-anchor" to="/weekieTalkie">
                    Posts
                </Link>
                <Link className="WT-anchor" to="/my/posts">
                    My Posts
                </Link>
            </div>
        </div>
    )
}

export default WeekieTalkieSideBar;