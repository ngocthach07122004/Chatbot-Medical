import React, { useState } from "react";
import classNames from 'classnames/bind';
import styles from "./Header.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles); 
const navObjects =  [
   {
    'id':1,
    'name':'About We',
    'url':'aboutWe'
   },
   {
    'id':2,
    'name':'Chatbot',
    'url':'chatbot'
   }
]
export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(0);
  const onClickNavItem = (url, idNav) => {
     setIsOpen(idNav);
     return navigate(`/${url}`)
  }
  return (
    <div className={`${cx("wrapper_header")} navbar navbar-expand-lg main-nav`}>
      <header className={cx("header", "container")}>
        {/* Logo */}
        <div  className={cx("wrapper_logo")}>
          <div className={cx("logo")}>
           <>
              <i className={cx("fa-solid fa-user-nurse","custom_icon")}></i>
      
              <span className={cx("title_icon")}>The powerful chatbot for medical</span>
           </>
          </div>
          <div className={cx("wrapper_nawItem")}>
          {
            navObjects.map((navObject,index) => 
            (<div className={cx("nawItem", isOpen==navObject.id ? 'activeNawItem' :'' )} key = {index} onClick={ ()=>onClickNavItem(navObject.url,navObject.id)  } ><span className={cx('nawItem_text')}>{navObject.name}</span> </div>)
            )
          }
          </div>
        </div>
  
        {/* Navigation */}
        
  
        {/* Buttons */}
        <div className={cx("actions")}>
          <button className={cx("actions_btn","login")}>Log In</button>
          <button className={cx("actions_btn","signup")}>Sign Up</button>
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
