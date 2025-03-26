import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";

const updateBlog = () => {
  const { id } = useParams(); // Lấy ID của blog từ URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Hàm để lấy thông tin blog hiện tại
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:9999/getblog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blogData = res.data.blog;
        setTitle(blogData.title);
        setDescription(blogData.description);
        setCategory(blogData.category._id); // Lấy ID danh mục
        setImageUrl(blogData.image);
      } catch (error) {
        console.error("Lỗi khi tải thông tin blog", error);
        setMessage("Không thể tải thông tin blog!");
      }
    };

    // Hàm để lấy danh sách danh mục
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:9999/getcategory");
        setCategories(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục", error);
      }
    };

    fetchBlog();
    fetchCategories();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Bạn cần đăng nhập để cập nhật blog!");
      return;
    }

    const updatedBlogData = {
      title,
      description,
      category,
      image: imageUrl,
    };

    try {
      const res = await axios.put(`http://localhost:9999/updateblog/${id}`, updatedBlogData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Cập nhật blog thành công!");
      setTimeout(() => navigate("/home"), 2000); // Chuyển hướng sau khi cập nhật
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi cập nhật blog!");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Chỉnh sửa Blog</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Danh mục</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL Ảnh</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập URL ảnh"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">Cập nhật Blog</Button>
      </Form>
    </Container>
  );
};

export default updateBlog;