import React from "react";
import styles from "./DoctorProfile.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const DoctorProfile = () => {
    // Static mock data (replace with real data later)
    const doctor = {
        name: "Dr. Nguyen Van A",
        title: "Cardiologist",
        avatar: "",
        rating: 4.9,
        reviews: 128,
        hospital: "HCMC University Hospital",
        years: 12,
        patients: 2400,
        email: "dr.nguyenvana@example.com",
        phone: "+84 912 345 678",
        location: "700000, District 1, Ho Chi Minh City",
        specialties: ["Cardiology", "Hypertension", "Preventive Medicine"],
        languages: ["Vietnamese", "English"],
        about:
            "Experienced cardiologist focusing on preventive care and patient-centric treatment plans. Passionate about improving heart health through lifestyle changes and evidence-based medicine.",
    };

    return (
        <div className={cx("profile_wrapper")}>
            <section className={cx("hero_card")}>
                <div className={cx("hero_left")}>
                    <div className={cx("avatar")}>
                        <i className="fa-solid fa-user-doctor"></i>
                    </div>
                    <div className={cx("identity")}>
                        <h1 className={cx("name")}>{doctor.name}</h1>
                        <p className={cx("title")}>{doctor.title} • {doctor.hospital}</p>
                        <div className={cx("rating")}>
                            <i className="fa-solid fa-star"></i>
                            <span>{doctor.rating}</span>
                            <span className={cx("muted")}>({doctor.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <div className={cx("hero_right")}>
                    <div className={cx("stat")}>
                        <div className={cx("stat_value")}>{doctor.years}+</div>
                        <div className={cx("stat_label")}>Years Experience</div>
                    </div>
                    <div className={cx("stat")}>
                        <div className={cx("stat_value")}>{doctor.patients.toLocaleString()}</div>
                        <div className={cx("stat_label")}>Patients Served</div>
                    </div>
                    <div className={cx("stat")}>
                        <div className={cx("stat_value")}>{doctor.specialties.length}</div>
                        <div className={cx("stat_label")}>Specialties</div>
                    </div>
                </div>
            </section>

            <section className={cx("content_grid")}>
                <div className={cx("card")}>
                    <h2 className={cx("card_title")}>
                        <i className="fa-solid fa-address-card"></i>
                        About
                    </h2>
                    <p className={cx("about_text")}>{doctor.about}</p>
                    <div className={cx("chips")}>
                        {doctor.languages.map((lang) => (
                            <span key={lang} className={cx("chip")}>
                                <i className="fa-solid fa-language"></i>
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={cx("card")}>
                    <h2 className={cx("card_title")}>
                        <i className="fa-solid fa-stethoscope"></i>
                        Specialties
                    </h2>
                    <div className={cx("pill_list")}>
                        {doctor.specialties.map((spec) => (
                            <span key={spec} className={cx("pill")}>{spec}</span>
                        ))}
                    </div>
                </div>

                <div className={cx("card")}>
                    <h2 className={cx("card_title")}>
                        <i className="fa-solid fa-phone"></i>
                        Contact
                    </h2>
                    <ul className={cx("contact_list")}>
                        <li><i className="fa-solid fa-envelope"></i>{doctor.email}</li>
                        <li><i className="fa-solid fa-mobile-screen"></i>{doctor.phone}</li>
                        <li><i className="fa-solid fa-location-dot"></i>{doctor.location}</li>
                    </ul>
                </div>

                <div className={cx("card")}>
                    <h2 className={cx("card_title")}>
                        <i className="fa-solid fa-graduation-cap"></i>
                        Experience
                    </h2>
                    <ul className={cx("timeline")}>
                        <li>
                            <div className={cx("time")}>2019 - Present</div>
                            <div className={cx("desc")}>
                                Senior Cardiologist, {doctor.hospital}
                            </div>
                        </li>
                        <li>
                            <div className={cx("time")}>2016 - 2019</div>
                            <div className={cx("desc")}>
                                Cardiologist, Central Hospital
                            </div>
                        </li>
                        <li>
                            <div className={cx("time")}>2013 - 2016</div>
                            <div className={cx("desc")}>
                                Resident Doctor, City Hospital
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <section className={cx("actions_row")}>
                <button className={cx("btn", "primary")}>Edit Profile</button>
                <button className={cx("btn", "secondary")}>Download CV</button>
                <button className={cx("btn")}>Contact</button>
            </section>
        </div>
    );
};

export default DoctorProfile;
