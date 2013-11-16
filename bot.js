var config = require("./config.js");
var irc = require("irc");
var cash = require('./plugins/cash.js');
var fs = require('fs');
var plugins = Array();
var current_timestamp = new Date().getTime();
current_timestamp = Math.round(current_timestamp / 1000);
var interest_file = './database/lint.dat';
//Deal with interest
fs.exists(interest_file,function(exists){
  if(exists==true)
  {
    fs.readFile(interest_file,function(err,data){
      data = parseInt(data);
      if(current_timestamp>(data+86400))
      {
        fs.writeFile(interest_file,current_timestamp,function(){
          cash.accruedInterest(config);
        });
      }
    });
  }else{
    fs.writeFile(interest_file,current_timestamp,function(){
      cash.accruedInterest(config);
    });
  }
});








//Start bot
var bot = new irc.Client(config.server, config.botName, {
  channels:config.channels
});


// Auto Load All Plugins
var i = 0;
require('fs').readdirSync(__dirname + '/plugins/').forEach(function(file) {
  if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
    plugins[i] = require('./plugins/' + file);
    i++;
  }
});

//Message Listener
bot.addListener("message", function (from, to, text, message){
    for(var i=0;i<plugins.length;i++)
    {
      if(typeof plugins[i].message == 'function'){
        plugins[i].message(from, to, text, message, bot, config);
      }
    }
})
//JOIN EVENT HANDLER
bot.addListener("join", function (channel, nick, message) { 
  for(var i=0;i<plugins.length;i++)
    {
      if(typeof plugins[i].message == 'function'){
        plugins[i].join(channel, nick, message, bot, config);
      }
    }
})
//PART EVENT HANDLER
bot.addListener("part", function (channel, nick, message) { 
  for(var i=0;i<plugins.length;i++)
    {
      if(typeof plugins[i].message == 'function'){
        plugins[i].part(channel, nick, message, bot, config);
      }
    }
})
//RAW EVENT HANDLER
bot.addListener("raw", function (message) { 
  for(var i=0;i<plugins.length;i++)
    {
      if(typeof plugins[i].message == 'function'){
        plugins[i].raw(message, bot, config);
      }
    }
})

//ACTION EVENT HANDLER
bot.addListener("action", function (from, to, message) { 
  for(var i=0;i<plugins.length;i++)
    {
      if(typeof plugins[i].message == 'function'){
        plugins[i].action(from, to, message, bot, config);
      }
    }
})

//LOAD CURRENT NICKS INTO CONFIG EVENT HANDLER
bot.addListener("names", function (channel, nicks) { 
  config.nicks = nicks;
})