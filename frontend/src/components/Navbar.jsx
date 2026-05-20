import {
    Link,
} from 'react-router-dom';

import { useAuth }
    from '../context/AuthContext';

function Navbar() {

    const {
        user,
        logout
    } = useAuth();

    return (
        <nav>

        {
            user
                ? (
                    <>
                        <Link to="/tests">
                            Tests
                        </Link>

                        {' | '}

                        {
                            user?.role === 'student' && (
                                <>
                                    <Link to={`/students/${user.id}`}>
                                        My Results
                                    </Link>

                                    {' | '}
                                </>
                            )
                        }

                        <Link to="/profile">
                            My Profile
                        </Link>

                        {' | '}

                        {
                            user?.role === 'teacher' && (
                                <>
                                    <Link
                                        to="/tests/teacher"
                                    >
                                        Teacher Tests
                                    </Link>

                                    {' | '}

                                    <Link
                                        to="/tests/create"
                                    >
                                        Create Test
                                    </Link>

                                    {' | '}

                                    <Link to="/students">
                                        Students
                                    </Link>

                                    {' | '}
                                </>
                            )
                        }

                        <span>

                            {
                                user.avatar
                                    ? (
                                        <img
                                            src={user.avatar}
                                            alt="Avatar"
                                            width="30"
                                            height="30"
                                        />
                                    )
                                    : '👤'
                            }

                            {' '}

                            {user.first_name}
                            {' '}
                            {user.last_name}

                        </span>

                        <button
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </>
                )
                : (
                    <Link to="/login">
                        Login
                    </Link>
                )
        }

        </nav>
    );
}

export default Navbar;