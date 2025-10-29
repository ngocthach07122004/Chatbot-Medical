// import React, { useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import classNames from "classnames/bind";
// import styles from "./patientDetail.module.scss";

// const cx = classNames.bind(styles);

// const seed = [
//     { id: "p1", FullName: "Nguyen Thi B", Age: 28, Address: "Thu Duc City, HCMC", pathologies: [{ id: "x1", data: "Hypertension Stage 1", createdAt: new Date().toISOString() }] },
//     { id: "p2", FullName: "Tran Van C", Age: 45, Address: "District 7, HCMC", pathologies: [] },
// ];

// const PatientDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [patients, setPatients] = useState(seed);
//     const [newPathology, setNewPathology] = useState("");
//     const pIndex = patients.findIndex((p) => p.id === id);
//     const patient = patients[pIndex];

//     if (!patient) {
//         return (
//             <div className={cx("wrapper")}>
//                 <div className={cx("empty")}>
//                     Patient not found. <button className={cx("btn")} onClick={() => navigate("/patients/")}>Back to patients</button>
//                 </div>
//             </div>
//         );
//     }

//     const [edit, setEdit] = useState({ FullName: patient.FullName, Age: patient.Age, Address: patient.Address });
//     const [isEditing, setIsEditing] = useState(false);

//     const onSave = (e) => {
//         e.preventDefault();
//         const copy = [...patients];
//         copy[pIndex] = { ...copy[pIndex], FullName: edit.FullName, Age: Number(edit.Age || 0), Address: edit.Address };
//         setPatients(copy);
//         setIsEditing(false);
//     };

//     const onCancel = () => {
//         setEdit({ FullName: patient.FullName, Age: patient.Age, Address: patient.Address });
//         setIsEditing(false);
//     };

//     const onAddPathology = (e) => {
//         e.preventDefault();
//         if (!newPathology.trim()) return;
//         const copy = [...patients];
//         const newItem = { id: Math.random().toString(36).slice(2, 8), data: newPathology.trim(), createdAt: new Date().toISOString() };
//         copy[pIndex] = { ...copy[pIndex], pathologies: [newItem, ...(copy[pIndex].pathologies || [])] };
//         setPatients(copy);
//         setNewPathology("");
//     };

//     const onRemovePath = (pid) => {
//         const copy = [...patients];
//         copy[pIndex] = { ...copy[pIndex], pathologies: (copy[pIndex].pathologies || []).filter((x) => x.id !== pid) };
//         setPatients(copy);
//     };

//     const pathList = useMemo(() => (patient.pathologies || []), [patients, pIndex]);

//     return (
//         <div className={cx("wrapper")}>
//             <div className={cx("header")}>
//                 <button className={cx("btn")} onClick={() => navigate("/patients/")}><i className="fa-solid fa-arrow-left" /> Back</button>
//                 <h1>Patient Profile</h1>
//             </div>

//             <div className={cx("grid")}>
//                 <div className={cx("card")}>
//                     <h2><i className="fa-solid fa-user" /> Profile</h2>
//                     {!isEditing ? (
//                         <div className={cx("view_block")}>
//                             <div><strong>Full Name:</strong> {patient.FullName}</div>
//                             <div><strong>Age:</strong> {patient.Age}</div>
//                             <div><strong>Address:</strong> {patient.Address}</div>
//                             <div className={cx("actions")}>
//                                 <button className={cx("btn", "primary")} onClick={() => setIsEditing(true)}>Edit</button>
//                             </div>
//                         </div>
//                     ) : (
//                         <form className={cx("form")} onSubmit={onSave}>
//                             <label>Full Name</label>
//                             <input value={edit.FullName} onChange={(e) => setEdit({ ...edit, FullName: e.target.value })} />
//                             <label>Age</label>
//                             <input type="number" min="0" value={edit.Age} onChange={(e) => setEdit({ ...edit, Age: e.target.value })} />
//                             <label>Address</label>
//                             <input value={edit.Address} onChange={(e) => setEdit({ ...edit, Address: e.target.value })} />
//                             <div className={cx("actions")}>
//                                 <button type="button" className={cx("btn")} onClick={onCancel}>Cancel</button>
//                                 <button className={cx("btn", "primary")} type="submit">Save</button>
//                             </div>
//                         </form>
//                     )}
//                 </div>

