import styled from "styled-components";
import { useThemeContext } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.card};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;


const Button = styled.button`
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

const Header = () => {
  const { toggleTheme, isDarkMode } = useThemeContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("currentUser");
  
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const isExpired = Date.now() > parsed.expiresAt;
  
        if (isExpired) {
          console.log("Session expired. Logging out.");
          localStorage.removeItem("currentUser");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          console.log("Session valid. User logged in.");
        }
      } catch (err) {
        console.error("Error parsing session:", err);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <HeaderContainer>
      <ButtonGroup>
        <Button
          onClick={() => {
            console.log("Toggling theme...");
            toggleTheme();
          }}
        >
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>
        {isLoggedIn && (
          <Button onClick={handleLogout}>Logout</Button>
        )}
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default Header;
