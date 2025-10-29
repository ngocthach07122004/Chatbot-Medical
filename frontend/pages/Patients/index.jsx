// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import classNames from "classnames/bind";
// import styles from "./patients.module.scss";

// const cx = classNames.bind(styles);

// const initialPatients = [
//   {
//     id: "p1",
//     FullName: "Nguyen Thi B",
//     Age: 28,
//     Address: "Thu Duc City, HCMC",
//   },
//   { id: "p2", FullName: "Tran Van C", Age: 45, Address: "District 7, HCMC" },
// ];

// const Patients = () => {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [patients, setPatients] = useState(initialPatients);
//   const [newP, setNewP] = useState({ FullName: "", Age: "", Address: "" });

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return patients;
//     return patients.filter(
//       (p) =>
//         p.FullName.toLowerCase().includes(q) ||
//         String(p.Age).includes(q) ||
//         (p.Address || "").toLowerCase().includes(q)
//     );
//   }, [patients, query]);

//   const handleAdd = (e) => {
//     e.preventDefault();
//     const id = `p_${Math.random().toString(36).slice(2, 8)}`;
//     const created = {
//       id,
//       FullName: newP.FullName.trim(),
//       Age: Number(newP.Age || 0),
//       Address: newP.Address.trim(),
//     };
//     setPatients((prev) => [created, ...prev]);
//     setNewP({ FullName: "", Age: "", Address: "" });
//   };

//   const handleRemove = (id) => {
//     setPatients((prev) => prev.filter((p) => p.id !== id));
//   };

//   return (
//     <div className={cx("wrapper")}>
//       <div className={cx("header_row")}>
//         <h1>Patients</h1>
//         <div className={cx("search")}>
//           <i className="fa-solid fa-magnifying-glass" />
//           <input
//             placeholder="Search by name, age or address"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <form className={cx("add_form")} onSubmit={handleAdd}>
//         <input
//           placeholder="Full name"
//           value={newP.FullName}
//           onChange={(e) => setNewP({ ...newP, FullName: e.target.value })}
//         />
//         <input
//           type="number"
//           min="0"
//           placeholder="Age"
//           value={newP.Age}
//           onChange={(e) => setNewP({ ...newP, Age: e.target.value })}
//         />
//         <input
//           placeholder="Address"
//           value={newP.Address}
//           onChange={(e) => setNewP({ ...newP, Address: e.target.value })}
//         />
//         <button className={cx("btn", "primary")} type="submit">
//           <i className="fa-solid fa-user-plus" /> Add
//         </button>
//       </form>

//       <div className={cx("table")}>
//         <div className={cx("thead")}>
//           <div>Name</div>
//           <div>Age</div>
//           <div>Address</div>
//           <div>Actions</div>
//         </div>
//         {filtered.map((p) => (
//           <div key={p.id} className={cx("row")}>
//             <div
//               className={cx("cell", "name")}
//               onClick={() => navigate(`/patients/${p.id}/`)}
//             >
//               <i className="fa-solid fa-user" /> {p.FullName}
//             </div>
//             <div className={cx("cell")}>{p.Age}</div>
//             <div className={cx("cell")}>{p.Address}</div>
//             <div className={cx("cell", "actions")}>
//               <button
//                 className={cx("btn")}
//                 onClick={() => navigate(`/patients/${p.id}/`)}
//               >
//                 Open
//               </button>
//               <button
//                 className={cx("btn", "danger")}
//                 onClick={() => handleRemove(p.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//         {filtered.length === 0 && (
//           <div className={cx("empty")}>
//             <i className="fa-regular fa-folder-open" /> No patients found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Patients;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./patients.module.scss";
import PatientForm from "../../components/Form/PatientForm";
import PatientService from "../../services/patientService";
const cx = classNames.bind(styles);

const initialPatients = [
  {
    id: "p1",
    FullName: "Nguyen Thi B",
    Age: 28,
    Address: "Thu Duc City, HCMC",
    Gender: "Female",
    Weight: "55kg",
    Data: { Note: "Healthy", Blood: "O+" },
  },
  {
    id: "p2",
    FullName: "Tran Van C",
    Age: 45,
    Address: "District 7, HCMC",
    Gender: "Male",
    Weight: "68kg",
    Data: { Note: "High blood pressure", Blood: "A+" },
  },
];

const Patients = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState(initialPatients);
  const [showForm, setShowForm] = useState(false);
  // const [newP, setNewP] = useState({
  //   FullName: "",
  //   Age: "",
  //   Address: "",
  //   Gender: "",
  //   Weight: "",
  // });
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // console.log("patients", patients);
    if (!q) return patients;
    return Array.isArray(patients)
      ? patients.filter(
          (p) =>
            (p.fullName || "").toLowerCase().includes(q) ||
            String(p.age).includes(q) ||
            (p.address || "").toLowerCase().includes(q)
        )
      : [];
  }, [patients, query]);
  const getPatients = async () => {
    let doctorId = localStorage.getItem("doctorId");
    if (doctorId == null) {
      navigate("/login");
    }
    const response = await PatientService.getPatientsByDoctor(doctorId);
    setPatients(response.data);
  };
  useEffect(() => {
    getPatients();
  }, []);
  const createPatient = async (data) => {
    const doctorId = localStorage.getItem("doctorId");
    if (doctorId == null) {
      navigate("/login");
    }
    const response = await PatientService.createPatient(doctorId, data);
    try {
      if (response.status === 200) {
        console.log("create patient", response.data);
        setPatients((prev) => [...prev, response.data.data]);
        getPatients();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreatePatient = (payload) => {
    createPatient(payload);
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header_row")}>
        <h1>Patients</h1>
        <div className={cx("search")}>
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by name, age or address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className={cx("btn", "primary")}
          onClick={() => setShowForm(true)}
        >
          <i className="fa-solid fa-user-plus" /> Add Patient
        </button>
      </div>

      <div className={cx("table")}>
        <div className={cx("thead")}>
          <div>Name</div>
          <div>Age</div>
          <div>Gender</div>
          <div>Weight</div>
          <div>Address</div>
          <div>Actions</div>
        </div>

        {filtered.map((p) => (
          <div key={p.id} className={cx("row")}>
            <div
              className={cx("cell", "name")}
              onClick={() => navigate(`/patients/${p.id}/`)}
            >
              <i className="fa-solid fa-user" /> {p.fullName}
            </div>
            <div className={cx("cell")}>{p.age}</div>
            <div className={cx("cell")}>{p.gender}</div>
            <div className={cx("cell")}>{p.weight}</div>
            <div className={cx("cell")}>{p.address}</div>
            <div className={cx("cell", "actions")}>
              <button
                className={cx("icon_btn", "danger")}
                onClick={() => handleRemove(p.id)}
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={cx("empty")}>
            <i className="fa-regular fa-folder-open" /> No patients found
          </div>
        )}
      </div>
      {showForm && (
        <PatientForm
          title="Add information for patient"
          setShowForm={setShowForm}
          onSubmit={handleCreatePatient}
        />
      )}
    </div>
  );
};

export default Patients;
