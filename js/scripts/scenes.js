(function(){

    Crafty.scene('Game', function() {

        Crafty.e('Obstacle').atGrid(6, 7);
        Crafty.e('Obstacle').atGrid(9, 9);
        Crafty.e('Obstacle').atGrid(2, 10);
        Crafty.e('Obstacle').atGrid(8, 12);

        Crafty.e('Player').atGrid(5, 5);

    }, function() {
        // Remove events
    });

    Crafty.scene('Loading', function(){

        Crafty.load([
            'assets/player.png'
        ], function(){

            Crafty.sprite(16, 'assets/player.png', {
                spr_player:    [0, 0]
            });

            Crafty.scene('Game');
        })
    });

})();