import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/register', { userName, lastName, email, phone, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div 
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            }}
        >
            <div className="card shadow p-4" style={{ width: '400px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="User Name" 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Last Name" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-3">Register</button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>
    );
};

export default Register;
