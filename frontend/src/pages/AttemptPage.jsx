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

    function showError(message) {

        setError(message);

        setTimeout(() => {

            setError('');

        }, 10000);
    }

    useEffect(() => {

        async function fetchAttempt() {

            try {

                const result =
                    await getAttempt(id);

                setData(result);

                const savedAnswers =
                    sessionStorage.getItem(
                        `attempt_${id}_answers`
                    );

                if (savedAnswers) {

                    setAnswers(
                        JSON.parse(savedAnswers)
                    );
                }

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

    }, [data, isSubmitting, navigate]);

    useEffect(() => {

        if (
            Object.keys(answers).length === 0
        ) {
            return;
        }

        sessionStorage.setItem(
            `attempt_${id}_answers`,
            JSON.stringify(answers)
        );

    }, [answers, id]);

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

            sessionStorage.removeItem(
                `attempt_${id}_answers`
            );

            navigate(
                `/results/${id}`
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

    const answeredQuestions =
        data?.questions.filter(question => {

            const answer =
                answers[question.id];

            if (question.type === 'multiple') {
                return answer?.length > 0;
            }

            return Boolean(answer);

        }).length || 0;

    if (loading) {

        return (
            <p>
                Loading...
            </p>
        );
    }

    if (!data) {

        return (

            <div className="results-page">

                <ErrorToast
                    message={error}
                    onClose={() =>
                        setError('')
                    }
                />

                <div className="empty-state">

                    <h1>
                        Attempt unavailable
                    </h1>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="attempt-page">

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <div className="attempt-header-card">

                <div>

                    <h1 className="page-title">
                        {data.test.title}
                    </h1>

                    <p className="card-description">
                        {data.test.description}
                    </p>

                </div>

                <div className="attempt-timer">

                    <span className="attempt-timer-label">
                        Time Left
                    </span>

                    <span className="attempt-timer-value">

                        {
                            timeLeft !== null &&
                            formatTime(timeLeft)
                        }

                    </span>

                </div>

            </div>

            <div className="attempt-progress-card">

                <div className="attempt-progress-top">

                    <span>
                        Progress
                    </span>

                    <span>

                        {answeredQuestions}
                        {' / '}
                        {data.questions.length}

                    </span>

                </div>

                <div className="attempt-progress-bar">

                    <div
                        className="attempt-progress-fill"
                        style={{
                            width: `${
                                (
                                    answeredQuestions
                                    / data.questions.length
                                ) * 100
                            }%`
                        }}
                    />

                </div>

            </div>

            {
                data.questions.map((question, index) => (

                    <div
                        key={question.id}
                        className="attempt-question-card"
                    >

                        <div className="question-header">

                            <h3 className="editor-question-title">

                                {index + 1}.
                                {' '}

                                {question.text}

                            </h3>

                            <div className="question-type">

                                {question.type}

                            </div>

                        </div>

                        {
                            question.type === 'text'
                                ? (

                                    <textarea
                                        className="input"
                                        value={
                                            answers[question.id] || ''
                                        }

                                        onChange={e =>
                                            handleAnswer(
                                                question,
                                                e.target.value
                                            )
                                        }
                                    />

                                ) : (

                                    <div className="answers-list">

                                        {
                                            question.answers.map(answer => (

                                                <label
                                                    key={answer.id}
                                                    className="attempt-answer-option"
                                                >

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

                                                    <span>
                                                        {answer.text}
                                                    </span>

                                                </label>
                                            ))
                                        }

                                    </div>
                                )
                        }

                    </div>
                ))
            }

            <div className="attempt-submit-bar">

                <button
                    className="btn-primary"
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                        isSubmitting ||
                        answeredQuestions === 0
                    }
                >
                    {
                        isSubmitting
                            ? 'Submitting...'
                            : 'Submit Test'
                    }
                </button>

            </div>

        </div>
    );
}

export default AttemptPage;