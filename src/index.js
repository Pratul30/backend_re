const express = require('express');
const app = express();
const port = 3000;

const companyRoutes = require('./routes/companyRoutes');

app.use(express.json())
app.use('/api', companyRoutes)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
    });