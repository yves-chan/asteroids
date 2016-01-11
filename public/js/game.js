var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};

/* declare properties for each of the 5 assets,
Each of the 5 assets have 2 more assets; URL: points to relative path
name: unique string or key to identify which graphic to use
*/
var graphicAssets = {
  ship: {URL:'assets/ship.png', name: 'ship'},
  bullet:{URL:'assets/bullet.png', name:'bullet'},

  asteroidLarge:{URL:'assets/asteroidLarge.png', name:'asteroidLarge'},
  asteroidMedium:{URL:'assets/asteroidMedium.png', name:'asteroidMedium'},
  asteroidSmall:{URL:'assets/asteroidSmall.png', name:'asteroidSmall'}
};

var asteroidProperties = {
  startingAsteroids: 4,
  maxAsteroids: 20,
  incrementAsteroids: 2,

  asteroidLarge: { minVelocity:50,
     maxVelocity:150,
     minAngularVelocity:0,
     maxAngularVelocity: 200,
     score: 20,
     nextSize: graphicAssets.asteroidMedium.name,
   },
  asteroidMedium: { minVelocity:50,
     maxVelocity:200,
     minAngularVelocity:0,
     maxAngularVelocity: 200,
     score: 50,
     nextSize: graphicAssets.asteroidSmall.name,
   },
   asteroidSmall: { minVelocity:50,
     maxVelocity:200,
     minAngularVelocity:0,
     maxAngularVelocity: 200,
     score: 100,
   },

}

var shipProperties = {
  startX: gameProperties.screenWidth * 0.5,
  startY: gameProperties.screenHeight * 0.5,
  acceleration: 300,
  drag: 100,
  maxVelocity: 300,
  angularVelocity: 200,
};

//speed: velocity of bullet
//interval: firing rate (how often you can shoot)
//lifeSpan: how long bullet will remain within game before dying
//maxCount: how many bullets can appear at a given time
var bulletProperties = {
  speed: 400,
  interval: 250,
  lifeSpan: 2000,
  maxCount: 30,
}

//shipSprite references our player ship
var gameState = function(game){
  this.shipSprite;

  this.key_left;
  this.key_right;
  this.key_thrust;
  this.key_fire;

  this.bulletGroup;
  this.bulletInterval = 0;

  this.asteroidGroup;
  this.asteroidsCount = asteroidProperties.startingAsteroids;
};

gameState.prototype = {

    //game.load is used to load all eternal content (images, sounds, texture, atlases)
    preload: function () {
      //load.image(asset name of image, url, overwrite; false by default, if true will overwrite an asset if there is an existing key)
      game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
      game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
      game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
      game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
      game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
    },

    create: function () {
      this.initGraphics();
      this.initPhysics();
      this.initKeyboard();
      this.resetAsteroids();
    },

    update: function () {
      this.checkBoundaries(this.shipSprite);
      this.checkPlayerInput();
      this.bulletGroup.forEachExists(this.checkBoundaries, this);
      this.asteroidGroup.forEachExists(this.checkBoundaries, this);
    },

    //in game.add.sprite(x, y, image used as texture by this display object)
    initGraphics: function() {
      this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
      this.shipSprite.angle = -90;
      this.shipSprite.anchor.set(0.5,0.5);

      //group manages multiple objects
      this.bulletGroup = game.add.group();

      this.asteroidGroup = game.add.group();
    },

    initPhysics: function(){
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
      this.shipSprite.body.drag.set(shipProperties.drag);
      this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

      this.bulletGroup.enableBody = true;
      this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
      this.bulletGroup.createMultiple(30, graphicAssets.bullet.name);
      this.bulletGroup.setAll('anchor.x', 0.5);
      this.bulletGroup.setAll('anchor.y', 0.5);
      this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);

      this.asteroidGroup.enableBody = true;
      this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    initKeyboard: function(){
      this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    // checkPlayerIput is called every frame loop which is called in update()
    checkPlayerInput: function(){
      if (this.key_left.isDown) {
        this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
      } else
      if (this.key_right.isDown) {
        this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
      } else {
        this.shipSprite.body.angularVelocity = 0 ;
      }
      if (this.key_thrust.isDown) {
        game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
      } else {
        this.shipSprite.body.acceleration.set(0);
      }

      if (this.key_fire.isDown) {
        this.fire();
      }
    },

    checkBoundaries: function(sprite){
      if (sprite.x < 0) {
        sprite.x = game.width;
      } else if (sprite.x > game.width) {
        sprite.x = 0;
      }

      if (sprite.y < 0) {
        sprite.y = game.height;
      } else if (sprite.y > game.height) {
        sprite.y = 0;
      }
    },

    //check if game clock has passed the bullet interval
    fire: function() {
      if (game.time.now > this.bulletInterval) {
        //get the first object in bulletGroup, if getFirstExists(true), it retrives an object that currently exists in game
        var bullet = this.bulletGroup.getFirstExists(false);

      if (bullet) {
        //position bullet in front of ship
        var length = this.shipSprite.width * 0.5;
        var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
        var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);

        bullet.reset(x, y);
        bullet.lifespan = bulletProperties.lifeSpan;
        bullet.rotation = this.shipSprite.rotation;

        game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
        this.bulletInterval = game.time.now + bulletProperties.interval;
      }
    }
  },

  createAsteroid: function(x, y, size) {
    var asteroid = this.asteroidGroup.create(x, y, size);
    asteroid.anchor.set(0.5,0.5);
    asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity,asteroidProperties[size].maxAngularVelocity);
    var randomAngle = game.math.degToRad(game.rnd.angle());
    var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity,asteroidProperties[size].maxVelocity);

    game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
  },

  resetAsteroids: function() {
    for (var i=0; i< this.asteroidsCount; i++) {
      var side = Math.round(Math.random());
      var x;
      var y;

      if (side) {
        //Will appear anywhere from the x axis
        x = Math.round(Math.random()) * gameProperties.screenWidth;
        y = Math.random() * gameProperties.screenHeight;
      } else {
        //Will appear anywhere from the y axis
        x = Math.random() * gameProperties.screenWidth;
        y = Math.round(Math.random()) * gameProperties.screenHeight;
      }

      this.createAsteroid(x,y, graphicAssets.asteroidLarge.name);
    }
  }

};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
