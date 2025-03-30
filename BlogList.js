
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlogList.css"; // Ensure to create this CSS file for styling

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [comments, setComments] = useState({});
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;
  const maxPages = 9;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get("https://dummyjson.com/posts"),
          axios.get("https://jsonplaceholder.typicode.com/posts")
        ]);
        
        const blogPosts = [...response1.data.posts.slice(0, 2000), ...response2.data.slice(0, 20)];
        setBlogs(blogPosts);

        const initialLikes = {};
        const initialDislikes = {};
        const initialComments = {};
        const initialExpanded = {};
        blogPosts.forEach(blog => {
          initialLikes[blog.id] = 0;
          initialDislikes[blog.id] = 0;
          initialComments[blog.id] = [];
          initialExpanded[blog.id] = false;
        });
        setLikes(initialLikes);
        setDislikes(initialDislikes);
        setComments(initialComments);
        setExpanded(initialExpanded);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleLike = (id) => {
    setLikes((prevLikes) => ({ ...prevLikes, [id]: prevLikes[id] + 1 }));
  };

  const handleDislike = (id) => {
    setDislikes((prevDislikes) => ({ ...prevDislikes, [id]: prevDislikes[id] + 1 }));
  };

  const handleComment = (id, comment) => {
    if (comment.trim() !== "") {
      setComments((prevComments) => ({
        ...prevComments,
        [id]: [...prevComments[id], comment],
      }));
    }
  };

  const toggleReadMore = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const handleTranslate = async (id, text) => {
    try {
      const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`);
      const translatedText = response.data.responseData.translatedText;
      setBlogs(prevBlogs => prevBlogs.map(blog => 
        blog.id === id ? { ...blog, body: translatedText } : blog
      ));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const nextPage = () => {
    if (currentPage < Math.min(maxPages, Math.ceil(filteredBlogs.length / blogsPerPage))) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <h2>Dummy Blog Posts</h2>
      <input
        type="text"
        placeholder="Search blog posts..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        currentBlogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <h3>{blog.title}</h3>
            <p>
              {expanded[blog.id] ? blog.body : `${blog.body.substring(0, 75)}...`}
              <button className="read-more" onClick={() => toggleReadMore(blog.id)}>
                {expanded[blog.id] ? "Read Less" : "Read More"}
              </button>
            </p>
            <button className="translate-btn" onClick={() => handleTranslate(blog.id, blog.body)}>Translate to English</button>
            <div className="interactions">
              <button className="like-btn" onClick={() => handleLike(blog.id)}>👍 {likes[blog.id]}</button>
              <button className="dislike-btn" onClick={() => handleDislike(blog.id)}>👎 {dislikes[blog.id]}</button>
            </div>
            <div className="comments-section">
              <input
                type="text"
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(blog.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <ul>
                {comments[blog.id].map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} </span>
        <button onClick={nextPage} disabled={currentPage >= Math.min(maxPages, Math.ceil(filteredBlogs.length / blogsPerPage))}>Next</button>
      </div>
    </div>
  );
};

export default BlogList;


/*
dev.to.api
import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://dev.to/api/articles");
        setBlogs(response.data.slice(0, 10)); // Fetch only the first 10 blogs
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Latest Blogs</h2>
      {loading ? <p>Loading blogs...</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {blogs.map((blog) => (
            <li key={blog.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
              {blog.cover_image && (
                <img src={blog.cover_image} alt={blog.title} style={{ width: "100%", height: "auto", borderRadius: "8px" }} />
              )}
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <a href={blog.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;
*/

/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dark-theme.css"; // Dark theme styles

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState({});
    const [newBlog, setNewBlog] = useState({ title: "", body: "" });
    const [translatedTexts, setTranslatedTexts] = useState({});

    useEffect(() => {
       
       axios.get("https://jsonplaceholder.typicode.com/posts")
            .then(response => {
                const blogPosts = response.data.slice(0, 50);
                setBlogs(blogPosts);
                const initialLikes = {};
                const initialComments = {};
                blogPosts.forEach(blog => {
                    initialLikes[blog.id] = 0;
                    initialComments[blog.id] = [];
                });
                setLikes(initialLikes);
                setComments(initialComments);
            })
            .catch(error => console.error("Error fetching blogs:", error));
    }, []);

    const handleLike = (id) => {
        setLikes(prevLikes => ({ ...prevLikes, [id]: prevLikes[id] + 1 }));
    };

    const handleComment = (id, comment) => {
        setComments(prevComments => ({ 
            ...prevComments, 
            [id]: [...prevComments[id], comment] 
        }));
    };

    const handleAddBlog = () => {
        if (newBlog.title && newBlog.body) {
            const newEntry = {
                id: blogs.length + 1,
                title: newBlog.title,
                body: newBlog.body,
            };
            setBlogs([newEntry, ...blogs]);
            setNewBlog({ title: "", body: "" });
        }
    };

    const handleTranslate = async (id, text) => {
        if (!translatedTexts[id]) {
            try {
                const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`);
                setTranslatedTexts(prev => ({ ...prev, [id]: response.data.responseData.translatedText }));
            } catch (error) {
                console.error("Error translating text:", error);
            }
        } else {
            setTranslatedTexts(prev => {
                const newTexts = { ...prev };
                delete newTexts[id];
                return newTexts;
            });
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.body.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container enhanced-theme">
            <div className="navbar">
                <Link to="/" className="home-button">🏠</Link>
            </div>
            <h1 className="title">Blog List</h1>
            <input 
                type="text" 
                className="search-bar" 
                placeholder="Search blog..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
            />

            <div className="add-blog-form">
                <h2>Add a New Blog</h2>
                <input 
                    type="text" 
                    placeholder="Blog Title" 
                    value={newBlog.title} 
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} 
                />
                <textarea 
                    placeholder="Blog Content" 
                    value={newBlog.body} 
                    onChange={(e) => setNewBlog({ ...newBlog, body: e.target.value })} 
                />
                <button onClick={handleAddBlog}>Submit</button>
            </div>

            <div className="blog-list">
                {filteredBlogs.map(blog => (
                    <div key={blog.id} className="blog-card">
                        <h2>{blog.title}</h2>
                        <p>{translatedTexts[blog.id] ? translatedTexts[blog.id] : blog.body.substring(0, 100)}...</p>
                        <div className="interactions">
                            <button className="like-btn" onClick={() => handleLike(blog.id)}>
                                👍 {likes[blog.id]}
                            </button>
                            <button className="translate-btn" onClick={() => handleTranslate(blog.id, blog.body)}>🌍 Translate</button>
                        </div>
                        <Link to={`/blog/${blog.id}`} className="read-more">Read More</Link>
                        <div className="comments-section">
                            <input 
                                type="text" 
                                placeholder="Add a comment..." 
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleComment(blog.id, e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                            />
                            <ul>
                                {comments[blog.id].map((comment, index) => (
                                    <li key={index}>{comment}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogList;
*/