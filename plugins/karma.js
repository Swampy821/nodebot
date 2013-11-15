///KARMA PLUGIN
var sqlite3 = require('./../node_modules/sqlite3/sqlite3.js').verbose();
var db = new sqlite3.Database('database/database.db');

//MESSAGE EVENT
exports.message = function(from, to, text, message, bot, config){
	var message_string = text.split(' ');
	var user_name = message_string[0].substr(0,message_string[0].length-2);
	if((message_string[0].substr(message_string[0].length-2,2)=='++' || message_string[0].substr(message_string[0].length-2,2)=='--') && user_name!=from)
	{
		if(config.nicks[user_name]==null)
		{
			bot.say(config.channels[0],"I don't know of any "+user_name+"s.");
			return false;
		}
		if(message_string[0].substr(message_string[0].length-2,2)=='--')
		{
			var min=true;
		}else{
			var min=false;
		}
		var sql = 'SELECT `count` FROM karma WHERE user_name=?';
		var bind = [user_name];
		var is_in=false;
		var karma = 0;
		db.each(sql,bind,function(err,data){
			is_in=true;
			karma = data.count;
		},function(){
			if(is_in==false)
			{
				sql = "INSERT INTO karma (`user_name`,`count`) VALUES (?,?)";
				bind = [user_name,(min==false ? 1 : 0)];
				db.run(sql,bind);
				var say_string='';
				if(min==false)
				{
					say_string = 'Woo '+user_name+' is up to 1 karma!';
				}else{
					say_string = 'awe '+user_name+', '+from+' has pushed you to 0 karma.';
				}
				bot.say(config.channels[0],say_string);
			}else{
				sql = "UPDATE karma SET `count`=`count`"+(min==false ? '+' : '-')+"1 WHERE user_name=?";
				bind = [user_name];
				db.run(sql,bind);
				if(min==false)
				{
					karma++;
				}else{
					karma--;
				}
				bot.say(config.channels[0],user_name+' is '+(min==false ? 'up' : 'down')+' to '+karma+' karma thanks to '+from+'!');
			}

		});	
	}

}

//JOIN EVENT
exports.join = function(channel, nick, message, bot, config){
	
}

//PART EVENT
exports.part = function(channel, nick, message, bot, config){
	
}

//PART EVENT
exports.raw = function(message, bot, config){

}

//ACTION EVENT
exports.action = function(from, to, message, bot, config){
	

}