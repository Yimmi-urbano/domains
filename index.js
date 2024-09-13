const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3500;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.json());
app.use(cors());

const domainsRouter = require('./routes/domains');
app.use('/domains', domainsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
