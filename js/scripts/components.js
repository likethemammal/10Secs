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

    Crafty.c("InverseFourway", {

        init: function () {
            this.requires("Multiway");
        },

        inverseFourway: function (speed) {
            this.multiway(speed, {
                UP_ARROW: 90,
                DOWN_ARROW: -90,
                RIGHT_ARROW: 180,
                LEFT_ARROW: 0,
                W: 90,
                S: -90,
                D: 180,
                A: 0,
                Z: 90,
                Q: 0
            });

            return this;
        }
    });

    Crafty.c('Actor', {
        init: function() {
            this.requires('2D, Canvas, Grid')
        }
    });

    Crafty.c('Obstacle',{
        init: function() {
            this.requires('Actor, Collision, InverseFourway, Color').inverseFourway(5).color('#F77FFF');

            this.onHit('Player', this.stopAllObstacles);
        },

        stopAllObstacles: function() {
            Crafty('Obstacle').each(function() {
                this.stopMovement();
            });
        },

        stopMovement: function() {
            this._speed = 0;
            if (this._movement) {
                this.x -= this._movement.x;
                this.y -= this._movement.y;
            }
        }
    });

    Crafty.c('Player', {
        init:function() {
            this.requires('Actor, Collision, spr_player');
        }
    });

})();
