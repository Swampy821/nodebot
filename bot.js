var config = {
  channels : ['##antiB9'],
  server: "irc.freenode.net",
  botName: "Sharon"
};
var irc = require("irc");

var bot = new irc.Client(config.server, config.botName, {
  channels:config.channels
});

bot.addListener("message", function(from,to,text,message){
  


})