import api from '../api/axios';

export async function getStudents() {

    const response =
        await api.get(
            '/users/students'
        );

    return response.data;
}

export async function updateProfile(data) {

    const response =
        await api.put(
            '/users/profile',
            data
        );

    return response.data;
}

export async function changePassword(data) {

    const response =
        await api.put(
            '/users/password',
            data
        );

    return response.data;
}