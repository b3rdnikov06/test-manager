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

        <div className="result-page">

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <h1 className="page-title">
                Attempt Result
            </h1>

            <div className="result-summary">

                <div className="summary-card">

                    <span className="summary-label">
                        Attempt ID
                    </span>

                    <span className="summary-value">
                        #{data.attempt_id}
                    </span>

                </div>

                <div className="summary-card">

                    <span className="summary-label">
                        Student ID
                    </span>

                    <span className="summary-value">
                        #{data.user_id}
                    </span>

                </div>

                <div className="summary-card">

                    <span className="summary-label">
                        Score
                    </span>

                    <span className="summary-value">

                        {data.score}
                        /
                        {data.total}

                    </span>

                </div>

                <div className="summary-card">

                    <span className="summary-label">
                        Percentage
                    </span>

                    <span className="summary-value">
                        {data.percentage}%
                    </span>

                </div>

            </div>

            {
                data.questions.map((question, index) => (

                        <div
                            key={question.question_id}
                            className="question-card"
                        >

                        <h3 className="question-title">

                            {index + 1}.
                            {' '}

                            {question.question_text}

                        </h3>

                        <div className="question-type">

                            {question.type}

                        </div>

                        {
                            question.type === 'text'
                            ? (
                        
                                <div className="text-answer-wrapper">
                        
                                    <div className="text-answer-card">
                        
                                        <div className="text-answer-top">
                        
                                            <span className="text-answer-label">
                                                Student Answer
                                            </span>
                        
                                            {
                                                question.text_answer ===
                                                question.answers.find(
                                                    answer => answer.is_correct
                                                )?.text && (
                        
                                                    <span
                                                        className="
                                                            answer-tag
                                                            correct-tag
                                                        "
                                                    >
                                                        Correct
                                                    </span>
                                                )
                                            }
                        
                                        </div>
                        
                                        <p className="text-answer-value">
                        
                                            {
                                                question.text_answer ||
                                                'No answer'
                                            }
                        
                                        </p>
                        
                                    </div>
                        
                                    <div className="text-answer-card">
                        
                                        <div className="text-answer-top">
                        
                                            <span className="text-answer-label">
                                                Correct Answer
                                            </span>
                        
                                        </div>
                        
                                        <p className="text-answer-value">
                        
                                            {
                                                question.answers.find(
                                                    answer => answer.is_correct
                                                )?.text || 'No correct answer'
                                            }
                        
                                        </p>
                        
                                    </div>
                        
                                </div>
                        
                            ) : (

                                    question.answers.map(answer => (

                                        <div
                                            key={answer.answer_id}
                                            className={`
                                                answer-option
                                                ${
                                                    answer.selected && answer.is_correct
                                                        ? 'correct-selected-answer'
                                                        : ''
                                                }
                                                ${
                                                    answer.selected && !answer.is_correct
                                                        ? 'wrong-selected-answer'
                                                        : ''
                                                }
                                                ${
                                                    !answer.selected && answer.is_correct
                                                        ? 'correct-answer'
                                                        : ''
                                                }
                                            `}
                                        >

                                        <div className="answer-row">

                                            <p className="answer-text">

                                                {answer.text}

                                            </p>

                                            <div className="answer-tags">

                                                {
                                                    Boolean(answer.selected) && (

                                                        <span
                                                            className={`
                                                                answer-tag
                                                                ${
                                                                    answer.is_correct
                                                                        ? 'selected-tag'
                                                                        : 'wrong-tag'
                                                                }
                                                            `}
                                                        >
                                                            Selected
                                                        </span>
                                                    )
                                                }

                                                {
                                                    Boolean(answer.is_correct) && (

                                                        <span
                                                            className="
                                                                answer-tag
                                                                correct-tag
                                                            "
                                                        >
                                                            Correct
                                                        </span>
                                                    )
                                                }

                                            </div>

                                            </div>


                                        </div>
                                    ))
                                )
                        }

                    </div>
                ))
            }

        </div>
    );
}

export default ResultPage;