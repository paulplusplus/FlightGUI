const sqlite = require('sqlite3').verbose();

class DBHandler{
    //const dbname = 'flight.db';
    //const db = '';
    constructor(){
        db = new sqlite.Database(dbname, (err, conn))
    }
}