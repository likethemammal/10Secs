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
                itemX: 20,
                itemY: 17,
                completed: false,
                text: 'by putting out the fire',
                renderScenery: function() {
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*12, h: Game.grid.tile.height*7}).atGrid(12, 14);

                    var barn = Crafty.e('Image, Obstacle').image("assets/extras/house.png", "no-repeat").atGrid(17, 14);

                    barn.collision([0,barn.h*3/4], [barn.w, barn.h*3/4], [barn.w,barn.h], [0,barn.h]);
                    barn.alpha = 1;
                    barn.z = 10;

                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/firewood.png", "no-repeat")
                        .atGrid(16, 17);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/firewood.png", "no-repeat")
                        .atGrid(19, 19);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/firewood.png", "no-repeat")
                        .atGrid(13, 18);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/firewood.png", "no-repeat")
                        .atGrid(23, 16);

                    var smk = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(13, 15);
                    var smk2 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(20, 14);
                    var smk3 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(19, 19);
                    smk.z = 10;
                    smk2.z = 10;
                    smk3.z = 10;
                }

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
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*12, h: Game.grid.tile.height*5}).atGrid(18, -5);

                    var manBuilding = Crafty.e('Image, Obstacle') .image("assets/extras/schoolhouse.png", "no-repeat").atGrid(20, -6);

                    manBuilding.collision([0,manBuilding.h*3/4], [manBuilding.w,manBuilding.h*3/4], [manBuilding.w,manBuilding.h], [0,manBuilding.h]);
                    manBuilding.alpha = 1;
                    manBuilding.z = 10;

                    var swing = Crafty.e('Image, Obstacle').image("assets/extras/swing.png", "no-repeat").atGrid(26, -4);

                    swing.collision([0,swing.h*3/4], [swing.w,swing.h*3/4], [swing.w,swing.h], [0,swing.h]);
                    swing.alpha = 1;
                    swing.z = 10;


                    //Dog Assets
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*5, h: Game.grid.tile.height*4}).atGrid(6, 18);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(5, 18);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(11, 18);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(10, 17);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(10, 17);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(5, 21);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(4, 21);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(5, 20);

                    Crafty.e('Image, Obstacle').image("assets/extras/bone.png", "no-repeat").atGrid(8, 18);
                    Crafty.e('Image, Obstacle').image("assets/extras/ball.png", "no-repeat").atGrid(9, 21);

                }
            },

            man: {
                name: 'man',
                gridX: 6,
                gridY: 8,
                sprite: '',
                itemName: 'Hippie',
                itemX: -6,
                itemY: 5,
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


                    //Item related
                    Crafty.e('Solid, Image').image("assets/background-grass2.png", "repeat").attr({w: Game.grid.tile.width*6, h: Game.grid.tile.height*6}).atGrid(-9, 3);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(-5, 6);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(-4, 5);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(-4, 8);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(-9, 7);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*2, h: Game.grid.tile.height}).atGrid(-6, 9);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*4}).atGrid(-10, 3);

                    Crafty.e('Solid, Image').image("assets/extras/carpet.png", "no-repeat").atGrid(-8, 4);
                    var smk = Crafty.e('Solid, Image').image("assets/extras/smoke.png", "no-repeat").atGrid(-7, 2);
                    var smk2 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(-5, 4);
                    var smk3 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(-10, 6);

                    smk.z = 10;
                    smk2.z = 10;
                    smk3.z = 10;

                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/bong.png", "no-repeat")
                        .atGrid(-7, 4);


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
            },

            tnt: {
                name: 'tnt',
                gridX: 5,
                gridY: 1,
                sprite: '',
                itemName: 'Scissors',
                itemX: 13,
                itemY: 1,
                completed: false,
                text: "by cutting the tnt's fuse",
                renderScenery: function() {

                    //Disaster related
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*6}).color('#686F76').atGrid(1, -3);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(2, -1);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(2, -3);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*4}).atGrid(9, -2);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(8, -3);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(10, 1);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(4, -1);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "repeat").attr({w: Game.grid.tile.width*4, h: Game.grid.tile.height}).atGrid(1, 2);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(6, 2);

                    var manBuilding = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(2, -2);
                    manBuilding.collision([0,manBuilding.h*3/4], [manBuilding.w,manBuilding.h*3/4], [manBuilding.w,manBuilding.h], [0,manBuilding.h]);
                    manBuilding.z = 10;

                    var manBuilding2 = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(6, -3);
                    manBuilding2.collision([0,manBuilding.h*3/4], [manBuilding.w,manBuilding.h*3/4], [manBuilding.w,manBuilding.h], [0,manBuilding.h]);
                    manBuilding2.z = 10;

                    var manBuilding3 = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(7, -1);
                    manBuilding3.collision([0,manBuilding.h*3/4], [manBuilding.w,manBuilding.h*3/4], [manBuilding.w,manBuilding.h], [0,manBuilding.h]);
                    manBuilding3.z = 10;

                    var manBuilding4 = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(3, -4);
                    manBuilding4.collision([0,manBuilding.h*3/4], [manBuilding.w,manBuilding.h*3/4], [manBuilding.w,manBuilding.h], [0,manBuilding.h]);
                    manBuilding4.z = 9;

                    Crafty.e('Obstacle, Image').image('assets/extras/rock2.png', "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(5, 0);
                    Crafty.e('Obstacle, Image').image('assets/extras/rock2.png', "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(6, 1);
                    Crafty.e('Obstacle, Image').image('assets/extras/rock2.png', "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(6, -2);


                    //Item related
                    var wall = Crafty.e('Obstacle, Color').attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*4}).color('#9DA76B').atGrid(10, -4);
                    wall.collision([0,0],[0,wall.h - Game.grid.tile.height/2],[wall.w,wall.h - Game.grid.tile.height/2],[wall.w,0]);

                    Crafty.e('Obstacle, Image').image("assets/extras/appliances.png", "no-repeat").atGrid(10, -4);
                    Crafty.e('Obstacle, Image').image("assets/extras/cabinets.png", "no-repeat").atGrid(13, -4);
                    Crafty.e('Obstacle, Image').image("assets/extras/cabinets.png", "no-repeat").atGrid(16, -4);

                    Crafty.e('Solid, Image').image("assets/extras/tile.png", "repeat").attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*4}).atGrid(10, 0);
                    Crafty.e('Solid, Image').image("assets/extras/puddle.png", "no-repeat").atGrid(15, 1);
                }
            }
        },

        origDisasters: {},

        victories: 0,

        timeElapsed: 0.0
    };

})();