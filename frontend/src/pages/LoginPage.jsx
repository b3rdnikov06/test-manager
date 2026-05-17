import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            } else {
                setError('Login failed');
            }
        }
    }

    return (
        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e =>
                        setEmail(e.target.value)
                    }
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e =>
                        setPassword(e.target.value)
                    }
                />

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

            {
                error &&
                <p>{error}</p>
            }

        </div>
    );
}

export default LoginPage;