import {
    useEffect,
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    getStudents
} from '../services/usersService';

import ErrorToast
    from '../components/ErrorToast';

function StudentsPage() {

    const navigate =
        useNavigate();

    const [students, setStudents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    function showError(message) {

        setError(message);

        setTimeout(() => {

            setError('');

        }, 5000);
    }

    useEffect(() => {

        async function fetchStudents() {

            try {

                const data =
                    await getStudents();

                setStudents(data);

            } catch (err) {

                showError(
                    err.response?.data?.error ||
                    'Failed to load students'
                );

            } finally {

                setLoading(false);
            }
        }

        fetchStudents();

    }, []);

    if (loading) {

        return (
            <p>
                Loading...
            </p>
        );
    }

    return (

        <div className="profile-page">

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <div className="page-header">

                <h1 className="page-title">
                    Students
                </h1>

                <p className="card-description">

                    Manage students
                    and view their results

                </p>

            </div>

            {
                students.length === 0
                    ? (

                        <div className="empty-state">

                            <h2>
                                No students yet
                            </h2>

                            <p>
                                Students will appear here
                            </p>

                        </div>

                    ) : (

                        <div className="students-grid">

                            {
                                students.map((student, index) => (

                                    <div
                                        key={student.id}
                                        className="student-card"
                                    >

                                        <div className="student-card-top">

                                            <div className="profile-avatar">

                                                {
                                                    student.avatar
                                                        ? (

                                                            <img
                                                                src={student.avatar}
                                                                alt="Avatar"
                                                            />

                                                        ) : (

                                                            <>
                                                                {
                                                                    student.first_name?.[0]
                                                                }
                                                                {
                                                                    student.last_name?.[0]
                                                                }
                                                            </>
                                                        )
                                                }

                                            </div>

                                            <div className="student-info">

                                                <h2>

                                                    {index + 1}.
                                                    {' '}

                                                    {
                                                        student.first_name
                                                    }
                                                    {' '}
                                                    {
                                                        student.last_name
                                                    }

                                                </h2>

                                                <p>
                                                    {student.email}
                                                </p>

                                            </div>

                                        </div>

                                        <button
                                            className="btn-primary"
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/students/${student.id}`
                                                )
                                            }
                                        >
                                            View Results
                                        </button>

                                    </div>
                                ))
                            }

                        </div>
                    )
            }

        </div>
    );
}

export default StudentsPage;