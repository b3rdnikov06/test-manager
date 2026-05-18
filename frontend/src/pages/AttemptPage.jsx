import {
    useEffect,
    useState
} from 'react';

import {
    useParams,
    useNavigate
} from 'react-router-dom';

import {
    getAttempt,
    saveAnswer,
    submitAttempt
} from '../services/attemptsService';

import ErrorToast
    from '../components/ErrorToast';

function AttemptPage() {

    const { id } =
        useParams();

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');
    
    const [answers, setAnswers] =
        useState({});
    
    const navigate =
        useNavigate();

    useEffect(() => {

        async function fetchAttempt() {

            try {

                const result =
                    await getAttempt(id);

                setData(result);

            } catch (err) {

                setError(
                    err.response?.data?.error ||
                    'Failed to load attempt'
                );

            } finally {

                setLoading(false);
            }
        }

        fetchAttempt();

    }, [id]);

    function handleAnswer(
        question,
        value
    ) {
    
        if (question.type === 'multiple') {
    
            const current =
                answers[question.id] || [];
    
            const updated =
                current.includes(value)
                    ? current.filter(
                        id => id !== value
                    )
                    : [...current, value];
    
            setAnswers(prev => ({
                ...prev,
                [question.id]: updated
            }));
    
            return;
        }
    
        setAnswers(prev => ({
            ...prev,
            [question.id]: value
        }));
    }

    async function handleSubmit() {

        try {
    
            for (const question of data.questions) {
    
                const value =
                    answers[question.id];
    
                if (!value) {
                    continue;
                }
    
                if (question.type === 'text') {
    
                    await saveAnswer(id, {
                        question_id: question.id,
                        text_answer: value
                    });
    
                    continue;
                }
    
                if (question.type === 'multiple') {
    
                    for (const answerId of value) {
    
                        await saveAnswer(id, {
                            question_id: question.id,
                            answer_id: answerId
                        });
                    }
    
                    continue;
                }
    
                await saveAnswer(id, {
                    question_id: question.id,
                    answer_id: value
                });
            }
    
            await submitAttempt(id);
    
            navigate(
                `/results/${id}`
            );
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to submit test'
            );
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!data) {
        return (

            <div>
    
                <ErrorToast
                    message={error}
                    onClose={() =>
                        setError('')
                    }
                />
    
                <h1>
                    Attempt unavailable
                </h1>
    
                <p>
                    {error}
                </p>
    
            </div>
        );
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
                {data.test.title}
            </h1>

            <p>
                {data.test.description}
            </p>

            <p>
                Time limit:
                {' '}
                {data.test.time_limit}
                {' '}
                min
            </p>

            <hr />

            {
                data.questions.map(question => (

                    <div key={question.id}>

                        <h3>
                            {question.order_index + 1}.
                            {' '}
                            {question.text}
                        </h3>

                        <p>
                            Type:
                            {' '}
                            {question.type}
                        </p>

                        {
                            question.type === 'text'
                                ? (

                                    <textarea
                                        value={answers[question.id] || ''}

                                        onChange={e =>
                                            handleAnswer(
                                                question,
                                                e.target.value
                                            )
                                        }
                                    />

                                ) : (

                                    question.answers.map(answer => (

                                        <div
                                            key={answer.id}
                                        >

                                            <label>

                                            <input
                                                type={
                                                    question.type === 'single'
                                                        ? 'radio'
                                                        : 'checkbox'
                                                }

                                                name={`question-${question.id}`}

                                                checked={
                                                    question.type === 'multiple'
                                                        ? (
                                                            answers[question.id]?.includes(answer.id)
                                                            || false
                                                        )
                                                        : (
                                                            answers[question.id] === answer.id
                                                        )
                                                }

                                                onChange={() =>
                                                    handleAnswer(
                                                        question,
                                                        answer.id
                                                    )
                                                }
                                            />

                                                {' '}

                                                {answer.text}

                                            </label>

                                        </div>
                                    ))
                                )
                        }

                        <hr />

                    </div>
                ))
            }
            <button
                type="button"
                onClick={handleSubmit}
            >
                Submit Test
            </button>

        </div>
    );
}

export default AttemptPage;