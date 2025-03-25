import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("category", formData.category);
    formDataObj.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:9999/blog/create", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Bài viết đã được tạo thành công!");
      navigate(`/blog/${response.data.blogData._id}`);
    } catch (error) {
      alert("Lỗi khi tạo bài viết: " + error.response?.data?.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Hình ảnh</label>
          <input type="file" className="form-control" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Tạo bài viết</button>
      </form>
    </div>
  );
}
