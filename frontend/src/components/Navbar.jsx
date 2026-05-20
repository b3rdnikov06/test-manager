import { Link } from 'react-router-dom';

import { useAuth }
    from '../context/AuthContext';

import '../styles/components/navbar.css';

function Navbar() {

    const {
        user,
        logout
    } = useAuth();

    return (

        <header className="navbar">

            <div className="navbar-left">

            <Link
                className="navbar-logo"
                to="/tests"
            >
                TestSystem
            </Link>

            </div>

            <div className="navbar-right">

                {
                    user
                        ? (
                            <>

                                <nav className="navbar-links">

                                    <Link to="/tests">
                                        Tests
                                    </Link>

                                    {
                                        user?.role === 'student' && (
                                            <Link
                                                to={`/students/${user.id}`}
                                            >
                                                My Results
                                            </Link>
                                        )
                                    }

                                    <Link to="/profile">
                                        My Profile
                                    </Link>

                                    {
                                        user?.role === 'teacher' && (
                                            <>
                                                <Link
                                                    to="/tests/teacher"
                                                >
                                                    Teacher Tests
                                                </Link>

                                                <Link
                                                    to="/tests/create"
                                                >
                                                    Create Test
                                                </Link>

                                                <Link to="/students">
                                                    Students
                                                </Link>
                                            </>
                                        )
                                    }

                                </nav>

                                <div className="navbar-user">

                                    <div className="navbar-user-info">

                                        <div className="navbar-avatar">

                                            {
                                                user.avatar
                                                    ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt="Avatar"
                                                        />
                                                    )
                                                    : (
                                                        <span>
                                                            {user.first_name?.[0]}
                                                        </span>
                                                    )
                                            }

                                        </div>

                                        <div className="navbar-user-text">

                                            <span className="navbar-username">

                                                {user.first_name}
                                                {' '}
                                                {user.last_name}

                                            </span>

                                            <span className="navbar-role">

                                                {user.role}

                                            </span>

                                        </div>

                                    </div>

                                    <button
                                        className="logout-btn"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>

                                </div>

                            </>
                        )
                        : (
                            <Link
                                className="login-link"
                                to="/login"
                            >
                                Login
                            </Link>
                        )
                }

            </div>

        </header>

    );
}

export default Navbar;