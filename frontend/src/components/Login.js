import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/login', { email, password });
            setMessage(response.data.message);
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light"
        style={{
          background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      }}>
            <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Enter your email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter your password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
                {message && <div className="alert alert-primary mt-3 text-center">{message}</div>}
            </div>
        </div>
    );
};

export default Login;
