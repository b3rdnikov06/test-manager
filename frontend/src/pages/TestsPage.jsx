import {
    useEffect,
    useState
} from 'react';

import {
    getTests
} from '../services/testsService';

import {
    useNavigate
} from 'react-router-dom';

import {
    useAuth
} from '../context/AuthContext';

import ErrorToast from '../components/ErrorToast';

import {
    startAttempt
} from '../services/attemptsService';

function TestsPage() {

    const navigate =
        useNavigate();
    
    const { user } =
        useAuth();

    const [tests, setTests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');
    
    function showError(message) {

        setError(message);
    
        setTimeout(() => {
    
            setError('');
    
        }, 10000);
    }

    async function handleStartTest(
        testId
    ) {
    
        try {
    
            const data =
                await startAttempt(
                    testId
                );
    
            navigate(
                `/attempt/${data.attempt_id}`
            );
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to start test'
            );
        }
    }

    useEffect(() => {

        async function fetchTests() {

            try {

                const data =
                    await getTests();

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

            <h1>Available Tests</h1>

            {
                tests.length === 0
                    ? (
                        <p>No tests available</p>
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
                                    Time limit:
                                    {' '}
                                    {test.time_limit}
                                    {' '}
                                    min
                                </p>

                                {
                                    test.is_published &&
                                    user?.role === 'teacher' && (

                                        <div>

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

                                        </div>
                                    )
                                }

                                {
                                    test.is_published &&
                                    user?.role === 'student' &&
                                    !test.attempt_id && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStartTest(
                                                    test.id
                                                )
                                            }
                                        >
                                            Start Test
                                        </button>
                                    )
                                }

                                {
                                    test.is_published &&
                                    user?.role === 'student' &&
                                    test.attempt_id &&
                                    !Boolean(test.is_completed) && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/attempt/${test.attempt_id}`
                                                )
                                            }
                                        >
                                            Continue Test
                                        </button>
                                    )
                                }

                                {
                                    test.is_published &&
                                    user?.role === 'student' &&
                                    Boolean(test.is_completed) && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/results/${test.attempt_id}`
                                                )
                                            }
                                        >
                                            View Result
                                        </button>
                                    )
                                }
                                
                                <hr />

                            </div>
                        ))
                    )
            }

        </div>
    );
}

export default TestsPage;