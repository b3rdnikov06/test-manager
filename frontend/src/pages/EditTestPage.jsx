import {
    useEffect,
    useState
} from 'react';

import {
    useParams
} from 'react-router-dom';

import {
    getFullTest,
    createQuestion,
    createAnswer,
    updateQuestion,
    deleteQuestion,
    deleteAnswer,
    publishTest,
    updateTest
} from '../services/testsService';

import ErrorToast from '../components/ErrorToast';

function EditTestPage() {

    const { id } =
        useParams();

    const [questions, setQuestions] =
        useState([]);

    const [title, setTitle] =
        useState('');
    
    const [
        description,
        setDescription
    ] = useState('');
    
    const [
        timeLimit,
        setTimeLimit
    ] = useState(5);
    
    const [testData, setTestData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    const [
        questionText,
        setQuestionText
    ] = useState('');
        
    const [
        questionType,
        setQuestionType
    ] = useState('single');

    const [
        answerInputs,
        setAnswerInputs
    ] = useState({});

    const [
        editingQuestionId,
        setEditingQuestionId
    ] = useState(null);
    
    const [
        editingQuestionText,
        setEditingQuestionText
    ] = useState('');

    function showError(message) {

        setError(message);
    
        setTimeout(() => {
    
            setError('');
    
        }, 10000);
    }

    function showSuccess(message) {

        setSuccess(message);
    
        setTimeout(() => {
    
            setSuccess('');
    
        }, 5000);
    }

    useEffect(() => {

        async function fetchTest() {

            try {

                const data =
                    await getFullTest(id);

                setTestData(data);

                setTitle(data.title);

                setDescription(
                    data.description || ''
                );

                setTimeLimit(
                    data.time_limit
                );

                setQuestions(
                    data.questions || []
                );

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

    async function handleCreateQuestion(e) {

        e.preventDefault();
    
        try {
    
            await createQuestion(id, {
                text: questionText,
                type: questionType
            });
    
            const updated =
                await getFullTest(id);
    
            setQuestions(
                updated.questions || []
            );

            showSuccess(
                'Test successfully saved'
            );

            setTestData(updated);
    
            setQuestionText('');
    
            setQuestionType('single');
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to create question'
            );
        }
    }

    function handleAnswerChange(
        questionId,
        field,
        value
    ) {
    
        setAnswerInputs(prev => ({
    
            ...prev,
    
            [questionId]: {
    
                ...prev[questionId],
    
                [field]: value
            }
        }));
    }

    function startEditingQuestion(
        question
    ) {
    
        setEditingQuestionId(
            question.id
        );
    
        setEditingQuestionText(
            question.text
        );
    }

    async function handleUpdateQuestion(
        questionId
    ) {
    
        try {
    
            await updateQuestion(
                questionId,
                {
                    text:
                        editingQuestionText
                }
            );
    
            const updated =
                await getFullTest(id);
    
            setTestData(updated);
    
            setQuestions(
                updated.questions || []
            );

            showSuccess(
                'Test successfully saved'
            );
    
            setEditingQuestionId(null);
    
            setEditingQuestionText('');

            showSuccess(
                'Question successfully updated'
            );
    
        } catch (err) {
    
            console.log(err);
    
            showError(
                err.response?.data?.error ||
                'Failed to update question'
            );
        }
    }

    async function handleUpdateTest() {

        try {
    
            await updateTest(id, {
                title,
                description,
                time_limit:
                    Number(timeLimit)
            });
    
            const updated =
                await getFullTest(id);
    
            setTestData(updated);
    
            setQuestions(
                updated.questions || []
            );

            showSuccess(
                'Test successfully saved'
            );
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to update test'
            );
        }
    }

    async function handleDeleteQuestion(
        questionId
    ) {
    
        try {
    
            await deleteQuestion(
                questionId
            );
    
            const updated =
                await getFullTest(id);
    
            setTestData(updated);
    
            setQuestions(
                updated.questions || []
            );

            showSuccess(
                'Test successfully saved'
            );
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to delete question'
            );
        }
    }

    async function handleDeleteAnswer(
        answerId
    ) {
    
        try {
    
            await deleteAnswer(
                answerId
            );
    
            const updated =
                await getFullTest(id);
    
            setTestData(updated);
    
            setQuestions(
                updated.questions || []
            );

            showSuccess(
                'Test successfully saved'
            );
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to delete answer'
            );
        }
    }

    async function handleCreateAnswer(
        question
    ) {
    
        try {
    
            const input =
                answerInputs[question.id];
    
            await createAnswer(
                question.id,
                {
                    text: input.text,
    
                    is_correct:
                        question.type === 'text'
                            ? true
                            : input.is_correct || false
                }
            );
    
            const updated =
                await getFullTest(id);
    
            setTestData(updated);
    
            setQuestions(
                updated.questions || []
            );

            showSuccess(
                'Test successfully saved'
            );
    
            setAnswerInputs(prev => ({
                ...prev,
    
                [question.id]: {
                    text: '',
                    is_correct: false
                }
            }));
    
        } catch (err) {
    
            console.log(err);
    
            showError(
                err.response?.data?.error ||
                'Failed to create answer'
            );
        }
    }

    async function handlePublishTest() {

        try {
    
            await publishTest(id);
    
            const updated =
                await getFullTest(id);
    
            setTestData(updated);
    
            setQuestions(
                updated.questions || []
            );

            showSuccess(
                'Test successfully saved'
            );
    
        } catch (err) {
    
            showError(
                err.response?.data?.error ||
                'Failed to publish test'
            );

        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (

        <div className="editor-page">
    
            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />
    
            <ErrorToast
                message={success}
                onClose={() =>
                    setSuccess('')
                }
                type="success"
            />
    
            <div className="editor-header">
    
                <h1 className="page-title">
                    Test Editor
                </h1>
    
            </div>
    
            <div className="editor-card">
    
                <h2 className="editor-section-title">
                    Test Settings
                </h2>
    
                <input
                    className="input"
                    type="text"
                    value={title}
                    onChange={e =>
                        setTitle(
                            e.target.value
                        )
                    }
                    placeholder="Test title"
                />
    
                <textarea
                    className="input"
                    value={description}
                    onChange={e =>
                        setDescription(
                            e.target.value
                        )
                    }
                    placeholder="Description"
                />
    
                <input
                    className="input"
                    type="number"
                    min="5"
                    max="30"
                    value={timeLimit}
                    onChange={e =>
                        setTimeLimit(
                            e.target.value
                        )
                    }
                />
    
                <button
                    className="btn-primary"
                    type="button"
                    onClick={handleUpdateTest}
                >
                    Save Test
                </button>
    
            </div>
    
            {
                !testData?.is_published && (
    
                    <div className="editor-card">
    
                        <h2 className="editor-section-title">
                            Add Question
                        </h2>
    
                        <form
                            className="editor-form"
                            onSubmit={
                                handleCreateQuestion
                            }
                        >
    
                            <input
                                className="input"
                                type="text"
                                placeholder="Question text"
                                value={questionText}
                                onChange={e =>
                                    setQuestionText(
                                        e.target.value
                                    )
                                }
                            />
    
                            <select
                                className="input"
                                value={questionType}
                                onChange={e =>
                                    setQuestionType(
                                        e.target.value
                                    )
                                }
                            >
    
                                <option value="single">
                                    Single
                                </option>
    
                                <option value="multiple">
                                    Multiple
                                </option>
    
                                <option value="text">
                                    Text
                                </option>
    
                            </select>
    
                            <button
                                className="btn-primary"
                                type="submit"
                            >
                                Add Question
                            </button>
    
                        </form>
    
                    </div>
                )
            }
    
            {
                questions.map((question, index) => (
    
                    <div
                        key={question.id}
                        className="editor-question-card"
                    >
    
                        {
                            editingQuestionId ===
                            question.id ? (
    
                                <div className="editor-form">
    
                                    <input
                                        className="input"
                                        type="text"
                                        value={
                                            editingQuestionText
                                        }
                                        onChange={e =>
                                            setEditingQuestionText(
                                                e.target.value
                                            )
                                        }
                                    />
    
                                    <button
                                        className="btn-primary"
                                        type="button"
                                        onClick={() =>
                                            handleUpdateQuestion(
                                                question.id
                                            )
                                        }
                                    >
                                        Save
                                    </button>
    
                                </div>
    
                            ) : (
    
                                <div className="question-header">
    
                                    <div>
    
                                        <h3 className="editor-question-title">
    
                                            {index + 1}.
                                            {' '}
    
                                            {question.text}
    
                                        </h3>
    
                                        <p className="card-description">
    
                                            Type:
                                            {' '}
    
                                            {question.type}
    
                                        </p>
    
                                    </div>
    
                                    <div className="test-actions">
    
                                        <button
                                            className="btn-primary"
                                            type="button"
                                            onClick={() =>
                                                startEditingQuestion(
                                                    question
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
    
                                        {
                                            !testData?.is_published && (
    
                                                <button
                                                    className="btn-danger"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteQuestion(
                                                            question.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )
                                        }
    
                                    </div>
    
                                </div>
                            )
                        }
    
                        <div className="answers-list">
    
                            {
                                question.answers.map(answer => (
    
                                    <div
                                        key={answer.id}
                                        className="editor-answer-item"
                                    >
    
                                        <div>
    
                                            {answer.text}
    
                                            {' '}
    
                                            {
                                                Boolean(
                                                    answer.is_correct
                                                ) && (
    
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
    
                                        {
                                            !testData?.is_published && (
    
                                                <button
                                                    className="btn-danger"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteAnswer(
                                                            answer.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )
                                        }
    
                                    </div>
                                ))
                            }
    
                        </div>
    
                        {
                            !testData?.is_published && (
    
                                <div className="editor-form">
    
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Answer text"
                                        value={
                                            answerInputs[
                                                question.id
                                            ]?.text || ''
                                        }
                                        onChange={e =>
                                            handleAnswerChange(
                                                question.id,
                                                'text',
                                                e.target.value
                                            )
                                        }
                                    />
    
                                    {
                                        question.type !== 'text' && (
    
                                            <label className="editor-checkbox">
    
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        answerInputs[
                                                            question.id
                                                        ]?.is_correct || false
                                                    }
                                                    onChange={e =>
                                                        handleAnswerChange(
                                                            question.id,
                                                            'is_correct',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
    
                                                Correct answer
    
                                            </label>
                                        )
                                    }
    
                                    <button
                                        className="btn-primary"
                                        type="button"
                                        onClick={() =>
                                            handleCreateAnswer(
                                                question
                                            )
                                        }
                                    >
                                        Add Answer
                                    </button>
    
                                </div>
                            )
                        }
    
                    </div>
                ))
            }
    
            {
                !testData?.is_published && (
    
                    <div className="editor-publish-section">
    
                        <button
                            className="btn-primary"
                            type="button"
                            onClick={
                                handlePublishTest
                            }
                        >
                            Publish Test
                        </button>
    
                    </div>
                )
            }
    
        </div>
    );
}

export default EditTestPage;