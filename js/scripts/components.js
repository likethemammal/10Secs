(function() {

    Crafty.c('Grid', {
        init: function() {
            this.attr({
                w: Game.grid.tile.width,
                h: Game.grid.tile.height
            })
        },

        atGrid: function(x, y) {
            this.gridX = x;
            this.gridY = y;
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

    Crafty.c('Solid', {
        init: function() {
            this.requires('Actor, Collision, InverseFourway').inverseFourway(5);
        },

        stopMovement: function() {
            this._speed = 0;
            if (this._movement) {
                this.x -= this._movement.x;
                this.y -= this._movement.y;
            }
        }
    });

    Crafty.c('Obstacle',{
        init: function() {
            this.requires('Solid, Color').color('#F77FFF');

            this.onHit('Player', this.stopAllObstacles);
        },

        stopAllObstacles: function() {
            Crafty.trigger('PlayerHit', this);

            Crafty('Solid').each(function() {
                this.stopMovement();
            });
        }
    });

    Crafty.c('Item', {
        itemName: 'item',

        init: function() {

            this.requires('Solid, Color').attr({w: 16*3, h: 16*3}).collision([0,0],[0,this.h],[this.w,this.h],[this.w,0]).color('#f66134');

            this.onHit('Player', this.allowPickup, this.disallowPickup);

        },

        allowPickup: function() {
            Crafty('Player').itemPickup = this;
        },

        disallowPickup: function() {
            Crafty('Player').itemPickup = null;
        },

        setProximity: function() {
            this.collider = Crafty.e('Obstacle').atGrid(this.gridX+1, this.gridY+1);
        },

        pickup: function() {
            this.collider.destroy();
            this.destroy();
        }
    });

    Crafty.c('Player', {
        init:function() {
            this.requires('Actor, Collision, Keyboard, spr_player');
            this.bind('KeyDown', this.checkKey);
        },

        checkKey: function() {
            if (this.isDown('SPACE')) {
                if (this.itemPickup) {
                    this.item = this.itemPickup.itemName;
                    this.itemPickup.pickup();
                }
            }
        }
    });

})();
