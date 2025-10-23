import React, { useState } from "react";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import doctorAuthService from "../../services/doctorAuthApi";
const cx = classNames.bind(styles);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await doctorAuthService.login(email, password);
      if (res.code == "200") {
        localStorage.setItem("login", "success");
        localStorage.setItem("isLogin", true);
        localStorage.setItem("fullName", res.entity.fullName);
        window.dispatchEvent(new Event("loginChange"));
        navigate("/chatbot");
      } else {
        localStorage.setItem("login", "fail");
        localStorage.setItem("isLogin", false);
      }
    } catch (error) {
      localStorage.setItem("login", "fail");
      localStorage.setItem("isLogin", false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData.email, formData.password);
    // Handle login logic here
    // console.log("Login data:", formData);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("login_container")}>
        <div className={cx("login_card")}>
          <div className={cx("login_header")}>
            <div className={cx("icon_wrapper")}>
              <i className="fa-solid fa-user-nurse"></i>
            </div>
            <h1 className={cx("login_title")}>Welcome Back</h1>
            <p className={cx("login_subtitle")}>
              Sign in to continue to your medical assistant
            </p>
          </div>

          <form className={cx("login_form")} onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={cx("form_options")}>
              <label className={cx("checkbox_label")}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className={cx("forgot_link")}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className={cx("btn_submit")}>
              Sign In
            </button>
          </form>

          <div className={cx("login_footer")}>
            <p className={cx("signup_text")}>
              Don't have an account?{" "}
              <span
                className={cx("signup_link")}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>

          <div className={cx("divider")}>
            <span>OR</span>
          </div>

          <div className={cx("social_login")}>
            <button className={cx("social_btn", "google")}>
              <i className="fa-brands fa-google"></i>
              Continue with Google
            </button>
            <button className={cx("social_btn", "facebook")}>
              <i className="fa-brands fa-facebook-f"></i>
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
