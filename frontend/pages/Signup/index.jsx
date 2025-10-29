import React, { useState } from "react";
import styles from "./Signup.module.scss";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import doctorAuthService from "../../services/doctorAuthApi";
const cx = classNames.bind(styles);

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const registerUser = async (data) => {
    try {
      const res = await doctorAuthService.register(data);
      //   alert("Đăng ký thành công!");
      //   console.log(res.data);
      if (res.code == "200") {
        navigate("/chatbot");
        localStorage.setItem("login", "success");
        localStorage.setItem("isLogin", true);
        localStorage.setItem("gmail", data.gmail);
        localStorage.setItem("fullName", res.entity.fullName);
        localStorage.setItem("doctorId", res.entity.id);
      }
    } catch (error) {
      localStorage.setItem("login", "fail");
      localStorage.setItem("isLogin", false);
      alert("Đăng ký thất bại!");
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const payload = {
      fullName: formData.fullName,
      gmail: formData.email,
      password: formData.password,
    };

    registerUser(payload);

    // console.log("Signup data:", formData);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("signup_container")}>
        <div className={cx("signup_card")}>
          <div className={cx("signup_header")}>
            <div className={cx("icon_wrapper")}>
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h1 className={cx("signup_title")}>Create Account</h1>
            <p className={cx("signup_subtitle")}>
              Join us and start your health journey today
            </p>
          </div>

          <form className={cx("signup_form")} onSubmit={handleSubmit}>
            <div className={cx("form_group")}>
              <label className={cx("form_label")}>
                <i className="fa-solid fa-user"></i>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                className={cx("form_input")}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={cx("form_group")}>
              <label className={cx("form_label")}>
                <i className="fa-solid fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className={cx("form_input")}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={cx("form_group")}>
              <label className={cx("form_label")}>
                <i className="fa-solid fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                name="password"
                className={cx("form_input")}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={cx("form_group")}>
              <label className={cx("form_label")}>
                <i className="fa-solid fa-lock"></i>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={cx("form_input")}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className={cx("form_checkbox")}>
              <label className={cx("checkbox_label")}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className={cx("terms_link")}>
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className={cx("terms_link")}>
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" className={cx("btn_submit")}>
              Create Account
            </button>
          </form>

          <div className={cx("signup_footer")}>
            <p className={cx("login_text")}>
              Already have an account?{" "}
              <span
                className={cx("login_link")}
                onClick={() => navigate("/login")}
              >
                Sign In
              </span>
            </p>
          </div>

          <div className={cx("divider")}>
            <span>OR</span>
          </div>

          <div className={cx("social_signup")}>
            <button className={cx("social_btn", "google")}>
              <i className="fa-brands fa-google"></i>
              Sign up with Google
            </button>
            <button className={cx("social_btn", "facebook")}>
              <i className="fa-brands fa-facebook-f"></i>
              Sign up with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
