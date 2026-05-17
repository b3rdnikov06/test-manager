import api from '../api/axios';

export async function getTestResults(
    testId
) {

    const response =
        await api.get(
            `/results/tests/${testId}`
        );

    return response.data;
}

export async function getAttemptResult(
    attemptId
) {

    const response =
        await api.get(
            `/results/${attemptId}`
        );

    return response.data;
}

export async function getStudentResults(
    studentId
) {

    const response =
        await api.get(
            `/results/student/${studentId}`
        );

    return response.data;
}