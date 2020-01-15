const express = require('express');
const router = express.Router();
const conn = require('../models/database');

//Middleware

//URl/Endpoints
router.get('/', (req, res) =>{
    const dbcon = conn('./models/flight.db');
    dbcon.all("SELECT * FROM Customers;", (err, rows) => {
        if(err){
            res.json({error: "No customers"});
            console.log(err);
        } else{
            res.json(rows);
        }
    });
    dbcon.close();
});




module.exports = router;