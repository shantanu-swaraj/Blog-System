import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import Login from "./components/Login";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
