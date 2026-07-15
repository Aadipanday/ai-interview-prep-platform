import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "./logout-button.scss";

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 8l4 4-4 4M18 12H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 5H6a2 2 0 00-2 2v10a2 2 0 002 2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LogoutButton = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const didLogout = await handleLogout();

    if (didLogout) {
      navigate("/login", { replace: true });
    } else {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      className="logout-button"
      onClick={onLogout}
      disabled={isLoggingOut}
    >
      <LogoutIcon />
      {isLoggingOut ? "Signing out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
