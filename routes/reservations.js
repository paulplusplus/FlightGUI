const express = require('express');
const router = express.Router();
const conn = require('../models/database');
const {authHandler} = require('../auth'); //Auth function



router.post('/', authHandler, (req, res) => { //Book a flight - minimum customer privlege
    try{
        const {CustID, FlightID, GuiSearch} = req.body;
        const dbcon = conn('./models/flight.db');
        dbcon.run('INSERT INTO Cust_Flight(CustID, FlightID, GuiSearch) VALUES(?, ?, ?);', [CustID, FlightID, GuiSearch], (err) =>{
            if(err){
                res.status(400).json({error: "flight already booked"});
            } else res.status(201).json({flight: "flight booked"});
        });
        dbcon.close();
    } catch(err) {
        res.status(400).json({error: "an error occurred"});
        console.error(err);
    }
});

router.delete('/', authHandler, (req, res) => {
    try{
        const {CustID, FlightID} = req.body;
        const dbcon = conn('./models/flight.db');
        console.log('WEHERE??');
        dbcon.run("DELETE FROM Cust_Flight WHERE CustID=? AND FlightID=?;", [CustID, FlightID], (err) => {
            if(err){
                console.log('ERROR?');
                res.status(400).json({error: "an error occurred"});
                console.error(err);
            } else{
                console.log('DELETED?');
                console.log(`Row(s) deleted ${this.changes}`);
                res.status(200).json({flight: "flight deleted"});
            } 
            dbcon.close();
        });
        
    } catch(err){
        res.status(400).json({error: "an error occurred"});
        console.error(err);
    }
});

router.get('/', authHandler, (req, res) => {
    try{
        const {CustID} = req.body;
        const dbcon = conn('./models/flight.db');
        dbcon.all("SELECT cf.CustID, f.FlightID, a.AirlineName, f.Origin, f.Destination, f.CurrentPassengers, f.Capacity, f.FlightStatus, f.Fare, f.FlightDate, f.DepartureTime, f.FlightTime FROM Cust_Flight AS cf INNER JOIN Flights AS f ON cf.FlightID = f.FlightID INNER JOIN Airlines AS a ON f.AirlineID = a.AirlineID WHERE CustID=?", [CustID], (err, rows) =>{
            if(err){
                res.status(400).json({error: "an error occurred"});
            } else{
                res.status(200).json(rows);
                console.log(rows);
            }
        });
        dbcon.close();
    } catch(err){
        res.status(400).json({error: "an error occurred"});
        console.error(err);
    }
});

module.exports = router;