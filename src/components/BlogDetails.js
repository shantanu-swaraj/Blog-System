import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./dark-theme.css"; // Dark theme styles

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [bookmarked, setBookmarked] = useState(false);
    const [aiComment, setAiComment] = useState("");
    const [translatedText, setTranslatedText] = useState(null);

    useEffect(() => {
        axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then(response => {
                setBlog(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching blog details:", error));
    }, [id]);

    const handleLike = () => {
        setLikes(likes + 1);
    };

    const handleComment = () => {
        if (newComment.trim() !== "") {
            setComments([...comments, newComment]);
            setNewComment("");
        }
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
    };

    const generateAiComment = () => {
        const aiComments = [
            "Great insights!",
            "Loved this perspective!",
            "Very informative article.",
            "Thanks for sharing!",
            "This is exactly what I was looking for."
        ];
        const randomComment = aiComments[Math.floor(Math.random() * aiComments.length)];
        setAiComment(randomComment);
    };

    const handleTranslate = async () => {
        if (!translatedText) {
            try {
                const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(blog.body)}&langpair=auto|en`);
                setTranslatedText(response.data.responseData.translatedText);
            } catch (error) {
                console.error("Error translating text:", error);
            }
        } else {
            setTranslatedText(null);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!blog) return <div className="error">Blog not found.</div>;

    return (
        <div className="blog-details enhanced-theme">
            <div className="navbar">
                <Link to="/" className="home-button">🏠</Link>
                <button className="translate-btn" onClick={handleTranslate}>🌍 Translate</button>
            </div>
            <h1 className="blog-title">{blog.title}</h1>
            <p className="blog-content">{translatedText ? translatedText : blog.body}</p>
            
            <div className="interactions">
                <button className="like-btn" onClick={handleLike}>👍 {likes}</button>
                <button className="bookmark-btn" onClick={handleBookmark}>
                    {bookmarked ? "🔖 Bookmarked" : "📌 Bookmark"}
                </button>
            </div>
            
            <div className="comments-section">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>{comment}</li>
                    ))}
                    {aiComment && <li className="ai-comment">🤖 {aiComment}</li>}
                </ul>
                <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="post-btn" onClick={handleComment}>Post</button>
                <button className="ai-btn" onClick={generateAiComment}>✨ AI Comment</button>
            </div>
        </div>
    );
};

export default BlogDetails;

