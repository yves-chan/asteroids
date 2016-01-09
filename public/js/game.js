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

var shipProperties = {
  startX: gameProperties.screenWidth * 0.5,
  startY: gameProperties.screenHeight * 0.5,
  acceleration: 300,
  drag: 100,
  maxVelocity: 300,
  angularVelocity: 200,
};

//shipSprite references our player ship
var gameState = function(game){
  this.shipSprite;

  this.key_left;
  this.key_right;
  this.key_thrust;
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
    },

    update: function () {
      this.checkPlayerInput();

    },

    //in game.add.sprite(x, y, image used as texture by this display object)
    initGraphics: function() {
      this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
      this.shipSprite.angle = -90;
      this.shipSprite.anchor.set(0.5,0.5);
    },

    initPhysics: function(){
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
      this.shipSprite.body.drag.set(shipProperties.drag);
      this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);
    },

    initKeyboard: function(){
      this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
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
    },


};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
