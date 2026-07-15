import { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here

        try {
            const success = await handleLogin({ email, password });

            if (success) {
                navigate("/"); // ✅ only redirect if login worked
            } else {
                alert("Invalid email or password"); // show error
            }
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed. Please check your credentials.");
        }
    }

    if (loading) {
        return (
            <main ><h1>Loading...</h1></main>
        )
    }


    return (

        <main className="auth-page">
            <div className="form-container">
                <div className="auth-heading">
                    <h1>Welcome back</h1>
                    <p>Sign in to continue your interview preparation.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" name="email" id="email" placeholder="you@example.com" autoComplete="email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" name="password" id="password" placeholder="Enter your password" autoComplete="current-password" required />
                    </div>
                    <button type="submit" className="btn primary-btn">Login</button>
                </form>
                <p className="auth-switch">Don't have an account? <Link to={"/register"}>Create one</Link></p>
            </div>
        </main>



    )
}
