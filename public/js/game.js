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
  asteroidSmall:{URL:'assets/asteroidSmall.png', name:'asteroidSmall'},
};

var shipProperties = {
  startX: gameProperties.screenWidth * 0.5;
  startY: gameProperties.screenHeight * 0.5;
};

//shipSprite references our player ship
var gameState = function(game){
  this.shipSprite;

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

    },

    update: function () {

    },

    //in game.add.sprite(x, y, image used as texture by this display object)
    initGraphics: function() {
      this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
      this.shipSprite.angle = -90;
      this.shipSprite.anchor.set(0.5,0.5);
    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
