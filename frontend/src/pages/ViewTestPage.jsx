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

import ErrorToast
    from '../components/ErrorToast';

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

        return (
            <p>
                Loading...
            </p>
        );
    }

    return (

        <div className="results-page">

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <div className="student-profile-card">

                <div className="student-info">

                    <h1 className="page-title">
                        {test.title}
                    </h1>

                    <p>
                        {test.description}
                    </p>

                </div>

            </div>

            <div className="stats-grid">

                <div className="stat-card">

                    <span className="stat-label">
                        Questions
                    </span>

                    <span className="stat-value">
                        {test.questions.length}
                    </span>

                </div>

                <div className="stat-card">

                    <span className="stat-label">
                        Time Limit
                    </span>

                    <span className="stat-value">
                        {test.time_limit} min
                    </span>

                </div>

            </div>

            {
                test.questions.map((question, index) => (

                    <div
                        key={question.id}
                        className="question-card"
                    >

                        <div className="question-header">

                            <h3 className="question-title">

                                {index + 1}.
                                {' '}
                                {question.text}

                            </h3>

                            <div className="question-type">

                                {question.type}

                            </div>

                        </div>

                        <div className="answers-list">

                            {
                                question.answers.map(answer => (

                                    <div
                                        key={answer.id}
                                        className={`
                                            answer-option
                                            ${
                                                Boolean(answer.is_correct)
                                                    ? 'correct-selected-answer'
                                                    : ''
                                            }
                                        `}
                                    >

                                        <div className="answer-row">

                                            <p className="answer-text">

                                                {answer.text}

                                            </p>

                                            {
                                                Boolean(answer.is_correct) && (

                                                    <div className="answer-tags">

                                                        <span
                                                            className="
                                                                answer-tag
                                                                correct-tag
                                                            "
                                                        >
                                                            Correct
                                                        </span>

                                                    </div>
                                                )
                                            }

                                        </div>

                                    </div>
                                ))
                            }

                        </div>

                    </div>
                ))
            }

        </div>
    );
}

export default ViewTestPage;