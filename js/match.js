(function($){
    var Card = Backbone.Model.extend({
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
        'click' : 'flip'
       },
       initialize: function(){
        _.bindAll(this, 'render','flip');
       },
       render: function(){
            $(this.el).html('<span>'+this.model.attributes.number+'</span>');
            return this;
       },
       flip: function(){
        if (!deckView.card1) {
            deckView.card1 = this;
        }else{
            if (this.model.attributes.number == deckView.card1.model.attributes.number) {
                $(deckView.card1.el).hide();
                $(this.el).hide();
                if (!(--deckView.remainingCards)) {
                     console.log('You win');
                     return;
                 }
            }
            deckView.card1 = null;
        }
       }
    });
    var DeckView = Backbone.View.extend({
        el: $('body'),
        
        events:{
            'click #newGame' : 'newGame'    
        },
        
        initialize: function(){
            _.bindAll(this,'render','newGame','addCard');
            this.collection = new CardDeck();
            this.collection.bind('add',this.addCard);
            this.card1=null;
            this.remainingCards= 5;
            this.render();
        },
        render: function(){
            $(this.el).append('<button id="newGame">Start new game</button><section id="card-container"></section>');
        },
        newGame: function(){
            $('#card-container').html('');
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
