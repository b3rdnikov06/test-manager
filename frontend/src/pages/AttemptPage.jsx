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
    
    const [timeLeft, setTimeLeft] =
        useState(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

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

    useEffect(() => {

        if (!data) {
            return;
        }
    
        const started =
            new Date(
                data.test.started_at
            );
    
        const limitMs =
            data.test.time_limit
            * 60
            * 1000;
    
        let interval;
    
        function updateTimer() {
    
            const now =
                new Date();
    
            const elapsed =
                now - started;
    
            const remaining =
                limitMs - elapsed;
    
            if (remaining <= 0) {
    
                clearInterval(interval);
    
                setTimeLeft(0);
    
                navigate('/tests');
    
                return;
            }
    
            setTimeLeft(
                Math.floor(
                    remaining / 1000
                )
            );
        }
    
        updateTimer();
    
        interval =
            setInterval(
                updateTimer,
                1000
            );
    
        return () =>
            clearInterval(interval);
    
    }, [data, isSubmitting]);

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

        const confirmed =
            window.confirm(
                'Are you sure?\n\nYou cannot change answers after submission.'
            );

        if (!confirmed) {
            return;
        }
        
        setIsSubmitting(true);

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

            showError(
                'Time limit exceeded'
            );
    
        } catch (err) {

            setIsSubmitting(false);
        
            showError(
                err.response?.data?.error ||
                'Failed to submit test'
            );
        }
    }

    function formatTime(seconds) {

        const minutes =
            Math.floor(seconds / 60);
    
        const secs =
            seconds % 60;
    
        return `${minutes}:${
            secs < 10
                ? '0'
                : ''
        }${secs}`;
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

                Warning:
                {' '}

                answers will not be saved
                automatically after the timer
                expires. Finish the test
                before time runs out.

            </p>

            {
                timeLeft !== null && (

                    <p>

                        Time left:
                        {' '}

                        {formatTime(timeLeft)}

                    </p>
                )
            }

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
                data.questions.map((question, index) => (

                    <div key={question.id}>

                        <h3>
                            {index + 1}.
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
                disabled={isSubmitting}
            >
                {
                    isSubmitting
                        ? 'Submitting...'
                        : 'Submit Test'
                }
            </button>

        </div>
    );
}

export default AttemptPage;