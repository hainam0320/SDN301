import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/user/reset-password/${token}`, { password: newPassword });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi xảy ra");
    }
  };

  return (
    <div className="reset-password-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Đặt lại mật khẩu</h2>
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Đặt lại</button>
        </form>
        {message && <p className="mt-3 text-center text-danger">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
