import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Spinner, Alert, Form, Button, ListGroup } from "react-bootstrap";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(""); // Lưu tên người bình luận

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/getblog/${id}`);
        setBlog(response.data.blog);
        setComments(response.data.blog.comments || []);
      } catch (error) {
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user.trim()) {
      alert("Bạn cần nhập tên trước khi bình luận!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:9999/blog/${id}/comment`, {
        user: user,
        text: newComment,
      });

      setComments([...comments, response.data.comment]); // Cập nhật danh sách bình luận
      setNewComment("");
    } catch (error) {
      alert("Không thể thêm bình luận, vui lòng thử lại!");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;
  if (!blog) return <Alert variant="warning" className="text-center">Không tìm thấy bài viết</Alert>;

  return (
    <Container className="mt-4">
      <Card className="shadow-lg">
        <Card.Img variant="top" src={blog.image} alt={blog.title} />
        <Card.Body>
          <Card.Title className="fw-bold fs-3">{blog.title}</Card.Title>
          <Card.Subtitle className="text-muted mb-3">
            <strong>Tác giả:</strong> {blog.userId?.userName || "Không xác định"}<br />
            <strong>Danh mục:</strong> {blog.category?.name || "Chưa có danh mục"}
          </Card.Subtitle>
          <Card.Text className="fs-5">{blog.description}</Card.Text>
        </Card.Body>
      </Card>

      {/* Phần Bình luận */}
      <Card className="mt-4 shadow-sm">
        <Card.Body>
          <h4>Bình luận ({comments.length})</h4>
          <ListGroup variant="flush">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <ListGroup.Item key={index} className="py-2">
                  <strong>{comment.user}</strong>: {comment.text}
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted">Chưa có bình luận nào.</p>
            )}
          </ListGroup>

          {/* Form thêm bình luận */}
          <Form>

            <Form.Group controlId="comment" className="mt-2">
              <Form.Control
                type="text"
                placeholder="Viết bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" className="mt-2" onClick={handleAddComment}>
              Gửi bình luận
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
