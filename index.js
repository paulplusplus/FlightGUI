const express = require('express');
const config = require('./config');
const app = express();

//Middleware

//Body Parser Middleware Init
app.use(express.json());    //Allows us to handle raw JSON
app.use(express.urlencoded({ extended: false}));

//Routes
app.use('/flights', require('./routes/flights'));
app.use('/airports', require('./routes/airports'));
app.use('/customers', require('./routes/customers'));
app.use('/airlines', require('./routes/airlines'));
app.use('/reservations', require('./routes/reservations'));


const customer =  require('./customers');

app.get('/', (req, res) => {
    res.send(JSON.stringify(customer));
});


const port = 3000;
app.listen(config.PORT, () => {
    console.log(`Server running on port: ${config.PORT}`);
});


