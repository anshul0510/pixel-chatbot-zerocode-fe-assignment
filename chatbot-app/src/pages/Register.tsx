import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import chatbotIllustration from "../assets/chatbot.svg";
import "../pages/login.css";
import Header from "../components/Header";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const strength = getPasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrength = (pass: string) => {
    if (pass.length < 6) return "Weak";
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) return "Strong";
    return "Medium";
  };

  const hashPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((user: any) => user.email === email);

    if (existingUser) {
      toast.error("User with this email already exists.");
      return;
    }

    const hashedPassword = await hashPassword(password);
    const updatedUsers = [...users, { name, email, password: hashedPassword }];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast.success("Registered successfully!");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <>
    <Header />

    <div className="login-container">
      <ToastContainer position="top-center" />      
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

          <h2>Create Account</h2>
          <p>Register to access your AI chatbot</p>

          <form onSubmit={handleRegister}>
            <input
              className="login-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setError("");
                setName(e.target.value);
              }}
            />
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
            <span className="toggle-password" onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"} Password
            </span>

            {/* Password Strength Indicator */}
            {password && (
              <p
                style={{
                  fontSize: "13px",
                  color:
                    passwordStrength === "Weak"
                      ? "#e74c3c"
                      : passwordStrength === "Medium"
                      ? "#f1c40f"
                      : "#2ecc71",
                  marginBottom: "1rem",
                }}
              >
                Password Strength: {passwordStrength}
              </p>
            )}

            {error && <p className="login-error">{error}</p>}

            <button className="login-button" type="submit">
              Register
            </button>
          </form>

          <p style={{ marginTop: "1rem", fontSize: "14px", textAlign: "center" }}>
            Already have an account?{" "}
            <span
              style={{ color: "#4b7bec", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Register;
