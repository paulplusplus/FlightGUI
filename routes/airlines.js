const express = require('express');
const router = express.Router();
const conn = require('../models/database');

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

router.post('/', (req, res) => { //Create an airline
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

router.put('/:id', (req, res) => {
    try{
        var id = parseInt(req.params.id);
        const dbcon = conn('./models/flight.db');
        dbcon.all('SELECT * FROM Airlines WHERE AirlineID=?', [id], (err, rows) => {
            if(err){
                res.sendStatus(400).json({error: "an error occurred"});
                console.error(err);
            } else{
                if(rows[0].AirlineName){ //If defined - i.e. such a record exists
                    //We can update it
                    dbcon.run('UPDATE Airlines SET AirlineName=? WHERE AirlineID=?;', [req.body.AirlineName, id], (err) => {
                        if(err){
                            res.sendStatus(400).json({error: "failed to update airline"});
                            console.error(err);
                        } else{
                            res.json({airline: "airline updated"});
                        }
                    });
                } else{
                    res.sendStatus(400).json({error: 'an error occurred'});
                }
            }
        });
        dbcon.close();
    } catch(err){
        res.sendStatus(400).json({error: "an error occurred"});
        console.error(err);
    }
});

module.exports = router;

/*
    Airlines should have a few things
    - A way to create an airline (post)
    

*/