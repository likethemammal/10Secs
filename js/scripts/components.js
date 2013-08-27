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

    Crafty.c('Background', {
        init: function() {
            this.requires('Solid, Image').attr({w: Game.map.width, h: Game.map.height}).image('assets/background-tile.png', "repeat");
        }
    });

    Crafty.c('GrassBackground', {
        init: function() {
            this.requires('Solid, Image').attr({w: Game.map.width*2, h: Game.map.height*2}).image('assets/background-grass.png', "repeat");
        }
    });

    Crafty.c('AnimationObject', {
        init: function() {
            this.requires('Solid');

            var animation_speed = 8;
            this.bind('NewDirection', function(data) {
                Crafty('Player').stop();
                if (data.x < 0) {
                    Crafty('Player').animate('PlayerMovingRight', animation_speed, -1);
                } else if (data.x > 0) {
                    Crafty('Player').animate('PlayerMovingLeft', animation_speed, -1);
                } else if (data.y < 0) {
                    Crafty('Player').animate('PlayerMovingDown', animation_speed, -1);
                } else if (data.y > 0) {
                    Crafty('Player').animate('PlayerMovingUp', animation_speed, -1);
                } else {
                    Crafty('Player').stop();
                }
            });
        }
    });

    Crafty.c('Solid', {
        init: function() {
            this.requires('Actor, Collision, InverseFourway').inverseFourway(3);
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
            this.requires('Solid');

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
            var size = Game.grid.tile.width;
            this.requires('Solid').attr({w: size*3, h: size*3}).collision([0,0],[0,this.h],[this.w,this.h],[this.w,0]);

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

        setProximity: function(disaster) {
            this.collider = Crafty.e('Obstacle').addComponent('spr_' + disaster.toLowerCase()).atGrid(this.gridX+1, this.gridY+1);

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
            var size = Game.grid.tile.width;
            this.requires('Solid').attr({w: size*3, h: size*3}).collision([0,0],[0,this.h],[this.w,this.h],[this.w,0]);

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

        setProximity: function(item) {
            this.collider = Crafty.e('Obstacle').addComponent('spr_' + item.toLowerCase()).atGrid(this.gridX+1, this.gridY+1);

            return this;
        },

        pickup: function() {
            App.trigger('item:disallowPickup', this.item);
            this.collider.destroy();
            this.destroy();
        },

        nameItem: function(name) {
            this.name = name;
        }
    });

    Crafty.c('Player', {
        init:function() {
            this.requires('Actor, Collision, Keyboard, spr_player, SpriteAnimation');
            this.bind('KeyDown', this.checkKey);
            this.animate('PlayerMovingUp',    6, 0, 8)
                .animate('PlayerMovingRight', 3, 0, 5)
                .animate('PlayerMovingDown',  9, 0, 11)
                .animate('PlayerMovingLeft',  0, 0, 2);
            // These next lines define our four animations
            //  each call to .animate specifies:
            //  - the name of the animation
            //  - the x and y coordinates within the sprite
            //     map at which the animation set begins
            //  - the number of animation frames *in addition to* the first one
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

                    } else if (this.item) {

                        App.trigger('message:create', 'Wrong item, this disaster requires a different solution.');

                        //ERROR: Wrong item, get different item for disaster;
                    }
                } else if (this.item){
                    App.trigger('item:drop', this.item);

                    var disasters = 0;
                    var x = this.x;
                    var y = this.y;

                    for (var key in Game.disasters) {
                        var disaster = Game.disasters[key];

                        if (disaster.itemName === this.item) {
                            Game.disasters[key].itemX = Game.toGrid(this.x);
                            Game.disasters[key].itemY = Game.toGrid(this.y);
                            Crafty('Player').destroy();
                            Crafty.e('Item').atGrid(Game.toGrid(x) - 1, Game.toGrid(y)).setProximity(disaster.itemName).nameItem(disaster.itemName);
                            Crafty.e('Player').atGrid(Game.toGrid(x), Game.toGrid(y));
                        }

                        disasters++;
                    }

                    this.item = null;
                }
            }
        }
    });

})();
