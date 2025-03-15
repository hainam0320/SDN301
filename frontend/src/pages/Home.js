import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:9999/category/getcategory")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
    
    axios.get("http://localhost:9999/blogs")
      .then(response => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <>
      <Container>
        <h2 className="mt-4">Danh mục</h2>
        <Row>
          {categories.map(category => (
            <Col key={category._id} md={3} className="mb-3">
              <Card className="p-3 text-center">
                <Link to={`/category/${category._id}`}>{category.name}</Link>
              </Card>
            </Col>
          ))}
        </Row>
        
        <h2 className="mt-4">Tất cả Blog</h2>
        <Row>
          {blogs.map(blog => (
            <Col key={blog._id} md={4} className="mb-3">
              <Card>
                <Card.Img variant="top" src={blog.image?.path || "/default-image.jpg"} alt={blog.title} />
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>{blog.description.substring(0, 100)}...</Card.Text>
                  <Link to={`/blog/${blog._id}`} className="btn btn-primary">Xem chi tiết</Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
