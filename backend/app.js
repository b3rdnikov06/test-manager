const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const testsRoutes = require('./routes/tests');
const questionsRoutes = require('./routes/questions');
const attemptsRoutes = require('./routes/attempts');
const authRoutes = require('./routes/auth');
const resultsRoutes = require('./routes/results');
const usersRoutes = require('./routes/users');

app.use('/tests', testsRoutes);
app.use('/questions', questionsRoutes);
app.use('/attempts', attemptsRoutes);
app.use('/auth', authRoutes);
app.use('/results', resultsRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
    res.send('API is working');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});