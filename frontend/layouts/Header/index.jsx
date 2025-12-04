import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { useNavigate, useLocation } from "react-router-dom";

const cx = classNames.bind(styles);
const navObjects = [
  {
    id: 1,
    name: "About Us",
    url: "about",
  },
  {
    id: 2,
    name: "Chatbot",
    url: "chatbot",
  },
  {
    id: 3,
    name: "Patients",
    url: "patients",
  },
  {
    id: 4,
    name: "Analytics",
    url: "analytics",
  },
];
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(0);
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));
  const [imageUser, setImageUser] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const userMenuRef = useRef(null);
  const userProfileRef = useRef(null);
  const openUserMenu = () => setIsUserMenuOpen((v) => !v);
  const goProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/profile");
  };
  const goHistory = () => {
    setIsUserMenuOpen(false);
    setIsHistoryOpen(true);
    setHistoryQuery("");
  };

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        userProfileRef.current &&
        !userProfileRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isUserMenuOpen]);

  useEffect(() => {
    // console.log("LOGIN",isLogin)
    // const isLoginValue = localStorage.getItem("isLogin");
    // setIsLogin(isLoginValue);
    //   console.log("LOGIN",isLogin)
    // const fullName =
    //   !isLoginValue
    //     ? "Võ Lê Khánh Vân"
    //     : localStorage.getItem("fullName");
    // setFullName(fullName);

    const handleLoginChange = () => {
      const isLoginValue = localStorage.getItem("isLogin");
      setIsLogin(isLoginValue);
      const fullName = !isLoginValue
        ? "Võ Lê Khánh Vân"
        : localStorage.getItem("fullName");
      setFullName(fullName);
    };

    window.addEventListener("loginChange", handleLoginChange);
    window.addEventListener("profileChange", handleLoginChange);

    return () => {
      window.removeEventListener("loginChange", handleLoginChange);
      window.removeEventListener("profileChange", handleLoginChange);
    };
  }, []);

  const onClickNavItem = (url, idNav) => {
    setActiveNav(idNav);
    navigate(`/${url}`);
  };

  const handleLogoClick = () => {
    setActiveNav(0);
    navigate("/");
  };

  // const handleAuthNavigation = (path) => {
  //   setActiveNav(0);
  //   navigate(path);
  // };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("fullName");
    localStorage.removeItem("gmail");
    setIsLogin(false);
    setFullName("");
    navigate("login/");
  };

  // Check if current page is login or signup to un-toggle nav buttons
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

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
            <span className={cx("title_icon")}>
              The powerful chatbot for medical
            </span>
          </div>
          <div className={cx("wrapper_nawItem")}>
            {navObjects.map((navObject) => (
              <div
                className={cx(
                  "nawItem",
                  isNavItemActive(navObject) ? "activeNawItem" : ""
                )}
                key={navObject.id}
                onClick={() => onClickNavItem(navObject.url, navObject.id)}
              >
                <span className={cx("nawItem_text")}>{navObject.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}

        {/* Buttons */}
        <div>
          {!isLogin ? (
            <div className={cx("actions")}>
              <div className={cx("authToggle")}>
                <button
                  className={cx(
                    "authBtn",
                    location.pathname === "/login" ? "activeAuth" : ""
                  )}
                  onClick={() => navigate("/login")}
                >
                  Log In
                </button>
                <button
                  className={cx(
                    "authBtn",
                    location.pathname === "/signup" ? "activeAuth" : ""
                  )}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          ) : (
            <div className={cx("user_profile_wrapper")}>
              <div
                className={cx("user_profile")}
                onClick={openUserMenu}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openUserMenu();
                }}
                ref={userProfileRef}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-label="Open user menu"
              >
                <div className={cx("avatar")}>
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className={cx("username")}>{fullName}</span>
              </div>

              {isUserMenuOpen && (
                <div className={cx("user_menu")} ref={userMenuRef} role="menu">
                  <button
                    className={cx("menu_item")}
                    role="menuitem"
                    onClick={goProfile}
                  >
                    <i className="fa-solid fa-user-doctor"></i>
                    View user profile
                  </button>
                  <button
                    className={cx("menu_item")}
                    role="menuitem"
                    onClick={goHistory}
                  >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    View chat history
                  </button>

                  <button
                    className={cx("menu_item")}
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <i className="fa fa-sign-out"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
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
