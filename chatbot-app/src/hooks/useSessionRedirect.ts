import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useSessionRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!session || Date.now() > session.expiresAt) {
      localStorage.removeItem("currentUser");
      navigate("/"); 
    }
  }, [navigate]);
};

export default useSessionRedirect;
