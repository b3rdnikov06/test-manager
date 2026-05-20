import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    createTest
} from '../services/testsService';

import ErrorToast
    from '../components/ErrorToast';

function CreateTestPage() {

    const navigate =
        useNavigate();

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

    const [error, setError] =
        useState('');

    function showError(message) {

        setError(message);

        setTimeout(() => {

            setError('');

        }, 5000);
    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setError('');

            const response =
                await createTest({
                    title,
                    description,
                    time_limit: Number(timeLimit)
                });

            navigate(
                `/tests/${response.test_id}/edit`
            );

        } catch (err) {

            showError(
                err.response?.data?.error ||
                'Failed to create test'
            );
        }
    }

    return (

        <div className="editor-page">

            <ErrorToast
                message={error}
                onClose={() =>
                    setError('')
                }
            />

            <div className="editor-header">

                <h1 className="page-title">
                    Create Test
                </h1>

            </div>

            <div className="editor-card">

                <h2 className="editor-section-title">
                    Test Information
                </h2>

                <form
                    className="editor-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        className="input"
                        type="text"
                        placeholder="Test title"
                        value={title}
                        onChange={e =>
                            setTitle(
                                e.target.value
                            )
                        }
                    />

                    <textarea
                        className="input"
                        placeholder="Description"
                        value={description}
                        onChange={e =>
                            setDescription(
                                e.target.value
                            )
                        }
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
                        type="submit"
                    >
                        Create Test
                    </button>

                </form>

            </div>

        </div>
    );
}

export default CreateTestPage;