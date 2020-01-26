const express = require('express');
const config = require('./config');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

//Middleware

//Body Parser Middleware Init
app.use(express.json());    //Allows us to handle raw JSON
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build'))); //Allows us to serve our built React app

//Routes
app.use('/api/flights', require('./routes/flights'));
app.use('/api/airports', require('./routes/airports'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/airlines', require('./routes/airlines'));
app.use('/api/reservations', require('./routes/reservations'));


const customer =  require('./customers');

app.get('/api', (req, res) => {
    //console.log('Cookies: ', req.cookies.jwt);
    res.send(JSON.stringify(customer));
});


const port = 3000;
app.listen(config.PORT, () => {
    console.log(`Server running on port: ${config.PORT}`);
});


