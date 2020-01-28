const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const conn = require('../models/database');
const bcrypt = require('bcryptjs');
const {auth, authHandler} = require('../auth'); //Auth function
const config = require('../config');

//Middleware

//URl/Endpoints
router.get('/', (req, res) =>{
    const dbcon = conn('./models/flight.db');
    dbcon.all("SELECT * FROM Customers;", (err, rows) => {
        if(err){
            res.status(400).json({error: "no customers"});
            console.log(err);
        } else{
            res.json(rows);
        }
    });
    dbcon.close();
});

router.put('/:id', authHandler, (req, res) => { //Modify a customer
    try{
        var id = parseInt(req.params.id);
        const dbcon = conn('./models/flight.db');
        dbcon.all("SELECT * FROM Customers WHERE CustID=?", [id], (err, rows) => {
            if(err){
                res.status(400).json({error: "an error occurred"});
                console.error(err);
            } else{
                if(rows.length > 0){
                    var username = req.body.UserName ? req.body.UserName : rows[0].UserName; //Be careful that a result is actually returned
                    var email = req.body.Email ? req.body.Email : rows[0].Email;
                    //var password = req.body.Password ? req.body.Password : rows.Password;
                    if(req.body.Password){ //If a new password was provided
                        bcrypt.genSalt(10, (err, salt) => { 
                            bcrypt.hash(req.body.Password, salt, (err, hash) => {
                                var password = hash; //Set password to hashed password
                                dbcon.run('UPDATE Customers SET UserName=?, Email=?, Password=? WHERE CustId=?;', [username, email, password, id], (err) => {
                                    if(err){
                                        res.status(400).json({error: "unable to update customer"});
                                        console.error(err);
                                    } else{
                                        res.status(200).json({customer: "customer modifed"});
                                    }
                                    dbcon.close();
                                });
                            });
                        });
                    } else{ //If a new password was NOT provided
                        dbcon.run('UPDATE Customers SET UserName=?, Email=? WHERE CustId=?;', [username, email, id], (err) => {
                            if(err){
                                res.status(400).json({error: "unable to update customer"});
                                console.error(err);
                            } else{
                                res.status(200).json({customer: "customer modified"});
                            }
                            dbcon.close();
                        });
                    }
                } else {
                    res.status(400).json({error: "an error has occurred"});
                }
            }
        });
    }catch(err){
        res.status(400).json({error: "an error has occurred"});
        console.error(err);
    }

});

router.post('/auth', async(req, res) => { //Authentication route
    const {UserName, Email, Password} = req.body; //Destructure and declare
    try{
        const user = await auth(req.body); //Wait for Promise to resolve and authenticate
        //let date = new Date();
        //date.setMonth(date.getMonth() + 24);
        //let expire = date.getTime();
        let expire = new Date(Number(new Date()) + 63072000000); //2 years
        //Now - we create a JWT
        const token = jwt.sign({ID: user.CustID, UserName: user.UserName, priv: user.Admin}, config.JWT_SECRET, {expiresIn : "7d"});
        res.status(200).cookie('jwt', token, {httpOnly: true, expires: expire}).json({auth: true, token: token, UserName: user.UserName, Email: user.Email, CustID: user.CustID}); //No point in sending this JSON? IDK
        //res.status(200).cookie('jwt', token, {httpOnly: true, maxAge: 86400}).json({auth: true, token: token, UserName: user.UserName, Email: user.Email, CustID: user.CustID});
    } catch(err) {
        //User unauthorized
        res.status(401).json({error: "authentication failed"});
        console.error(err);
    }
});
 
router.post('/register', async(req, res) => { //Create a user
    const {UserName, Email, Password} = req.body;
    const dbcon = conn('./models/flight.db');
    bcrypt.genSalt(10, (err, salt) => { 
        bcrypt.hash(Password, salt, (err, hash) => {
            var password = hash; //Set password to hashed password
            dbcon.run('INSERT INTO Customers(UserName, Email, Password) VALUES(?, ?, ?);', [UserName, Email, password], (err) => {
                if(err){
                    res.status(400).json({error: "an error occurred during registration"});
                    console.error(err);
                } else{
                    res.json({customer: "customer registered"});
                }
                dbcon.close();
            });
        });
    });
    
});


module.exports = router;

