var options = {numberOfDecks:2};

function Hand(){
	this.cards = [];
}

Hand.prototype.drawCard = function(card){
	this.cards.push(card);
}
Hand.prototype.total = function(){
	var total = 0;
	var ace_count=0;
	for(var i=0;i<this.cards.length;i++){
		if(card_is_ace(this.cards[i])==true){ace_count++;}
		total+= this.cards[i].value;
	}

	if(ace_count>0 && total<11)
	{
		total+=10;
	}
	return total;
}

Hand.prototype.busted = function(){
	if(this.total()>21)
	{
		//Busted
		return true;
	}else{
		//Still Good.
		return false
	}
}
function card_is_ace(card)
{
	if(card.show_val=='Ace')
	{
		return true;
	}else{
		return false;
	}
}

function Card(show_val, suit, value)
{
	this.show_val = show_val;
	this.suit = suit;
	this.value = value;
}
function generateDeck(numberOfDecks)
{
	var card_vals = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
	var suits = ['Hearts','Diamonds','Clubs','Spades'];
	var deck = [];

	for(var i=0; i<numberOfDecks;i++) //Add the amount of decks.
	{
		for(var s=0;s<card_vals.length;s++) //Loop through the different cards. 
		{
			for(var t=0;t<suits.length;t++)
			{
				deck.push(new Card(card_vals[s], suits[t], (s<10 ? s+1 : 10)));
			}
		}
	}
	return deck;
}

function Deck(){
	this.deckcards = generateDeck(options.numberOfDecks);
}
Deck.prototype.draw = function(){
	var card = this.deckcards.pop();
	return card;
}
Deck.prototype.shuffle = function(){
	var s;
	var temp;
	var array = this.deckcards;
	for(var i=array.length-1; i>0;i--)
	{
		s = Math.floor(Math.random() * (i-1));
		temp = array[i];
		array[i]=array[s];
		array[s]=temp;
	}
	this.deckcards = array;
};
exports.Game = function(){
	this.deck = new Deck();
	this.player_hand = new Hand();
	this.dealer_hand = new Hand();
}