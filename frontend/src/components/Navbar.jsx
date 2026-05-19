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