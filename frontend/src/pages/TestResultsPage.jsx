import {
    useEffect,
    useState
} from 'react';

import {
    useParams,
    useNavigate
} from 'react-router-dom';

import {
    getTestResults
} from '../services/resultsService';

import ErrorToast
    from '../components/ErrorToast';

function TestResultsPage() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const [data, setData] =
        useState(null);

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

    useEffect(() => {

        async function fetchResults() {

            try {

                const result =
                    await getTestResults(id);

                setData(result);

            } catch (err) {

                showError(
                    err.response?.data?.error ||
                    'Failed to load results'
                );

            } finally {

                setLoading(false);
            }
        }

        fetchResults();

    }, [id]);

    if (loading) {

        return (
            <p>
                Loading results...
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
                Test Results
            </h1>

            <div className="student-profile-card">

                <div className="student-info">

                    <h2>
                        {data.title}
                    </h2>

                    <p>
                        Published test analytics
                    </p>

                </div>

            </div>

            {
                data.attempts.length === 0
                    ? (

                        <div className="empty-state">
                            No attempts yet
                        </div>

                    )
                    : (

                        data.attempts.map(attempt => (

                            <div
                                key={
                                    attempt.attempt_id
                                }
                                className="attempt-card"
                            >

                                <div className="student-result-header">

                                    <div className="student-avatar">

                                        {
                                            attempt.avatar
                                                ? (

                                                    <img
                                                        src={attempt.avatar}
                                                        alt="Avatar"
                                                    />

                                                ) : (

                                                    <span>
                                                        {
                                                            attempt.first_name?.[0]
                                                        }
                                                    </span>
                                                )
                                        }

                                    </div>

                                    <div className="student-info">

                                        <h3>

                                            {attempt.first_name}
                                            {' '}
                                            {attempt.last_name}

                                        </h3>

                                        <p>
                                            Student attempt
                                        </p>

                                    </div>

                                </div>

                                <div className="attempt-stats">

                                    <div className="attempt-stat">

                                        <span className="attempt-stat-label">
                                            Score
                                        </span>

                                        <span className="attempt-stat-value">

                                            {attempt.score}
                                            /
                                            {attempt.total}

                                        </span>

                                    </div>

                                    <div className="attempt-stat">

                                        <span className="attempt-stat-label">
                                            Percentage
                                        </span>

                                        <span className="attempt-stat-value">

                                            {attempt.percentage}%

                                        </span>

                                    </div>

                                </div>

                                <button
                                    className="btn-primary"
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/results/${attempt.attempt_id}`
                                        )
                                    }
                                >
                                    Open Result
                                </button>

                            </div>
                        ))
                    )
            }

        </div>
    );
}

export default TestResultsPage;