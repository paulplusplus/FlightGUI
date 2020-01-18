const express = require('express');
const router = express.Router();
const conn = require('../models/database');
const {adminHandler} = require('../auth'); //Auth function
//Middleware

//URl/Endpoints
router.get('/', (req, res) =>{ //Get all airports
    const dbcon = conn('./models/flight.db');
    dbcon.all("SELECT * FROM Airports;", (err, rows) => {
        if(err){
            res.json({error: "no airports"});
            console.log(err);
        } else{
            res.json(rows);
            //console.log(rows);
        }
    });
    dbcon.close();
});

router.post('/', adminHandler, (req, res) =>{ //Add an airport - Administrator
    try{
        var name = req.body.AirportName;
        var city = req.body.CityName;
        var country = req.body.Country;

        const dbcon = conn('./models/flight.db');
        dbcon.run('INSERT INTO Airports(AirportName, CityName, Country) VALUES(?, ?, ?)', [name, city, country], (err) => {
            if(err){
                res.json({error: "can't add airport"});
                console.log(err);
            } else{
                res.sendStatus(201);
            }
        });
        dbcon.close();

    } catch(err){
        res.json({error: "an error has occurred."});
        console.error(err);
    }

});

router.put('/:id', adminHandler,  (req, res) =>{ //Modify an airport - administrator
    try{
        const dbcon = conn('./models/flight.db');
        var id = parseInt(req.params.id);
        //console.log(id);
        dbcon.all("SELECT * FROM Airports WHERE AirportID=?;", [id], (err, rows) => {
            if(err){
                res.sendStatus(400).json({error: "no such airport"});
                console.log(err);
                
            } else{
                console.log(rows);
                var name = rows[0].AirportName;
                var city = rows[0].CityName;
                var country = rows[0].Country;
                name = req.body.AirportName ? req.body.AirportName : name;
                city = req.body.CityName ? req.body.CityName : city;
                country = req.body.Country ? req.body.Country : country;
                //console.log(name);
                //console.log(city);
                //console.log(country);
                dbcon.run('UPDATE Airports SET AirportName=?, CityName=?, Country=? WHERE AirportId=?;', [name, city, country, id], (err) => {
                    if(err) console.error(err);
                });
                res.json({airport: "airport modified"});
            }
        });
        dbcon.close();
    } catch(err){
        res.json({error: "an error has occurred"});
        console.error(err);
    }
});

module.exports = router;

