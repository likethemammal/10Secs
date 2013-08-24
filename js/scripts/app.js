(function() {

    Game = {

        grid: {
            width:  25,
            height: 15,
            tile: {
                width:  16,
                height: 16
            }
        },

        width: function() {
            return this.grid.width * this.grid.tile.width;
        },

        height: function() {
            return this.grid.height * this.grid.tile.height;
        },

        start: function() {

            Crafty.init(this.width(), this.height());

            Crafty.background('#F77F00');

            Crafty.scene('Loading');

        }
    };

    window.addEventListener('load', _.bind(Game.start, Game));

})();