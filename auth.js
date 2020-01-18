//Auth route
//We'll use JWTs - JSON Web Tokens
const bcrypt = require('bcryptjs');
const conn = require('./models/database');
const jwt = require('jsonwebtoken');
const config = require('./config');



function auth(arg){ //Function used to authenticate users
    return new Promise((resolve, reject) => {
        try{
            const dbcon = conn('./models/flight.db');
            if(arg.UserName){
                dbcon.all('SELECT * FROM Customers WHERE UserName=?', [arg.UserName], (err, row) => {
                    if(err) reject('an error occurred');
                    if(row[0].Password){ //E.g. - some result was returned - lets verify password
                        bcrypt.compare(arg.Password, row[0].Password, (err, isMatch) => {
                            if(err) reject('authentication failed');
                            if(isMatch){
                                resolve(row[0]);
                            } else{
                                reject('authentication failed');
                            }
                        })
                    } 
                });
            }
            if(arg.Email){
                dbcon.all('SELECT * FROM Customers WHERE Email=?', [arg.Email], (err, row) => {
                    if(err) reject('an error occurred');
                    if(row[0].Password){ //E.g. - some result was returned - lets verify password
                        bcrypt.compare(arg.Password, row[0].Password, (err, isMatch) => {
                            if(err) reject('authentication failed');
                            if(isMatch){
                                resolve(row[0]);
                            } else{
                                reject('authentication failed');
                            }
                        })
                    } 
                });
            }
        } catch(err){
            reject('authentication failed');
        }
    })
}

function authHandler(req, res, next){ //Check if authorized - used for protected routes
    var token = req.headers.authorization;
    if(token){ //if present
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            console.log(decoded);
            if(decoded.priv === 1){
                console.log('admin');
                next(); //If an admin accesses route - immediately allow
            } else{
                if(decoded.ID == parseInt(req.params.id) || decoded.ID == req.body.CustID){ //Make certain a user isn't tampering with another user's data
                    next();
                    console.log('authorized');
                } else{
                    console.log('No match');
                    res.status(401).json({error: "unauthorized"});
                }
            }
        });
        //next();
    } else{
        //console.log("auth reroute");
        //res.redirect('/customers/auth');
        res.status(401).json({error: "unauthorized"});
    }
}

function adminHandler(req, res, next){ //Check if authorized - used for protected ADMIN routes
    var token = req.headers.authorization;
    if(token){ //if present
        jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            console.log(decoded);
            
            //res.status(200).send(decoded);
            if(decoded.priv === 1){
                next();
            } else{
                res.status(401).json({error: "unauthorized"});
            }
        });
    } else{
        res.status(401).json({error: "unauthorized"});
    }
}

module.exports = {
    auth,
    authHandler,
    adminHandler
}