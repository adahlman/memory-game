(function($){
    var Card = Backbone.Model.extend({
        defaults:{
          flipped: false  
        },
        set: function(attributes,options){
            Backbone.Model.prototype.set.apply(this, arguments);
        }
    });
    var CardDeck = Backbone.Collection.extend({
        model: Card
    });
    var CardView = Backbone.View.extend({
       tagName: 'article',
       className:'card',
       events: {
        'click' : 'flip',
        'webkitTransitionEnd': 'trans',
        'transitionend': 'trans',
        'msTransitionEnd' : 'trans'
       },
       initialize: function(){
        _.bindAll(this, 'render','flip','clearCard');
       },
       render: function(){
            $(this.el).html('<section class="flip-card"><article class="front"></article><article class="back"></article></section>');
            return this;
       },
       flip: function(){
            // if a card is already flipped or an animation is in progress, do nothing
            if (this.model.get('flipped') || deckView.progress) {
                return;
            }
            // flip the card and show the image behind
            $(this.el).addClass('flipped').children().children('.back').css({'background-image': 'url('+ deckView.imagebase + deckView.cards[this.model.attributes.number - 1]+')'});
            // animation started
            deckView.progress = true;
            // if this is the first card of the pair we have selected, set it to card1
            if (!deckView.card1) {
                deckView.card1 = this;
            }else{
                // are the first and second cards we have selected the same
                if (this.model.attributes.number == deckView.card1.model.attributes.number) {
                    // if no cards are remaining, the game is over
                    if (!(--deckView.remainingCards)) {
                         alert('You win');
                         return;
                     }
                }else{
                    // no match so reset selected cards
                    var curr = this;
                    var x = deckView.card1;
                    deckView.progress = true;
                    // pause so player has a chance to see
                    setTimeout(function(){
                      curr.clearCard();
                      x.clearCard();
                      }, 1000);
                }
                // unset card1 for next selection
                deckView.card1 = null;
            }
       },
       trans: function(){
        // at end of animation if card is flipped back over, get rid of face image and reset flipped property
        if (this.model.get('flipped')) {
            $(this.el).children().children('.back').css({'background-image':''});
            this.model.set({flipped: false});
        }else{
            // card is flipped and waiting for match or completed
            this.model.set({flipped: true});
        }
        // animation is done
        deckView.progress = false;
       },
       clearCard: function(){
        // flip card back over
        $(this.el).removeClass('flipped');
        deckView.progress = true;

       }
    });
    var DeckView = Backbone.View.extend({
        el: $('body'),
        
        events:{
            'click #newGame' : 'newGame'    
        },
        
        initialize: function(){
            _.bindAll(this,'render','newGame','addCard', 'test');
            this.collection = new CardDeck();
            this.collection.bind('add',this.addCard);
            this.imagebase = 'https://playingcardcollector.files.wordpress.com/2013/02/playing_cards_by_mushfacecomics_';
            this.cards = [];
            this.render();
        },
        render: function(){
            //this.test();
            $(this.el).append('<button id="newGame">Start new game</button><section id="card-container" class="clearfix"></section>');
        },
        test:function(){
            //console.log(this.cards)
        },
        newGame: function(){
            $('#card-container').html('');
            this.collection.reset();
            this.remainingCards= 6;
            this.card1=null;
            this.progress = false;
            this.cards.length = 0;
            var deckOptions = ['ace_of_spades.jpg','jack_of_spades.jpg','king_of_clubss.jpg','jack_of_hearts.jpg','jack_of_clubs.jpg','queen_of_diamonds.jpg',
                          'jack_of_diamonds.jpg','king_of_hearts.jpg','king_of_spades.jpg','king_of_diamonds.jpg', 'queen_of_spades.jpg',
                          'queen_of_hearts.jpg', 'queen_of_clubs.jpg'
                          ];
            // randomly select cards from the deck of availanble cards based on the value of remainingCards
            while(this.cards.length < this.remainingCards){
                var random = Math.floor(Math.random()*deckOptions.length);
                if (this.cards.indexOf(deckOptions[random]) < 0) {
                    this.cards.push(deckOptions[random]);
                }
            }
            // create a pair for every card in our deck
            for(var i = 1; i <= this.remainingCards; i++){
                for(var j =0; j < 2; j++){
                    var card = new Card({number: i});
                    this.collection.add(card);  
                }
            }
            // mix up list
            for(var i = 0; i <= $('#card-container').children().length; i++){
               $( $('#card-container').children()[Math.floor(Math.random()*i)]).appendTo($('#card-container'));
            }
        },
        addCard: function(card){
            var cardView = new CardView({
                model: card
            });
            $('#card-container', this.el).append(cardView.render().el);
        }
    });
    var deckView = new DeckView();
})(jQuery);
