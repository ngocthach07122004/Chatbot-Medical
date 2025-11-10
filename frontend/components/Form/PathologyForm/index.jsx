import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./PatientForm.module.scss"; // hoặc file css bạn dùng

const cx = classNames.bind(styles);

export default function AddPathologyForm({ setShowForm, onSave }) {
  const [dataFields, setDataFields] = useState([{ key: "", value: "" }]);
  const [title] = useState("Add Pathology Record");

  // Thêm một dòng key-value mới
  const handleAddField = () => {
    setDataFields([...dataFields, { key: "", value: "" }]);
  };

  // Cập nhật giá trị từng field
  const handleField = (index, field, value) => {
    const updated = [...dataFields];
    updated[index][field] = value;
    setDataFields(updated);
  };

  // Submit dữ liệu về parent
  const handleSave = (e) => {
    e.preventDefault();

    // Chuyển danh sách key-value thành object data
    const formattedData = dataFields.reduce((acc, item) => {
      if (item.key.trim() !== "") acc[item.key] = item.value;
      return acc;
    }, {});

    const payload = {
      data: formattedData,
    };

    // Gửi lại cho parent (API call thực hiện ở trên component cha)
    onSave(payload);
    setShowForm(false);
  };

  return (
    <div>
      <div className={cx("overlay")} onClick={() => setShowForm(false)} />
      <div className={cx("modal")}>
        <form onSubmit={handleSave} className={cx("modal_content")}>
          <h2>{title}</h2>

          <div className={cx("data_section")}>
            <h4>Pathology Data</h4>
            {dataFields.map((f, i) => (
              <div key={i} className={cx("data_row")}>
                <input
                  placeholder="Key (e.g. abc123)"
                  value={f.key}
                  onChange={(e) => handleField(i, "key", e.target.value)}
                  required
                />
                <input
                  placeholder="Value (e.g. 213)"
                  value={f.value}
                  onChange={(e) => handleField(i, "value", e.target.value)}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className={cx("btn", "secondary")}
              onClick={handleAddField}
            >
              + Add Field
            </button>
          </div>

          <div className={cx("modal_actions")}>
            <button className={cx("btn", "primary")} type="submit">
              Save
            </button>
            <button
              className={cx("btn")}
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
