(function() {

    Crafty.c('Grid', {
        init: function() {
            this.attr({
                w: Game.grid.tile.width,
                h: Game.grid.tile.height
            })
        },

        atGrid: function(x, y) {
            if (x === undefined && y === undefined) {
                return { x: this.x/Game.grid.tile.width, y: this.y/Game.grid.tile.height }
            } else {
                this.attr({ x: x * Game.grid.tile.width, y: y * Game.grid.tile.height });
                return this;
            }
        },

        atPixel: function(x, y) {
            if (x === undefined && y === undefined) {
                return { x: this.x, y: this.y }
            } else {
                this.attr({ x: x, y: y});
                return this;
            }

        }

    });

    Crafty.c('Actor', {
        init: function() {
            this.requires('2D, Canvas, Grid')
        }
    });

    Crafty.c('Player', {
        init:function() {
            this.requires('Actor, Fourway, spr_player').fourway(5);
        }
    })

})();
