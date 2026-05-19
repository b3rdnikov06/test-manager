import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { jwtDecode }
    from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const token =
            localStorage.getItem('token');

        if (token) {

            try {

                const payload =
                    jwtDecode(token);

                setUser({
                    id: payload.id,
                    role: payload.role,
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    avatar: payload.avatar,
                    email: payload.email
                });

            } catch {

                localStorage.removeItem('token');
            }
        }

        setLoading(false);

    }, []);

    const login = (token) => {

        localStorage.setItem('token', token);

        const payload =
            jwtDecode(token);

        setUser({
            id: payload.id,
            role: payload.role,
            first_name: payload.first_name,
            last_name: payload.last_name,
            avatar: payload.avatar,
            email: payload.email
        });
    };

    const logout = () => {

        localStorage.removeItem('token');

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}