const express = require('express');
const router = express.Router();
const conn = require('../models/database');
const {authHandler, adminHandler} = require('../auth'); //Auth function

//Middleware

//URl/Endpoints
router.get('/', (req, res) =>{
    const dbcon = conn('./models/flight.db');
    dbcon.all("SELECT f.FlightID, a.AirlineName, f.Origin, f.Destination, f.CurrentPassengers, f.Capacity, f.FlightStatus, f.Fare, f.FlightDate, f.DepartureTime, f.FlightTime FROM Flights AS f INNER JOIN Airlines AS a on f.AirlineID = a.AirlineID;", (err, rows) => {
        if(err){
            res.status(400).json({error: "no flights"});
            console.log(err);
        } else{
            res.status(200).json(rows);
        }
    });
    dbcon.close();
});

router.get('/:id', (req, res) =>{  //Get flights for specific airline
    var id = parseInt(req.params.id);
    const dbcon = conn('./models/flight.db');
    try{
        dbcon.all("SELECT f.FlightID, a.AirlineName, f.Origin, f.Destination, f.CurrentPassengers, f.Capacity, f.FlightStatus, f.Fare, f.FlightDate, f.DepartureTime, f.FlightTime FROM Flights AS f INNER JOIN Airlines AS a on f.AirlineID = a.AirlineID WHERE f.AirlineID=?;", [id], (err, rows) => {
            if(err){
                res.status(400).json({error: "no flights for this airline"});
                console.log(err);
            } else{
                res.status(200).json(rows);
            }
        });
        dbcon.close();
    } catch (err) {
        req.status(500).json({error: "Server error occurred"});
    }
});

router.get('/airport/:name', (req, res) => {
    var name = req.params.name; //Airport name
    const dbcon = conn('./models/flight.db');
    try{
        dbcon.all("SELECT f.FlightID, a.AirlineName, f.Origin, f.Destination, f.CurrentPassengers, f.Capacity, f.FlightStatus, f.Fare, f.FlightDate, f.DepartureTime, f.FlightTime FROM Flights AS f INNER JOIN Airlines AS a on f.AirlineID = a.AirlineID WHERE f.Origin=? OR f.Destination=?;", [name, name], (err, rows) => {
            if(err){
                res.status(400).json({error: "no flights for this airport"});
                console.log(err);
            } else{
                res.status(200).json(rows);
            }
        });
        dbcon.close();
    } catch(err) {
        req.status(500).json({error: "Server error occurred"});
    }
});

router.post('/', adminHandler, (req, res) =>{ //Add a flight - Administrator
    try{
        var id = req.body.AirlineID;
        var origin = req.body.Origin;
        var destination = req.body.Destination;
        var cp = req.body.CurrentPassengers;
        var cap = req.body.Capacity;
        var fltstat = req.body.FlightStatus;
        var fare = req.body.Fare;
        var fltdate = req.body.FlightDate;
        var deptime = req.body.DepartureTime;
        var flttime = req.body.FlightTime;
        
        
        const dbcon = conn('./models/flight.db');
        dbcon.run('INSERT INTO Flights(AirlineID, Origin, Destination, CurrentPassengers, Capacity, FlightStatus, Fare, FlightDate, DepartureTime, FlightTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, origin, destination, cp, cap, fltstat, fare, fltdate, deptime, flttime], (err) => {
            if(err){
                res.json({error: "can't add flight"});
                console.log(err);
            } else{
                res.sendStatus(201);
            }
        });
        dbcon.close();

    } catch(err){
        res.status(500).json({error: "an error has occurred."});
        console.error(err);
    }

});

router.put('/:id', adminHandler, (req, res) =>{ //Modify a flight - Administrator
    try{
        const dbcon = conn('./models/flight.db');
        var id = parseInt(req.params.id);
        //console.log(id);
        dbcon.all("SELECT * FROM Flights WHERE FlightID=?;", [id], (err, rows) => {
            if(err){
                res.status(400).json({error: "no such flight"});
                console.log(err);
                
            } else{
                //console.log(rows);
                var aid = rows[0].AirlineID; 
                var origin = rows[0].Origin;
                var destination = rows[0].Destination;
                var cp = rows[0].CurrentPassengers;
                var cap = rows[0].Capacity;
                var fltstat = rows[0].FlightStatus;
                var fare = rows[0].Fare;
                var fltdate = rows[0].FlightDate;
                var deptime = rows[0].DepartureTime;
                var flttime = rows[0].FlightTime;
                aid = req.body.AirlineID ? req.body.AirlineID : aid;
                origin = req.body.Origin ? req.body.Origin : origin;
                destination = req.body.Destination ? req.body.Destination : destination;
                cp = req.body.CurrentPassengers ? req.body.CurrentPassengers : cp;
                cap = req.body.Capacity ? req.body.Capacity : cap;
                fltstat = req.body.FlightStatus ? req.body.FlightStatus : fltstat;
                fare = req.body.Fare ? req.body.Fare : fare;
                fltdate = req.body.FlightDate ? req.body.FlightDate : fltdate;
                deptime = req.body.DepartureTime ? req.body.DepartureTime : deptime;
                flttime = req.body.FlightTime ? req.body.FlightTime : flttime;
                
                //console.log(name);
                //console.log(city);
                //console.log(country);
                dbcon.run('UPDATE Flights SET AirlineID=?, Origin=?, Destination=?, CurrentPassengers=?, Capacity=?, FlightStatus=?, Fare=?, FlightDate=?, DepartureTime=?, FlightTime=? WHERE FlightId=?;', [aid, origin, destination, cp, cap, fltstat, fare, fltdate, deptime, flttime, id], (err) => {
                    if(err) console.error(err);
                });
                res.json({flight: "flight modified"});
            }
        });
        dbcon.close();
    } catch(err){
        res.status(500).json({error: "an error has occurred"});
        console.error(err);
    }
});

router.delete('/:id', adminHandler, (req, res) => { //Delete a flight - Administrator
    try{
        var id = parseInt(req.params.id);
        const dbcon = conn('./models/flight.db');
        dbcon.run('DELETE FROM Flights WHERE FlightID=?', [id], (err) =>{
            if(err) console.error(err);
        });
        res.status(200).json({flight: "flight deleted"});
        dbcon.close();
    } catch(err){
        res.json({error: "an error occurred"});
        console.error(err);
    }
});



module.exports = router;

