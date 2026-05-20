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
            
            setTimeout(() => {
            
                setError('');
            
            }, 5000);
        }
    }

    return (

        <div className="auth-page">
    
            <div className="auth-container">
    
                <div className="auth-layout">
    
                    <div className="auth-banner">
    
                        <h1 className="banner-title">
                            Join TestSystem
                        </h1>
    
                        <p className="banner-subtitle">
                            Create tests, manage students
                            and track results easily.
                        </p>
    
                        <div className="banner-features">
    
                            <div className="feature-item">
                                Smart testing platform
                            </div>
    
                            <div className="feature-item">
                                Student analytics
                            </div>
    
                            <div className="feature-item">
                                Clean modern interface
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="auth-card">

                    <h1 className="auth-title">
                        Create Account
                    </h1>

                    <p className="auth-subtitle">
                        Register your account
                    </p>

                    <form
                        onSubmit={handleSubmit}
                    >


                        <input
                            className="input"
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={e =>
                                setFirstName(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            className="input"
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={e =>
                                setLastName(
                                    e.target.value
                                )
                            }
                        />

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

                            <input
                                className="input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                            />

                        <div>

                            <select
                                className="input"
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

                        <button
                            className="btn-primary auth-btn"
                            type="submit"
                        >
                            Register
                        </button>

                    </form>

                    <Link
                        className="auth-link"
                        to="/login"
                    >
                        Already have an account?
                    </Link>

                    <ErrorToast
                        message={error}
                        onClose={() =>
                            setError('')
                        }
                    />

                    </div>

                </div>

            </div>

        </div>

    );
}

export default RegisterPage;