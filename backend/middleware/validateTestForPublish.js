const db = require('../db');

module.exports = (req, res, next) => {

    const test_id = req.params.id;

    const questionsQuery = `
        SELECT id, type, order_index
        FROM questions
        WHERE test_id = ?
    `;

    db.query(questionsQuery, [test_id], (err, questionsResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        const totalQuestions = questionsResult.length;

        if (totalQuestions < 5) {
            return res.status(400).json({
                error: 'Test must contain at least 5 questions'
            });
        }

        if (totalQuestions > 20) {
            return res.status(400).json({
                error: 'Test cannot contain more than 20 questions'
            });
        }

        let checkedQuestions = 0;

        let hasError = false;

        for (const question of questionsResult) {

            if (question.type === 'text') {

                checkedQuestions++;

                if (
                    !hasError &&
                    checkedQuestions === questionsResult.length
                ) {
                    next();
                }

                continue;
            }

            const answersQuery = `
                SELECT COUNT(*) AS total
                FROM answers
                WHERE question_id = ?
            `;

            db.query(
                answersQuery,
                [question.id],
                (err, answerResult) => {

                    if (hasError) {
                        return;
                    }

                    if (err) {

                        hasError = true;

                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    if (answerResult[0].total < 2) {

                        hasError = true;

                        return res.status(400).json({
                            error:
                                `Question ${question.order_index} must contain at least 2 answers`
                        });
                    }

                    checkedQuestions++;

                    if (
                        !hasError &&
                        checkedQuestions === questionsResult.length
                    ) {
                        next();
                    }
                }
            );
        }
    });
};