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
        <div>

            <h1>
                Student Results
            </h1>

            <p>

            {
                results.avatar
                    ? (

                        <img
                            src={results.avatar}
                            alt="Avatar"
                            width="80"
                            height="80"
                        />

                    ) : (

                        <div>
                            👤
                        </div>
                    )
            }

            </p>

            <p>

                Name:
                {' '}

                {results.first_name}
                {' '}
                {results.last_name}

            </p>

            <p>
                Email:
                {' '}
                {results.email}
            </p>

            <hr />

            <h2>
                Statistics
            </h2>

            <p>

                Completed tests:
                {' '}

                {results.completed_tests}

            </p>

            <p>

                Average score:
                {' '}

                {results.average_score}
                %

            </p>

            <p>

                Best score:
                {' '}

                {results.best_score}
                %

            </p>

            <p>

                Worst score:
                {' '}

                {results.worst_score}
                %

            </p>

            <hr />

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
                    >

                        <p>
                            Attempt ID:
                            {' '}
                            {result.attempt_id}
                        </p>

                        <p>
                            Title:
                            {' '}
                            {result.title}
                        </p>

                        <p>
                            Score:
                            {' '}
                            {result.score}
                            /
                            {result.total}
                        </p>

                        <p>
                            Percentage:
                            {' '}
                            {result.percentage}
                            %
                        </p>

                        <p>

                            Duration:
                            {' '}

                            {result.duration_minutes}
                            {' '}
                            min

                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/results/${result.attempt_id}`
                                )
                            }
                        >
                            Open Result
                        </button>

                        <hr />

                    </div>
                ))
            )}

        </div>
    );
}

export default StudentResultsPage;