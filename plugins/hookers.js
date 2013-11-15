///HOOKER PLUGIN
cash = require('./cash.js');

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
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//ACTION EVENT
exports.action = function(from, to, message, bot, config){
	var message_string = message.split(' ');

	if(message_string[0].toLowerCase()=='steals' && message_string[3].toLowerCase()==config.botName.toLowerCase())
	{
		if(getRandomInt(0,10)<4)
		{
			var amount = message_string[1];
			amount = amount.substr(1,amount.length);
			amount = parseInt(amount);
			cash.add(from,amount,function(current_cash){
				console.log(current_cash);
				bot.say(from,'You now have $'+current_cash);
			});
			bot.action(config.channels[0],' gets '+message_string[1]+' stolen form her.');
			
		}else{
			bot.action(config.channels[0],' hits '+from+' with her purse and runs off!');
		}
	}



	//TIPS
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