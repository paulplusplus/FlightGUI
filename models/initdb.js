const conn = require('./database');
var dbcon = conn('flight.db');
var drops = ['DROP TABLE IF EXISTS Customers;', 'DROP TABLE IF EXISTS Airports;', 'DROP TABLE IF EXISTS Airlines;', 'DROP TABLE IF EXISTS Flights;', 'DROP TABLE IF EXISTS Cust_Flight;']
var creates = [ // UNIQUE , CONSTRAINT email_unique UNIQUE(email)
    'CREATE TABLE Customers(CustID INTEGER PRIMARY KEY AUTOINCREMENT, UserName TEXT, Email TEXT, Password TEXT, Admin NUMERIC DEFAULT 0);',
    'CREATE TABLE Airports(AirportID INTEGER PRIMARY KEY AUTOINCREMENT, AirportName TEXT, CityName TEXT, Country TEXT);',
    'CREATE TABLE Airlines(AirlineID INTEGER PRIMARY KEY AUTOINCREMENT, AirlineName TEXT);',
    //'CREATE TABLE Flights(FlightID INTEGER PRIMARY KEY AUTOINCREMENT, AirlineID INT, Origin INT, Destination INT, CurrentPassengers INT DEFAULT 0, Capacity INT, FlightStatus NUMERIC DEFAULT 1, Fare INT, FlightDate NUMERIC, DepartureTime NUMERIC, FlightTime NUMERIC, FOREIGN KEY(Origin) REFERENCES Airports(AirportID), FOREIGN KEY(Destination) REFERENCES Airports(AirportID), FOREIGN KEY(AirlineID) REFERENCES Airlines(AirlineID));',
    'CREATE TABLE Flights(FlightID INTEGER PRIMARY KEY AUTOINCREMENT, AirlineID INT, Origin TEXT, Destination TEXT, CurrentPassengers INT DEFAULT 0, Capacity INT, FlightStatus NUMERIC DEFAULT 1, Fare INT, FlightDate NUMERIC, DepartureTime NUMERIC, FlightTime NUMERIC, FOREIGN KEY(AirlineID) REFERENCES Airlines(AirlineID));',
    'CREATE TABLE Cust_Flight(CustID INT, FlightID INT, GuiSearch NUMERIC, FOREIGN KEY (CustID) REFERENCES Customer(CustID) ON DELETE CASCADE, FOREIGN KEY (FlightID) REFERENCES Flights(FlightID) ON DELETE CASCADE, PRIMARY KEY (CustID, FlightID));'
]

dbcon.serialize(() =>{
    for(query of drops){
        dbcon.run(query);
    }
    for(query of creates){
        dbcon.run(query);
    }
})



var sql = "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
dbcon.all(sql, (err, row) => {
    if(err){
         console.log(err);
    } else{
        console.log(row);
    } 
});

dbcon.close();
