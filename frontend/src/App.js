import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChangePassword from './components/Changepassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import HomePage from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateBlog from "./pages/createBlog";
import UserBlogs from "./pages/UserBlogs";
import { Container } from "react-bootstrap";

const App = () => {
    return (
        <Router>
          <Header />
            <div className="flex flex-col items-center justify-center min-h-screen">
             
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />  
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/createblog" element={<CreateBlog />} />
                    <Route path="/myblogs" element={<UserBlogs />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;