///HOOKER PLUGIN




//MESSAGE EVENT
exports.message = function(from, to, text, message, bot, config){
	var message_string = text.split(' ');

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
	var message_string = message.split(' ');
	if(message_string[0].toLowerCase()=='tips' && message_string[1].toLowerCase()==config.botName.toLowerCase())
	{
		var amount = message_string[2];
		amount = amount.substr(1,amount.length);
		amount = parseInt(amount);
		switch(amount)
		{
			case 10:
				bot.say(config.channels[0],'$10? You have got to be kidding me...');
				setTimeout(function(){
					bot.action(config.channels[0], 'takes your money and walks away.');
				},800);
				break;
		}
	}
}