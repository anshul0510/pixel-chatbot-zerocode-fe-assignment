import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../pages/login.css";
import chatbotIllustration from "../assets/chatbot.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";


// Hash function (same as used in Register)
const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const hashedPassword = await hashPassword(password);

    const matchedUser = users.find(
      (user: any) => user.email === email && user.password === hashedPassword
    );

    if (matchedUser) {
      const sessionData = {
        user: matchedUser,
        expiresAt: Date.now() + 30 * 60 * 1000, 
      };
    
      localStorage.setItem("currentUser", JSON.stringify(sessionData));
    
      toast.success(`Welcome back, ${matchedUser.name.split(" ")[0]}!`);
      setTimeout(() => navigate("/chat"), 1500);
    }else {
      setError("Invalid email or password.");
      toast.error("Invalid credentials.");
    }
    
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <Header />

      <ToastContainer position="top-center" />
      <div className="login-container">
        <div className="login-left-panel">
          <img src={chatbotIllustration} alt="Chatbot" className="login-illustration" />
        </div>

        <div className="login-right-panel">
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Welcome Back, Human 🤖</h2>
            <p>Your AI assistant missed you.</p>
            <form onSubmit={handleLogin}>
              <input
                className="login-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
              />
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "Hide" : "Show"} Password
              </span>

              {error && <p className="login-error">{error}</p>}

              <button className="login-button" type="submit">
                Login
              </button>
            </form>

            <p style={{ marginTop: "1rem", fontSize: "14px", textAlign: "center" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "#4b7bec", cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>

            <div className="social-login">
              <p className="social-text">Or continue with</p>
              <div className="social-buttons">
                <button type="button" className="google-button">
                  <img src="/google-icon.svg" alt="Google" />
                  Google
                </button>
                <button type="button" className="github-button">
                  <img src="/github-icon.svg" alt="GitHub" />
                  GitHub
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
