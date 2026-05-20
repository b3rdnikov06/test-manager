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

import ErrorToast
    from '../components/ErrorToast';

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

        <div className="profile-page">

            <h1 className="page-title">
                My Profile
            </h1>

            <div className="profile-card">

                <div className="profile-avatar">

                    {
                        user?.avatar
                            ? (

                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                />

                            ) : (

                                <span>
                                    {user?.first_name?.[0]}
                                </span>
                            )
                    }

                </div>

                <div className="profile-info">

                    <h2>

                        {user?.first_name}
                        {' '}
                        {user?.last_name}

                    </h2>

                    <p>
                        {user?.email}
                    </p>

                    <span className="profile-role">

                        {user?.role}

                    </span>

                </div>

            </div>

            <div className="profile-settings-grid">

                <div className="settings-card">

                <h2 className="section-title">
                    Edit Profile
                </h2>

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div>

                            <input
                                className="input"
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

                        <div>

                            <input
                                className="input"
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

                        <div>

                            <input
                                className="input"
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

                        <button
                            className="btn-primary"
                            type="submit"
                        >
                            Edit Profile
                        </button>

                     </form>

                </div>

            <div className="settings-card">

            <h2 className="section-title">
                Change Password
            </h2>

            <form
                onSubmit={handlePasswordChange}
            >

                        <div>

                            <input
                                className="input"
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

                        <div>

                            <input
                                className="input"
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

                        <div>

                            <input
                                className="input"
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

                        <button
                            className="btn-primary"
                            type="submit"
                        >
                            Change Password
                        </button>

                    </form>

                </div>

            </div>          

            <ErrorToast
                message={error || message}
                onClose={() => {

                    setError('');
                    setMessage('');

                }}
            />

        </div>

    );
}

export default ProfilePage;