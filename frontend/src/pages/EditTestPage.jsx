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
    
            setEditingQuestionId(null);
    
            setEditingQuestionText('');
    
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
        <div>

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <h1>

                Test Editor

                {
                !testData?.is_published && (

                    <button
                        type="button"
                        onClick={
                            handlePublishTest
                        }
                    >
                        Publish Test
                    </button>
                )
            }

            </h1>

            <div>

                <input
                    type="text"
                    value={title}
                    onChange={e =>
                        setTitle(
                            e.target.value
                        )
                    }
                    placeholder="Test title"
                />

            </div>

            <br />

            <div>

                <textarea
                    value={description}
                    onChange={e =>
                        setDescription(
                            e.target.value
                        )
                    }
                    placeholder="Description"
                />

            </div>

            <br />

            <div>

                <input
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

            </div>

            <br />

            <button
                type="button"
                onClick={handleUpdateTest}
            >
                Save Test
            </button>

            <br />
            <br />

            {
                !testData?.is_published && (

                    <>
                        <form
                            onSubmit={
                                handleCreateQuestion
                            }
                        >

                            <input
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

                            <button type="submit">
                                Add Question
                            </button>

                        </form>

                        <br />
                    </>
                )
            }

            {
                questions.map(question => (

                    <div key={question.id}>
                        {
                            editingQuestionId ===
                            question.id ? (
                            
                                <div>
                            
                                    <input
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

                                <div>

                                    <h3>
                                        {question.text}
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            startEditingQuestion(
                                                question
                                            )
                                        }
                                    >
                                        Edit Question
                                    </button>

                                    {
                                        !testData?.is_published && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteQuestion(
                                                        question.id
                                                    )
                                                }
                                            >
                                                Delete Question
                                            </button>
                                        )
                                    }

                                </div>
                            )
                        }

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

                                {
                                    !testData?.is_published && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteAnswer(
                                                    answer.id
                                                )
                                            }
                                        >
                                            Delete Answer
                                        </button>
                                    )
                                }

                            </div>
                            ))
                        }

                        <hr />

                        {
                            !testData?.is_published && (

                                <div>

                                    <input
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

                                            <label>

                                                Correct

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

                                            </label>
                                        )
                                    }

                                    <button
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

                        <hr />

                    </div>
                ))
            }

        </div>
    );
}

export default EditTestPage;