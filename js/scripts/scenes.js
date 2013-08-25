(function(){

    Crafty.scene('GameLoop', function() {

        Crafty.e('Background').atGrid(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.locationY));
//        Crafty.e('Background').atGrid(0, 0);

        renderWalls();

        var timeElapsed = 0;

        App.timer.bind('1 second', function() {
            timeElapsed++;

            $('.timer').children().text("Timer: " + (10 - timeElapsed));

            if (timeElapsed > 10) {
                timeElapsed = 0;

                App.timer.stop();
                App.timer.unbind('1 second');

//                Crafty.scene('GameOver');
            }
        });


        var text_css = {
            'font-size': '24px',
            'font-family': 'Arial',
            'color': 'white',
            'text-align': 'left'
        };
        var disasters = 0;

        for (var key in Game.disasters) {
            var disaster = Game.disasters[key];

            if (!disaster.completed) {
                Crafty.e('Disaster').atGrid(disaster.gridX, disaster.gridY).setProximity().setNames(disaster.name, disaster.itemName);
                Crafty.e('Item').atGrid(disaster.itemX, disaster.itemY).setProximity().nameItem(disaster.itemName);
            }

            disasters++;
        }

        Crafty.e('Obstacle').atGrid(6, 7);
        Crafty.e('Obstacle').atGrid(9, 9);
        Crafty.e('Obstacle').atGrid(2, 10);

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


        var gameUI = new App.GameUI();

        App.timer.start();

        this.bind('WinRound', _.bind(function(disaster) {
            Game.disasters[disaster].completed = true;
            Game.victories++;

            App.timer.stop();
            App.timer.unbind('1 second');
            delete gameUI;

            Crafty.scene('Victory');
        }, this));

    }, function() {
        this.unbind('WinRound');
    });

    Crafty.scene('Victory', function() {

        var text_css = {
            'font-size': '24px',
            'font-family': 'Arial',
            'color': 'white',
            'text-align': 'center'
        };

        var delay = true;
        var gameCompleted = false;
        var disasters = 0;

        for (var dis in Game.disasters) {
            disasters++
        }

        if (Game.victories >= disasters) {

            gameCompleted = true;

            Crafty.e('2D, DOM, Text')
                .text("You've cleaned up all the disasters! Good fuckin' job!")
                .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
                .css(text_css);

        } else {

            Crafty.e('2D, DOM, Text')
                .text('Disaster avoided! Good job!')
                .attr({ x: 0, y: Game.height()/2, w: Game.width() })
                .css(text_css);

            Crafty.e('2D, DOM, Text')
                .text('Get ready for the next round!')
                .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
                .css(text_css);

        }

        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function() {
            if (!delay) {
                if (gameCompleted) {
                    Game.reset();
                    this.unbind('KeyDown');
                    Crafty.scene('StartMenu');
                } else {
                    Crafty.scene('GameLoop');
                }
            }
        });

    }, function() {

        this.unbind('KeyDown');

    });

    Crafty.scene('GameOver', function() {
        var delay = true;
        var text_css = {
            'font-size': '24px',
            'font-family': 'Arial',
            'color': 'white',
            'text-align': 'center'
        };

        Crafty.e('2D, DOM, Text')
            .text("The disasters fucked you up. Try better next time")
            .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
            .css(text_css);


        setTimeout(function() { delay = false; }, 500);

        this.bind('KeyDown', function() {
            if (!delay) {
                Game.reset();
                Crafty.scene('Loading');
            }
        });

    }, function() {

        this.unbind('KeyDown');

    });

    Crafty.scene('Loading', function(){

        Crafty.load([
            'assets/player.png'
        ], function(){

            Crafty.sprite(32, 'assets/player.png', {
                spr_player:    [0, 0]
            });

            Crafty.scene('StartMenu');

        })
    });

    Crafty.scene('StartMenu', function(){

        var startMenu = new App.StartMenu();

    });

    function renderWalls() {

        function createWall(x, y, w, h) {
            Crafty.e('Obstacle')
                .attr({w: w, h: h})
                .atGrid(x, y)
                .collision([0,0], [w,0], [w,h], [0,h]);
        }

        // Box off original game area.
        createWall(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.locationY), Game.map.width, Game.grid.tile.height);
        createWall(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.height - 7.25*Game.grid.tile.width), Game.map.width, Game.grid.tile.height);

        createWall(Game.toGrid(Game.map.locationX), Game.toGrid(Game.map.locationY), Game.grid.tile.width, Game.map.height);
        createWall(Game.toGrid(Game.map.width - 14*Game.grid.tile.width), Game.toGrid(Game.map.locationY), Game.grid.tile.width, Game.map.height);
    }

})();