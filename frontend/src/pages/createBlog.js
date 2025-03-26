import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Dùng URL thay vì file
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:9999/getcategory");
        setCategories(res.data); // Đảm bảo luôn là mảng
      } catch (error) {
        console.error("Lỗi khi tải danh mục", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Bạn cần đăng nhập để tạo blog!");
      return;
    }

    if (!title || !description || !category || !imageUrl) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const blogData = { title, description, category, image: imageUrl };

    try {
      const res = await axios.post("http://localhost:9999/create/blog", blogData, {
        headers: { Authorization: token },
      });

      setMessage("Tạo blog thành công!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi tạo blog!");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Viết Blog</h2>
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

        <Button variant="primary" type="submit" className="w-100">Tạo Blog</Button>
      </Form>
    </Container>
  );
};

export default CreateBlog;
