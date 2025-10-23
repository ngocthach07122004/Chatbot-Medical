import styles from './Footer.module.scss'
import classNames from 'classnames/bind';
import { Twitter, Facebook, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles); 
const Footer = () => {
  return (
    <footer className={cx("wrapper_footer","bg-danger","text-light","py-4","mt-auto")}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About BkuDoctor</h5>
            <ul className="list-unstyled">
              <li><Link className="text-light text-decoration-none" to="/about">Our Story</Link></li>
              <li><Link className="text-light text-decoration-none" to="/careers">Careers</Link></li>
              <li><Link className="text-light text-decoration-none" to="/news">News</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><Link className="text-light text-decoration-none" to="/contact">Contact Us</Link></li>
              <li><Link className="text-light text-decoration-none" to="/faq">FAQ</Link></li>
              <li><Link className="text-light text-decoration-none" to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Connect With Us</h5>
            <div className="d-flex gap-3">
              <a 
                href="#" 
                data-mdb-ripple-init
                className="btn text-white btn-floating p-2"
                style={{"backgroundColor": "#3b5998", "borderRadius": "50%"}}
                role="button"
              >
                <Facebook />
              </a>
              <a href="#" 
                data-mdb-ripple-init
                className="btn text-white btn-floating p-2"
                style={{"backgroundColor": "#55acee", "borderRadius": "50%"}}
                role="button"
                >
                  <Twitter />
                </a>
              <a 
                href="#" 
                data-mdb-ripple-init
                className="btn text-white btn-floating p-2"
                style={{"backgroundColor": "#33333", "borderRadius": "50%"}}
                role="button"
              >
                <Github />
              </a>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col text-center">
            <p className="mb-0">© 2025 Hcmut. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;