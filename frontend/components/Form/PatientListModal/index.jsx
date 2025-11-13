import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./PatientListModal.module.scss";

const cx = classNames.bind(styles);

export default function PatientListModal({
  patients,
  setShowForm,
  handlePatientChat,
}) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("overlay")} onClick={() => setShowForm(false)} />

      <div className={cx("modal")}>
        <div className={cx("modal_content")}>
          <h2>Patients</h2>

          <div className={cx("patient_list")}>
            {patients.length === 0 && <p>No patients available.</p>}

            {patients.map((p, i) => (
              <div
                key={i}
                className={cx("patient_item")}
                onClick={() => handlePatientChat(p.id)}
              >
                <button className={cx("icon_btn")}>
                  <FontAwesomeIcon icon={faUser} />
                </button>
                <span className={cx("patient_name")}>{p.fullName}</span>
              </div>
            ))}
          </div>

          <div className={cx("modal_actions")}>
            <button className={cx("btn")} onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
