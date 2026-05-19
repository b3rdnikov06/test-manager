import {
    useEffect,
    useState
} from 'react';

import {
    getTeacherTests
} from '../services/testsService';

import { Link }
    from 'react-router-dom';

import {
    deleteTest
} from '../services/testsService';

import {
    useNavigate
} from 'react-router-dom';

import ErrorToast from '../components/ErrorToast';

function TeacherTestsPage() {

    const [tests, setTests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const navigate =
        useNavigate();
    
    function showError(message) {

        setError(message);
    
        setTimeout(() => {
    
            setError('');
    
        }, 10000);
    }

    useEffect(() => {

        async function fetchTests() {

            try {

                const data =
                    await getTeacherTests();

                setTests(data);

            } catch (err) {

                showError(
                    err.response?.data?.error ||
                    'Failed to load tests'
                );

            } finally {

                setLoading(false);
            }
        }

        fetchTests();

    }, []);

    async function handleDeleteTest(
        testId
    ) {
    
        try {
    
            await deleteTest(testId);
    
            setTests(prev =>
                prev.filter(
                    test => test.id !== testId
                )
            );
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to delete test'
            );

        }
    }

    if (loading) {
        return <p>Loading tests...</p>;
    }

    return (
        <div>

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <h1>Teacher Tests</h1>


            {
                tests.length === 0
                    ? (
                        <p>No tests created</p>
                    )
                    : (
                        tests.map(test => (

                            <div key={test.id}>

                                <h3>
                                    {test.title}
                                </h3>

                                <p>
                                    {test.description}
                                </p>

                                <p>
                                    Published:
                                    {' '}
                                    {test.is_published
                                        ? 'Yes'
                                        : 'No'}
                                </p>

                                <p>
                                    Attempts:
                                    {' '}
                                    {test.attempts_count}
                                </p>

                                <Link to={`/tests/${test.id}/edit`}>
                                    Edit
                                </Link>

                                <p>
                                {
                                    Number(test.attempts_count) === 0 && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteTest(test.id)
                                            }
                                        >
                                            Delete Test
                                        </button>
                                    )
                                }
                                </p>

                                {
                                    Boolean(test.is_published) &&
                                    Number(test.attempts_count) > 0 ? (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/results/tests/${test.id}`
                                                )
                                            }
                                        >
                                            View Results
                                        </button>

                                    ) : null
                                    
                                }

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/tests/${test.id}/view`
                                        )
                                    }
                                >
                                    View Test
                                </button>

                                <hr />

                            </div>
                        ))
                    )
            }

        </div>
    );
}

export default TeacherTestsPage;