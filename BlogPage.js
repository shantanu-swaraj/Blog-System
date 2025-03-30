import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.css";

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 5;

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/posts")
            .then(response => setBlogs(response.data.slice(0, 20))) // Limit to 20 blogs
            .catch(error => console.error("Error fetching blogs:", error));
    }, []);

    // Pagination logic
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    return (
        <div className="container">
            <nav className="navbar">
                <Link to="/" className="logo">📖 Blog System</Link>
                <div className="nav-links">
                    <Link to="/">🏠 Home</Link>
                    <Link to="/create">📝 Create Blog</Link>
                    <Link to="/blogpage">📜 All Blogs</Link>
                </div>
            </nav>
            
            <h1>All Blogs</h1>
            <div className="blog-list">
                {currentBlogs.map(blog => (
                    <div key={blog.id} className="blog-card">
                        <h2>{blog.title}</h2>
                        <p>{blog.body.substring(0, 100)}...</p>
                        <Link to={`/blog/${blog.id}`} className="read-more">Read More</Link>
                    </div>
                ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    ◀ Prev
                </button>
                <span> Page {currentPage} of {Math.ceil(blogs.length / blogsPerPage)} </span>
                <button disabled={indexOfLastBlog >= blogs.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default BlogPage;
