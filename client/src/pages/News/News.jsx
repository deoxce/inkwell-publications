import { Link } from "react-router-dom";

import './News.css';

export default function News() {
    return (
        <div className="container">
            <div className="wrapper">
                <Link to={"/news"} className="news" id="news3"></Link>
                <Link to={"/news"} className="news" id="news2"></Link>
                <Link to={"/news"} className="news" id="news1"></Link>
                <div className="news"></div>
                <div className="news"></div>
                <div className="news"></div>
            </div>
        </div>
    )
}