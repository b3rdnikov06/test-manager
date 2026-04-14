const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const testsRoutes = require('./routes/tests');
const questionsRoutes = require('./routes/questions');

app.use('/tests', testsRoutes);
app.use('/questions', questionsRoutes);

app.get('/', (req, res) => {
    res.send('API is working');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});