(function(){

    Crafty.scene('Game', function() {

        Crafty.e('Obstacle').atGrid(6, 7);
        Crafty.e('Obstacle').atGrid(9, 9);
        Crafty.e('Obstacle').atGrid(2, 10);
        Crafty.e('Disaster').atGrid(8, 12).setProximity().requireItem('Hammer');

        Crafty.e('Item').atGrid(20, 20).setProximity().nameItem('Hammer');

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