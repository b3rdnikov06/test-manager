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
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {

        async function fetchResults() {

            try {

                const data =
                    await getStudentResults(id);


                setResults(data.attempts || []);

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

            {

                results.length === 0
                ? (

                    <p>
                        No completed tests
                    </p>

                ) : (

                results.map(result => (

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