const express = require('express');

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


const customer =  require('./customers');

app.get('/', (req, res) => {
    res.send(JSON.stringify(customer));
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

/*
    We need to work on error handling next - there is, otherwise, a possibility of operational errors crashing our server
*/