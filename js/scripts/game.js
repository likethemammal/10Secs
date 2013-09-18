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
                gridY: 16,
                sprite: '',
                itemName: 'Extinguisher',
                itemX: 20,
                itemY: 16,
                completed: false,
                text: 'by putting out the fire',
                renderScenery: function() {
                    var disX = this.gridX,
                        disY = this.gridY;

                    //Disaster related 15, 16
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*12, h: Game.grid.tile.height*7}).atGrid(disX - 3, disY - 3);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height}).atGrid(disX - 2, disY + 4);

                    var house = Crafty.e('Image, Obstacle').image("assets/extras/house.png", "no-repeat").atGrid(disX + 2, disY - 3);
                    house.collision([0,house.h*3/4], [house.w, house.h*3/4], [house.w,house.h], [0,house.h]);
                    house.z = 10;

                    var wood = Crafty.e('Image, Obstacle').image("assets/extras/firewood.png", "no-repeat").atGrid(disX + 1, disY);
                    var wood2 = Crafty.e('Image, Obstacle').image("assets/extras/firewood.png", "no-repeat").atGrid(disX + 4, disY + 2);
                    var wood3 = Crafty.e('Image, Obstacle').image("assets/extras/firewood.png", "no-repeat").atGrid(disX - 2, disY + 1);
                    var wood4 = Crafty.e('Image, Obstacle').image("assets/extras/firewood.png", "no-repeat").atGrid(disX + 8, disY - 1);

                    wood.z = 9;
                    wood2.z = 9;
                    wood3.z = 9;
                    wood4.z = 9;

                    var smk = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(disX - 2, disY - 2);
                    var smk2 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(disX + 5, disY - 3);
                    var smk3 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(disX + 4, disY + 2);
                    smk.z = 10;
                    smk2.z = 10;
                    smk3.z = 10;
                }
            },

            homework: {
                name: 'homework',
                gridX: 28,
                gridY: 10,
                sprite: '',
                itemName: 'Dog',
                itemX: 7,
                itemY: 16,
                completed: false,
                text: 'because the dog ate your homework',
                renderScenery: function() {
                    var disX = this.gridX,
                        disY = this.gridY,
                        itemX = this.itemX,
                        itemY = this.itemY;

                    //Disaster related 28, 10
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*12, h: Game.grid.tile.height*7}).atGrid(disX - 7, disY);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*6, h: Game.grid.tile.height*2}).atGrid(disX - 5, disY + 7);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX - 8, disY);

                    var school = Crafty.e('Image, Obstacle') .image("assets/extras/schoolhouse.png", "no-repeat").atGrid(disX - 5, disY - 1);
                    school.collision([0,school.h*3/4], [school.w,school.h*3/4], [school.w,school.h], [0,school.h]);
                    school.z = 10;

                    var swing = Crafty.e('Image, Obstacle').image("assets/extras/swing.png", "no-repeat").atGrid(disX + 1, disY + 2);
                    swing.collision([0,swing.h*3/4], [swing.w,swing.h*3/4], [swing.w,swing.h], [0,swing.h]);
                    swing.z = 10;

                    //Item related 7, 15
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*6}).atGrid(itemX - 5, itemY - 3);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*7, h: Game.grid.tile.height}).atGrid(itemX - 3, itemY + 3);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*3, h: Game.grid.tile.height}).atGrid(itemX + 1, itemY - 4);

                    Crafty.e('Image, Obstacle').image("assets/extras/bone.png", "no-repeat").atGrid(itemX + 3, itemY - 2);
                    Crafty.e('Image, Obstacle').image("assets/extras/ball.png", "no-repeat").atGrid(itemX + 2, itemY + 2);

                }
            },

            man: {
                name: 'man',
                gridX: 26,
                gridY: 3,
                sprite: '',
                itemName: 'Hippie',
                itemX: 5,
                itemY: 11,
                completed: false,
                text: 'because the hippie beat The Man',
                renderScenery: function() {
                    var disX = this.gridX,
                        disY = this.gridY,
                        itemX = this.itemX,
                        itemY = this.itemY;

                    //Disaster related 26, 3
                    var building = Crafty.e('Image, Obstacle').image("assets/extras/man-building.png", "no-repeat").atGrid(disX - 1, disY - 4);
                    building.collision([0,building.h*3/4], [building.w,building.h*3/4], [building.w,building.h], [0,building.h]);
                    building.z = 10;

                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width*9, h: Game.grid.tile.height*7}).color('#A7A7A7').atGrid(disX - 4, disY - 4);
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width, h: Game.grid.tile.height*2}).color('#A7A7A7').atGrid(disX - 5, disY);

                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(disX - 2, disY - 1);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(disX - 1, disY);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(disX + 1, disY);
                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/money-bag.png", "no-repeat")
                        .atGrid(disX + 2, disY - 1);


                    //Item related 5, 11
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*7, h: Game.grid.tile.height*6}).atGrid(itemX - 4, itemY - 2);
                    Crafty.e('Solid, Image').image("assets/background-grass2.png", "repeat").attr({w: Game.grid.tile.width*7, h: Game.grid.tile.height}).atGrid(itemX - 4, itemY - 3);
                    Crafty.e('Solid, Image').image("assets/background-grass2.png", "repeat").attr({w: Game.grid.tile.width*8, h: Game.grid.tile.height}).atGrid(itemX - 5, itemY - 1);
                    Crafty.e('Solid, Image').image("assets/background-grass2.png", "repeat").attr({w: Game.grid.tile.width*7, h: Game.grid.tile.height}).atGrid(itemX - 4, itemY + 1);
                    Crafty.e('Solid, Image').image("assets/background-grass2.png", "repeat").attr({w: Game.grid.tile.width*8, h: Game.grid.tile.height}).atGrid(itemX - 4, itemY + 3);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX - 5, itemY - 2);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX + 3, itemY);

                    Crafty.e('Solid, Image').image("assets/extras/carpet.png", "no-repeat").atGrid(itemX - 2, itemY - 1);
                    var smk = Crafty.e('Solid, Image').image("assets/extras/smoke.png", "no-repeat").atGrid(itemX - 1, itemY - 3);
                    var smk2 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(itemX + 1, itemY - 1);
                    var smk3 = Crafty.e('Solid, Image').image("assets/extras/smoke2.png", "no-repeat").atGrid(itemX - 4, itemY - 1);

                    smk.z = 10;
                    smk2.z = 10;
                    smk3.z = 10;

                    Crafty.e('Image, Obstacle')
                        .image("assets/extras/bong.png", "no-repeat")
                        .atGrid(itemX - 1, itemY - 1);

                }
            },

            ufo: {
                name: 'ufo',
                gridX: 26,
                gridY: 7,
                sprite: '',
                itemName: 'Cow',
                itemX: 4,
                itemY: 4,
                completed: false,
                text: 'by sacrificing the cow',
                renderScenery: function() {
                    var disX = this.gridX,
                        disY = this.gridY,
                        itemX = this.itemX,
                        itemY = this.itemY;

                    //Disaster related 26, 7
                    Crafty.e('Solid, Color').color("#bfbfbf").attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*5}).atGrid(disX - 4, disY - 2);

                    Crafty.e('Solid, Image').image('assets/parking-lot.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*5}).atGrid(disX - 3, disY - 2);
                    Crafty.e('Solid, Image').image('assets/parking-lot.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*5}).atGrid(disX - 1, disY - 2);
                    Crafty.e('Solid, Image').image('assets/parking-lot.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*5}).atGrid(disX + 1, disY - 2);
                    Crafty.e('Solid, Image').image('assets/parking-lot.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*5}).atGrid(disX + 3, disY - 2);

                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 5, disY - 1);
                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 5, disY);
                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 1, disY + 1);
                    Crafty.e('Solid, Image').image('assets/parking-cracked.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX - 1, disY + 1);

                    Crafty.e('Obstacle, Image').image('assets/extras/cars1.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 1, disY + 1);
                    Crafty.e('Obstacle, Image').image('assets/extras/cars2.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 3, disY + 1);
                    Crafty.e('Obstacle, Image').image('assets/extras/cars3.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 3, disY - 1);
                    Crafty.e('Obstacle, Image').image('assets/extras/cars4.png', "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX - 1, disY + 2);

                    //Item related 4, 5
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width*6, h: Game.grid.tile.height*6}).atGrid(itemX - 3, itemY - 2);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX - 4, itemY - 2);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX - 4, itemY - 1);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX + 3, itemY - 1);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX + 1, itemY + 4);
                    Crafty.e('Solid, Image').image("assets/background-grass.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX + 3, itemY + 1);

                    Crafty.e('Obstacle, Image').image("assets/extras/hay.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX + 1, itemY + 2);
                    Crafty.e('Obstacle, Image').image("assets/extras/hay.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX + 2, itemY + 1);
                    Crafty.e('Obstacle, Image').image("assets/extras/hay.png", "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(itemX - 2, itemY + 2);

                    var barn = Crafty.e('Image, Obstacle').image("assets/extras/barn.png", "no-repeat").atGrid(itemX - 1, itemY - 3);
                    barn.collision([0,barn.h*3/4], [barn.w, barn.h*3/4], [barn.w,barn.h], [0,barn.h]);
                    barn.z = 10;

                }
            },

            tnt: {
                name: 'tnt',
                gridX: 16,
                gridY: 1,
                sprite: '',
                itemName: 'Scissors',
                itemX: -7,
                itemY: -3,
                completed: false,
                text: "by cutting the tnt's fuse",
                renderScenery: function() {
                    var disX = this.gridX,
                        disY = this.gridY,
                        itemX = this.itemX,
                        itemY = this.itemY;

                    //Disaster related 17, 1
                    Crafty.e('Solid, Color').attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*6}).color('#686F76').atGrid(disX - 4, disY - 4);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(disX - 3, disY - 2);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(disX - 3, disY - 4);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height*4}).atGrid(disX + 4, disY - 3);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(disX + 3, disY - 4);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(disX + 5, disY);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(disX - 1, disY - 2);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "repeat").attr({w: Game.grid.tile.width*4, h: Game.grid.tile.height}).atGrid(disX - 4, disY + 1);
                    Crafty.e('Solid, Image').image("assets/background-rocks.png", "no-repeat").atGrid(disX + 1, disY + 1);

                    Crafty.e('Solid, Image').image("assets/extras/wick.png", "no-repeat").atGrid(disX, disY);

                    var rock = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(disX - 3, disY - 3);
                    rock.collision([0,rock.h*3/4], [rock.w,rock.h*3/4], [rock.w,rock.h], [0,rock.h]);
                    rock.z = 10;

                    var rock2 = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(disX + 1, disY - 4);
                    rock2.collision([0,rock2.h*3/4], [rock2.w,rock2.h*3/4], [rock2.w,rock2.h], [0,rock2.h]);
                    rock2.z = 10;

                    var rock3 = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(disX + 2, disY - 2);
                    rock3.collision([0,rock3.h*3/4], [rock3.w,rock3.h*3/4], [rock3.w,rock3.h], [0,rock3.h]);
                    rock3.z = 10;

                    var rock4 = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(disX - 2, disY - 5);
                    rock4.collision([0,rock4.h*3/4], [rock4.w,rock4.h*3/4], [rock4.w,rock4.h], [0,rock4.h]);
                    rock4.z = 9;

                    var rock5 = Crafty.e('Image, Obstacle').image("assets/extras/rock.png", "no-repeat").atGrid(disX + 4, disY - 1);
                    rock5.collision([0,rock4.h*3/4], [rock4.w,rock4.h*3/4], [rock4.w,rock4.h], [0,rock4.h]);
                    rock5.z = 11;

                    Crafty.e('Obstacle, Image').image('assets/extras/rock2.png', "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX, disY - 1);
                    Crafty.e('Obstacle, Image').image('assets/extras/rock2.png', "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 1, disY);
                    Crafty.e('Obstacle, Image').image('assets/extras/rock2.png', "no-repeat").attr({w: Game.grid.tile.width, h: Game.grid.tile.height}).atGrid(disX + 1, disY - 3);


                    //Item related -9, -2
                    var wall = Crafty.e('Obstacle, Color').attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*3}).color('#9DA76B').atGrid(itemX - 3, itemY - 4);
                    wall.collision([0,0],[0,wall.h - Game.grid.tile.height/2],[wall.w,wall.h - Game.grid.tile.height/2],[wall.w,0]);

                    Crafty.e('Obstacle, Image').image("assets/extras/appliances.png", "no-repeat").atGrid(itemX - 3, itemY - 5);
                    Crafty.e('Obstacle, Image').image("assets/extras/cabinets.png", "no-repeat").atGrid(itemX, itemY - 5);
                    Crafty.e('Obstacle, Image').image("assets/extras/cabinets.png", "no-repeat").atGrid(itemX + 3, itemY - 5);

                    Crafty.e('Solid, Image').image("assets/extras/tile.png", "repeat").attr({w: Game.grid.tile.width*10, h: Game.grid.tile.height*4}).atGrid(itemX - 3, itemY - 1);
                    Crafty.e('Solid, Image').image("assets/extras/puddle.png", "no-repeat").atGrid(itemX + 2, itemY);
                }
            }
        },

        origDisasters: {},

        victories: 0,

        timeElapsed: 0.0
    };

})();