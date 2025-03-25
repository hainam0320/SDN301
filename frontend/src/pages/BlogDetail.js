import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data.blog);
      } catch (error) {
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>Không tìm thấy bài viết</p>;

  return (
    <div className="container mt-4">
      <h2>{blog.title}</h2>
      <img src={`http://localhost:5000${blog.image.path}`} alt={blog.title} className="img-fluid" />
      <p><strong>Danh mục:</strong> {blog.category}</p>
      <p>{blog.description}</p>
    </div>
  );
}
