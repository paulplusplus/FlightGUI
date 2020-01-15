const conn = require('./database');
const dbcon = conn('flight.db');
dbcon.serialize(() => {
dbcon.all('SELECT * FROM Customers', (err, rows) => {
    if(err) console.log(err);
    else console.log(rows);
});

dbcon.all('SELECT * FROM Airports', (err, rows) => {
    if(err) console.log(err);
    else console.log(rows);
});

dbcon.all('SELECT * FROM Airlines', (err, rows) => {
    if(err) console.log(err);
    else console.log(rows);
});

dbcon.all('SELECT * FROM Flights', (err, rows) => {
    if(err) console.log(err);
    else console.log(rows);
});

dbcon.all('SELECT * FROM Cust_Flight', (err, rows) => {
    if(err) console.log(err);
    else console.log(rows);
});
});