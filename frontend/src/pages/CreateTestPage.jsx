import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    createTest
} from '../services/testsService';

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

            setError(
                err.response?.data?.error ||
                'Failed to create test'
            );
            
        }
    }

    return (
        <div>

            <h1>Create Test</h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e =>
                            setTitle(
                                e.target.value
                            )
                        }
                    />

                </div>

                <br />

                <div>

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={e =>
                            setDescription(
                                e.target.value
                            )
                        }
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

                <button type="submit">
                    Create Test
                </button>

            </form>

            {
                error &&
                <p>{error}</p>
            }

        </div>
    );
}

export default CreateTestPage;