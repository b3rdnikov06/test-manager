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
                                    test.is_published && (

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

                                <hr />

                            </div>
                        ))
                    )
            }

        </div>
    );
}

export default TestsPage;