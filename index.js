const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json())
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.urlencoded({extended: true}));

app.use(require('./src/routes/router'));

app.listen(PORT, ()=>{
    console.log(`server on port ${PORT}`);
})