import {
    useEffect,
    useState
} from 'react';

import {
    getTeacherTests,
    deleteTest
} from '../services/testsService';

import {
    Link,
    useNavigate
} from 'react-router-dom';

import ErrorToast
    from '../components/ErrorToast';

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

        return (
            <p>
                Loading tests...
            </p>
        );
    }

    return (

        <div className="results-page">

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <h1 className="page-title">
                Teacher Tests
            </h1>

            {
                tests.length === 0
                    ? (

                        <div className="empty-state">
                            No tests created
                        </div>

                    )
                    : (

                        tests.map((test, index) => (

                            <div
                                key={test.id}
                                className="test-card"
                            >

                                <div className="question-header">

                                    <div>

                                    <h2 className="attempt-title">

                                    {index + 1}.
                                    {' '}

                                    {test.title}

                                    </h2>

                                        <p className="card-description">
                                            {test.description}
                                        </p>

                                    </div>

                                    <div
                                        className={`
                                            question-type
                                            ${
                                                Boolean(test.is_published)
                                                    ? ''
                                                    : 'unpublished-badge'
                                            }
                                        `}
                                    >

                                        {
                                            Boolean(test.is_published)
                                                ? 'Published'
                                                : 'Draft'
                                        }

                                    </div>

                                </div>

                                <div className="test-actions">

                                    <div className="attempt-badge">

                                        <span className="attempt-badge-label">
                                            Attempts
                                        </span>

                                        <span className="attempt-badge-value">

                                            {test.attempts_count}

                                        </span>

                                    </div>

                                    <Link
                                        className="btn-primary"
                                        to={`/tests/${test.id}/edit`}
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        className="btn-primary"
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/tests/${test.id}/view`
                                            )
                                        }
                                    >
                                        View Test
                                    </button>

                                    {
                                        Boolean(test.is_published) &&
                                        Number(test.attempts_count) > 0 && (

                                            <button
                                                className="btn-primary"
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/results/tests/${test.id}`
                                                    )
                                                }
                                            >
                                                View Results
                                            </button>
                                        )
                                    }

                                    {
                                        Number(test.attempts_count) === 0 && (

                                            <button
                                                className="btn-danger"
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteTest(test.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        )
                                    }

                                </div>

                            </div>
                        ))
                    )
            }

        </div>
    );
}

export default TeacherTestsPage;