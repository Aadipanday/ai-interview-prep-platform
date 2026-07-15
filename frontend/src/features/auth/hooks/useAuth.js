import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

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
            // BUG FIX: this used to swallow the error completely — no
            // return value at all, so the caller (Register.jsx) had no
            // way to know registration failed and would navigate("/")
            // regardless. That's what sent you to a protected route
            // while unauthenticated, which then redirected to /login —
            // and hid the real save failure from you in the process.
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

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user); // logged in
            } catch (error) {
                console.error("No user logged in:", error);
                setUser(null); // not logged in
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [setLoading, setUser]);

    return { user, loading, handleLogin, handleRegister, handleLogout };
};
