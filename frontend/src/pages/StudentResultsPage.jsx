import {
    useEffect,
    useState
} from 'react';

import {
    useParams,
    useNavigate
} from 'react-router-dom';

import {
    getStudentResults
} from '../services/resultsService';

function StudentResultsPage() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const [results, setResults] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {

        async function fetchResults() {

            try {

                const data =
                    await getStudentResults(id);


                setResults(data);

            } catch (err) {

                setError(
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
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (

        <div className="results-page">

            <h1 className="page-title">
                Student Results
            </h1>

            <div className="student-profile-card">

            <div className="student-avatar">

                {
                    results.avatar
                        ? (

                            <img
                                src={results.avatar}
                                alt="Avatar"
                            />

                        ) : (

                            <span>
                                {results.first_name?.[0]}
                            </span>
                        )
                }

            </div>

            <div className="student-info">

                <h2>

                    {results.first_name}
                    {' '}
                    {results.last_name}

                </h2>

                <p>
                    {results.email}
                </p>

            </div>

            </div>

            <h2 className="section-title">
                Statistics
            </h2>

            <div className="stats-grid">

            <div className="stat-card">

                <span className="stat-label">
                    Completed Tests
                </span>

                <span className="stat-value">
                    {results.completed_tests}
                </span>

            </div>

            <div className="stat-card">

                <span className="stat-label">
                    Average Score
                </span>

                <span className="stat-value">
                    {results.average_score}%
                </span>

            </div>

            <div className="stat-card">

                <span className="stat-label">
                    Best Score
                </span>

                <span className="stat-value">
                    {results.best_score}%
                </span>

            </div>

            <div className="stat-card">

                <span className="stat-label">
                    Worst Score
                </span>

                <span className="stat-value">
                    {results.worst_score}%
                </span>

            </div>

        </div>

            {

                results.attempts.length === 0
                ? (

                    <p>
                        No completed tests
                    </p>

                ) : (

                results.attempts.map(result => (

                    <div
                        key={result.attempt_id}
                        className="attempt-card"
                    >

                        <h3 className="attempt-title">
                            {result.title}
                        </h3>

                        <div className="attempt-stats">

                            <div className="attempt-stat">

                                <span className="attempt-stat-label">
                                    Score
                                </span>

                                <span className="attempt-stat-value">

                                    {result.score}
                                    /
                                    {result.total}

                                </span>

                            </div>

                            <div className="attempt-stat">

                                <span className="attempt-stat-label">
                                    Percentage
                                </span>

                                <span className="attempt-stat-value">

                                    {result.percentage}%

                                </span>

                            </div>

                            <div className="attempt-stat">

                                <span className="attempt-stat-label">
                                    Duration
                                </span>

                                <span className="attempt-stat-value">

                                    {result.duration_minutes} min

                                </span>

                            </div>

                        </div>

                        <button
                            className="btn-primary"
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/results/${result.attempt_id}`
                                )
                            }
                        >
                            Open Result
                        </button>

                    </div>
                ))
            )}

        </div>
    );
}

export default StudentResultsPage;