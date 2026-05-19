import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    register
} from '../services/authService';

import ErrorToast
    from '../components/ErrorToast';

import {
    Link
} from 'react-router-dom';

function RegisterPage() {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [role, setRole] =
        useState('student');

    const [error, setError] =
        useState('');
    
    const [firstName, setFirstName] =
        useState('');
    
    const [lastName, setLastName] =
        useState('');

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setError('');

            await register({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role
            });

            navigate('/login');

        } catch (err) {

            setError(
                err.response?.data?.error ||
                'Registration failed'
            );
        }
    }

    return (
        <div>

            <h1>
                Register
            </h1>

            <form
                onSubmit={handleSubmit}
            >

                <div>

                <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={e =>
                        setFirstName(
                            e.target.value
                        )
                    }
                />

                </div>

                <br />

                <div>

                <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={e =>
                        setLastName(
                            e.target.value
                        )
                    }
                />

                </div>

                <br />

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

                <div>

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                </div>

                <br />

                <div>

                    <select
                        value={role}
                        onChange={e =>
                            setRole(
                                e.target.value
                            )
                        }
                    >

                        <option value="student">
                            Student
                        </option>

                        <option value="teacher">
                            Teacher
                        </option>

                    </select>

                </div>

                <br />

                <button type="submit">
                    Register
                </button>

            </form>

            <br />

            <Link to="/login">
                Login
            </Link>

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

        </div>
    );
}

export default RegisterPage;