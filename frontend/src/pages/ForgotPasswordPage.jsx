import {
    useState
} from 'react';

import {
    resetPassword
} from '../services/usersService';

import {
    Link
} from 'react-router-dom';

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

        <div>

            <h1>
                Forgot Password
            </h1>

            <div>

                <input
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

            <br />

            <button
                type="button"
                onClick={handleSendCode}
            >
                Send Code
            </button>

            <br />
            <br />

            {
                showResetForm && (

                    <form
                        onSubmit={
                            handleResetPassword
                        }
                    >

                        <input
                            type="text"
                            placeholder="Code"
                            value={code}
                            onChange={e =>
                                setCode(
                                    e.target.value
                                )
                            }
                        />

                        <br />
                        <br />

                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={e =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                        />

                        <br />
                        <br />

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={e =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />

                        <br />
                        <br />

                        <button type="submit">
                            Reset Password
                        </button>

                    </form>
                )
            }

            {
                message && (
                    <p>
                        {message}
                    </p>
                )
            }

            <br />

            <Link to="/login">
                Login
            </Link>

            <br />
            <br />

            <Link to="/register">
                Register
            </Link>

        </div>
    );
}

export default ForgotPasswordPage;