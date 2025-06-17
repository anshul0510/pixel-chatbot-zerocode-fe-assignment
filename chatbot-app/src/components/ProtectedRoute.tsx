import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const data = localStorage.getItem("currentUser");

  if (!data) {
    return <Navigate to="/" />;
  }

  try {
    const session = JSON.parse(data);
    const isExpired = Date.now() > session.expiresAt;

    if (isExpired) {
      localStorage.removeItem("currentUser");
      return <Navigate to="/" />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("currentUser");
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
