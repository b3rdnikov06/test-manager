import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { loginUser }
    from '../services/authService';

import { useAuth }
    from '../context/AuthContext';

function LoginPage() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [error, setError] =
        useState('');

    const [showError, setShowError] =
        useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setError('');

            const data =
                await loginUser(
                    email,
                    password
                );

            login(data.token);

            navigate('/tests');

        } catch (err) {

            if (err.response?.data?.error) {

                setError(
                    err.response.data.error
                );

                setShowError(true);

                setTimeout(() => {

                    setShowError(false);

                }, 5000);

            } else {

                setError('Login failed');

                setShowError(true);

                setTimeout(() => {

                    setShowError(false);

                }, 5000);

            }

        }

    }

    return (

        <div className="auth-page">

            <div className="auth-container">
    
                <div className="auth-layout">
        
                    <div className="auth-banner">
        
                        <h1 className="banner-title">
                            Welcome to TestSystem
                        </h1>
        
                        <p className="banner-subtitle">
                            Create tests, manage students,
                            and track results in one place.
                        </p>
        
                        <div className="banner-features">
        
                            <div className="feature-item">
                                Modern testing platform
                            </div>
        
                            <div className="feature-item">
                                Student analytics
                            </div>
        
                            <div className="feature-item">
                                Fast and intuitive interface
                            </div>
        
                        </div>
        
                    </div>
        
                    <div className="auth-card">
        
                        <h1 className="auth-title">
                            Welcome Back
                        </h1>
        
                        <p className="auth-subtitle">
                            Login to your account
                        </p>
        
                        <form onSubmit={handleSubmit}>
        
                            <input
                                className="input"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
        
                            <input
                                className="input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />
        
                            <button
                                className="btn-primary auth-btn"
                                type="submit"
                            >
                                Login
                            </button>
        
                        </form>
        
                        <Link
                            className="auth-link"
                            to="/register"
                        >
                            Create account
                        </Link>
        
                        <Link
                            className="forgot-password-link"
                            to="/forgot-password"
                        >
                            Forgot password?
                        </Link>
        
                    </div>
        
                </div>

                {
                    showError && (
                        <div className="error-message">
                            {error}
                        </div>
                    )
                }
            </div>

        </div>

    );

}

export default LoginPage;