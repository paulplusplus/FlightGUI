const dbc = require('./database');
const bcrypt = require('bcryptjs');
const dbcon = dbc('flight.db');
//'CREATE TABLE Flights(FlightID INTEGER PRIMARY KEY AUTOINCREMENT, AirlineID INT, Origin INT, Destination INT, 
    //CurrentPassengers INT DEFAULT 0, Capacity INT, FlightStatus NUMERIC DEFAULT 1, Fare INT, FlightDate NUMERIC, DepartureTime NUMERIC, FlightTime NUMERIC, 
//
    //Cust_Flight(CustID INT, FlightID INT, GuiSearch NUMERIC, FOREIGN KEY 
var customers = [['paulplus', 'paul@plus.com', 'abc123'], ['admin', 'admin@site.com', 'password']];
var airport = [['JFK', 'New York', 'USA'], ['LAX', 'California', 'USA'], ['LGA', 'New York', 'USA']];
var airline = [['American Airlines'], ['United Airlines']];
var flight = [[1, 'JFK', 'LAX', 25, 250, 1, 250, '01-20-2020', '19:50', '04:00'], [2, 'LAX', 'JFK', 50, 250, 1, 250, '01-22-2020', '09:50', '04:50']];
var cufl = [[1, 1, 1], [1, 2, 0], [2, 1, 1], [2, 2, 0]];


dbcon.serialize( async() => {
    /* for(var i = 0; i < 2; i++){
        (async () => {
            console.log(i);
            console.log(customers[i][2]);
            var cass = customers[i][0];
            var eass = customers[i][1];
            var pass = customers[i][2];
            await new Promise( (resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => { //We generate a SALT using 10 rounds of encryption
                    bcrypt.hash(pass, salt, (err, hash) => {
                        //Hash Password
                        try{
                        pass = hash;
                        dbcon.run('INSERT INTO Customers(UserName, Email, Password) VALUES(?, ?, ?)', [cass, eass, pass]);
                        resolve();
                        } catch(err) {
                            console.log(err);
                        }
                    });
                });
                 
            });
        });
        //dbcon.run('INSERT INTO Customers(UserName, Email, Password) VALUES(?, ?, ?)', [cass, eass, pass]);
    } */
    await new Promise( (resolve, reject) => {
        customers.forEach((item, index) => {
        console.log(item[2]);
        bcrypt.genSalt(10, (err, salt) => { //We generate a SALT using 10 rounds of encryption
            bcrypt.hash(item[2], salt, (err, hash) => {
                //Hash Password
                try{
                item[2] = hash;
                dbcon.run('INSERT INTO Customers(UserName, Email, Password) VALUES(?, ?, ?)', item);
                //resolve();
                } catch(err) {
                    console.log(err);
                }
            });
        });
    });
    resolve();
    }).then(()=>{
        for(var airp of airport){
            dbcon.run('INSERT INTO Airports(AirportName, CityName, Country) VALUES(?, ?, ?)', airp);
        }
        for(var airl of airline){
            dbcon.run('INSERT INTO Airlines(AirlineName) VALUES(?)', airl);
        }
        for(var flig of flight){
            dbcon.run('INSERT INTO Flights(AirlineID, Origin, Destination, CurrentPassengers, Capacity, FlightStatus, Fare, FlightDate, DepartureTime, FlightTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', flig);
        }
        for(var cuf of cufl){
            dbcon.run('INSERT INTO Cust_Flight(CustID, FlightID, GuiSearch) VALUES(?, ?, ?)', cuf);
        }
    });
});
