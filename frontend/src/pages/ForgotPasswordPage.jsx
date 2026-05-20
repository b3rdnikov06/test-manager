import {
    useState
} from 'react';

import {
    resetPassword
} from '../services/usersService';

import {
    Link
} from 'react-router-dom';

import ErrorToast
    from '../components/ErrorToast';

function ForgotPasswordPage() {

    const [email, setEmail] =
        useState('');

    const [code, setCode] =
        useState('');

    const [generatedCode, setGeneratedCode] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [
        confirmPassword,
        setConfirmPassword
    ] = useState('');

    const [message, setMessage] =
        useState('');

    const [showResetForm, setShowResetForm] =
        useState(false);

    function handleSendCode() {

        const mockCode =
            Math.floor(
                1000 + Math.random() * 9000
            ).toString();

        setMessage(
            'Sending code...'
        );

        setTimeout(() => {

            setGeneratedCode(mockCode);

            setMessage(
                `Demo code: ${mockCode}`
            );

            setShowResetForm(true);

        }, 2000);
    }

    async function handleResetPassword(e) {

        e.preventDefault();

        if (code !== generatedCode) {

            setMessage(
                'Invalid code'
            );

            return;
        }

        if (newPassword.length < 8) {

            setMessage(
                'Password must contain at least 8 characters'
            );
        
            return;
        }

        if (newPassword !== confirmPassword) {

            setMessage(
                'Passwords do not match'
            );

            return;
        }

        try {

            const data =
                await resetPassword({
                    email,
                    new_password: newPassword
                });
        
            setMessage(
                data.message
            );
        
        } catch (err) {
        
            setMessage(
                err.response?.data?.error ||
                'Failed to reset password'
            );
        }
    }

    return (

        <div className="auth-page">
    
            <div className="auth-container">
    
                <div className="auth-layout">
    
                    <div className="auth-banner">
    
                        <h1 className="banner-title">
                            Password Recovery
                        </h1>
    
                        <p className="banner-subtitle">
                            Restore access to your account
                            quickly and securely.
                        </p>
    
                        <div className="banner-features">
    
                            <div className="feature-item">
                                Secure password reset
                            </div>
    
                            <div className="feature-item">
                                Fast recovery process
                            </div>
    
                            <div className="feature-item">
                                Modern user experience
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="auth-card">

                    <h1 className="auth-title">
                        Forgot Password
                    </h1>

                    <p className="auth-subtitle">
                        Enter your email address
                    </p>

                    <div>

                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e =>
                            setEmail(
                                e.target.value
                            )
                        }
                    />

                </div>

                {
                    !showResetForm && (

                        <button
                            className="btn-primary auth-btn"
                            type="button"
                            onClick={handleSendCode}
                        >
                            Send Code
                        </button>

                    )
                }

                {
                    showResetForm && (

                        <form
                            onSubmit={
                                handleResetPassword
                            }
                        >

                            <input
                                className="input"
                                type="text"
                                placeholder="Code"
                                value={code}
                                onChange={e =>
                                    setCode(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className="input"
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={e =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className="input"
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={e =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                className="btn-primary auth-btn"
                                type="submit"
                            >
                                Reset Password
                            </button>

                        </form>
                    )
                }

                <Link
                    className="auth-link"
                    to="/login"
                >
                    Back to Login
                </Link>

                <Link
                    className="forgot-password-link"
                    to="/register"
                >
                    Create account
                </Link>

                </div>

                </div>

                {
                    message && (
                        <ErrorToast
                            message={message}
                            onClose={() =>
                                setMessage('')
                            }
                        />
                    )
                }

            </div>

        </div>

    );
}

export default ForgotPasswordPage;