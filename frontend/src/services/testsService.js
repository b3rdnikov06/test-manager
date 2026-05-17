import api from '../api/axios';

export async function getTests() {

    const response =
        await api.get('/tests');

    return response.data;
}

export async function getTeacherTests() {

    const response =
        await api.get('/tests/teacher');

    return response.data;
}

export async function createTest(testData) {

    const response =
        await api.post(
            '/tests',
            testData
        );

    return response.data;
}

export async function getFullTest(testId) {

    const response =
        await api.get(
            `/tests/${testId}/full`
        );

    return response.data;
}

export async function createQuestion(
    testId,
    questionData
) {

    const response =
        await api.post(
            `/tests/${testId}/questions`,
            questionData
        );

    return response.data;
}

export async function createAnswer(
    questionId,
    answerData
) {

    const response =
        await api.post(
            `/questions/${questionId}/answers`,
            answerData
        );

    return response.data;
}

export async function updateQuestion(
    questionId,
    questionData
) {

    const response =
        await api.patch(
            `/questions/${questionId}`,
            questionData
        );

    return response.data;
}

export async function deleteTest(
    testId
) {

    const response =
        await api.delete(
            `/tests/${testId}`
        );

    return response.data;
}

export async function deleteQuestion(
    questionId
) {

    const response =
        await api.delete(
            `/questions/${questionId}`
        );

    return response.data;
}

export async function publishTest(
    testId
) {

    const response =
        await api.patch(
            `/tests/${testId}/publish`
        );

    return response.data;
}

export async function deleteAnswer(
    answerId
) {

    const response =
        await api.delete(
            `/questions/answers/${answerId}`
        );

    return response.data;
}

export async function updateTest(
    testId,
    testData
) {

    const response =
        await api.patch(
            `/tests/${testId}`,
            testData
        );

    return response.data;
}