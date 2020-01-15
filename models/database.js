const sqlite3 = require('sqlite3').verbose(); //Sqlite3 connector

const DBNAME = 'flight.db'
//var db = '';

function conn(dbfile){
    const db = new sqlite3.Database(dbfile, (err) => {
        if(err){
            return console.error(err.message);
        } else{
            console.log('Connected to the database');
        }
    });
    return db;
}


module.exports = conn;
//exports.db = db;