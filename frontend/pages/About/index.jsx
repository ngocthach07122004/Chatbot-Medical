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
                        Building an AI-powered medical Q&A system using Bi-Encoder Retrieval and Cross-Encoder Reranking
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
                                As part of the Data Warehouse and Decision Support Systems course (CO4031) at Ho Chi Minh City University of Technology,
                                our mission is to design and build a reliable medical question-answering system that leverages advanced AI techniques
                                to provide accurate health information from trusted sources like OpenFDA and PMC-Patients.
                            </p>
                            <p className={cx("section_description")}>
                                Our system combines multi-source retrieval, knowledge synthesis, and generative responses to bridge the gap between
                                complex medical knowledge and everyday users, supporting informed health decisions while addressing challenges in
                                data processing and semantic understanding.
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
                            <h3 className={cx("value_title")}>User-Focused</h3>
                            <p className={cx("value_description")}>
                                We prioritize delivering helpful and accessible medical information for patients, healthcare workers, and the general public.
                            </p>
                        </div>

                        <div className={cx("value_card")}>
                            <div className={cx("value_icon")}>
                                <i className="fa-solid fa-lightbulb"></i>
                            </div>
                            <h3 className={cx("value_title")}>Innovation</h3>
                            <p className={cx("value_description")}>
                                We employ cutting-edge techniques like Bi-Encoder and Cross-Encoder to enhance retrieval accuracy in medical domains.
                            </p>
                        </div>

                        <div className={cx("value_card")}>
                            <div className={cx("value_icon")}>
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <h3 className={cx("value_title")}>Data Integrity</h3>
                            <p className={cx("value_description")}>
                                We maintain high standards in data processing using Medallion Architecture and ensure ethical handling of medical information.
                            </p>
                        </div>

                        <div className={cx("value_card")}>
                            <div className={cx("value_icon")}>
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <h3 className={cx("value_title")}>Accuracy</h3>
                            <p className={cx("value_description")}>
                                All responses are based on verified sources and advanced retrieval methods to minimize errors and hallucinations.
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
                        A group of dedicated Computer Science students from Ho Chi Minh City University of Technology, passionate about applying data engineering and AI to healthcare challenges.
                    </p>
                    <div className={cx("values_grid")}>
                        <div className={cx("team_card")}>
                            <div className={cx("team_avatar")}>
                                <i className="fa-solid fa-user-graduate"></i>
                            </div>
                            <h3 className={cx("team_name")}>Nguyễn Đình Đức</h3>
                            <p className={cx("team_description")}>
                                Student ID: 2210794
                            </p>
                        </div>

                        <div className={cx("team_card")}>
                            <div className={cx("team_avatar")}>
                                <i className="fa-solid fa-user-graduate"></i>
                            </div>
                            <h3 className={cx("team_name")}>Huỳnh Ngọc Duy Khương</h3>
                            <p className={cx("team_description")}>
                                Student ID: 2211710
                            </p>
                        </div>

                        <div className={cx("team_card")}>
                            <div className={cx("team_avatar")}>
                                <i className="fa-solid fa-user-graduate"></i>
                            </div>
                            <h3 className={cx("team_name")}>Nguyễn Trần Minh Tâm</h3>
                            <p className={cx("team_description")}>
                                Student ID: 2213035
                            </p>
                        </div>

                        <div className={cx("team_card")}>
                            <div className={cx("team_avatar")}>
                                <i className="fa-solid fa-user-graduate"></i>
                            </div>
                            <h3 className={cx("team_name")}>Huỳnh Ngọc Thạch</h3>
                            <p className={cx("team_description")}>
                                Student ID: 2213173 
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