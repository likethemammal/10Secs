(function(){

    Crafty.scene('GameLoop', function() {

        Crafty.e('AnimationObject').atGrid(Game.toGrid(Game.width()/2), Game.toGrid(Game.height()/2));
        Crafty.e('GrassBackground').atGrid(Game.toGrid(Game.map.locationX*3), Game.toGrid(Game.map.locationY*3));
        Crafty.e('Background').atGrid(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.locationY));

        renderWalls();

//        var timeElapsed = 0;
//
//        App.timer.every('1 second', function () {
//            timeElapsed++;
//
//            $('.timer').children().text("Timer: " + (10 - timeElapsed));
//
//            if (timeElapsed >= 10) {
//                timeElapsed = 0;
//
//                App.timer.stop();
//                App.timer.reset();
//                App.timer.clear();
//
//                Crafty.scene('GameOverMenu');
//            }
//        });

        var disasters = 0;

        for (var key in Game.disasters) {
            if (Game.disasters.hasOwnProperty(key)) {
                var disaster = Game.disasters[key];

                if (!disaster.completed) {
                    Crafty.e('Disaster').atGrid(disaster.gridX, disaster.gridY).setProximity(disaster.name).setNames(disaster.name, disaster.itemName);
                    Crafty.e('Item').atGrid(disaster.itemX, disaster.itemY).setProximity(disaster.itemName).nameItem(disaster.itemName);
                }

                disasters++;
            }
        }

        Crafty.e('Obstacle').addComponent('spr_wall').atGrid(6, 7);
        Crafty.e('Obstacle').addComponent('spr_wall').atGrid(9, 9);
        Crafty.e('Obstacle').addComponent('spr_wall').atGrid(2, 10);

        Crafty.e('Player').atGrid(Game.toGrid(Game.width()/2), Game.toGrid(Game.height()/2));

//        Crafty.e('Timer, 2D, DOM, Text')
//            .text("Timer: " + (10 - timeElapsed))
//            .attr({ x: 60, y: 0, w: Game.width() })
//            .css(text_css);
//
//        Crafty.e('2D, DOM, Text')
//            .text("Round: " + Game.victories + '/' + disasters)
//            .attr({ x: 0, y: 0, w: Game.width() })
//            .css(text_css);


        new App.GameUI();

        App.timer.start();

        this.bind('WinRound', _.bind(function(disaster) {
            Game.disasters[disaster].completed = true;
            Game.lastFinished = disaster;
            Game.victories++;

            App.timer.stop();
            App.timer.reset();
            App.timer.clear();

            var disasters = 0;

            for (var dis in Game.disasters) {
                if (Game.disasters.hasOwnProperty(dis)) {
                    disasters++
                }
            }

            if (Game.victories >= disasters) {
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
        new App.VictoryMenu();

        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function() {
            if (!delay) {
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

        new App.GameOverMenu();

        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function() {
            if (!delay) {
                Game.reset();
                this.unbind('KeyDown');
                Crafty.scene('Loading');
            }
        });

    }, function() {

        this.unbind('KeyDown');

    });

    Crafty.scene('StartMenu', function(){

        new App.StartMenu();

    });

    Crafty.scene('RoundMenu', function(){
        var delay = true;
        new App.RoundMenu();

        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function() {
            if (!delay) {
                this.unbind('KeyDown');
                Crafty.scene('GameLoop');
            }
        });

    }, function() {

        this.unbind('KeyDown');

    });

    Crafty.scene('Loading', function(){

        Crafty.load([
            'assets/player.png',
            'assets/items/dog.png',
            'assets/items_and_disasters.png',
            'assets/wall16.png',
            'assets/wall32.png'
        ], function(){

            Crafty.sprite(Game.grid.tile.width, 'assets/wall' + Game.grid.tile.width + '.png', {
                spr_wall:    [0, 0]
            });

            Crafty.sprite(Game.grid.tile.width, 'assets/player.png', {
                spr_player:    [10, 0]
            }, 0, 2);


            Crafty.sprite(Game.grid.tile.width, 'assets/items_and_disasters.png', {
                spr_hippie: [0,0],
                spr_man: [1,0],
                spr_cow: [2,0],
                spr_alien: [3,0],
                spr_scissors: [4,0],
                spr_tnt: [5,0],
                spr_extinguisher: [6,0],
                spr_fire: [7,0],
                spr_homework: [8,0],
                spr_dog: [9,0]
            });

            Crafty.scene('StartMenu');

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

})();