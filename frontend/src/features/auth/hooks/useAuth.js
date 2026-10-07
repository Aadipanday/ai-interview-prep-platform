import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return true; // ✅ success
        } catch (error) {
            console.error("Login failed:", error);
            return false; // ❌ failure
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return true; // ✅ success
        } catch (error) {
            console.error("Register failed:", error);
            return false; // ❌ failure
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            return true;
        } catch (error) {
            console.error("Logout failed:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, handleLogin, handleRegister, handleLogout };
};
