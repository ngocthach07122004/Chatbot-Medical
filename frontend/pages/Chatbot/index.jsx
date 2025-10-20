import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Chatbot.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Chatbot = () => {
    const navigate = useNavigate();

    // Helper to generate a greeting message
    const makeGreeting = () => ({
        id: Date.now(),
        type: 'bot',
        text: "Hello! I'm your medical assistant. How can I help you today?",
        timestamp: new Date(),
    });

    // Seed a couple of sessions for the history sidebar (UI-only)
    const initialSessions = [
        {
            id: 's1',
            title: 'Medical Consultation',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
            messages: [makeGreeting()],
        },
        {
            id: 's2',
            title: 'Symptom Check',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            messages: [
                { id: Date.now() - 5, type: 'user', text: 'I have a mild fever and sore throat.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
                { id: Date.now() - 4, type: 'bot', text: 'Those can be signs of a common cold or flu. Do you have any other symptoms?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            ],
        },
    ];

    const [sessions, setSessions] = useState(initialSessions);
    const [currentSessionId, setCurrentSessionId] = useState(initialSessions[0].id);
    const [messages, setMessages] = useState(initialSessions[0].messages);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [historyPulse, setHistoryPulse] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyQuery, setHistoryQuery] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatHistoryRef = useRef(null);
    const userMenuRef = useRef(null);
    const userProfileRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Close user menu when clicking outside
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
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isUserMenuOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputValue,
            timestamp: new Date()
        };
        // Update local messages state
        setMessages(prev => [...prev, userMessage]);
        // Update the message list in the selected session
        setSessions(prev => prev.map(s => {
            if (s.id !== currentSessionId) return s;
            const hadUserBefore = (s.messages || []).some(m => m.type === 'user');
            const newTitle = hadUserBefore ? s.title : (userMessage.text.trim().slice(0, 40) || s.title || 'New Chat');
            return { ...s, title: newTitle, messages: [...s.messages, userMessage] };
        }));
        setInputValue('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'Thank you for your message. As a medical assistant, I can help you with general health information, symptom assessment, and medical guidance. Please note that I\'m not a replacement for professional medical advice.',
                timestamp: new Date()
            };
            // Update local messages state
            setMessages(prev => [...prev, botMessage]);
            // Update the selected session as well
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, botMessage] } : s));
            setIsTyping(false);
        }, 1500);
    };

    const handleNewChat = () => {
        const newSession = {
            id: `s_${Math.random().toString(36).slice(2, 8)}`,
            title: 'New Chat',
            createdAt: new Date(),
            messages: [makeGreeting()],
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setMessages(newSession.messages);
    };

    const handleSelectSession = (id) => {
        setCurrentSessionId(id);
        const found = sessions.find(s => s.id === id);
        if (found) {
            setMessages(found.messages);
        }
    };

    const openUserMenu = () => setIsUserMenuOpen((v) => !v);
    const goProfile = () => { setIsUserMenuOpen(false); navigate('/profile'); };
    const goHistory = () => {
        setIsUserMenuOpen(false);
        setIsHistoryOpen(true);
        setHistoryQuery("");
    };

    const filteredSessions = useMemo(() => {
        const q = historyQuery.trim().toLowerCase();
        if (!q) return sessions;
        return sessions.filter((s) =>
            s.title.toLowerCase().includes(q) ||
            (s.messages || []).some((m) => (m.text || "").toLowerCase().includes(q))
        );
    }, [sessions, historyQuery]);

    const suggestedPrompts = [
        "What are common symptoms of flu?",
        "How can I improve my sleep quality?",
        "Tell me about healthy eating habits",
        "What should I do for a headache?"
    ];

    return (
        <>
            <div className={cx("chatbot_wrapper")}>
                {/* Sidebar */}
                <aside className={cx("sidebar")}>
                    <div className={cx("sidebar_header")}>
                        <button className={cx("new_chat_btn")} onClick={handleNewChat}>
                            <i className="fa-solid fa-plus"></i>
                            <span>New Chat</span>
                        </button>
                    </div>

                    <div className={cx("chat_history", historyPulse ? 'pulse' : '')} ref={chatHistoryRef}>
                        <div className={cx("history_section")}>
                            <h3 className={cx("history_title")}>Recent</h3>
                            {sessions.map((s) => (
                                <div
                                    key={s.id}
                                    className={cx("history_item", currentSessionId === s.id ? "active" : "")}
                                    onClick={() => handleSelectSession(s.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectSession(s.id); }}
                                >
                                    <i className="fa-solid fa-message"></i>
                                    <span>{s.title}</span>
                                </div>
                            ))}
                            {sessions.length === 0 && (
                                <div className={cx("history_item")}>
                                    <i className="fa-solid fa-message"></i>
                                    <span>No conversations yet</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={cx("sidebar_footer")}>
                        <div
                            className={cx("user_profile")}
                            onClick={openUserMenu}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openUserMenu(); }}
                            ref={userProfileRef}
                            aria-haspopup="menu"
                            aria-expanded={isUserMenuOpen}
                            aria-label="Open user menu"
                        >
                            <div className={cx("avatar")}>
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <span className={cx("username")}>Medical User</span>
                        </div>
                        {isUserMenuOpen && (
                            <div className={cx("user_menu")} ref={userMenuRef} role="menu">
                                <button className={cx("menu_item")} role="menuitem" onClick={goHistory}>
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                    View chat history
                                </button>
                                <button className={cx("menu_item")} role="menuitem" onClick={goProfile}>
                                    <i className="fa-solid fa-user-doctor"></i>
                                    View user profile
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className={cx("chat_main")}>
                    <div className={cx("chat_container")}>
                        {/* Messages */}
                        <div className={cx("messages_area")}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cx("message", message.type === 'user' ? 'user_message' : 'bot_message')}
                                >
                                    <div className={cx("message_avatar")}>
                                        {message.type === 'bot' ? (
                                            <i className="fa-solid fa-user-nurse"></i>
                                        ) : (
                                            <i className="fa-solid fa-user"></i>
                                        )}
                                    </div>
                                    <div className={cx("message_content")}>
                                        <div className={cx("message_text")}>{message.text}</div>
                                        <div className={cx("message_time")}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className={cx("message", "bot_message")}>
                                    <div className={cx("message_avatar")}>
                                        <i className="fa-solid fa-user-nurse"></i>
                                    </div>
                                    <div className={cx("message_content")}>
                                        <div className={cx("typing_indicator")}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Prompts (show only if no user messages yet) */}
                        {messages.filter(m => m.type === 'user').length === 0 && (
                            <div className={cx("suggested_prompts")}>
                                <h3 className={cx("prompts_title")}>Suggested Questions</h3>
                                <div className={cx("prompts_grid")}>
                                    {suggestedPrompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            className={cx("prompt_card")}
                                            onClick={() => setInputValue(prompt)}
                                        >
                                            <i className="fa-solid fa-lightbulb"></i>
                                            <span>{prompt}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className={cx("input_area")}>
                            <form className={cx("input_form")} onSubmit={handleSendMessage}>
                                <div className={cx("input_wrapper")}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className={cx("message_input")}
                                        placeholder="Ask me anything about your health..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className={cx("send_btn", inputValue.trim() ? 'active' : '')}
                                        disabled={!inputValue.trim()}
                                    >
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                            <div className={cx("input_footer")}>
                                <p>Medical chatbot can make mistakes. Always verify important information.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* History modal */}
            {isHistoryOpen && (
                <div className={cx("modal_overlay")} onClick={() => setIsHistoryOpen(false)}>
                    <div className={cx("modal_panel")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className={cx("modal_header")}>
                            <h3><i className="fa-solid fa-clock-rotate-left"></i> Chat history</h3>
                            <button className={cx("icon_btn")} onClick={() => setIsHistoryOpen(false)} aria-label="Close">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className={cx("modal_body")}>
                            <div className={cx("history_search")}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input
                                    placeholder="Search by title or message"
                                    value={historyQuery}
                                    onChange={(e) => setHistoryQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className={cx("history_list")}>
                                {filteredSessions.map((s) => (
                                    <button key={s.id} className={cx("history_row")} onClick={() => { handleSelectSession(s.id); setIsHistoryOpen(false); }}>
                                        <div className={cx("row_title")}>{s.title}</div>
                                        <div className={cx("row_meta")}>
                                            <span><i className="fa-regular fa-clock" /> {new Date(s.createdAt).toLocaleString()}</span>
                                            <span>• {s.messages.length} messages</span>
                                        </div>
                                        <div className={cx("row_preview")}>{s.messages[0]?.text?.slice(0, 80)}{(s.messages[0]?.text?.length || 0) > 80 ? "…" : ""}</div>
                                    </button>
                                ))}
                                {filteredSessions.length === 0 && (
                                    <div className={cx("empty_center")}>No results. Try a different keyword.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
