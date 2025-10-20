import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./patients.module.scss";

const cx = classNames.bind(styles);

const initialPatients = [
    { id: "p1", FullName: "Nguyen Thi B", Age: 28, Address: "Thu Duc City, HCMC" },
    { id: "p2", FullName: "Tran Van C", Age: 45, Address: "District 7, HCMC" },
];

const Patients = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [patients, setPatients] = useState(initialPatients);
    const [newP, setNewP] = useState({ FullName: "", Age: "", Address: "" });

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return patients;
        return patients.filter(
            (p) => p.FullName.toLowerCase().includes(q) || String(p.Age).includes(q) || (p.Address || "").toLowerCase().includes(q)
        );
    }, [patients, query]);

    const handleAdd = (e) => {
        e.preventDefault();
        const id = `p_${Math.random().toString(36).slice(2, 8)}`;
        const created = {
            id,
            FullName: newP.FullName.trim(),
            Age: Number(newP.Age || 0),
            Address: newP.Address.trim(),
        };
        setPatients((prev) => [created, ...prev]);
        setNewP({ FullName: "", Age: "", Address: "" });
    };

    const handleRemove = (id) => {
        setPatients((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className={cx("wrapper")}>
            <div className={cx("header_row")}>
                <h1>Patients</h1>
                <div className={cx("search")}>
                    <i className="fa-solid fa-magnifying-glass" />
                    <input placeholder="Search by name, age or address" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </div>

            <form className={cx("add_form")} onSubmit={handleAdd}>
                <input placeholder="Full name" value={newP.FullName} onChange={(e) => setNewP({ ...newP, FullName: e.target.value })} />
                <input type="number" min="0" placeholder="Age" value={newP.Age} onChange={(e) => setNewP({ ...newP, Age: e.target.value })} />
                <input placeholder="Address" value={newP.Address} onChange={(e) => setNewP({ ...newP, Address: e.target.value })} />
                <button className={cx("btn", "primary")} type="submit"><i className="fa-solid fa-user-plus" /> Add</button>
            </form>

            <div className={cx("table")}>
                <div className={cx("thead")}>
                    <div>Name</div>
                    <div>Age</div>
                    <div>Address</div>
                    <div>Actions</div>
                </div>
                {filtered.map((p) => (
                    <div key={p.id} className={cx("row")}>
                        <div className={cx("cell", "name")} onClick={() => navigate(`/patients/${p.id}/`)}>
                            <i className="fa-solid fa-user" /> {p.FullName}
                        </div>
                        <div className={cx("cell")}>{p.Age}</div>
                        <div className={cx("cell")}>{p.Address}</div>
                        <div className={cx("cell", "actions")}>
                            <button className={cx("btn")} onClick={() => navigate(`/patients/${p.id}/`)}>Open</button>
                            <button className={cx("btn", "danger")} onClick={() => handleRemove(p.id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className={cx("empty")}>
                        <i className="fa-regular fa-folder-open" /> No patients found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Patients;
