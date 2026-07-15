import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        // BUG FIX: the backend controller destructures `{ name, email,
        // password }` from req.body — there is no `username` field on the
        // server at all. Sending `username` meant `name` was always
        // undefined, which always tripped the backend's "Please provide
        // name, email, and password" validation and returned 400. Every
        // registration attempt was failing here, which is also why
        // getMe() always came back 401 afterward — no account was ever
        // actually created.
        const res = await api.post("/api/auth/register", { name: username, email, password });
        return res.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const res = await api.post("/api/auth/login", { email, password });
        return res.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

export async function logout() {
    try {
        const res = await api.get("/api/auth/logout");
        return res.data;
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
}

export async function getMe() {
    try {
        const res = await api.get("/api/auth/get-me");
        return res.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}