(function(){

    App = {};

    App.init = function() {
        this.loadTemplates();
        window.addEventListener('load', _.bind(Game.start, Game));
    };

    App.timer = new Timer(100);

    App.templates = ['start', 'how-to', 'victory', 'round', 'game-over', 'game-ui', 'message'];

    App.loadTemplates = function() {
        var templates = App.templates;
        for (var i = 0; i < App.templates.length; i++) {
            var tmpl_dir = './templates';
            var tmpl_url = tmpl_dir + '/' + templates[i] + '.ejs';
            var tmpl_string = '';

            $.ajax({
                url: tmpl_url,
                method: 'GET',
                async: false,
                contentType: 'text',
                success: function (data) {
                    tmpl_string = data;
                }
            });

            $('head').append('<script id="' +
                templates[i] + '-template" type="text/template">' + tmpl_string + '<\/script>');
        }
    };

    App.init();

    App.StartMenu = Backbone.View.extend({

        el: '.menu-container',

        template: _.template($("#start-template").html()),

        events: {
            'click .start-btn': 'startGame',
            'click .how-to-btn': 'howTo'
        },

        initialize: function() {
            this.canStart = false;

            App.on('sceneChange:StartMenu', _.bind(this.removeUI, this));
            this.render();
        },

        render: function () {
            this.$el.html(this.template);
            this.animateMenu();
            return this;
        },

        animateMenu: function() {
            $('.website-btn').delay(300).animate({bottom: "10px"},{duration: 1000, specialEasing: {bottom: "easeOutBounce" }});
            $('.start-btn').delay(300).animate({right: "0"},{duration: 1000, specialEasing: {right: "easeOutBounce" }});
            $('.how-to-btn').delay(300).animate({left: "0"},{duration: 1000, specialEasing: {left: "easeOutBounce" }});
            $('.start-title').delay(300).animate({top: "-60px", width: '450px'},{duration: 1000, specialEasing: { top: "easeOutBounce", width: "easeOutBounce" }, complete: _.bind(function() {
                this.canStart = true;
            }, this)});
        },

        startGame: function() {
            if (this.canStart && !Game.started) {
                this.$el.children().remove();
                this.canStart = false;
                Game.started = true;
                Crafty.scene('GameLoop');
            }
        },

        howTo: function(){
            Crafty.scene('HowToMenu');
        },

        removeUI: function() {
            App.off('sceneChange:StartMenu', _.bind(this.removeUI, this));

            if (Game.scene !== 'HowToMenu') {
                this.$el.children().remove();
            }
        }
    });

    App.HowToMenu = Backbone.View.extend({

        el: '.menu-container',

        template: _.template($("#how-to-template").html()),

        events: {
            'click .back-ui-btn': 'back'
        },

        initialize: function() {
            this.canBack = false;
            App.on('sceneChange:HowToMenu', _.bind(this.removeUI, this));
            this.render();
        },

        render: function () {
            this.$el.html(this.template);
            this.animateMenu();
            return this;
        },

        animateMenu: function() {
            $('.back-ui-btn').animate({bottom: "10px"},{duration: 1000, specialEasing: {bottom: "easeOutBounce" }});
            $('.how-to-ui-container-right').animate({right: "0"},{duration: 1000, specialEasing: {right: "easeOutBounce" }});
            $('.how-to-ui-container-left').animate({left: "0"},{duration: 1000, specialEasing: {left: "easeOutBounce" }, complete: _.bind(function() {
                this.canBack = true;
            }, this)});
        },

        back: function() {
            if (this.canBack) {
                this.$el.children().remove();
                Crafty.scene('StartMenu');
                this.canBack = false;
            }
        },

        removeUI: function() {
            App.off('sceneChange:HowToMenu', _.bind(this.removeUI, this));
            if (Game.scene !== 'StartMenu') {
                this.$el.children().remove();
            }
        }
    });

    App.VictoryMenu = Backbone.View.extend({

        el: '.menu-container',

        template: _.template($("#victory-template").html()),

        initialize: function() {
            App.on('sceneChange:VictoryMenu', _.bind(this.removeUI, this));
            this.render();
        },

        render: function () {
            this.$el.html(this.template({text: "You've fixed all disasters and saved the world!", time: Math.floor(Game.timeElapsed*10)/10}));
            return this;
        },

        removeUI: function() {
            App.off('sceneChange:VictoryMenu', _.bind(this.removeUI, this));
            this.$el.children().remove();
        }
    });

    App.RoundMenu = Backbone.View.extend({

        el: '.menu-container',

        template: _.template($("#round-template").html()),

        initialize: function() {
            App.on('sceneChange:RoundMenu', _.bind(this.removeUI, this));
            this.render();
        },

        render: function () {
            var text = Game.disasters[Game.lastFinished].text;
            this.$el.html(this.template({text: "You survived this round " + text + ". Can you survive the next round?", item: Game.disasters[Game.lastFinished].itemName, disaster: Game.lastFinished}));
            return this;
        },

        removeUI: function() {
            App.off('sceneChange:RoundMenu', _.bind(this.removeUI, this));
            this.$el.children().remove();
        }
    });

    App.GameOverMenu = Backbone.View.extend({

        el: '.menu-container',

        template: _.template($("#game-over-template").html()),

        initialize: function() {
            App.on('sceneChange:GameOverMenu', _.bind(this.removeUI, this));
            this.render();
        },

        render: function () {
            this.$el.html(this.template({rounds: Game.victories, text: 'You should be faster at this. Suck less next time.', time: Math.floor(Game.timeElapsed*10)/10}));
            return this;
        },

        removeUI: function() {
            App.off('sceneChange:GameOverMenu', _.bind(this.removeUI, this));
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
            App.on('item:allowPickup', _.bind(this.allowPickup, this));
            App.on('item:disallowPickup', _.bind(this.disallowPickup, this));
            App.on('item:pickup', _.bind(this.setItemUI, this));
            App.on('item:drop', _.bind(this.unsetItemUI, this));

            App.on('disaster:allowFix', _.bind(this.allowFix, this));
            App.on('disaster:disallowFix', _.bind(this.disallowFix, this));

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
            App.off('item:allowPickup', _.bind(this.allowPickup, this));
            App.off('item:disallowPickup', _.bind(this.disallowPickup, this));
            App.off('item:pickup', _.bind(this.setItemUI, this));
            App.off('item:drop', _.bind(this.unsetItemUI, this));

            App.off('disaster:allowFix', _.bind(this.allowFix, this));
            App.off('disaster:disallowFix', _.bind(this.disallowFix, this));

            this.$el.children().remove();
        },

        renderMessage: function(message) {
            var messageView = new App.Message();
            messageView.text = message;

            messageView.render();
        },

        deleteMessage: function() {
            $('.message').remove();
        },

        setItemUI: function(item) {
            $('.current-item').children().show().attr('src', 'assets/items/' + item.toLowerCase() + '.png');
        },

        unsetItemUI: function(item) {
            $('.current-item').children().hide();
        },

        allowPickup: function(item) {
            var $indicator = $('.indicator');
            $indicator.show();
            if (!item) {
                $indicator.children().attr('src', 'assets/indicator-check.png');
            } else {
                $indicator.children().attr('src', 'assets/indicator-x.png');
            }
        },

        disallowPickup: function() {
            var $indicator = $('.indicator');
            $indicator.hide();
            $indicator.children().attr('src', '');
        },

        allowFix: function(canFix) {
            var $indicator = $('.indicator');
            $indicator.show();
            if (canFix) {
                $indicator.children().attr('src', 'assets/indicator-check.png');
            } else {
                $indicator.children().attr('src', 'assets/indicator-x.png');
            }

        },

        disallowFix: function() {
            var $indicator = $('.indicator');
            $indicator.hide();
            $indicator.children().attr('src', '');
        }

    });

    App.Message = Backbone.View.extend({
        el: '.ui-container',
        tagName: 'div',
        template: _.template($("#message-template").html()),

        render: function () {
            var $message = $('.message');
            if ($message.length) {
                $message.children().text(this.text);
                return this;
            } else {
                this.$el.prepend(this.template({message: this.text}));
                return this;
            }
        }
    });

    _.extend(App, Backbone.Events);

})();