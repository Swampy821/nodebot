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
		if(callback != undefined)
		{
			callback(cash);
		}
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
		if(callback != undefined)
		{
			callback(cash);
		}
		
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
		if(callback != undefined)
		{
			callback(cash);
		}
	});e
}

exports.accruedInterest = function(config)
{
	console.log('ACCRUING INTEREST');
	var sql = "SELECT rowid, cash FROM cash";
	var cash = Array();
	var new_cash;
	var update_sql = 'UPDATE cash SET `cash` = CASE ';
	var update_bind = Array();
	var row_ids = Array();
	db.each(sql,function(err,rows){
		cash.push({cash:rows.cash, id: rows.rowid, interest:0});
	},function(){

		for(var i=0;i<cash.length;i++)
		{
			new_cash = cash[i].cash*config.interest_rate;
			cash[i].cash+=new_cash;
			update_sql += ' WHEN `rowid`=? THEN ? ';
			update_bind.push(cash[i].id);
			update_bind.push(cash[i].cash);
			row_ids.push(cash[i].id);
		}
		update_sql += ' END WHERE `rowid` IN (';
		update_sql += row_ids.join(', ');
		update_sql += ')';
		db.run(update_sql,update_bind);
	})
}
