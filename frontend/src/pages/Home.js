import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [blogs, setBlogs] = useState([]); // Danh sách blog
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục đang chọn

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    axios.get("http://localhost:9999/getcategory")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  // Lấy danh sách blog theo danh mục
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const url = selectedCategory 
          ? `http://localhost:9999/getblogbycategory/${selectedCategory}`
          : "http://localhost:9999/getblog";
        
        const response = await axios.get(url);
        setBlogs(Array.isArray(response.data.blogs) ? response.data.blogs : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory]); // Chạy lại khi selectedCategory thay đổi

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container>
      {/* Danh mục */}
      <h2 className="mt-4">Danh mục</h2>
      <Row>
        <Col md={3} className="mb-3">
          <Button
            variant={selectedCategory ? "outline-primary" : "primary"}
            className="w-100"
            onClick={() => setSelectedCategory(null)}
          >
            Tất cả
          </Button>
        </Col>
        {categories.map(category => (
          <Col key={category._id} md={3} className="mb-3">
            <Button
              variant={selectedCategory === category._id ? "primary" : "outline-primary"}
              className="w-100"
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name}
            </Button>
          </Col>
        ))}
      </Row>

      {/* Danh sách blog */}
      <h2 className="mt-4">Tất cả Blog</h2>
      <Row>
        {blogs.length > 0 ? (
          blogs.map(blog => (
            <Col key={blog._id} md={4} className="mb-3">
              <Card>
                <Card.Img variant="top" src={blog.image?.path || "/default-image.jpg"} alt={blog.title} />
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>{blog.description?.substring(0, 100)}...</Card.Text>
                  <Link to={`/blog/${blog._id}`} className="btn btn-primary">Xem chi tiết</Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">Không có blog nào</p>
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
