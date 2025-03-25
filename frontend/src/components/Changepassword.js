import { useState } from "react";
import axios from "axios";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ChangePassword = () => {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới không khớp!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/change-password", {
                email,
                currentPassword,
                newPassword
            });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Lỗi xảy ra");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{
            background: "linear-gradient(to right, #667eea, #764ba2)",
            display: "flex",
            flexDirection: "column"
        }}>
            <Card style={{
                width: "420px",
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                backgroundColor: "#fff",
                animation: "fadeIn 0.5s ease-in-out"
            }}>
                <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#333" }}>Đổi mật khẩu</h3>
                <Form onSubmit={handleChangePassword}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Mật khẩu hiện tại</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu hiện tại"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <Button variant="outline-secondary" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                <i className={showCurrentPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Button variant="outline-secondary" onClick={() => setShowNewPassword(!showNewPassword)}>
                                <i className={showNewPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Button className="mt-4 w-100" variant="primary" type="submit" style={{
                        fontWeight: "bold",
                        borderRadius: "8px",
                        backgroundColor: "#4c8bf5",
                        borderColor: "#4c8bf5"
                    }}>
                        Đổi mật khẩu
                    </Button>
                </Form>
                {message && (
                    <p className={`text-center mt-3 ${message.includes("thành công") ? "text-success" : "text-danger"}`} style={{ fontWeight: "bold" }}>
                        {message}
                    </p>
                )}
            </Card>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default ChangePassword;