import {
    useEffect,
    useState
} from 'react';

import {
    useParams
} from 'react-router-dom';

import {
    getAttemptResult
} from '../services/resultsService';

import ErrorToast from '../components/ErrorToast';

function ResultPage() {

    const { id } =
        useParams();

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

        async function fetchResult() {

            try {

                const result =
                    await getAttemptResult(id);

                setData(result);

            } catch (err) {

                showError(
                    err.response?.data?.error ||
                    'Failed to load result'
                );

            } finally {

                setLoading(false);
            }
        }

        fetchResult();

    }, [id]);

    if (loading) {
        return <p>Loading result...</p>;
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
                Attempt Result
            </h1>

            <p>
                Attempt ID:
                {' '}
                {data.attempt_id}
            </p>

            <p>
                Student ID:
                {' '}
                {data.user_id}
            </p>

            <p>
                Score:
                {' '}
                {data.score}
                /
                {data.total}
            </p>

            <p>
                Percentage:
                {' '}
                {data.percentage}
                %
            </p>

            <hr />

            {
                data.questions.map(question => (

                    <div
                        key={question.question_id}
                    >

                        <h3>
                            {question.question_text}
                        </h3>

                        <p>

                            Type:
                            {' '}

                            {question.type}

                        </p>

                        {
                            question.type === 'text'
                                ? (

                                    <div>

                                        <p>

                                            Student answer:
                                            {' '}

                                            {
                                                question.text_answer
                                            }

                                        </p>

                                        {
                                            question.answers.map(answer => (

                                                answer.is_correct && (

                                                    <p
                                                        key={
                                                            answer.answer_id
                                                        }
                                                    >

                                                        Correct answer:
                                                        {' '}

                                                        {answer.text}

                                                    </p>
                                                )
                                            ))
                                        }

                                    </div>

                                ) : (

                                    question.answers.map(answer => (

                                        <div
                                            key={answer.answer_id}
                                        >

                                            <p>

                                                {answer.text}

                                                {' '}

                                                {
                                                    answer.selected
                                                        ? '(selected by student)'
                                                        : ''
                                                }

                                                {' '}

                                                {
                                                    answer.is_correct
                                                        ? '(correct answer)'
                                                        : ''
                                                }

                                            </p>

                                        </div>
                                    ))
                                )
                        }

                        <hr />

                    </div>
                ))
            }

        </div>
    );
}

export default ResultPage;