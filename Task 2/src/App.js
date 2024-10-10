import "./App.css";
import { useState } from "react";
import { notification } from "antd";

function App() {
  const [formData, setFormData] = useState({
    time: "",
    quantity: 0,
    base: "",
    revenue: 0,
    price: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "", // Reset lỗi khi người dùng nhập lại
    });
  };

  const validateField = (fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "time":
        if (!value) {
          error = "Thời gian không được để trống.";
        }
        break;
      case "quantity":
        if (!value || isNaN(value) || value <= 0) {
          error = "Số lượng phải là một số dương.";
        }
        break;
      case "base":
        if (!value) {
          error = "Trụ không được để trống.";
        }
        break;
      case "revenue":
        if (!value || isNaN(value) || value < 0) {
          error = "Doanh thu phải là một số không âm.";
        }
        break;
      case "price":
        if (!value || isNaN(value) || value < 0) {
          error = "Đơn giá phải là một số không âm.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleUpdate = () => {
    const newErrors = {};
    for (const field in formData) {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        setErrors(newErrors);
        return; // Ngừng kiểm tra tiếp nếu có lỗi đầu tiên
      }
    }

    if (Object.keys(newErrors).length === 0) {
      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin giao dịch đã được cập nhật.",
      });
    }
  };

  return (
    <div className="transaction-form">
      <div className="header">
        <div className="left-section">
          <button className="back-btn">← Đóng</button>
          <h2>Nhập giao dịch</h2>
        </div>
        <button className="update-btn" onClick={handleUpdate}>
          Cập nhật
        </button>
      </div>

      <div className="form">
        <div className="form-group">
          <label htmlFor="time">Thời gian</label>
          <input
            type="datetime-local"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={errors.time ? "error" : ""}
          />
          {errors.time && <span className="error-message">{errors.time}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Số lượng</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={errors.quantity ? "error" : ""}
          />
          {errors.quantity && (
            <span className="error-message">{errors.quantity}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="base">Trụ</label>
          <select
            id="base"
            name="base"
            value={formData.base}
            onChange={handleChange}
            className={errors.base ? "error" : ""}
          >
            <option value="">Chọn trụ</option>
            <option value="1">Trụ 1</option>
            <option value="2">Trụ 2</option>
          </select>
          {errors.base && <span className="error-message">{errors.base}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="revenue">Doanh thu</label>
          <input
            type="number"
            id="revenue"
            name="revenue"
            value={formData.revenue}
            onChange={handleChange}
            className={errors.revenue ? "error" : ""}
          />
          {errors.revenue && (
            <span className="error-message">{errors.revenue}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price">Đơn giá</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "error" : ""}
          />
          {errors.price && (
            <span className="error-message">{errors.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
