import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId"); // ✅ Lấy userId từ localStorage

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Bạn chưa đăng nhập!");
          return;
        }

        if (!userId) {
          setError("Không tìm thấy ID người dùng.");
          return;
        }

        console.log("🔍 Gửi request với userId:", userId); // ✅ Debug userId

        const res = await axios.get(`http://localhost:9999/getuserblog/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ API Response:", res.data); // ✅ Debug response

        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        } else if (Array.isArray(res.data.blogs)) {
          setBlogs(res.data.blogs);
        } else {
          setBlogs([]);
          setError("Dữ liệu không hợp lệ từ server.");
        }
      } catch (err) {
        console.error("❌ Lỗi API:", err.response || err);
        setError(err.response?.data?.message || "Lỗi khi tải bài viết.");
      }
    };

    fetchUserBlogs();
  }, [userId]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">My Blog</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {blogs.length > 0 ? (
        <Row>
          {blogs.map((blog) => (
            <Col md={4} key={blog._id} className="mb-4">
              <Card className="shadow">
                <Card.Img
                  variant="top"
                  src={blog.image || "https://via.placeholder.com/600x400"}
                  alt={blog.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>
                    {blog.description.length > 100
                      ? blog.description.substring(0, 100) + "..."
                      : blog.description}
                  </Card.Text>
                  <small className="text-muted">
                    📅 {new Date(blog.createdAt).toLocaleDateString()}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-muted">Chưa có bài viết nào.</p>
      )}
    </Container>
  );
};

export default UserBlogs;
