import React, { use, useEffect, useState } from "react";
import jsPDF from "jspdf";
import styles from "./DoctorProfile.module.scss";
import classNames from "classnames/bind";
import doctorAuthService from "../../services/doctorAuthApi";

const cx = classNames.bind(styles);
const dataFake = {
  FullName: "Dr. Nguyen Van A",
  gmail: "dr.nguyenvana@example.com",
  Age: 40,
  title: "Cardiologist",
  avatar: "",
  rating: 4.9,
  reviews: 128,
  hospital: "HCMC University Hospital",
  years: 12,
  patients: 2400,
  phone: "+84 912 345 678",
  location: "700000, District 1, Ho Chi Minh City",
  specialties: ["Cardiology", "Hypertension", "Preventive Medicine"],
  languages: ["Vietnamese", "English"],
  about:
    "Experienced cardiologist focusing on preventive care and patient-centric treatment plans. Passionate about improving heart health through lifestyle changes and evidence-based medicine.",
};

// [
//   {
//     year: "",
//     year: "",
//   },
// ];
const DoctorProfile = () => {
  // UI-only mock data (will be replaced by backend integration)
  const [gmail, setGmail] = useState(null);
  const [doctor, setDoctor] = useState(dataFake);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(dataFake);

  const [experience, setExperience] = useState([{ year: "", description: "" }]);

  const openEdit = () => {
    setFormData({
      ...doctor,
      name: doctor.FullName,
      email: doctor.gmail,
      age: doctor.Age,
      specialtiesText: (doctor.specialties || []).join(", "),
      languagesText: (doctor.languages || []).join(", "),
    });
    setIsEditOpen(true);
  };

  const closeEdit = () => setIsEditOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleGetProfile = async (gmail) => {
    let response = await doctorAuthService.getProfile(gmail);
    let res = response.entity;
    console.log(res);
    try {
      if (response.code === "200") {
        let data = {
          FullName: res.fullName || "...",
          gmail: res.gmail || "...",
          Age: res.data?.age || 0,
          title: res.data?.title || "...",
          avatar: res.data?.avatar || "",
          rating: res.data?.rating || "...",
          reviews: res.data?.reviews || "...",
          hospital: res.data?.hospital || "...",
          years: res.data?.years || "...",
          patients: res.data?.patients || "...",
          phone: res.data?.phone || "...",
          location: res.data?.location || "...",
          specialties: res.data?.specialties || [],
          languages: res.data?.languages || ["Vietnamese", "English"],
          about: res.data?.about,
          experience: res.data?.experience,
        };
        setDoctor(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const gmail = localStorage.getItem("gmail") || null;
    if (gmail != null) {
      setGmail(gmail);
      handleGetProfile(gmail);
    }
  }, []);
  const handleUpdateProfile = async (gmail, data) => {
    console.log("PRE", data);
    const res = await doctorAuthService.updateProfile(gmail, data);
    // console.log(res);
    console.log("AFTER", data);
    try {
      if (res.code == "200") {
        localStorage.setItem("fullName", data.fullName);
        console.log(data.fullName);
        window.dispatchEvent(new Event("profileChange"));
        alert("Update profile success");
      } else {
        alert("Update profile fail");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const specialties = (formData.specialtiesText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const languages = (formData.languagesText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedDoctor = {
      ...doctor,
      FullName: formData.name || doctor.FullName,
      gmail: formData.email || doctor.gmail,
      Age: Number(formData.age ?? doctor.Age) || doctor.Age,
      title: formData.title || doctor.title,
      hospital: formData.hospital || doctor.hospital,
      years: Number(formData.years ?? doctor.years) || doctor.years,
      phone: formData.phone || doctor.phone,
      location: formData.location || doctor.location,
      about: formData.about || doctor.about,
      specialties,
      languages,
      experience,
    };

    setDoctor(updatedDoctor); // cập nhật state

    const dataDoctor = {
      title: updatedDoctor.title,
      avatar: updatedDoctor.avatar,
      rating: updatedDoctor.rating,
      reviews: updatedDoctor.reviews,
      hospital: updatedDoctor.hospital,
      years: updatedDoctor.years,
      patients: updatedDoctor.patients,
      phone: updatedDoctor.phone,
      location: updatedDoctor.location,
      specialties: updatedDoctor.specialties,
      languages: updatedDoctor.languages,
      about: updatedDoctor.about,
      experience: updatedDoctor.experience,
    };

    const payload = {
      gmail: gmail,
      password: "",
      age: updatedDoctor.Age,
      fullName: updatedDoctor.FullName,
      data: dataDoctor,
    };

    handleUpdateProfile(gmail, payload);
    setIsEditOpen(false);
  };

  const handleChangeExperience = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    setExperience(newExperience);
  };

  const addExperience = () => {
    setExperience([...experience, { year: "", description: "" }]);
  };

  const removeExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
  };

  const toSafeFileName = (name) =>
    name
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "")
      .substring(0, 64);

  const handleDownloadCV = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48; // 2/3 inch margins
    const contentWidth = pageWidth - margin * 2;
    const baseLine = 16; // baseline spacing in pt
    let y = margin;

    const ensureSpace = (needed = baseLine) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const heading = (text) => {
      ensureSpace(baseLine * 1.8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(text, margin, y);
      y += baseLine * 1.2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
    };

    const paragraph = (text) => {
      if (!text) return;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line) => {
        ensureSpace(baseLine);
        doc.text(line, margin, y);
        y += baseLine;
      });
      y += 4; // small spacer
    };

    const bullets = (items = []) => {
      items.forEach((item) => {
        const lines = doc.splitTextToSize(item, contentWidth - 14);
        ensureSpace(baseLine);
        doc.text("•", margin, y);
        lines.forEach((line, idx) => {
          if (idx > 0) ensureSpace(baseLine);
          doc.text(line, margin + 14, y);
          y += baseLine;
        });
      });
      y += 4;
    };

    // Header: Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(doctor.FullName || "Doctor", margin, y);
    y += baseLine * 1.5;

    // Subtitle: Title • Hospital
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const subtitle = [doctor.title, doctor.hospital]
      .filter(Boolean)
      .join(" • ");
    if (subtitle) {
      doc.text(subtitle, margin, y);
      y += baseLine * 1.2;
    }

    // Meta line
    doc.setFontSize(10);
    // const meta = [
    //   `Years of Experience: ${doctor.years}+`,
    //   `Patients Served: ${doctor?.patients?.toLocaleString?.() || 0}`,
    //   `Rating: ${doctor.rating} (${doctor.reviews} reviews)`,
    // ].join("   |   ");
    const meta = [
      `Years of Experience: ${doctor?.years ?? 0}+`,
      `Patients Served: ${doctor?.patients?.toLocaleString?.() ?? 0}`,
      `Rating: ${doctor?.rating ?? 0} (${doctor?.reviews ?? 0} reviews)`,
    ].join("   |   ");
    doc.text(meta, margin, y);
    y += baseLine * 1.5;

    // Contact
    if (doctor.gmail || doctor.phone || doctor.location) {
      heading("Contact");
      if (doctor.gmail) {
        ensureSpace(baseLine);
        doc.text(`Email: ${doctor.gmail}`, margin, y);
        y += baseLine;
      }
      if (doctor.Age != null) {
        ensureSpace(baseLine);
        doc.text(`Age: ${doctor.Age}`, margin, y);
        y += baseLine;
      }
      if (doctor.phone) {
        ensureSpace(baseLine);
        doc.text(`Phone: ${doctor.phone}`, margin, y);
        y += baseLine;
      }
      if (doctor.location) {
        ensureSpace(baseLine);
        doc.text(`Location: ${doctor.location}`, margin, y);
        y += baseLine;
      }
      y += 6;
    }

    // Summary
    if (doctor.about) {
      heading("Summary");
      paragraph(doctor.about);
    }

    // Specialties
    if (doctor.specialties?.length) {
      heading("Specialties");
      bullets(doctor.specialties);
    }

    // Languages
    if (doctor.languages?.length) {
      heading("Languages");
      paragraph(doctor.languages.join(", "));
    }

    // Experience (static sample with current hospital)
    heading("Experience");
    const experienceItems = [
      `2019 - Present: Senior Cardiologist, ${
        doctor.hospital || "General Hospital"
      }`,
      "2016 - 2019: Cardiologist, Central Hospital",
      "2013 - 2016: Resident Doctor, City Hospital",
    ];
    bullets(experienceItems);

    const base = toSafeFileName(doctor.FullName || "Doctor_Profile");
    doc.save(`${base}_CV.pdf`);
  };

  return (
    <div className={cx("profile_wrapper")}>
      <section className={cx("hero_card")}>
        <div className={cx("hero_left")}>
          <div className={cx("avatar")}>
            <i className="fa-solid fa-user-doctor"></i>
          </div>
          <div className={cx("identity")}>
            <h1 className={cx("name")}>{doctor.FullName}</h1>
            <p className={cx("title")}>
              {doctor.title} • {doctor.hospital}
            </p>
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
            <div className={cx("stat_value")}>
              {doctor.patients.toLocaleString()}
            </div>
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
              <span key={spec} className={cx("pill")}>
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className={cx("card")}>
          <h2 className={cx("card_title")}>
            <i className="fa-solid fa-phone"></i>
            Contact
          </h2>
          <ul className={cx("contact_list")}>
            <li>
              <i className="fa-solid fa-envelope"></i>
              {doctor.gmail}
            </li>
            <li>
              <i className="fa-solid fa-user"></i>Age: {doctor.Age}
            </li>
            <li>
              <i className="fa-solid fa-mobile-screen"></i>
              {doctor.phone}
            </li>
            <li>
              <i className="fa-solid fa-location-dot"></i>
              {doctor.location}
            </li>
          </ul>
        </div>

        <div className={cx("card")}>
          <h2 className={cx("card_title")}>
            <i className="fa-solid fa-graduation-cap"></i>
            Experience
          </h2>
          <ul className={cx("timeline")}>
            {experience.length == 1 &&
            experience[0].description === "default_value" ? (
              <>
                <div className={cx("time")}>2025 - Present</div>
                <div className={cx("desc")}>Please add yours experience</div>
              </>
            ) : (
              experience.map((experienceInfo) => (
                <li>
                  <div className={cx("time")}>{experienceInfo.year}</div>
                  <div className={cx("desc")}>{experienceInfo.description}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className={cx("actions_row")}>
        <button className={cx("btn", "primary")} onClick={openEdit}>
          Edit Profile
        </button>
        <button className={cx("btn", "secondary")} onClick={handleDownloadCV}>
          Download CV
        </button>
      </section>

      {isEditOpen && (
        <div className={cx("modal_overlay")}>
          <div className={cx("modal")}>
            <div className={cx("modal_header")}>
              <h3>
                <i className="fa-solid fa-user-pen"></i>Edit Profile
              </h3>
              <button
                className={cx("icon_btn")}
                onClick={closeEdit}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form className={cx("modal_body")} onSubmit={handleSave}>
              <div className={cx("form_grid")}>
                <div className={cx("form_group")}>
                  <label>Full Name</label>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group")}>
                  <label>Title</label>
                  <input
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group")}>
                  <label>Hospital</label>
                  <input
                    name="hospital"
                    value={formData.hospital || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group")}>
                  <label>Years</label>
                  <input
                    name="years"
                    type="number"
                    min="0"
                    value={formData.years ?? doctor.years}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group")}>
                  <label>Age</label>
                  <input
                    name="age"
                    type="number"
                    min="0"
                    value={formData.age ?? doctor.Age}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group")}>
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group")}>
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className={cx("form_group", "wide")}>
                  <label>Experience</label>
                  {experience.map((exp, index) => (
                    <div key={index} className={cx("experience_row")}>
                      <input
                        type="text"
                        name={`year-${index}`}
                        placeholder="Year (e.g. 2023-2024)"
                        value={exp.year}
                        onChange={(e) =>
                          handleChangeExperience(index, "year", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        name={`description-${index}`}
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) =>
                          handleChangeExperience(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className={cx("remove_btn")}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addExperience}
                    className={cx("add_btn")}
                  >
                    + Add Experience
                  </button>
                </div>

                <div className={cx("form_group", "wide")}>
                  <label>Location</label>
                  <input
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group", "wide")}>
                  <label>Specialties (comma-separated)</label>
                  <input
                    name="specialtiesText"
                    value={formData.specialtiesText || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group", "wide")}>
                  <label>Languages (comma-separated)</label>
                  <input
                    name="languagesText"
                    value={formData.languagesText || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form_group", "wide")}>
                  <label>About</label>
                  <textarea
                    name="about"
                    rows={4}
                    value={formData.about || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={cx("modal_actions")}>
                <button type="button" className={cx("btn")} onClick={closeEdit}>
                  Cancel
                </button>
                <button type="submit" className={cx("btn", "primary")}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
