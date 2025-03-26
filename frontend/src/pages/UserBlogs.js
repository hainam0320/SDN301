import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const userId = localStorage.getItem("userId"); // ✅ Lấy userId từ localStorage

  useEffect(() => {
    fetchUserBlogs();
  }, []);

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

      console.log("🔍 Gửi request với userId:", userId);

      const res = await axios.get(`http://localhost:9999/getuserblog/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ API Response:", res.data);

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

  // ✅ Xóa blog
  const handleDeleteBlog = async (blogId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:9999/deleteblog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage(res.data.message);
      setBlogs(blogs.filter((blog) => blog._id !== blogId)); // Cập nhật UI sau khi xóa
    } catch (error) {
      console.error("❌ Lỗi khi xoá blog:", error.response?.data || error);
      setError(error.response?.data?.message || "Lỗi khi xoá blog!");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">My Blog</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

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

                  {/* ✅ Nút Xóa */}
                  <Button
                    variant="danger"
                    className="mt-2 d-block w-100"
                    onClick={() => handleDeleteBlog(blog._id)}
                  >
                    Xoá
                  </Button>

                  {/* ✅ Nút Sửa */}
                  <Link to={`/edit/${blog._id}`} className="btn btn-primary mt-2 d-block w-100">
                    Sửa
                  </Link>
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
