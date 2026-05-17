import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

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
                    JSON.parse(
                        atob(
                            token.split('.')[1]
                        )
                    );

                setUser({
                    id: payload.id,
                    role: payload.role
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
            JSON.parse(
                atob(
                    token.split('.')[1]
                )
            );

        setUser({
            id: payload.id,
            role: payload.role
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