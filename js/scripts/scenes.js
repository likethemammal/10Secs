(function(){

    Crafty.scene('GameLoop', function() {

        Crafty.e('AnimationObject').atGrid(Game.toGrid(Game.width()/2), Game.toGrid(Game.height()/2));
        Crafty.e('GrassBackground').atGrid(Game.toGrid(Game.map.locationX*3), Game.toGrid(Game.map.locationY*3));
        Crafty.e('Background').atGrid(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.locationY));

        renderWalls();

        var timeElapsed = 0;

        App.timer.every('1 second', function () {
            timeElapsed++;

            $('.timer').children().text("Timer: " + (10 - timeElapsed));

            if (timeElapsed >= 10) {
                timeElapsed = 0;

                App.timer.stop();
                App.timer.reset();
                App.timer.clear();

                Crafty.scene('GameOverMenu');
            }
        });

        App.timer.every('100 milliseconds', function () {
            Game.timeElapsed += 0.1;
        });

        renderGameObjects();

        Crafty.e('Player').atGrid(Game.toGrid(Game.width()/2), Game.toGrid(Game.height()/2));

        new App.GameUI();

        App.timer.start();

        this.bind('WinRound', _.bind(function(disaster) {
            Game.disasters[disaster].completed = true;
            Game.lastFinished = disaster;
            Game.victories++;

            App.timer.stop();
            App.timer.reset();
            App.timer.clear();

            if (Game.victories >= Object.keys(Game.disasters).length) {
                Crafty.scene('VictoryMenu');
            } else {
                Crafty.scene('RoundMenu');
            }

        }, this));

    }, function() {
        this.unbind('WinRound');
    });

    Crafty.scene('VictoryMenu', function() {
        var delay = true;
        Game.started = false;

        App.menu = new App.VictoryMenu();

        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function(event) {
            if (!delay && event.key === 32) {
                    Game.reset();
                    this.unbind('KeyDown');
                    Crafty.scene('Loading');
             }
        });

    }, function() {

        this.unbind('KeyDown');

    });

    Crafty.scene('GameOverMenu', function() {
        var delay = true;
        Game.started = false;

        App.menu = new App.GameOverMenu();

        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function(event) {
            if (!delay && event.key === 32) {
                Game.reset();
                this.unbind('KeyDown');
                Crafty.scene('Loading');
            }
        });

    }, function() {

        this.unbind('KeyDown');

    });

    Crafty.scene('StartMenu', function(){

        App.menu = new App.StartMenu();

    });

    Crafty.scene('HowToMenu', function(){

        App.menu = new App.HowToMenu();

    });

    Crafty.scene('RoundMenu', function(){
        var delay = true;
        App.menu = new App.RoundMenu();

        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function(event) {
            if (!delay && event.key === 32) {
                this.unbind('KeyDown');
                Crafty.scene('GameLoop');
            }
        });

    }, function() {

        this.unbind('KeyDown');

    });

    Crafty.scene('Loading', function(){

        Crafty.load([
            'assets/title.png',
            'assets/player.png',
            'assets/items_and_disasters.png',
            'assets/wall16.png',
            'assets/wall32.png',

            'assets/current-item-ui.png',
            'assets/message.png',
            'assets/text-block.png',
            'assets/timer-ui.png',
            'assets/tooltip-ui.png',
            'assets/website-btn.png',
            "assets/indicator-check.png",
            "assets/indicator-x.png",


            'assets/items/cow.png',
            'assets/items/dog.png',
            'assets/items/extinguisher.png',
            'assets/items/hippie.png',
            'assets/items/scissors.png',

            'assets/disasters/fire.png',
            'assets/disasters/homework.png',
            'assets/disasters/man.png',
            'assets/disasters/tnt.png',
            'assets/disasters/ufo.png',

            'assets/extras/man-building.png',
            'assets/extras/money-bag.png',
            "assets/extras/barn.png",
            "assets/extras/hay.png",
            "assets/extras/cars1.png",
            "assets/extras/cars2.png",
            "assets/extras/cars3.png",
            "assets/extras/cars4.png",
            "assets/extras/schoolhouse.png",
            "assets/extras/swing.png",
            "assets/extras/bone.png",
            "assets/extras/ball.png",
            "assets/extras/house.png",
            "assets/extras/firewood.png",
            "assets/extras/carpet.png",
            "assets/extras/bong.png",
            "assets/extras/smoke.png",
            "assets/extras/smoke2.png",
            "assets/extras/wick.png",
            "assets/extras/rock.png",
            "assets/extras/rock2.png",
            "assets/extras/appliances.png",
            "assets/extras/cabinets.png",
            "assets/extras/tile.png",
            "assets/extras/puddle.png",

            'assets/background-grass.png',
            'assets/background-grass2.png',
            'assets/background-rocks.png',
            'assets/background-tile.png',

            'assets/parking-lot.png',
            'assets/parking-cracked.png'

        ], function() {

            Crafty.sprite(Game.grid.tile.width, 'assets/wall' + Game.grid.tile.width + '.png', {
                spr_wall:    [0, 0]
            });

            //Needs padding to fix between Collision objects
            Crafty.sprite(Game.grid.tile.width - 2, 'assets/player.png', {
                spr_player:    [10, 0]
            }, 2, 2);


            Crafty.sprite(Game.grid.tile.width, 'assets/items_and_disasters.png', {
                spr_hippie: [0,0],
                spr_man: [1,0],
                spr_cow: [2,0],
                spr_ufo: [3,0],
                spr_scissors: [4,0],
                spr_tnt: [5,0],
                spr_extinguisher: [6,0],
                spr_fire: [7,0],
                spr_homework: [8,0],
                spr_dog: [9,0]
            });

            Crafty.scene('StartMenu');

        }, function(e) {
            console.log(e.loaded);
        })
    });


    function renderWalls() {

        function createWall(x, y, w, h) {
            Crafty.e('Obstacle, spr_wall')
                .attr({w: w, h: h})
                .atGrid(x, y)
                .collision([0,0], [w,0], [w,h], [0,h])
        }

        // Box off original game area.
        createWall(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.locationY), Game.map.width, Game.grid.tile.height);
        createWall(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.height - 7.25*Game.grid.tile.width), Game.map.width, Game.grid.tile.height);

        createWall(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.locationY), Game.grid.tile.width, Game.map.height);
        createWall(Game.toGrid(Game.map.width - 14*Game.grid.tile.width), Game.toGrid(Game.map.locationY), Game.grid.tile.width, Game.map.height);
    }

    function renderGameObjects() {
        for (var key in Game.disasters) {
            if (Game.disasters.hasOwnProperty(key)) {
                var disaster = Game.disasters[key];

                if (!disaster.completed) {
                    if (disaster.renderScenery) {
                        disaster.renderScenery()
                    }
                    var dis = Crafty.e('Disaster').atGrid(disaster.gridX, disaster.gridY).setProximity(disaster.name).setNames(disaster.name, disaster.itemName);
                    dis.z = 1000;
                    var itm = Crafty.e('Item').atGrid(disaster.itemX, disaster.itemY).setProximity(disaster.itemName).nameItem(disaster.itemName);
                    itm.z = 100;

                } else {
                    if (disaster.renderScenery) {
                        disaster.renderScenery()
                    }
                }
            }
        }
    }

})();