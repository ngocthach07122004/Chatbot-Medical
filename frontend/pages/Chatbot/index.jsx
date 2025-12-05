import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Chatbot.module.scss";
import classNames from "classnames/bind";
import PatientService from "../../services/patientService";
import chatServiceApi from "../../services/chatServiceApi";
import PatientListModal from "../../components/Form/PatientListModal";
import ArticlePopup from "../../components/ArticlePopup";
import { askClinicalQuestion } from "../../services/clinicalQaService";
import { fetchDocuments } from "../../services/corpusService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const cx = classNames.bind(styles);

const Chatbot = () => {
  const navigate = useNavigate();

  // --- States Dữ liệu ---
  const [patients, setPatients] = useState([]); // Danh sách bệnh nhân cho Sidebar
  const [messages, setMessages] = useState([]); // Tin nhắn hiển thị chính

  // --- States Context ---
  const [doctorId, setDoctorId] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [currentPatientName, setCurrentPatientName] = useState("");

  // --- States UI ---
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm trong sidebar
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // --- States for Article Popup ---
  const [selectedArticle, setSelectedArticle] = useState(null);

  // --- REFS (Đã bổ sung đầy đủ) ---
  const messagesEndRef = useRef(null);
  const chatHistoryRef = useRef(null); // <--- Đã thêm dòng này để fix lỗi
  const inputRef = useRef(null);       // <--- Đã thêm dòng này
  const userMenuRef = useRef(null);
  const userProfileRef = useRef(null);

  // 1. Kiểm tra Login & Init
  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    const storedDoctorId = localStorage.getItem("doctorId");
    if (!isLogin || !storedDoctorId) {
      navigate("/login");
    }
    setDoctorId(storedDoctorId);
  }, [navigate]);

  // 2. Lấy danh sách bệnh nhân (Sidebar)
  const getPatients = async () => {
    if (!doctorId) return;
    try {
      const response = await PatientService.getPatientsByDoctorLightWeight(doctorId);
      const data = response.data || response;
      if (Array.isArray(data)) {
        setPatients(data);
      }
    } catch (error) {
      console.log("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    getPatients();
  }, [doctorId]);

  // 3. Helper: Chuyển dữ liệu Backend (Map<Date, List>) -> UI Messages
  const mapBackendToMessages = (backendData) => {
    if (!backendData) return [];
    let allMessages = [];

    // Backend trả về: { "2025-12-03": [ {data: {user_question: "...", bot_answer: "..."}} ] }
    Object.keys(backendData).forEach((dateKey) => {
      const dailyChats = backendData[dateKey];
      dailyChats.forEach((item) => {
        const content = item.data;
        // Tách thành 2 bong bóng chat: User và Bot
        if (content.user_question) {
          allMessages.push({
            id: `u_${item.id}`,
            type: "user",
            text: content.user_question,
            timestamp: new Date(content.timestamp || item.createdAt),
          });
        }
        if (content.bot_answer) {
          allMessages.push({
            id: `b_${item.id}`,
            type: "bot",
            text: content.bot_answer,
            references: content.references || [],
            articles: content.articles || [],
            timestamp: new Date(content.timestamp || item.createdAt),
          });
        }
      });
    });

    // Sắp xếp theo thời gian tăng dần
    return allMessages.sort((a, b) => a.timestamp - b.timestamp);
  };

  // 4. Xử lý chọn bệnh nhân từ Sidebar
  const handleSelectPatient = async (patient) => {
    setCurrentPatientId(patient.id);
    setCurrentPatientName(patient.fullName || patient.name);
    setMessages([]); // Xóa tin nhắn cũ
    setIsTyping(true); // Hiển thị loading

    try {
      // Gọi API lấy lịch sử chat
      const data = await chatServiceApi.getHistoryChatByPatient(doctorId, patient.id);

      if (data && Object.keys(data).length > 0) {
        const historyMsgs = mapBackendToMessages(data);
        setMessages(historyMsgs);
      } else {
        // Nếu chưa có lịch sử, hiện lời chào
        setMessages([{
          id: "welcome",
          type: "bot",
          text: `Hello! I am ready to assist with patient: ${patient.fullName || patient.name}.`,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // 5. Scroll xuống cuối
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // 6. Open Article Popup
  const openArticlePopup = (articles, pmid) => {
    const article = articles?.find((a) => a.pmid === pmid);
    if (article) {
      setSelectedArticle(article);
    } else {
      // If article not found in the list, create a placeholder
      setSelectedArticle({ pmid, found: false });
    }
  };

  // 7. Close Article Popup
  const closeArticlePopup = () => {
    setSelectedArticle(null);
  };

  // 8. Gửi tin nhắn (Chat với AI) - Updated to use Clinical QA & Corpus APIs
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!currentPatientId) {
      alert("Please select a patient from the sidebar first!");
      return;
    }

    const userText = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Hiển thị tin nhắn User ngay lập tức (Optimistic UI)
    const tempUserMsg = {
      id: Date.now(),
      type: "user",
      text: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      // Step A: Call Clinical QA API to get answer + references
      const qa = await askClinicalQuestion(userText);

      // Step B: Fetch article contents if references exist
      let articles = [];
      if (qa.references && qa.references.length > 0) {
        try {
          articles = await fetchDocuments(qa.references);
        } catch (corpusError) {
          console.warn("Failed to fetch corpus documents:", corpusError);
          // Continue without articles if corpus API fails
        }
      }

      // Step C: Create bot message with answer, references, and articles
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        text: qa.answer,
        references: qa.references || [],
        articles: articles,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

      // Optional: Save to backend history (if you want to persist the chat)
      try {
        const payload = {
          doctorId: parseInt(doctorId),
          patientId: parseInt(currentPatientId),
          data: {
            user_question: userText,
            bot_answer: qa.answer,
            references: qa.references || [],
            articles: articles,
          },
        };
        await chatServiceApi.saveChat(payload);
      } catch (saveError) {
        console.warn("Failed to save chat history:", saveError);
      }

    } catch (error) {
      console.error("Clinical QA API Error:", error);
      setMessages((prev) => [...prev, {
        id: Date.now(),
        type: "bot",
        text: "Sorry, I couldn't process your question. Please try again or check if the medical AI service is available.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Logic phụ trợ (Filter, Menu) ---
  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      (p.fullName || p.name || "").toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  // Đóng menu user khi click ra ngoài
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (
        userMenuRef.current && !userMenuRef.current.contains(target) &&
        userProfileRef.current && !userProfileRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isUserMenuOpen]);

  const openUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const goProfile = () => navigate("/profile");

  return (
    <>
      <div className={cx("chatbot_wrapper")}>

        {/* === SIDEBAR: DANH SÁCH BỆNH NHÂN === */}
        <aside className={cx("sidebar")}>
          <div className={cx("sidebar_header")}>
            {/* Thay nút New Chat bằng ô tìm kiếm bệnh nhân */}
            <div className={cx("input_wrapper")} style={{ borderRadius: '12px', padding: '8px 12px', border: '1px solid #e0e0e0' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ color: '#888', marginRight: '8px' }}></i>
              <input
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
                placeholder="Search patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={cx("chat_history")} ref={chatHistoryRef}>
            <div className={cx("history_section")}>
              <h3 className={cx("history_title")}>My Patients</h3>

              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={cx(
                    "history_item",
                    currentPatientId === patient.id ? "active" : ""
                  )}
                  onClick={() => handleSelectPatient(patient)}
                >
                  <i className="fa-solid fa-user-injured" style={{ color: currentPatientId === patient.id ? '#007bff' : '#666' }}></i>
                  <span style={{ marginLeft: '8px' }}>
                    {patient.fullName || patient.name}
                  </span>
                </div>
              ))}

              {filteredPatients.length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  No patients found
                </div>
              )}
            </div>
          </div>

          <div className={cx("sidebar_footer")}>
            <div
              className={cx("user_profile")}
              onClick={openUserMenu}
              ref={userProfileRef}
            >
              <div className={cx("avatar")}>
                <i className="fa-solid fa-user-doctor"></i>
              </div>
              <span className={cx("username")}>Doctor</span>
            </div>
            {isUserMenuOpen && (
              <div className={cx("user_menu")} ref={userMenuRef}>
                <button className={cx("menu_item")} onClick={goProfile}>
                  <i className="fa-solid fa-user-doctor"></i> View Profile
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* === MAIN CHAT AREA === */}
        <main className={cx("chat_main")}>
          <div className={cx("chat_container")}>

            {/* Khu vực Tin nhắn */}
            <div className={cx("messages_area")}>
              {currentPatientId ? (
                <>
                  <div style={{ textAlign: 'center', paddingBottom: '16px', color: '#666', fontSize: '0.9rem' }}>
                    Talking with: <strong>{currentPatientName}</strong>
                  </div>

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cx(
                        "message",
                        message.type === "user" ? "user_message" : "bot_message"
                      )}
                    >
                      <div className={cx("message_avatar")}>
                        {message.type === "bot" ? (
                          <i className="fa-solid fa-robot"></i>
                        ) : (
                          <i className="fa-solid fa-user-doctor"></i>
                        )}
                      </div>
                      <div className={cx("message_content")}>
                        <div className={cx("message_text", message.type === "bot" ? "markdown_content" : "")}>
                          {message.type === "bot" ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.text}
                            </ReactMarkdown>
                          ) : (
                            message.text
                          )}
                        </div>

                        {/* Reference Chips - Only show for bot messages with references */}
                        {message.type === "bot" && message.references && message.references.length > 0 && (
                          <div className={cx("reference_chips")}>
                            <span className={cx("reference_label")}>
                              <i className="fa-solid fa-book-medical"></i>
                              References:
                            </span>
                            {message.references.map((pmid) => (
                              <span
                                key={pmid}
                                className={cx("reference_chip")}
                                onClick={() => openArticlePopup(message.articles, pmid)}
                                title={`View article PMID: ${pmid}`}
                              >
                                <i className="fa-solid fa-file-lines"></i>
                                PMID: {pmid}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className={cx("message_time")}>
                          {message.timestamp.toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className={cx("message", "bot_message")}>
                      <div className={cx("message_avatar")}>
                        <i className="fa-solid fa-robot"></i>
                      </div>
                      <div className={cx("message_content")}>
                        <div className={cx("typing_indicator")}>
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                  <i className="fa-solid fa-comments" style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                  <h3>Select a patient to view history</h3>
                </div>
              )}
            </div>

            {/* Khu vực Input */}
            <div className={cx("input_area")}>
              <form className={cx("input_form")} onSubmit={handleSendMessage}>
                <div className={cx("input_wrapper")}>
                  <input
                    ref={inputRef}
                    type="text"
                    className={cx("message_input")}
                    placeholder={currentPatientId ? `Ask about ${currentPatientName}...` : "Select a patient first..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={!currentPatientId}
                  />
                  <button
                    type="submit"
                    className={cx(
                      "send_btn",
                      inputValue.trim() ? "active" : ""
                    )}
                    disabled={!inputValue.trim()}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </form>
              <div className={cx("input_footer")}>
                <p>AI can make mistakes. Please verify important medical info.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isPatientModalOpen && (
        <PatientListModal
          patients={patients}
          setShowForm={setIsPatientModalOpen}
          handlePatientChat={handleSelectPatient}
        />
      )}

      {/* Article Popup Modal */}
      {selectedArticle && (
        <ArticlePopup
          article={selectedArticle}
          onClose={closeArticlePopup}
        />
      )}
    </>
  );
};

export default Chatbot;