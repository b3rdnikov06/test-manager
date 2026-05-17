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

function StudentsPage() {

    const navigate =
        useNavigate();

    const [students, setStudents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {

        async function fetchStudents() {

            try {

                const data =
                    await getStudents();

                setStudents(data);

            } catch (err) {

                setError(
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
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>

            <h1>
                Students
            </h1>

            {
                students.map(student => (

                    <div key={student.id}>

                        <p>
                            ID:
                            {' '}
                            {student.id}
                        </p>

                        <p>
                            Email:
                            {' '}
                            {student.email}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/students/${student.id}`
                                )
                            }
                        >
                            View Results
                        </button>

                        <hr />

                    </div>
                ))
            }

        </div>
    );
}

export default StudentsPage;