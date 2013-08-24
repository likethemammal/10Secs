(function(){

    Crafty.scene('Game', function() {

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