//                 <div className={cx("card")}>
//                     <h2><i className="fa-solid fa-notes-medical" /> Pathology (Medical History)</h2>
//                     <form className={cx("add_inline")} onSubmit={onAddPathology}>
//                         <input placeholder="Add pathology entry (tiền sử bệnh lý)" value={newPathology} onChange={(e) => setNewPathology(e.target.value)} />
//                         <button className={cx("btn", "primary")} type="submit">Add</button>
//                     </form>
//                     <ul className={cx("path_list")}>
//                         {pathList.map((item) => (
//                             <li key={item.id} className={cx("path_item")}>
//                                 <div>
//                                     <div className={cx("path_text")}>{item.data}</div>
//                                     <div className={cx("muted")}>{new Date(item.createdAt).toLocaleString()}</div>
//                                 </div>
//                                 <button className={cx("btn", "danger")} onClick={() => onRemovePath(item.id)} aria-label="Remove"><i className="fa-solid fa-trash" /></button>
//                             </li>
//                         ))}
//                         {pathList.length === 0 && <li className={cx("muted")}>No pathology records yet.</li>}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PatientDetail;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./patientDetail.module.scss";
import PatientForm from "../../components/Form/PatientForm";
import PatientService from "../../services/patientService";
const cx = classNames.bind(styles);

