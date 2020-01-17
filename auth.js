//Auth route
//We'll use JWTs - JSON Web Tokens
const bcrypt = require('bcryptjs');
const conn = require('./models/database');



module.exports = (arg) => { //Function used to authenticate users
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
        } catch(err){
            reject('authentication failed');
        }
    })
}