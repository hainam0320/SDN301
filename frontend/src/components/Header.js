import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  const userId = localStorage.getItem("userId");
  const isAuthenticated = !!token; // Kiểm tra nếu token tồn tại

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    localStorage.removeItem("userId");
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home">Blog App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">Trang chủ</Nav.Link>
            

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/createblog">Viết Blog</Nav.Link>
                <Nav.Link as={Link} to="/myblogs">My Blog</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>Đăng xuất</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
