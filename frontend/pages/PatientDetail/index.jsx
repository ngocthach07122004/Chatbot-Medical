import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./patientDetail.module.scss";
import PatientForm from "../../components/Form/PatientForm";
import AddPathologyForm from "../../components/Form/PathologyForm";
import PatientService from "../../services/patientService";
const cx = classNames.bind(styles);
const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({});
  const [isEditPatient, setIsEditPatient] = useState(false);
  const [isAddPathology, setIsAddPathology] = useState(false);
  const [pathology, setPathology] = useState([]);

  useEffect(() => {
    setPathology(patient.pathologys);
  }, [patient]);
  const createPathology = async (data) => {
    const response = await PatientService.createPathology(id, data);
    try {
      if (response.status === 200) {
        const patientRes = response.data.data;
        setPathology(patientRes.pathologys);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOnCreatePathology = (data) => {
    createPathology(data);
  };
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
  return (
    <div className={cx("content_grid")}>
      {/* Thông tin cá nhân */}
      <div className={cx("card")}>
        <h2 className={cx("card_title")}>
          <i className="fa-solid fa-user"></i>
          Patient Profile
        </h2>
        <ul className={cx("contact_list")}>
          <li>
            <i className="fa-solid fa-signature"></i> {patient.fullName}
          </li>
          <li>
            <i className="fa-solid fa-venus-mars"></i> {patient.gender}
          </li>
          <li>
            <i className="fa-solid fa-cake-candles"></i> Age: {patient.age}
          </li>
          <li>
            <i className="fa-solid fa-location-dot"></i> {patient.address}
          </li>
          <li>
            <i className="fa-solid fa-weight-scale"></i> {patient.weight} kg
          </li>
        </ul>

        <div className={cx("actions_row")}>
          <button
            className={cx("btn", "primary")}
            onClick={() => setIsEditPatient(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Data bổ sung */}
      <div className={cx("card")}>
        <h2 className={cx("card_title")}>
          <i className="fa-solid fa-dna"></i>
          Additional Data
        </h2>
        {patient.data && Object.keys(patient.data).length > 0 ? (
          <div className={cx("pill_list")}>
            {Object.entries(patient.data).map(([key, value]) =>
              key ? (
                <span key={key} className={cx("pill")}>
                  {key}: {value}
                </span>
              ) : null
            )}
          </div>
        ) : (
          <p className={cx("muted")}>No additional data found.</p>
        )}
      </div>

      {/* Bệnh lý (pathologys) */}
      <div className={cx("card")}>
        <h2 className={cx("card_title")}>
          <i className="fa-solid fa-notes-medical"></i>
          Pathology Records
        </h2>

        <button
          className={cx("btn", "primary")}
          onClick={() => setIsAddPathology(true)}
        >
          + Add Pathology
        </button>

        <ul className={cx("timeline")}>
          {pathology && pathology.length > 0 ? (
            pathology.map((path) => (
              <li key={path.id}>
                <div className={cx("time")}>
                  {new Date(path.createdAt).toLocaleString()}
                </div>
                <div className={cx("desc")}>
                  {Object.entries(path.data).map(([k, v]) => (
                    <div key={k}>
                      <strong>{k}:</strong> {v}
                    </div>
                  ))}
                </div>
              </li>
            ))
          ) : (
            <p className={cx("muted")}>No pathology records yet.</p>
          )}
        </ul>
      </div>
      {/* --- Edit Profile Modal --- */}
      {isEditPatient && (
        <PatientForm
          title="Update Patient information"
          setShowForm={setIsEditPatient}
          initData={memoInitData}
          onSubmit={handleOnSubmit}
        />
      )}
      {/* --- Add Pathology Modal --- */}
      {isAddPathology && (
        <AddPathologyForm
          setShowForm={setIsAddPathology}
          onSave={handleOnCreatePathology}
        />
      )}
    </div>
  );
};

export default PatientDetail;
