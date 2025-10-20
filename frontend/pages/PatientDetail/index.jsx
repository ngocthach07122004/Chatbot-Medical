import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./patientDetail.module.scss";

const cx = classNames.bind(styles);

const seed = [
    { id: "p1", FullName: "Nguyen Thi B", Age: 28, Address: "Thu Duc City, HCMC", pathologies: [{ id: "x1", data: "Hypertension Stage 1", createdAt: new Date().toISOString() }] },
    { id: "p2", FullName: "Tran Van C", Age: 45, Address: "District 7, HCMC", pathologies: [] },
];

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patients, setPatients] = useState(seed);
    const [newPathology, setNewPathology] = useState("");
    const pIndex = patients.findIndex((p) => p.id === id);
    const patient = patients[pIndex];

    if (!patient) {
        return (
            <div className={cx("wrapper")}>
                <div className={cx("empty")}>
                    Patient not found. <button className={cx("btn")} onClick={() => navigate("/patients/")}>Back to patients</button>
                </div>
            </div>
        );
    }

    const [edit, setEdit] = useState({ FullName: patient.FullName, Age: patient.Age, Address: patient.Address });
    const [isEditing, setIsEditing] = useState(false);

    const onSave = (e) => {
        e.preventDefault();
        const copy = [...patients];
        copy[pIndex] = { ...copy[pIndex], FullName: edit.FullName, Age: Number(edit.Age || 0), Address: edit.Address };
        setPatients(copy);
        setIsEditing(false);
    };

    const onCancel = () => {
        setEdit({ FullName: patient.FullName, Age: patient.Age, Address: patient.Address });
        setIsEditing(false);
    };

    const onAddPathology = (e) => {
        e.preventDefault();
        if (!newPathology.trim()) return;
        const copy = [...patients];
        const newItem = { id: Math.random().toString(36).slice(2, 8), data: newPathology.trim(), createdAt: new Date().toISOString() };
        copy[pIndex] = { ...copy[pIndex], pathologies: [newItem, ...(copy[pIndex].pathologies || [])] };
        setPatients(copy);
        setNewPathology("");
    };

    const onRemovePath = (pid) => {
        const copy = [...patients];
        copy[pIndex] = { ...copy[pIndex], pathologies: (copy[pIndex].pathologies || []).filter((x) => x.id !== pid) };
        setPatients(copy);
    };

    const pathList = useMemo(() => (patient.pathologies || []), [patients, pIndex]);

    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <button className={cx("btn")} onClick={() => navigate("/patients/")}><i className="fa-solid fa-arrow-left" /> Back</button>
                <h1>Patient Profile</h1>
            </div>

            <div className={cx("grid")}>
                <div className={cx("card")}>
                    <h2><i className="fa-solid fa-user" /> Profile</h2>
                    {!isEditing ? (
                        <div className={cx("view_block")}>
                            <div><strong>Full Name:</strong> {patient.FullName}</div>
                            <div><strong>Age:</strong> {patient.Age}</div>
                            <div><strong>Address:</strong> {patient.Address}</div>
                            <div className={cx("actions")}>
                                <button className={cx("btn", "primary")} onClick={() => setIsEditing(true)}>Edit</button>
                            </div>
                        </div>
                    ) : (
                        <form className={cx("form")} onSubmit={onSave}>
                            <label>Full Name</label>
                            <input value={edit.FullName} onChange={(e) => setEdit({ ...edit, FullName: e.target.value })} />
                            <label>Age</label>
                            <input type="number" min="0" value={edit.Age} onChange={(e) => setEdit({ ...edit, Age: e.target.value })} />
                            <label>Address</label>
                            <input value={edit.Address} onChange={(e) => setEdit({ ...edit, Address: e.target.value })} />
                            <div className={cx("actions")}>
                                <button type="button" className={cx("btn")} onClick={onCancel}>Cancel</button>
                                <button className={cx("btn", "primary")} type="submit">Save</button>
                            </div>
                        </form>
                    )}
                </div>

                <div className={cx("card")}>
                    <h2><i className="fa-solid fa-notes-medical" /> Pathology (Medical History)</h2>
                    <form className={cx("add_inline")} onSubmit={onAddPathology}>
                        <input placeholder="Add pathology entry (tiền sử bệnh lý)" value={newPathology} onChange={(e) => setNewPathology(e.target.value)} />
                        <button className={cx("btn", "primary")} type="submit">Add</button>
                    </form>
                    <ul className={cx("path_list")}>
                        {pathList.map((item) => (
                            <li key={item.id} className={cx("path_item")}>
                                <div>
                                    <div className={cx("path_text")}>{item.data}</div>
                                    <div className={cx("muted")}>{new Date(item.createdAt).toLocaleString()}</div>
                                </div>
                                <button className={cx("btn", "danger")} onClick={() => onRemovePath(item.id)} aria-label="Remove"><i className="fa-solid fa-trash" /></button>
                            </li>
                        ))}
                        {pathList.length === 0 && <li className={cx("muted")}>No pathology records yet.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;
