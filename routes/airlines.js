const express = require('express');
const router = express.Router();
const conn = require('../models/database');
const {adminHandler} = require('../auth'); //Auth function

//Middleware

//URl/Endpoints
router.get('/', (req, res) =>{
    const dbcon = conn('./models/flight.db');
    dbcon.all("SELECT * FROM Airlines;", (err, rows) => {
        if(err){
            res.json({error: "no airlines"});
            console.error(err);
        } else{
            res.json(rows);
        }
    });
    dbcon.close();
});

router.post('/', adminHandler, (req, res) => { //Create an airline - Administrator
    try{
        const dbcon = conn('./models/flight.db');
        var name = req.body.AirlineName;
        dbcon.run('INSERT INTO Airlines(AirlineName) VALUES(?)', [name], (err) => {
            if(err){
                res.json({Error: "can't add airline"});
                console.error(err);
            }
            else{
                res.sendStatus(201);
            }
        });
        dbcon.close();
    }catch(err){
        res.json({error: "an error has occurred."});
        console.error(err);
    }
});

router.put('/:id', adminHandler, (req, res) => { //modify an airline- ADMINISTRATOR
    try{
        var id = parseInt(req.params.id);
        const dbcon = conn('./models/flight.db');
        dbcon.all('SELECT * FROM Airlines WHERE AirlineID=?', [id], (err, rows) => {
            if(err){
                res.json({error: "an error occurred"});
                console.error(err);
            } else{
                if(rows[0].AirlineName){ //If defined - i.e. such a record exists
                    //We can update it
                    dbcon.run('UPDATE Airlines SET AirlineName=? WHERE AirlineID=?;', [req.body.AirlineName, id], (err) => {
                        if(err){
                            res.json({error: "failed to update airline"});
                            console.error(err);
                        } else{
                            res.json({airline: "airline updated"});
                        }
                    });
                } else{
                    res.json({error: 'an error occurred'});
                }
            }
        });
        dbcon.close();
    } catch(err){
        res.json({error: "an error occurred"});
        console.error(err);
    }
});

module.exports = router;

