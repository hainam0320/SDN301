import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Alert, Button, Form } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ userName: "", lastName: "", phone: "", email: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userId = localStorage.getItem("userId"); // ✅ Lấy userId từ localStorage
  const token = localStorage.getItem("token"); // ✅ Lấy token từ localStorage

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!token) {
        setError("Bạn chưa đăng nhập!");
        return;
      }

      if (!userId) {
        setError("Không tìm thấy ID người dùng.");
        return;
      }

      console.log("🔍 Gửi request với userId:", userId);

      const res = await axios.get(`http://localhost:9999/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ API Response:", res.data);

      if (res.data.user) {
        setUser(res.data.user);
        setFormData({
          userName: res.data.user.userName,
          lastName: res.data.user.lastName,
          phone: res.data.user.phone,
          email: res.data.user.email,
        });
      } else {
        setError("Không thể tải thông tin người dùng.");
      }
    } catch (err) {
      console.error("❌ Lỗi API:", err.response || err);
      setError(err.response?.data?.message || "Lỗi khi tải thông tin.");
    }
  };

  // ✅ Cập nhật thông tin người dùng
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:9999/api/v1/user/upprofile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(res.data.message);
      setUser(res.data.user);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật profile:", error.response?.data || error);
      setError(error.response?.data?.message || "Lỗi khi cập nhật thông tin!");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Thông Tin Cá Nhân</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Thông tin tài khoản</Card.Title>

              <Form onSubmit={handleUpdateProfile}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ</Form.Label>
                  <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" name="userName" value={formData.userName} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} readOnly />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">Cập Nhật</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
