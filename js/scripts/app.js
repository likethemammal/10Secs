(function(){

    App = {};

    App.StartMenu = Backbone.View.extend({

        el: '.menu-container',

        template: _.template($("#start-template").html()),

        events: {
            'click .start-btn': 'startGame',
            'click .how-to-btn': 'howTo'
        },

        initialize: function() {
            App.on('sceneChange:StartMenu', _.bind(this.removeUI, this));
            this.render();
        },

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        startGame: function() {
            Crafty.scene('GameLoop');
        },

        howTo: function(){
            console.log('How to menu launched');
        },

        removeUI: function() {
            App.off('sceneChange:StartMenu', _.bind(this.removeUI, this));
            this.$el.children().remove();
        }
    });

    App.GameUI = Backbone.View.extend({

        el: '.ui-container',

        template: _.template($("#game-ui-template").html()),

        initialize: function() {
            App.on('sceneChange:GameLoop', _.bind(this.removeUI, this));
            App.on('message:create', _.bind(this.renderMessage, this));
            App.on('message:delete', _.bind(this.deleteMessage, this));
            App.on('item:pickup', _.bind(this.setItemUI, this));
            App.on('item:drop', _.bind(this.unsetItemUI, this));
            this.render();
        },

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        removeUI: function() {
            App.off('sceneChange:GameLoop', _.bind(this.removeUI, this));
            App.off('message:create', _.bind(this.renderMessage, this));
            App.off('message:delete', _.bind(this.deleteMessage, this));
            App.off('item:pickup', _.bind(this.setItemUI, this));
            App.off('item:drop', _.bind(this.unsetItemUI, this));
            this.$el.children().remove();
        },

        renderMessage: function(message) {
            var messageView = new App.Message();
            messageView.text = message;

            messageView.render();

            delete messageView;
        },

        deleteMessage: function() {
            $('.message').remove();
        },

        setItemUI: function(item) {
            $('.item').children().attr('src', '/assets/items/' + item + '/.png');
        },

        unsetItemUI: function(item, x, y) {
            $('.item').children().attr('src', '');
        }

    });

    App.Message = Backbone.View.extend({
        el: '.ui-container',
        tagName: 'div',
        template: _.template($("#message-template").html()),

        render: function () {
            if ($('.message').length) {
                $('.message').text(this.text);
                return this;
            } else {
                this.$el.prepend(this.template({message: this.text}));
                return this;
            }
        }
    });

    _.extend(App, Backbone.Events);

})();