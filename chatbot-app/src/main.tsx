import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { ThemeProviderWrapper, useThemeContext } from "./context/ThemeContext";
import "./styles/global.css";

const ThemedApp = () => {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <ThemedApp />
    </ThemeProviderWrapper>
  </React.StrictMode>
);