const seed = [
  {
    id: "p1",
    FullName: "Nguyen Thi B",
    Age: 28,
    Address: "Thu Duc City, HCMC",
    Gender: "Male",
    Weight: "80",
    pathologies: [
      {
        id: "x1",
        description: "Hypertension Stage 1",
        detectedAt: "2024-10-01",
        notes: "Mild symptoms, stable BP.",
        severity: "Medium",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({});
  const [isEditPatient, setIsEditPatient] = useState(false);
  const [isAddPathologyOpen, setIsAddPathologyOpen] = useState(false);
  const [newPathology, setNewPathology] = useState({
    description: "",
    detectedAt: "",
    severity: "",
    notes: "",
  });
  const getPatientById = async (id) => {
    const response = await PatientService.getPatientById(id);
    try {
      if (response.status === 200) {
        setPatient(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPatientById(id);
  }, [id]);

  const updatePatient = async (id, patient) => {
    const response = await PatientService.updatePatient(id, patient);
    try {
      if (response.status === 200) {
        setPatient(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOnSubmit = (payload) => {
    updatePatient(id, payload);
  };

  const memoInitData = useMemo(() => patient, [patient]);

  if (!patient) {
    return (
      <div className={cx("wrapper")}>
        <div className={cx("empty")}>
          Patient not found.
          <button className={cx("btn")} onClick={() => navigate("/patients/")}>
            Back to patients
          </button>
        </div>
      </div>
    );
  }

  // const [editProfile, setEditProfile] = useState({
  //   FullName: patient.FullName,
  //   Age: patient.Age,
  //   Address: patient.Address,
  // });

  // const onSaveProfile = (e) => {
  //   e.preventDefault();
  //   const copy = [...patients];
  //   copy[pIndex] = { ...copy[pIndex], ...editProfile };
  //   setPatient(copy);
  //   setIsEditModalOpen(false);
  // };

  // const onAddPathology = (e) => {
  //   e.preventDefault();
  //   if (!newPathology.description.trim()) return;
  //   const copy = [...patients];
  //   const newItem = {
  //     id: Math.random().toString(36).slice(2, 8),
  //     ...newPathology,
  //     createdAt: new Date().toISOString(),
  //   };
  //   copy[pIndex] = {
  //     ...copy[pIndex],
  //     pathologies: [newItem, ...(copy[pIndex].pathologies || [])],
  //   };
  //   setPatients(copy);
  //   setNewPathology({
  //     description: "",
  //     detectedAt: "",
  //     severity: "",
  //     notes: "",
  //   });
  //   setIsAddPathologyOpen(false);
  // };

  // const onRemovePath = (pid) => {
  //   const copy = [...patients];
  //   copy[pIndex] = {
  //     ...copy[pIndex],
  //     pathologies: (copy[pIndex].pathologies || []).filter((x) => x.id !== pid),
  //   };
  //   setPatients(copy);
  // };

  // const pathList = useMemo(() => patient.pathologies || [], [patients, pIndex]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <button className={cx("btn")} onClick={() => navigate("/patients/")}>
          <i className="fa-solid fa-arrow-left" /> Back
        </button>
        <h1>Patient Profile</h1>
      </div>

      <div className={cx("grid")}>
        {/* Profile Card */}
        <div className={cx("card", "profile_card")}>
          <h2>
            <i className="fa-solid fa-user" /> Profile
          </h2>
          <div className={cx("view_block")}>
            <div>
              <strong>Full Name:</strong> {patient.fullName}
            </div>
            <div>
              <strong>Age:</strong> {patient.age}
            </div>
            <div>
              <strong>Address:</strong> {patient.address}
            </div>
            <div className={cx("actions")}>
              <button
                className={cx("btn", "primary")}
                onClick={() => setIsEditPatient(true)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Pathology Card */}
        {/* <div className={cx("card")}>
          <h2>
            <i className="fa-solid fa-notes-medical" /> Pathology
          </h2>
          <button
            className={cx("btn", "primary")}
            onClick={() => setIsAddPathologyOpen(true)}
          >
            + Add Pathology
          </button>

          <ul className={cx("path_list")}>
            {pathList.map((item) => (
              <li key={item.id} className={cx("path_item")}>
                <div>
                  <div className={cx("path_text")}>{item.description}</div>
                  {item.detectedAt && (
                    <div>
                      <strong>Date:</strong> {item.detectedAt}
                    </div>
                  )}
                  {item.severity && (
                    <div>
                      <strong>Severity:</strong> {item.severity}
                    </div>
                  )}
                  {item.notes && (
                    <div className={cx("muted")}>
                      <strong>Note:</strong> {item.notes}
                    </div>
                  )}
                  <div className={cx("muted")}>
                    Created: {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  className={cx("icon_btn")}
                  onClick={() => onRemovePath(item.id)}
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </li>
            ))}
            {pathList.length === 0 && (
              <li className={cx("muted")}>No pathology records yet.</li>
            )}
          </ul>
        </div> */}
      </div>

      {/* --- Edit Profile Modal --- */}
      {/* {isEditPatient && <PatientForm setShowForm={setIsEditPatient} data = {} />} */}
      {isEditPatient && (
        <PatientForm
          title="Update Patient information"
          setShowForm={setIsEditPatient}
          initData={memoInitData}
          onSubmit={handleOnSubmit}
        />
      )}
      {/* --- Add Pathology Modal --- */}
      {/* {isAddPathologyOpen && (
        <div className={cx("modal_overlay")}>
          <div className={cx("modal")}>
            <h3>Add Pathology Record</h3>
            <form onSubmit={onAddPathology}>
              <label>Description</label>
              <input
                placeholder="e.g. Diabetes, Hypertension..."
                value={newPathology.description}
                onChange={(e) =>
                  setNewPathology({
                    ...newPathology,
                    description: e.target.value,
                  })
                }
              />
              <label>Date Detected</label>
              <input
                type="date"
                value={newPathology.detectedAt}
                onChange={(e) =>
                  setNewPathology({
                    ...newPathology,
                    detectedAt: e.target.value,
                  })
                }
              />
              <label>Severity</label>
              <select
                value={newPathology.severity}
                onChange={(e) =>
                  setNewPathology({ ...newPathology, severity: e.target.value })
                }
              >
                <option value="">Select...</option>
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Severe">Severe</option>
              </select>
              <label>Notes</label>
              <textarea
                rows="3"
                placeholder="Additional notes..."
                value={newPathology.notes}
                onChange={(e) =>
                  setNewPathology({ ...newPathology, notes: e.target.value })
                }
              />
              <div className={cx("actions")}>
                <button
                  type="button"
                  className={cx("btn")}
                  onClick={() => setIsAddPathologyOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={cx("btn", "primary")}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PatientDetail;
