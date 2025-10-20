import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import styles from "./DefaultLayout.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const DefaultLayout = () => {
  return (
    <div className={cx("d-flex", "flex-column", "min-vh-100", "wrapper_body")}>
      <Header />
      <main className={cx("wrapper_main", "flex-grow-1")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
