import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import axios from "axios";
import Header from "../components/Header";
import useSessionRedirect from "../hooks/useSessionRedirect";

const USER_AVATAR = "https://i.pravatar.cc/40?img=3";
const BOT_AVATAR = "https://i.pravatar.cc/40?img=8";

const Wrapper = styled(motion.div)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  overflow: hidden;
`;

const Container = styled.div`
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.body};
`;

const BubbleWrapper = styled.div<{ sender: "user" | "bot" }>`
  display: flex;
  flex-direction: ${({ sender }) => (sender === "user" ? "row-reverse" : "row")};
  align-items: flex-end;
  gap: 8px;
  max-width: 100%;
  position: relative;

  &:hover .timestamp {
    opacity: 1;
  }
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const Bubble = styled(motion.div)<{ sender: "user" | "bot" }>`
  background: ${({ sender, theme }) =>
    sender === "user" ? theme.primary : theme.card};
  color: ${({ sender, theme }) =>
    sender === "user" ? "#fff" : theme.text};
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 15px;
  word-wrap: break-word;
  max-width: 70%;
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: gray;
  margin-top: 2px;
  opacity: 0;
  transition: opacity 0.3s;
`;

const InputArea = styled(motion.div)`
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.input};
  background: ${({ theme }) => theme.card};
  position: sticky;
  bottom: 0;
  z-index: 2;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 30px;
  border: none;
  font-size: 15px;
  outline: none;
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0 20px;
  border-radius: 50px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
  padding-left: 6px;

  span {
    width: 6px;
    height: 6px;
    background: gray;
    border-radius: 50%;
    animation: blink 1s infinite alternate;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 1;
    }
  }
`;

const ClearButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const session = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userEmail = session?.user?.email;

  useSessionRedirect();

  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem("voiceLang") || "en-US";
  });

  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "hi-IN", label: "Hindi (India)" },
    { code: "es-ES", label: "Spanish (Spain)" },
    { code: "fr-FR", label: "French" },
    { code: "de-DE", label: "German" },
    { code: "ja-JP", label: "Japanese" },
    { code: "zh-CN", label: "Chinese (Simplified)" },
  ];

  useEffect(() => {
    if (!userEmail) {
      navigate("/");
    }
  }, [userEmail, navigate]);

  const [chatHistory, setChatHistory] = useState<
    { sender: "user" | "bot"; text: string; timestamp: string }[]
  >(() => {
    const saved = localStorage.getItem(`chatHistory-${userEmail}`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "Hi! I'm Bolt 🤖, your assistant. Ask me anything!",
            timestamp: new Date().toISOString(),
          },
        ];
  });

  const handleSend = async () => {
    if (!message.trim() || isBotTyping) return;

    const now = new Date().toISOString();
    const userMsg = { sender: "user", text: message, timestamp: now };
    const newHistory = [...chatHistory, userMsg];

    setChatHistory(newHistory);
    setMessage("");
    setIsBotTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message,
      });

      const botMsg = {
        sender: "bot",
        text: response.data.reply,
        timestamp: new Date().toISOString(),
      };

      setChatHistory([...newHistory, botMsg]);
    } catch (error) {
      console.error("Flask API Error:", error);

      const botMsg = {
        sender: "bot",
        text: "Something went wrong with the server.",
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, botMsg]);
    } finally {
      setIsBotTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isBotTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => prev + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [selectedLang]);

  const handleClearChat = () => {
    const cleared = [
      {
        sender: "bot",
        text: "Hi! I'm Bolt 🤖, your assistant. Ask me anything!",
        timestamp: new Date().toISOString(),
      },
    ];
    setChatHistory(cleared);
    localStorage.setItem(`chatHistory-${userEmail}`, JSON.stringify(cleared));
  };

  const handleExport = (type: "txt" | "json") => {
    const filename = `chat-${new Date().toISOString().slice(0, 19)}.${type}`;
    let content = "";

    if (type === "txt") {
      content = chatHistory
        .map((msg) => `${msg.sender.toUpperCase()}: ${msg.text}`)
        .join("\n\n");
    } else {
      content = JSON.stringify(chatHistory, null, 2);
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <Wrapper
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "10px 16px",
            background: "#f9f9f9",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <select
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              localStorage.setItem("voiceLang", e.target.value);
            }}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <ClearButton onClick={handleClearChat}>Clear Chat</ClearButton>
          <ClearButton onClick={() => handleExport("txt")}>Export TXT</ClearButton>
          <ClearButton onClick={() => handleExport("json")}>Export JSON</ClearButton>
        </div>

        {chatHistory.length === 1 && (
          <div
            style={{
              padding: "0 20px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {[
              "Summarize this article for me",
              "Give me 5 startup ideas",
              "Explain React like I’m 5",
              "What’s new in Python 3.12?",
            ].map((template, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(template)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "16px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {template}
              </button>
            ))}
          </div>
        )}

        <ChatBody>
          {chatHistory.map((msg, index) => (
            <BubbleWrapper key={index} sender={msg.sender}>
              <Avatar src={msg.sender === "user" ? USER_AVATAR : BOT_AVATAR} />
              <div>
                <Bubble
                  sender={msg.sender}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {msg.text}
                </Bubble>
                <Timestamp className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Timestamp>
              </div>
            </BubbleWrapper>
          ))}

          {isBotTyping && (
            <TypingIndicator>
              <span></span>
              <span></span>
              <span></span>
            </TypingIndicator>
          )}
          <div ref={chatEndRef} />
        </ChatBody>

        <InputArea
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ChatInput
            ref={inputRef}
            placeholder="Type something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <SendButton onClick={handleSend} disabled={isBotTyping}>
            ➤
          </SendButton>
          <SendButton
            onClick={() => {
              if (isListening) {
                recognitionRef.current?.stop();
                setIsListening(false);
              } else {
                recognitionRef.current?.start();
                setIsListening(true);
              }
            }}
            title="Click to speak"
            style={{
              background: isListening ? "#ff7675" : "#0984e3",
              transition: "0.3s",
            }}
          >
            🎤
          </SendButton>
        </InputArea>
      </Container>
    </Wrapper>
  );
};

export default Chat;
