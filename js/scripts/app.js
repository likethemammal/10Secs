(function(){

    App = {};

    App.StartMenu = Backbone.View.extend({

        el: '.menu-container',

        template: _.template($("#start-template").html()),

        events: {
            'click .start-btn': 'startGame'
        },

        initialize: function() {
            this.render();
        },

        render: function () {
            this.$el.html(this.template);
            Crafty.e('2D, DOM')
                .DOM('.start-btn')
                .attr({ x: Game.height()/2, y: Game.height()/2 - 24});
            return this;
        },

        startGame: function() {
            Crafty.scene('GameLoop');

            this.$el.children().remove();
        }
    });

    _.extend(App, Backbone.Events);

})();