import React from "react";
import styles from "./Home.module.scss";
import classNames from 'classnames/bind';
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={cx("wrapper")}>
      {/* Hero Section */}
      <section className={cx("hero")}>
        <div className={cx("hero_content")}>
          <h1 className={cx("hero_title")}>
            Your AI-Powered Medical Assistant
          </h1>
          <p className={cx("hero_description")}>
            Get instant medical information, symptom analysis, and health guidance
            powered by advanced AI technology. Available 24/7 to help you make
            informed health decisions.
          </p>
          <div className={cx("hero_buttons")}>
            <button
              className={cx("btn_primary")}
              onClick={() => navigate('/chatbot')}
            >
              Start Chat Now
            </button>
            <button
              className={cx("btn_secondary")}
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className={cx("hero_image")}>
          <i className="fa-solid fa-robot"></i>
        </div>
      </section>

      {/* Features Section */}
      <section className={cx("features")}>
        <h2 className={cx("section_title")}>Why Choose Our Medical Chatbot?</h2>
        <div className={cx("features_grid")}>
          <div className={cx("feature_card")}>
            <div className={cx("feature_icon")}>
              <i className="fa-solid fa-clock"></i>
            </div>
            <h3 className={cx("feature_title")}>24/7 Availability</h3>
            <p className={cx("feature_description")}>
              Access medical information anytime, anywhere. Our AI assistant is
              always ready to help you.
            </p>
          </div>

          <div className={cx("feature_card")}>
            <div className={cx("feature_icon")}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className={cx("feature_title")}>Secure & Private</h3>
            <p className={cx("feature_description")}>
              Your health data is encrypted and protected. We prioritize your
              privacy and confidentiality.
            </p>
          </div>

          <div className={cx("feature_card")}>
            <div className={cx("feature_icon")}>
              <i className="fa-solid fa-brain"></i>
            </div>
            <h3 className={cx("feature_title")}>AI-Powered</h3>
            <p className={cx("feature_description")}>
              Advanced AI technology provides accurate and reliable medical
              information based on latest research.
            </p>
          </div>

          <div className={cx("feature_card")}>
            <div className={cx("feature_icon")}>
              <i className="fa-solid fa-user-doctor"></i>
            </div>
            <h3 className={cx("feature_title")}>Expert Knowledge</h3>
            <p className={cx("feature_description")}>
              Trained on vast medical databases to provide comprehensive health
              guidance and information.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={cx("cta")}>
        <div className={cx("cta_content")}>
          <h2 className={cx("cta_title")}>Ready to Get Started?</h2>
          <p className={cx("cta_description")}>
            Join thousands of users who trust our AI medical assistant for reliable
            health information.
          </p>
          <button
            className={cx("btn_cta")}
            onClick={() => navigate('/signup')}
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  )
};

export default Home;
