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

    Crafty.c('Disaster', {

        init: function() {
            this.requires('Solid, Color').attr({w: 16*3, h: 16*3}).collision([0,0],[0,this.h],[this.w,this.h],[this.w,0]).color('#000');

            this.onHit('Player', this.allowFix, this.disallowFix);
        },

        allowFix: function() {
            Crafty('Player').fixAllowed = true;
            Crafty('Player').disaster = this;
            if (Crafty('Player').item) {
                App.trigger('disaster:allowFix', this.item);
            }
        },

        disallowFix: function() {
            Crafty('Player').fixAllowed = false;
            Crafty('Player').disaster = null;
            App.trigger('message:delete');
            App.trigger('disaster:disallowFix', this.item);
        },

        setProximity: function() {
            this.collider = Crafty.e('Obstacle').atGrid(this.gridX+1, this.gridY+1);

            return this;
        },

        setNames: function(disasterName, itemName) {
            this.name = disasterName;
            this.requiredItem = itemName;
        },

        cleanup: function() {
            this.collider.destroy();
            this.destroy();
        }
    });

    Crafty.c('Item', {
        name: 'item',

        init: function() {

            this.requires('Solid, Color').attr({w: 16*3, h: 16*3}).collision([0,0],[0,this.h],[this.w,this.h],[this.w,0]).color('#f66134');

            this.onHit('Player', this.allowPickup, this.disallowPickup);

        },

        allowPickup: function() {
            Crafty('Player').itemPickup = this;
            App.trigger('item:allowPickup', this.item);
        },

        disallowPickup: function() {
            Crafty('Player').itemPickup = null;
            App.trigger('message:delete');
            App.trigger('item:disallowPickup', this.item);
        },

        setProximity: function() {
            this.collider = Crafty.e('Obstacle').atGrid(this.gridX+1, this.gridY+1);

            return this;
        },

        pickup: function() {
            this.collider.destroy();
            this.destroy();
        },

        nameItem: function(name) {
            this.name = name;
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
                    if (!this.item) {
                        this.item = this.itemPickup.name;
                        this.itemPickup.pickup();
                        this.itemPickup = null;

                        App.trigger('item:pickup', this.item);

                    } else {
                        App.trigger('message:create', 'Not allowed to hold more than one item, drop one first.');
                        //ERROR: Not allowed to hold more than one item, drop one first.
                    }
                } else if (this.fixAllowed) {
                    if (this.disaster.requiredItem === this.item) {
                        var disasterName = this.disaster.name;

                        this.item = null;

                        this.disaster.cleanup();
                        this.disaster = null;
                        // Win round, get points;

                        this.unbind('KeyDown', this.checkKey);

                        Crafty.trigger('WinRound', disasterName);

                    } else {

                        App.trigger('message:create', 'Wrong item, this disaster requires a different solution.');

                        //ERROR: Wrong item, get different item for disaster;
                    }
                } else if (this.item){
                    App.trigger('item:drop', this.item);

                    var disasters = 0;

                    for (var key in Game.disasters) {
                        var disaster = Game.disasters[key];

                        if (disaster.itemName === this.item) {
                            Game.disasters[key].itemX = Game.toGrid(this.x);
                            Game.disasters[key].itemY = Game.toGrid(this.y);
                            Crafty('Player').destroy();
                            Crafty.e('Item').atGrid(Game.toGrid(this.x), Game.toGrid(this.y)).setProximity().nameItem(disaster.itemName);
                            Crafty.e('Player').atGrid(Game.toGrid(this.x), Game.toGrid(this.x));
                        }

                        disasters++;
                    }

                    this.item = null;
                }
            }
        }
    });

})();
