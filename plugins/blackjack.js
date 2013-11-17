var blackjack = require("./blackjack_system/blackjack_system.js");
var cash = require("./cash.js")
var game;
var player;
var bet;
var game_phase=0;
var message_delay=600;



//MESSAGE EVENT
exports.message = function(from, to, text, message, bot, config){
	//Reset hold_phase to false. This stops any other command from executing after a command is recognized.
	var hold_phase=false;
	//Swplit the message into an array.
	var message_split = text.split(' ');
	//Check to see if the bot is a male ro female so her responses can match her sex. 
	var myself;
	if(config.sex.toLowerCase()=='female')
	{
		myself = 'herself';
	}else{
		myself = 'himself';
	}



	/*-------------------------START BLACKJACK-------------------------------*
	* Start Command: {BOT_NAME} lets play blackjack 
	*	
	* Start the game and ask the player how much they would like to bet. 
	*
	*
	*------------------------------------------------------------------------*/
	//Combine the string into a recognizable command. 
	var command = message_split[0]+' '+message_split[1]+' '+message_split[2]+' '+message_split[3];
	//Convert the string to lower case so it will recognize it no matter what
	command = command.toLowerCase();
	//Check if the command matches {BOT_NAME} lets play blackjack
	if(command==config.botName.toLowerCase()+' lets play blackjack' && game_phase==0)
	{
		//Intialize Game
		game = new blackjack.Game();
		//Shuffle the deck before play
		game.deck.shuffle();
		//Assign Player variable
		player = from;
		//Let the chat know that it's on.
		game_phase=1;
		//Set the hold_phase to true so that other commands are not accepted.
		hold_phase=true;
		//Tell the user that the game is starting. 
		bot.say(
				config.channels[0],
				'Alright, lets play some blackjack '+from+'!'
			   );
		//Delay a bit 
		setTimeout(function(){
			//ask the user how much they would like to bet. The user will bet by simple saying ${AMOUNT_OF_BET}
			bot.say(
				config.channels[0],
				'How much would you like to bet '+player+'?'
			   );
		},message_delay);
	}






	/*-------------------------TAKE THE BET-------------------------------*
	* Bet Command: ${BET_AMOUNT} 
	* Bet Example: $10
	*
	* Check to see if the user has enough money to support the bet. 
	* Verify that the user actually wants to bet that much.
	*---------------------------------------------------------------------*/
	if(game_phase==1 && from==player && message_split[0].substr(0,1)=='$' && hold_phase==false)
	{
		//Parse the bet, trim out the $ and throw it into the bet global variable.
		bet = parseInt(message_split[0].substr(1,message_split[0].length));
		//Check the users balance to make sure they have enough money to back up the bet. 
		cash.balance(from,function(player_balance){
			//Check to see if the user is trying to be more than the player balance. 
			if(bet>player_balance)
			{
				//Alert the user they cannot make a bet like that and wait for another bet command to come through. 
				bot.say(config.channels[0],from+', you have only got $'+player_balance+". You can't make a bet like that..");
			}else{
				//Set the game_phase to 2
				game_phase=2;
				//Hold the phase. 
				hold_phase=true;
				//Verify that the user actually wants to make a bet like that.
				bot.say(config.channels[0],from+', Are you sure you want to bet $'+bet+'?');
			}
		});
	}







	/*-------------------------TAKE THE BET AND START THE GAME------------------*
	* Command: "yes" or "No"
	*
	* Check to see if the user accepts their bet, if not return to the previous 
	* phase. 
	* If the player is cool with their bet deal out the cards and start the game
	*
	*---------------------------------------------------------------------------*/
	//Check if the phase is 2, the player matches and the hold phase is off
	if(game_phase==2 && from==player && hold_phase==false)
	{
		//if the message starts with "yes" ge the game going. 
		if(message_split[0].toLowerCase().substr(0,3)=='yes')
		{
			//Define the deal_card variable.
			var deal_card;
			/*-------START THE GAME--------*/
			//Lethte folks know the game is starting
			bot.say(config.channels[0],'Okay, sounds good. Lets get this game started.');
			//Pull the money out of the users account, for now they are past to the point of no return. 
			take_bet(from, bet); 
			//Deal the first card
			setTimeout(function(){
				//Draw a card form the deck
				deal_card = game.deck.draw();
				//Put it in the players hand
				game.player_hand.drawCard(deal_card);
				//Tell the player what card they have
				bot.action(config.channels[0],'deals '+from+' '+deal_card.show_val+' of '+deal_card.suit+'.');
				//Deal the second card. 
				setTimeout(function(){
					//Draw a card from the deck
					deal_card = game.deck.draw();
					//Put the card in the dealers hand
					game.dealer_hand.drawCard(deal_card);
					//Let everyone know what the card is. 
					bot.action(config.channels[0],'deals '+myself+' '+deal_card.show_val+' of '+deal_card.suit+'.');
					//Deal the third card
					setTimeout(function(){
						//Draw the card from the deck
						deal_card = game.deck.draw();
						//Put the card in the players hand
						game.player_hand.drawCard(deal_card);
						//Let the player know what card they got.
						bot.action(config.channels[0],'deals '+from+' '+deal_card.show_val+' of '+deal_card.suit+'.');
						//At this point check if the player already busted {I don't think they can actually bust but I didn't come to this conclusion until after I wrote the code}
						if(game.player_hand.busted()==true)
						{
							//if the player busts, close up teh game
							//Set the game object to nothing
							game = '';
							//Reset the game_phase
							game_phase=0;
							//Set the current player to nothing. 
							player='';
							//Delay a bit then send out the message that they have lost
							setTimeout(function(){
								//Send the loser a message telling them how much they lost. 
								bot.say(config.channels[0],from+', you have busted and lost your bet of $'+bet);
							},message_delay);
							//Get out of this function.
							return false;
						}
						//delay a bit then deal out the last card to the dealer.
						setTimeout(function(){
							//draw card from the deck
							deal_card = game.deck.draw();
							//place them in the dealers hand
							game.dealer_hand.drawCard(deal_card);
							//Tell the people what was dealt to to the dealer. 
							bot.action(config.channels[0],'deals '+myself+' '+deal_card.show_val+' of '+deal_card.suit+'.');
							//Time to see if the dealer busted.
							if(game.dealer_hand.busted()==true)
							{
								//Looks like the user has won. 
								//Clear the game object
								game='';
								//Return the game_phase to 0
								game_phase=0;
								//reset the player
								player='';
								//Set a delay before speaking
								setTimeout(function(){
									//Tell the user you busted. 
									bot.say(config.channels[0],'Well '+from+', it looks like I busted.');
									//wait a bit longer
									setTimeout(function(){
										//Payout the bet to the user
										payout_bet(from,bet); //give the user what they won.
										//Tell the user yougave them the money. 
										bot.action(config.channels[0],' gives '+from+' $'+bet);
									},message_delay); //PAYOUT BET
								}, message_delay); //DEALER BUST
							}else{
								//HA DEALER DIDN'T BUST. IT'S GAME TIME!!!
								setTimeout(function(){
									//Tell the people both the totals and give them the option to hit or stand
									bot.say(config.channels[0],'Well '+from+' it looks like you have a total of '+game.player_hand.total()+' and I have a total of '+game.dealer_hand.total()+'. Please say "hit" or "stand".');
									//change game_phase to 3
									game_phase=3;
									//turn on hold_phase
									hold_phase=true;
								},message_delay);
							} //End dealer bust if.
						},message_delay); //Deal card to dealer		
					},message_delay); //Deal card to player
				},message_delay); //Deal card to dealer
			},message_delay); //Deal card to player
		}else if(message_split[0].toLowerCase().substr(0,2)=='no'){
			//Lets back up a phase shall we?
			//change game_phase to 1
			game_phase=1;
			//turn on holdphase
			hold_phase=true;
			//Ask them how much they want to bet again.
			bot.say(config.channels[0],'Okay '+from+', how much would you like to bet then?');
		}
	}


	/*-------------------------HIT OR STAND-------------------------------*
	* Commands: "hit" or "stand"
	*
	* If the player hits deal them out another card. 
	* If they stand see if they beat the dealer, if not let them draw again. 
	*
	*---------------------------------------------------------------------*/	
	//Check fi game phase is 3, the player is correct and the hold_phase is off.
	if(game_phase==3 && from==player && hold_phase==false)
	{
		//See if the command is "hit"
		if(message_split[0].toLowerCase()=='hit')
		{
			//Draw a card from the deck for the player
			deal_card = game.deck.draw();
			//Put the card in the playershand
			game.player_hand.drawCard(deal_card);
			//Delay a bit and tell them what you dealt them
			setTimeout(function(){
				//Tell thee users what you dealt them. 
				bot.action(config.channels[0],'deals '+from+' '+deal_card.show_val+' of '+deal_card.suit+'.');
				//LETS SEE IF THE PLAYER BUSTED SHALL WE!?
				if(game.player_hand.busted()==true)
				{	
					//loops like the user busted, let's close up this game
					//Set the game object to nothing.
					game = '';
					//Set the game phase to 0
					game_phase=0;
					//Reset the player to nothing
					player='';
					//Wait a little bit longer
					setTimeout(function(){
						//Tell the user they lost and how much they lost
						bot.say(config.channels[0],from+', you have busted and lost your bet of $'+bet);
					},message_delay);
					//Return false to get out of this function.
					return false;
				}else{
					//if the player did not bust
					//Is the player hand above the dealer hand. 
					if(game.player_hand.total()>game.dealer_hand.total())
					{
						//Get teh dealer above the player one way or another. 
						finish_dealer_to_player(bot,config,function(){
							//Check if the dealer busted.
							if(game.dealer_hand.busted()==true)
							{
								//Well damn, looks like the user has one. Lets close up the game.
								//set game object to nothing.
								game='';
								//Set the game phase to 0
								game_phase=0;
								//Set the player to nothing. 
								player='';
								//Wait a bit and tell them you lost. 
								setTimeout(function(){
									//Tell the users you have lost, 
									bot.say(config.channels[0],'Well '+from+', it looks like I busted.');
									//Wait a bit, 
									setTimeout(function(){
										//Pay the user the money they won. 
										payout_bet(from,bet); //give the user what they won.
										//Inform teh user they have gotten more money. 
										bot.action(config.channels[0],' gives '+from+' $'+bet);
									},message_delay); //PAYOUT BET
								}, message_delay); //DEALER BUST
							}else{
								//HA DEALER DIDN'T BUST. IT'S GAME TIME!!!
								//Wait a little bit.
								setTimeout(function(){
									//Tell the user they have more options now. 
									bot.say(config.channels[0],'Well '+from+' it looks like you have a total of '+game.player_hand.total()+' and I have a total of '+game.dealer_hand.total()+'. Please say "hit" or "stand".');
									//Set the game_phase to 3
									game_phase=3;
									//turn on hold phase
									hold_phase=true;
								},message_delay);
							}
						})
					}
				} 
			},message_delay);
		//Check if the user is going to stand. 
		}else if(message_split[0].toLowerCase()=='stand') //LETS END THIS FOOL!
		{
			//Not sure why a user would stand when they are already losing but I am not going to complain if they want to make stupid choices. 
			if(game.dealer_hand.total()>game.player_hand.total())
			{
				//Lets close up this game. 
				//Set game object to nothing. 
				game = '';
				//Set game_phase to 0
				game_phase=0;
				//Reset player to nothing. 
				player='';
				//Wait a little bit. 
				setTimeout(function(){
					//Tell them they lost.
					bot.say(config.channels[0],"I guess you don't even want to try. Oh well I'll gladly keep your $"+bet);
				},message_delay);
				//Exit the function by returning false. 
				return false;
			}else{
				//if the dealer is lower than the player the dealer needs to draw until they are above them. 
				finish_dealer_to_player(bot,config,function(){
					//Check to see if the dealer busted. 
					if(game.dealer_hand.busted()==false)
					{
						//looks like the dealer is still good so the player lost. Lets close up the game. 
						//Set the game object ot nothing. 
						game = '';
						//Set the game_phase to 0
						game_phase=0;
						//Set the player to nothing. 
						player='';
						//Wait a little bit, 
						setTimeout(function(){
							//Tell them the dealer has won and how much they lost.
							bot.say(config.channels[0],from+', I have won with a total of '+game.dealer_hand.total()+', so you have lost your bet of $'+bet);
						},message_delay);
						//Okay lets get out of this function by returning false. 
						return false;
					}else{
						//Well crap the dealer busted so lets close up this game. 
						//Set the game object to nothing. 
						game='';
						//Set the game_phase to 0
						game_phase=0;
						//Set the player to nothing. 
						player='';
						//Wait a little bit.
						setTimeout(function(){
							//Tell the users that the dealer busted. 
							bot.say(config.channels[0],'Well '+from+', it looks like I busted.');
							//Wait a little bit.
							setTimeout(function(){
								//Payout the bet. 
								payout_bet(from,bet); //give the user what they won.
								//Tell the user you gave them the winning money. 
								bot.action(config.channels[0],' gives '+from+' $'+bet);
							},message_delay); //PAYOUT BET
						}, message_delay); //DEALER BUST



					}
				});
			}
		}
	}



	/*-------------------------END BLACKJACK-------------------------------*/
	command = message_split[0]+' '+message_split[1]+' '+message_split[2]
	command = command.toLowerCase();
	if(command==config.botName.toLowerCase()+', stop blackjack')
	{
		//kill game
		game='';
		//kill player
		player='';
		//Tell the group it's over. 
		bot.say(config.channels[0],'The blackjack game has ended.');
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

function payout_bet(to, amount, bot)
{
	cash.add(to,(amount*2));
}

function take_bet(to, amount)
{
	cash.remove(to,amount);
}

function finish_dealer_to_player(bot, config, callback)
{
	var game_card = game.deck.draw();
	game.dealer_hand.drawCard(game_card);
	setTimeout(function(){
		bot.action(config.channels[0],'deals herself '+game_card.show_val+' of '+game_card.suit+'.');
		if(game.dealer_hand.total()<game.player_hand.total())
		{
			finish_dealer_to_player(bot,config, callback);
		}else{
			callback();
		}
	})
}