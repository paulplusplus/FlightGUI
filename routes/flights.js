const express = require('express');
const router = express.Router();
const conn = require('../models/database');

//Middleware

//URl/Endpoints
router.get('/', (req, res) =>{
    const dbcon = conn('./models/flight.db');
    //dbcon.all("SELECT * FROM Flights;", (err, rows) => {
    dbcon.all("SELECT f.FlightID, a.AirlineName, f.Origin, f.Destination, f.CurrentPassengers, f.Capacity, f.FlightStatus, f.Fare, f.FlightDate, f.DepartureTime, f.FlightTime FROM Flights AS f INNER JOIN Airlines AS a on f.AirlineID = a.AirlineID;", (err, rows) => {
        if(err){
            res.json({error: "No flights"});
            console.log(err);
        } else{
            res.json(rows);
        }
    });
    dbcon.close();
});

router.post('/', (req, res) =>{ //Add a flight
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
                res.json({error: "No flights"});
                console.log(err);
            } else{
                res.sendStatus(201);
            }
        });
        dbcon.close();

    } catch(err){
        res.json({error: "An error has occurred."});
        console.error(err);
    }

});

router.put('/:id', (req, res) =>{ //Modify a flight
    try{
        const dbcon = conn('./models/flight.db');
        var id = parseInt(req.params.id);
        //console.log(id);
        dbcon.all("SELECT * FROM Flights WHERE FlightID=?;", [id], (err, rows) => {
            if(err){
                res.sendStatus(400).json({error: "No such flight"});
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
                res.json({flight: "Flight modified"});
            }
        });
        dbcon.close();
    } catch(err){
        res.sendStatus(400).json({error: "An error has occurred"});
        console.error(err);
    }
});

router.delete('/:id', (req, res) => { //Delete a flight
    try{
        var id = parseInt(req.params.id);
        const dbcon = conn('./models/flight.db');
        dbcon.run('DELETE FROM Flights WHERE FlightID=?', [id], (err) =>{
            if(err) console.error(err);
        })
        res.sendStatus(200).json({flight: "Flight deleted"});
        dbcon.close();
    } catch(err){
        res.json({error: "An error occurred"});
        console.error(err);
    }
});


module.exports = router;

