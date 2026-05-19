import {
    useAuth
} from '../context/AuthContext';

import {
    useState
} from 'react';

import {
    updateProfile,
    changePassword
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

    const [
        currentPassword,
        setCurrentPassword
    ] = useState('');
    
    const [
        newPassword,
        setNewPassword
    ] = useState('');
    
    const [
        confirmPassword,
        setConfirmPassword
    ] = useState('');

    const [
        showProfileForm,
        setShowProfileForm
    ] = useState(false);
    
    const [
        showPasswordForm,
        setShowPasswordForm
    ] = useState(false);

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

    async function handlePasswordChange(e) {

        e.preventDefault();
    
        try {
    
            setError('');
            setMessage('');
            
            const data =
                await changePassword({
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                });
    
            setMessage(
                'Password updated'
            );

            login(data.token);
    
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
    
        } catch (err) {
    
            setError(
                err.response?.data?.error ||
                'Failed to update password'
            );
        }
    }

    return (

        <div>

            <h1>
                My Profile
            </h1>

            {
                !showProfileForm && (

                    <button
                        type="button"
                        onClick={() =>
                            setShowProfileForm(true)
                        }
                    >
                        Edit Profile
                    </button>
                )
            }

            {
                showProfileForm && (

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
                )
            }

            <hr />

            {
                !showPasswordForm && (

                    <button
                        type="button"
                        onClick={() =>
                            setShowPasswordForm(true)
                        }
                    >
                        Change Password
                    </button>
                )
            }

            {
                showPasswordForm && (

                    <form onSubmit={handlePasswordChange}>

                        <div>

                            <input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={e =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <br />

                        <div>

                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={e =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <br />

                        <div>

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={e =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <br />

                        <button type="submit">
                            Change Password
                        </button>

                    </form>
                )
            }
            
            <br />
            <br />

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