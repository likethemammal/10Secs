(function() {

    Game = {

        grid: {
            width:  25,
            height: 15,
            tile: {
                width:  16,
                height: 16
            }
        },

        map: {
            width: 0,
            height: 0,
            multiplier: 2
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

            this.map.width = this.width()*this.map.multiplier;
            this.map.height = this.height()*this.map.multiplier;

            this.map.locationX = this.width()/this.map.multiplier*-1;
            this.map.locationY = this.height()/this.map.multiplier*-1;

            Crafty.init(this.width(), this.height());

            Crafty.bind('SceneChange', function(changeInfo) {
                if (changeInfo.oldScene !== changeInfo.newScene) {
                    App.trigger('sceneChange:' + changeInfo.oldScene);
                }
            });

            Crafty.background('#555');

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
                gridY: 17,
                sprite: '',
                itemName: 'Water',
                itemX: 4,
                itemY: 15,
                completed: false
            },

            homework: {
                name: 'homework',
                gridX: 25,
                gridY: -5,
                sprite: '',
                itemName: 'Dog',
                itemX: -5,
                itemY: 14,
                completed: false
            }
        },

        origDisasters: {},

        victories: 0
    };

    window.addEventListener('load', _.bind(Game.start, Game));

})();