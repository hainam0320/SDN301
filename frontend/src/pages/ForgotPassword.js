import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner, Container, Row, Col } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import "../css/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/forget-password", { email });
            setMessage(res.data.message);
            setEmail(""); // Xóa input sau khi gửi thành công
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row>
                    <Col>
                        <Card className="forgot-password-card shadow-lg p-4">
                            <Card.Body>
                                <Card.Title className="text-center fw-bold">Quên Mật Khẩu</Card.Title>
                                <p className="text-center text-muted">Nhập email để nhận mã OTP đặt lại mật khẩu</p>
                                <Form onSubmit={handleForgotPassword}>
                                    <Form.Group className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text"><FaEnvelope /></span>
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập email của bạn"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </Form.Group>
                                    <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : "Gửi OTP"}
                                    </Button>
                                </Form>
                                {message && (
                                    <p className={`mt-3 text-center ${isError ? "text-danger" : "text-success"}`}>
                                        {message}
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ForgotPassword;
