import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // Trạng thái danh mục được chọn

  useEffect(() => {
    axios.get("http://localhost:9999/category/getcategory")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));

    fetchBlogs();
  }, []);

  const fetchBlogs = (category = null) => {
    setLoading(true);
    let url = "http://localhost:9999/getblog";
    if (category) url = `http://localhost:9999/getblogbycategory/${category}`;

    axios.get(url)
      .then(response => {
        setBlogs(Array.isArray(response.data.blogs) ? response.data.blogs : []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchBlogs(categoryId);
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container>
      <h2 className="mt-4">Danh mục</h2>
      <Row>
        <Col md={3} className="mb-3">
          <Button
            variant={selectedCategory ? "outline-primary" : "primary"}
            className="w-100"
            onClick={() => {
              setSelectedCategory(null);
              fetchBlogs();
            }}
          >
            Tất cả
          </Button>
        </Col>
        {categories.map(category => (
          <Col key={category._id} md={3} className="mb-3">
            <Button
              variant={selectedCategory === category._id ? "primary" : "outline-primary"}
              className="w-100"
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.name}
            </Button>
          </Col>
        ))}
      </Row>

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
          <p>Không có blog nào</p>
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
