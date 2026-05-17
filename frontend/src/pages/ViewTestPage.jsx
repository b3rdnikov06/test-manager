import {
    useEffect,
    useState
} from 'react';

import {
    useParams
} from 'react-router-dom';

import {
    getFullTest
} from '../services/testsService';

import ErrorToast from '../components/ErrorToast';

function ViewTestPage() {

    const { id } =
        useParams();

    const [test, setTest] =
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

        async function fetchTest() {

            try {

                const data =
                    await getFullTest(id);

                setTest(data);

            } catch (err) {

                showError(
                    err.response?.data?.error ||
                    'Failed to load test'
                );

            } finally {

                setLoading(false);
            }
        }

        fetchTest();

    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
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
                {test.title}
            </h1>

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

            <hr />

            {
                test.questions.map(question => (

                    <div
                        key={question.id}
                    >

                        <h3>
                            {question.text}
                        </h3>

                        <p>
                            Type:
                            {' '}
                            {question.type}
                        </p>

                        {
                            question.answers.map(answer => (

                                <div
                                    key={answer.id}
                                >

                                    - {answer.text}

                                    {' '}

                                    (
                                    {
                                        answer.is_correct
                                            ? 'correct'
                                            : 'wrong'
                                    }
                                    )

                                </div>
                            ))
                        }

                        <hr />

                    </div>
                ))
            }

        </div>
    );
}

export default ViewTestPage;