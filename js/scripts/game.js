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

        map: {
            width: 0,
            height: 0,
            multiplier: 2,
            locationX: 0,
            locationY: 0
        },

        player: {
            speed: 3,
            locationX: 0,
            locationY: 0
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
            this.timeElapsed = 0.0;
        },

        disasters: {

            fire: {
                name: 'fire',
                gridX: 15,
                gridY: 17,
                sprite: '',
                itemName: 'Extinguisher',
                itemX: 4,
                itemY: 15,
                completed: false,
                text: 'by putting out the fire'
            },

            homework: {
                name: 'homework',
                gridX: 25,
                gridY: -5,
                sprite: '',
                itemName: 'Dog',
                itemX: -5,
                itemY: 14,
                completed: false,
                text: 'because the dog ate your homework'
            },

            man: {
                name: 'man',
                gridX: 6,
                gridY: 9,
                sprite: '',
                itemName: 'Hippie',
                itemX: 6,
                itemY: 10,
                completed: false,
                text: 'because the hippie beat The Man',
                renderScenery: function() {
                    var manBuilding = Crafty.e('Image, Obstacle')
                        .image("assets/extras/man-building.png", "no-repeat")
                        .atGrid(5, 5);

                    manBuilding.collision([0,manBuilding.h*3/4], [manBuilding.w,manBuilding.h*3/4], [manBuilding.w,manBuilding.h], [0,manBuilding.h]);
                    manBuilding.alpha = 1;
                    manBuilding.z = 10;

                    Crafty.e('Solid, Color')
                        .attr({w: Game.grid.tile.width*5, h: Game.grid.tile.height*3})
                        .color('#A7A7A7')
                        .atGrid(4, 7);

                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(4, 8);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(5, 9);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(7, 9);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(8, 8);
                }
            }
        },

        origDisasters: {},

        victories: 0,

        timeElapsed: 0.0
    };

})();