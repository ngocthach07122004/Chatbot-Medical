import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Hello! I\'m your medical assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        setMessages(prev => [...prev, userMessage]);
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
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleNewChat = () => {
        setMessages([
            {
                id: Date.now(),
                type: 'bot',
                text: 'Hello! I\'m your medical assistant. How can I help you today?',
                timestamp: new Date()
            }
        ]);
    };

    const suggestedPrompts = [
        "What are common symptoms of flu?",
        "How can I improve my sleep quality?",
        "Tell me about healthy eating habits",
        "What should I do for a headache?"
    ];

    return (
        <div className={cx("chatbot_wrapper")}>
            {/* Sidebar */}
            <aside className={cx("sidebar")}>
                <div className={cx("sidebar_header")}>
                    <button className={cx("new_chat_btn")} onClick={handleNewChat}>
                        <i className="fa-solid fa-plus"></i>
                        <span>New Chat</span>
                    </button>
                </div>

                <div className={cx("chat_history")}>
                    <div className={cx("history_section")}>
                        <h3 className={cx("history_title")}>Recent</h3>
                        <div className={cx("history_item", "active")}>
                            <i className="fa-solid fa-message"></i>
                            <span>Medical Consultation</span>
                        </div>
                        <div className={cx("history_item")}>
                            <i className="fa-solid fa-message"></i>
                            <span>Symptom Check</span>
                        </div>
                        <div className={cx("history_item")}>
                            <i className="fa-solid fa-message"></i>
                            <span>Health Tips</span>
                        </div>
                    </div>
                </div>

                <div className={cx("sidebar_footer")}>
                    <div className={cx("user_profile")}>
                        <div className={cx("avatar")}>
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <span className={cx("username")}>Medical User</span>
                    </div>
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
    );
};

export default Chatbot;
