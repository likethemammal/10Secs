(function() {

    Game = {

        grid: {
            width:  25,
            height: 15,
            tile: {
                width:  32,
                height: 32
            }
        },

        width: function() {
            return this.grid.width * this.grid.tile.width;
        },

        height: function() {
            return this.grid.height * this.grid.tile.height;
        },

        toGrid: function(pixel) {
            return Math.floor(pixel/this.grid.tile.width);
        },

        start: function() {

            this.origDisasters = $.extend(true, {}, this.disasters);

            Crafty.init(this.width(), this.height());

            Crafty.bind('SceneChange', function(changeInfo) {
                if (changeInfo.oldScene !== changeInfo.newScene) {
                    App.trigger('sceneChange:' + changeInfo.oldScene);
                }
            });

            Crafty.background('#F77F00');

            Crafty.scene('Loading');
        },

        reset: function() {
            this.disasters = $.extend(true, {}, this.origDisasters);
            this.victories = 0;
        },

        disasters: {
            oil: {
                name: 'oil',
                gridX: 5,
                gridY: 9,
                sprite: '',
                itemName: 'Hammer',
                itemX: 0,
                itemY: 5,
                completed: false
            },

            fire: {
                name: 'fire',
                gridX: 15,
                gridY: 23,
                sprite: '',
                itemName: 'Water',
                itemX: 4,
                itemY: 15,
                completed: false
            }
        },

        origDisasters: {},

        victories: 0
    };

    window.addEventListener('load', _.bind(Game.start, Game));

})();