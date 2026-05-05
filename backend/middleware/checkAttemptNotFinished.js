module.exports = (req, res, next) => {
    if (req.attempt.finished_at) {
        return res.status(400).json({
            error: 'Test already completed'
        });
    }

    const { finishAttempt } = require('../services/attemptService');
    const startedAt = new Date(req.attempt.started_at);
    const now = new Date();

    const diffMinutes = (now - startedAt) / (1000 * 60);

    const limit = req.attempt.time_limit;

    if (diffMinutes > limit) {
        finishAttempt(req.attempt.id, req.attempt.test_id, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            return res.status(400).json({
                error: 'Time limit exceeded. Test finished automatically'
            });
        });

        return;
    }

    next();
};