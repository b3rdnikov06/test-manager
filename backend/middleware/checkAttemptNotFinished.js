module.exports = (req, res, next) => {
    if (req.attempt.finished_at) {
        return res.status(400).json({
            error: 'Test already completed'
        });
    }

    next();
};