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

import ErrorToast from '../components/ErrorToast';

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
        return <p>Loading results...</p>;
    }

    return (
        <div>

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <h1>
                Test Results
            </h1>

            <h2>
                {data.title}
            </h2>

            {
                data.attempts.length === 0
                    ? (
                        <p>
                            No attempts yet
                        </p>
                    )
                    : (
                        data.attempts.map(attempt => (

                            <div
                                key={
                                    attempt.attempt_id
                                }
                            >

                                <p>
                                    Attempt ID:
                                    {' '}
                                    {
                                        attempt.attempt_id
                                    }
                                </p>

                                <p>
                                    User ID:
                                    {' '}
                                    {
                                        attempt.user_id
                                    }
                                </p>

                                <p>
                                    Score:
                                    {' '}
                                    {
                                        attempt.score
                                    }
                                    /
                                    {
                                        attempt.total
                                    }
                                </p>

                                <p>
                                    Percentage:
                                    {' '}
                                    {
                                        attempt.percentage
                                    }
                                    %
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/results/${attempt.attempt_id}`
                                        )
                                    }
                                >
                                    Open Result
                                </button>

                                <hr />

                            </div>
                        ))
                    )
            }

        </div>
    );
}

export default TestResultsPage;