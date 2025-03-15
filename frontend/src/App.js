import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";


const App = () => {
  return (
    <Router>
      <Header />
      <Container className="mt-4">
        <Routes>
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
