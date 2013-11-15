///CASH PLUGIN
var sqlite3 = require('./../node_modules/sqlite3/sqlite3.js').verbose();
var db = new sqlite3.Database('database/database.db');

//ADD CASH
exports.add = function(user, amount, callback)
{
	var sql = "SELECT cash FROM cash WHERE user_name=?";
	var bind = [user];
	var cash = 0;
	var exists = false;
	db.each(sql,bind,function(err,rows){
		cash = rows.cash;
		exists=true;
	},
	function(){ //COMPLETE
		cash+=amount;
		if(exists==false)
		{
			sql = "INSERT INTO cash (`user_name`,`cash`) VALUES (?,?)";
			bind = [user,cash];
			db.run(sql,bind);
		}else{
			sql = "UPDATE cash SET `cash`=? WHERE `user_name`=?";
			bind = [cash,user];
			db.run(sql,bind);
		}
		callback(cash);
	});
}

//REMOVE CASH
exports.remove = function(user, amount, callback)
{
	var sql = "SELECT cash FROM cash WHERE user_name=?";
	var bind = [user];
	var cash = 0;
	var exists = false;
	db.each(sql,bind,function(err,rows){
		cash = rows.cash;
		exists=true;
	},
	function(){ //COMPLETE
		cash-=amount;
		if(cash<0)
		{
			cash=0;
		}
		if(exists==false)
		{
			sql = "INSERT INTO cash (`user_name`,`cash`) VALUES (?,?)";
			bind = [user,cash];
			db.run(sql,bind);
		}else{
			sql = "UPDATE cash SET `cash`=? WHERE `user_name`=?";
			bind = [cash,user];
			db.run(sql,bind);
		}
		callback(cash);
	});
}

//GET BALANCE
exports.balance = function(user, callback)
{
	var sql = "SELECT cash FROM cash WHERE user_name=?";
	var bind = [user];
	var cash = 0;
	var exists = false;
	db.each(sql,bind,function(err,rows){
		cash = rows.cash;
		exists=true;
	},
	function(){
		callback(cash);
	});
}


