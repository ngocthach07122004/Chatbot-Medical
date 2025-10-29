import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./patientForm.module.scss";
import PatientService from "../../../services/patientService";
const cx = classNames.bind(styles);

function PatientForm({ title, initData = {}, setShowForm, onSubmit }) {
  const [data, setData] = useState({
    fullName: "",
    age: "",
    address: "",
    gender: "",
    weight: "",
    ...initData,
  });
  const [dataFields, setDataFields] = useState(
    initData?.data != null
      ? Object.entries(initData.data).map(([key, value]) => ({ key, value }))
      : [{ key: "", value: "" }]
  );
  const handleChange = (e, key) => {
    console.log("VALUE", e.target.value);
    setData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleField = (index, key, value) => {
    const copyField = [...dataFields];
    copyField[index][key] = value;
    setDataFields(copyField);
  };
  const handleAddField = () => {
    setDataFields([...dataFields, { key: "", value: "" }]);
  };

  useEffect(() => {
    if (!initData || Object.keys(initData).length === 0) return;
    setData({
      fullName: "",
      age: "",
      address: "",
      gender: "",
      weight: "",
      ...initData,
    });

    setDataFields(
      initData?.data
        ? Object.entries(initData.data).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }]
    );
  }, [initData?.id]);

  const handleSave = (e) => {
    e.preventDefault();
    let dataFieldsObject = dataFields.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    const payload = {
      ...data,
      data: dataFieldsObject,
    };
    onSubmit(payload);
    setShowForm(false);
    // setData({ fullName: "", age: "", address: "", gender: "", weight: "" });
    // setDataFields([{ key: "", value: "" }]);
  };

  return (
    <div>
      <div className={cx("overlay")} onClick={() => setShowForm(false)} />
      <div className={cx("modal")}>
        <form onSubmit={handleSave} className={cx("modal_content")}>
          <h2>{title}</h2>
          <input
            placeholder="Full name"
            required
            value={data.fullName}
            onChange={(e) => handleChange(e, "fullName")}
          />
          <input
            type="number"
            min="0"
            placeholder="Age"
            value={data.age}
            onChange={(e) => handleChange(e, "age")}
          />
          <input
            placeholder="Address"
            value={data.address}
            onChange={(e) => handleChange(e, "address")}
          />
          <select
            value={data.gender}
            onChange={(e) => handleChange(e, "gender")}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            placeholder="Weight (e.g. 65kg)"
            value={data.weight}
            onChange={(e) => handleChange(e, "weight")}
          />

          <div className={cx("data_section")}>
            <h4>Additional Data</h4>
            {dataFields.map((f, i) => (
              <div key={i} className={cx("data_row")}>
                <input
                  placeholder="Key"
                  value={f.key}
                  onChange={(e) => handleField(i, "key", e.target.value)}
                />
                <input
                  placeholder="Value"
                  value={f.value}
                  onChange={(e) => handleField(i, "value", e.target.value)}
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

export default React.memo(PatientForm);
