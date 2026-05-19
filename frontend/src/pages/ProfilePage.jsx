import {
    useAuth
} from '../context/AuthContext';

import {
    useState
} from 'react';

import {
    updateProfile
} from '../services/usersService';

function ProfilePage() {

    const {
        user,
        login
    } = useAuth();
    
    const [firstName, setFirstName] =
        useState(
            user?.first_name || ''
        );

    const [lastName, setLastName] =
        useState(
            user?.last_name || ''
        );

    const [avatar, setAvatar] =
        useState(
            user?.avatar || ''
        );

    const [message, setMessage] =
        useState('');

    const [error, setError] =
        useState('');

    async function handleSubmit(e) {

        e.preventDefault();
    
        try {
    
            setError('');
            setMessage('');

            const data =
                await updateProfile({
                    first_name: firstName,
                    last_name: lastName,
                    avatar
                });
    
            setMessage(
                'Profile updated'
            );

            login(data.token);
    
        } catch (err) {
    
            setError(
                err.response?.data?.error ||
                'Failed to update profile'
            );
        }
    }

    return (

        <div>

            <h1>
                My Profile
            </h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={e =>
                            setFirstName(
                                e.target.value
                            )
                        }
                    />

                </div>

                <br />

                <div>

                    <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={e =>
                            setLastName(
                                e.target.value
                            )
                        }
                    />

                </div>

                <br />

                <div>

                    <input
                        type="text"
                        placeholder="Avatar URL"
                        value={avatar}
                        onChange={e =>
                            setAvatar(
                                e.target.value
                            )
                        }
                    />

                </div>

                <br />

                <button type="submit">
                    Save Changes
                </button>

            </form>

            <br />

            {
                user?.avatar
                    ? (

                        <img
                            src={user.avatar}
                            alt="Avatar"
                            width="120"
                            height="120"
                        />

                    ) : (

                        <div>

                            👤

                        </div>
                    )
            }

            <br />

            <p>

                Full name:
                {' '}

                {user?.first_name}
                {' '}
                {user?.last_name}

            </p>

            <p>

                Email:
                {' '}

                {user?.email}

            </p>

            <p>

                Role:
                {' '}

                {user?.role}

            </p>

            {
                message && (
                    <p>
                        {message}
                    </p>
                )
            }

            {
                error && (
                    <p>
                        {error}
                    </p>
                )
            }

        </div>
    );
}

export default ProfilePage;