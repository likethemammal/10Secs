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
                itemX: 7,
                itemY: 19,
                completed: false,
                text: 'because the dog ate your homework',
                renderScenery: function() {
                    console.log(this);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*5, h: Game.grid.tile.height*4}).atGrid(6, 18);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(5, 18);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(11, 18);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(10, 17);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(10, 17);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(5, 21);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(4, 21);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(5, 20);

                }
            },

            man: {
                name: 'man',
                gridX: 6,
                gridY: 8,
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

                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width*5, h: Game.grid.tile.height*3}).color('#A7A7A7').atGrid(4, 7);
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).color('#A7A7A7').atGrid(3, 7);
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).color('#A7A7A7').atGrid(3, 8);
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).color('#A7A7A7').atGrid(3, 8);
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).color('#A7A7A7').atGrid(8, 10);
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).color('#A7A7A7').atGrid(9, 9);

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
            },

            ufo: {
                name: 'ufo',
                gridX: 26,
                gridY: 7,
                sprite: '',
                itemName: 'Cow',
                itemX: 0,
                itemY: 14,
                completed: false,
                text: 'by sacrificing the cow',
                renderScenery: function() {

                    //Disaster related
                    Crafty.e('Solid, Color').color("#bfbfbf").attr({w: Game.grid.tile.width*6, h: Game.grid.tile.height*4}).atGrid(24, 7);
                    Crafty.e('Solid, Color').color("#bfbfbf").attr({w: Game.grid.tile.width*6, h: Game.grid.tile.height*3}).atGrid(26, 6);

                    Crafty.e('Solid, Image').image('assets/parking-lot.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*3}).atGrid(25, 7);
                    Crafty.e('Solid, Image').image('assets/parking-lot.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*4}).atGrid(27, 6);
                    Crafty.e('Solid, Image').image('assets/parking-lot.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*4}).atGrid(29, 6);

                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(31, 6);
                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(31, 7);
                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(27, 8);
                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(25, 10);

                    Crafty.e('Obstacle, Image').image('assets/extras/cars1.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(27, 8);
                    Crafty.e('Obstacle, Image').image('assets/extras/cars2.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(29, 8);
                    Crafty.e('Obstacle, Image').image('assets/extras/cars3.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(29, 6);
                    Crafty.e('Obstacle, Image').image('assets/extras/cars4.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(25, 9);


                    //Item related
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*6, h: Game.grid.tile.height*6}).atGrid(-3, 12);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(-4, 12);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(-4, 13);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(3, 13);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(1, 18);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(3, 15);

                    Crafty.e('Obstacle, Image').image("assets/extras/hay.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(1, 16);
                    Crafty.e('Obstacle, Image').image("assets/extras/hay.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(2, 15);
                    Crafty.e('Obstacle, Image').image("assets/extras/hay.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(-2, 16);

                    var barn = Crafty.e('Image, Obstacle').image("assets/extras/barn.png", "no-repeat").atGrid(-1, 11);

                    barn.collision([0,barn.h*3/4], [barn.w, barn.h*3/4], [barn.w,barn.h], [0,barn.h]);
                    barn.alpha = 1;
                    barn.z = 10;


                }
            }
        },

        origDisasters: {},

        victories: 0,

        timeElapsed: 0.0
    };

})();