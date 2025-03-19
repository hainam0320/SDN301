import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChangePassword from './components/Changepassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const App = () => {
    return (
        <Router>
            <div className="flex flex-col items-center justify-center min-h-screen">
             
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />  
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;