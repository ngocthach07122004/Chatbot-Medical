import React from "react";
import styles from "./About.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const About = () => {
    return (
        <div className={cx("wrapper")}>
            {/* Header Section */}
            <section className={cx("header_section")}>
                <div className={cx("header_content")}>
                    <h1 className={cx("header_title")}>About Us</h1>
                    <p className={cx("header_description")}>
                        Revolutionizing healthcare with AI-powered medical assistance
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className={cx("mission_section")}>
                <div className={cx("container")}>
                    <div className={cx("mission_content")}>
                        <div className={cx("mission_text")}>
                            <h2 className={cx("section_title")}>Our Mission</h2>
                            <p className={cx("section_description")}>
                                We believe that quality healthcare information should be accessible
                                to everyone, anytime, anywhere. Our mission is to empower individuals
                                with reliable medical knowledge through cutting-edge AI technology,
                                helping them make informed decisions about their health and wellbeing.
                            </p>
                            <p className={cx("section_description")}>
                                Our advanced medical chatbot combines the latest in artificial
                                intelligence with comprehensive medical databases to provide accurate,
                                timely, and personalized health guidance.
                            </p>
                        </div>
                        <div className={cx("mission_icon")}>
                            <i className="fa-solid fa-bullseye"></i>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={cx("values_section")}>
                <div className={cx("container")}>
                    <h2 className={cx("section_title", "center")}>Our Core Values</h2>
                    <div className={cx("values_grid")}>
                        <div className={cx("value_card")}>
                            <div className={cx("value_icon")}>
                                <i className="fa-solid fa-heart"></i>
                            </div>
                            <h3 className={cx("value_title")}>Patient-Centered</h3>
                            <p className={cx("value_description")}>
                                We prioritize the needs and wellbeing of our users in every
                                decision we make.
                            </p>
                        </div>

                        <div className={cx("value_card")}>
                            <div className={cx("value_icon")}>
                                <i className="fa-solid fa-lightbulb"></i>
                            </div>
                            <h3 className={cx("value_title")}>Innovation</h3>
                            <p className={cx("value_description")}>
                                We continuously improve our technology to provide the best
                                medical assistance possible.
                            </p>
                        </div>

                        <div className={cx("value_card")}>
                            <div className={cx("value_icon")}>
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <h3 className={cx("value_title")}>Privacy</h3>
                            <p className={cx("value_description")}>
                                We maintain the highest standards of data security and user
                                confidentiality.
                            </p>
                        </div>

                        <div className={cx("value_card")}>
                            <div className={cx("value_icon")}>
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <h3 className={cx("value_title")}>Accuracy</h3>
                            <p className={cx("value_description")}>
                                We ensure all medical information is verified and based on
                                evidence-based research.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className={cx("team_section")}>
                <div className={cx("container")}>
                    <h2 className={cx("section_title", "center")}>Our Team</h2>
                    <p className={cx("team_intro")}>
                        A passionate group of medical professionals, AI researchers, and
                        software engineers dedicated to transforming healthcare accessibility.
                    </p>
                    <div className={cx("team_grid")}>
                        <div className={cx("team_card")}>
                            <div className={cx("team_avatar")}>
                                <i className="fa-solid fa-user-tie"></i>
                            </div>
                            <h3 className={cx("team_name")}>Medical Experts</h3>
                            <p className={cx("team_description")}>
                                Board-certified physicians and healthcare specialists
                            </p>
                        </div>

                        <div className={cx("team_card")}>
                            <div className={cx("team_avatar")}>
                                <i className="fa-solid fa-laptop-code"></i>
                            </div>
                            <h3 className={cx("team_name")}>AI Engineers</h3>
                            <p className={cx("team_description")}>
                                Leading experts in machine learning and natural language processing
                            </p>
                        </div>

                        <div className={cx("team_card")}>
                            <div className={cx("team_avatar")}>
                                <i className="fa-solid fa-users"></i>
                            </div>
                            <h3 className={cx("team_name")}>Support Team</h3>
                            <p className={cx("team_description")}>
                                Dedicated professionals ensuring the best user experience
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className={cx("contact_cta")}>
                <div className={cx("container")}>
                    <h2 className={cx("cta_title")}>Get In Touch</h2>
                    <p className={cx("cta_description")}>
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                    <button className={cx("btn_contact")}>
                        Contact Us
                    </button>
                </div>
            </section>
        </div>
    );
};

export default About;
