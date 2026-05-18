import api from '../api/axios';

export async function startAttempt(
    testId
) {

    const response =
        await api.post(
            '/attempts/start',
            {
                test_id: testId
            }
        );

    return response.data;
}

export async function getAttempt(
    attemptId
) {

    const response =
        await api.get(
            `/attempts/${attemptId}`
        );

    return response.data;
}

export async function saveAnswer(
    attemptId,
    answerData
) {

    const response =
        await api.post(
            `/attempts/${attemptId}/answer`,
            answerData
        );

    return response.data;
}

export async function submitAttempt(
    attemptId
) {

    const response =
        await api.post(
            `/attempts/${attemptId}/submit`
        );

    return response.data;
}