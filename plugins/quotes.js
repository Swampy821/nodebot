//Quotes Plugin
var sqlite3 = require('./../node_modules/sqlite3/sqlite3.js').verbose();
var db = new sqlite3.Database('database/database.db');

//Message Event
exports.message = function(from, to, text, message, bot, config) {
	if(config.quotes==false){return false;}
	var message_string = text.split(' ');
	switch(message_string[0]) {
		case '!quote':
			db.each("Select * from singleQuote Where quoteNumber=? ORDER BY orderNumber",[message_string[1]], function(err, row) {
				switch(row.messageType) {
					case 0:
						bot.say(to, "Quote " + row.quoteNumber + ": <" + row.user_name + "> " + row.quoteText);
						break;
					case 1:
						bot.say(to, "Quote " + row.quoteNumber + ": * " + row.user_name + " " + row.quoteText);
						break;
					default:
						bot.say(to, row.messageType);
						break;
				}
			});
			db.each("Select * from fullQuote Where quoteNumber=?",[message_string[1]], function(err, row) {
				bot.say(to, "Added by " + row.user_name + " in " + row.channel + " on " + row.timestamp);
			});
			break;
		case '!addquote':
			var text = text.replace("!addquote", "");
			var quoteLines = text.split('|');
			db.run("INSERT INTO fullQuote VALUES(null, ?, ?, date('now'))",[from,to],function(err,derr){
				var last_id= this.lastID;
				var sql = "INSERT INTO singleQuote VALUES(null,(Select quoteNumber From fullQuote ORDER BY quoteNumber Desc LIMIT 1), ?, ?, ?, ?)";
				var user, quote, messageType;
				for(var x = 0; x < quoteLines.length; x++) {
					if(quoteLines[x].trim().substring(0,1) == '<') {
						user = quoteLines[x].substring(quoteLines[x].indexOf('<')+1, quoteLines[x].indexOf('>'));
						quote = quoteLines[x].replace("<" + user + ">", "");
						//It's a message
						messageType = 0;
					} else if(quoteLines[x].trim().substring(0,1) == '*') {
						user = quoteLines[x].trim().split(' ')[1];
						quote = quoteLines[x].replace("* " + user, "");
						//It's an action
						messageType = 1;
					}
					quote = quote.trim();
					db.run(sql,[x, user, messageType, quote]);
				}
				bot.say(to, "Quote added as #"+last_id+"!");
			});
			break;
		case '!lastquote':
			db.each("Select * From fullQuote ORDER BY rowid Desc LIMIT 1", function(err, row) {
				db.each("Select * from singleQuote Where quoteNumber=? ORDER BY orderNumber",[row.quoteNumber], function(err, rs) {
					switch(rs.messageType) {
						case 0:
							bot.say(to, "Quote " + rs.quoteNumber + ": <" + rs.user_name + "> " + rs.quoteText);
							break;
						case 1:
							bot.say(to, "Quote " + rs.quoteNumber + ": * " + rs.user_name + " " + rs.quoteText);
							break;
						default:
							bot.say(to, row.messageType);
							break;
					}
				},function(){
					bot.say(to, "Added by " + row.user_name + " in " + row.channel + " on " + row.timestamp);
				});
				
			});
			break;
		default:
			break;
	}
}

//Join Event
exports.join = function(channel, nick, message, bot, config) {
	
}

//Part Event
exports.part = function(channel, nick, message, bot, config) {
	
}

//Action Event
exports.action = function(from, to, message, bot, config) {

}

//Raw Event
exports.raw = function(message, bot, config){

}

