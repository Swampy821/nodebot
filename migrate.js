///KARMA PLUGIN
var sqlite3 = require('./node_modules/sqlite3/sqlite3.js').verbose();
var db = new sqlite3.Database('database/database.db');
//SHOW TABLES 
/*
---------------------------------------------------------------------------
        CHECK THE TABLES AFTER YOU PULL REPO AND ADD ANY NECESSARY ONES     
          IF YOU ADD ANY TABLES ON CHANGES PLEASE ADD TO MIGRATE FILE    
---------------------------------------------------------------------------
*/



/*
db.each("SELECT * FROM sqlite_master WHERE type='table';",function(err,rows){
  console.log(rows);
});
*/



//KARMA TABLE
//db.run("CREATE TABLE karma (user_name VARCHAR(255), count INT);");



//CASH FLOW TABLE
//db.run("CREATE TABLE cash (user_name VARCHAR(255), cash INT, mod_date INT);");
