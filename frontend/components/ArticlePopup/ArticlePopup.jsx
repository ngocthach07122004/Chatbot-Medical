import React from "react";
import styles from "./ArticlePopup.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

/**
 * ArticlePopup - Modal component to display PubMed article details
 * @param {Object} article - The article object with pmid, text, and found properties
 * @param {Function} onClose - Callback function to close the popup
 */
export default function ArticlePopup({ article, onClose }) {
    if (!article) return null;

    // Handle clicking outside the popup to close
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle escape key to close
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div className={cx("article_popup_overlay")} onClick={handleOverlayClick}>
            <div className={cx("article_popup")}>
                <button className={cx("close_btn")} onClick={onClose} aria-label="Close">
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className={cx("popup_header")}>
                    <div className={cx("header_icon")}>
                        <i className="fa-solid fa-file-medical"></i>
                    </div>
                    <div className={cx("header_content")}>
                        <h2 className={cx("popup_title")}>PubMed Article</h2>
                        <span className={cx("pmid_badge")}>PMID: {article.pmid}</span>
                    </div>
                </div>

                <div className={cx("popup_body")}>
                    {!article.found ? (
                        <div className={cx("not_found")}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <h3>Document Not Found</h3>
                            <p>
                                The article with PMID <strong>{article.pmid}</strong> could not
                                be retrieved from the corpus database.
                            </p>
                            <a
                                href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx("pubmed_link")}
                            >
                                <i className="fa-solid fa-external-link-alt"></i>
                                View on PubMed
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className={cx("article_actions")}>
                                <a
                                    href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cx("action_btn")}
                                >
                                    <i className="fa-solid fa-external-link-alt"></i>
                                    View on PubMed
                                </a>
                            </div>
                            <div className={cx("article_text_container")}>
                                <pre className={cx("article_text")}>{article.text}</pre>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
