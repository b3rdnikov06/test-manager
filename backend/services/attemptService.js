const db = require('../db');

function finishAttempt(attempt_id, test_id, callback) {

    const checkFinishedQuery = `
        UPDATE attempts 
        SET finished_at = NOW()
        WHERE id = ? AND finished_at IS NULL
    `;

    db.query(checkFinishedQuery, [attempt_id], (err, result) => {
        if (err) return callback(err);

        if (result.affectedRows === 0) {
            return callback(null);
        }

        const query = `
            SELECT 
                q.id AS question_id,
                q.type,
                a.id AS answer_id,
                a.text AS answer_text,
                a.is_correct,
                ua.answer_id AS selected
            FROM questions q
            LEFT JOIN answers a ON q.id = a.question_id
            LEFT JOIN user_answers ua 
                ON ua.answer_id = a.id 
                AND ua.attempt_id = ?
            WHERE q.test_id = ?
        `;

        const textQuery = `
            SELECT question_id, text_answer
            FROM user_answers
            WHERE attempt_id = ? AND text_answer IS NOT NULL
        `;

        db.query(query, [attempt_id, test_id], (err, results) => {
            if (err) return callback(err);

            db.query(textQuery, [attempt_id], (err, textResults) => {
                if (err) return callback(err);

                const questionsMap = {};

                results.forEach(row => {
                    if (!questionsMap[row.question_id]) {
                        questionsMap[row.question_id] = {
                            type: row.type,
                            answers: [],
                            text_answer: null,
                            correct_text: null
                        };
                    }

                    if (row.type === 'text' && row.is_correct) {
                        questionsMap[row.question_id].correct_text = row.answer_text;
                    }

                    if (row.answer_id) {
                        questionsMap[row.question_id].answers.push({
                            is_correct: row.is_correct,
                            selected: row.selected !== null
                        });
                    }
                });

                textResults.forEach(row => {
                    if (questionsMap[row.question_id]) {
                        questionsMap[row.question_id].text_answer = row.text_answer;
                    }
                });

                let score = 0;
                const total = Object.keys(questionsMap).length;

                Object.values(questionsMap).forEach(question => {
                    let isCorrect = true;

                    if (question.type !== 'text') {
                        question.answers.forEach(answer => {
                            if (answer.is_correct && !answer.selected) isCorrect = false;
                            if (!answer.is_correct && answer.selected) isCorrect = false;
                        });
                    }

                    if (question.type === 'text') {
                        const user = (question.text_answer || '').trim().toLowerCase();
                        const correct = (question.correct_text || '').trim().toLowerCase();

                        if (user !== correct) isCorrect = false;
                    }

                    if (isCorrect) score++;
                });

                const resultQuery = `
                    INSERT INTO results (attempt_id, score, max_score)
                    VALUES (?, ?, ?)
                `;

                db.query(resultQuery, [attempt_id, score, total], (err) => {
                    if (err) return callback(err);

                    callback(null, { score, total });
                });
            });
        });
    });
}

module.exports = { finishAttempt };