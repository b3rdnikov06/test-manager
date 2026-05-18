import api from '../api/axios';

export async function loginUser(email, password) {

    const response = await api.post(
        '/auth/login',
        {
            email,
            password
        }
    );

    return response.data;
}

export async function register(
    userData
) {

    const response =
        await api.post(
            '/auth/register',
            userData
        );

    return response.data;
}