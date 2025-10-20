import React, { useState } from "react";
import classNames from 'classnames/bind';
import styles from "./Header.module.scss";
import { useNavigate, useLocation } from "react-router-dom";

const cx = classNames.bind(styles);
const navObjects = [
  {
    'id': 1,
    'name': 'About Us',
    'url': 'about'
  },
  {
    'id': 2,
    'name': 'Chatbot',
    'url': 'chatbot'
  }
]
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(0);

  const onClickNavItem = (url, idNav) => {
    setActiveNav(idNav);
    navigate(`/${url}`);
  }

  const handleLogoClick = () => {
    setActiveNav(0);
    navigate('/');
  }

  const handleAuthNavigation = (path) => {
    setActiveNav(0);
    navigate(path);
  }

  // Check if current page is login or signup to un-toggle nav buttons
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // Helper function to check if a nav item should be active based on current route
  const isNavItemActive = (navObject) => {
    if (isAuthPage) return false;
    // Check if current path matches the nav url
    if (location.pathname === `/${navObject.url}`) return true;
    // Otherwise check the activeNav state
    return activeNav === navObject.id;
  };

  return (
    <div className={cx("wrapper_header")}>
      <header className={cx("header")}>
        {/* Logo */}
        <div className={cx("wrapper_logo")}>
          <div className={cx("logo")} onClick={handleLogoClick}>
            <i className="fa-solid fa-user-nurse"></i>
            <span className={cx("title_icon")}>The powerful chatbot for medical</span>
          </div>
          <div className={cx("wrapper_nawItem")}>
            {
              navObjects.map((navObject) =>
                <div
                  className={cx("nawItem", isNavItemActive(navObject) ? 'activeNawItem' : '')}
                  key={navObject.id}
                  onClick={() => onClickNavItem(navObject.url, navObject.id)}
                >
                  <span className={cx('nawItem_text')}>{navObject.name}</span>
                </div>
              )
            }
          </div>
        </div>

        {/* Navigation */}


        {/* Buttons */}
        <div className={cx("actions")}>
          <div className={cx("authToggle")}>
            <button
              className={cx("authBtn", location.pathname === "/login" ? "activeAuth" : "")}
              onClick={() => navigate("/login")}
            >Log In</button>
            <button
              className={cx("authBtn", location.pathname === "/signup" ? "activeAuth" : "")}
              onClick={() => navigate("/signup")}
            >Sign Up</button>
          </div>
        </div>

        {/* Hamburger for mobile */}
        {/* <button
          className={cx("hamburger")}
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button> */}
      </header>
    </div>
  );
}
