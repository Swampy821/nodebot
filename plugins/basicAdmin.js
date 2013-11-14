



//MESSAGE EVENT
exports.message = function(from, to, text, message, bot, config){
	bot.say(config.channels[0],'message event');
}

//JOIN EVENT
exports.join = function(channel, nick, message, bot, config){
	bot.say(config.channels[0],'join event');
}

//PART EVENT
exports.part = function(channel, nick, message, bot, config){
	bot.say(config.channels[0],'part event');
}

//PART EVENT
exports.raw = function(message, bot, config){

}

//ACTION EVENT
exports.action = function(from, to, message, bot, config){
	bot.say(config.channels[0],'action event');
}