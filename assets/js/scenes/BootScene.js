class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // charger les images
    this.loadImages();
    // charger les spritesheet
    this.loadSpriteSheets();
    // charger l'audio
    this.loadAudio();
    // charger la map
    this.loadTileMap();
  }

  loadImages() {
    this.load.image('button1', 'assets/images/ui/blue_button01.png');
    this.load.image('button2', 'assets/images/ui/blue_button02.png');
    // charger l'image du tileset
    this.load.image('background', 'assets/level/background-extruded.png');
  }

  loadSpriteSheets() {
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monsters', 'assets/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
  }

  loadAudio() {
    this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
  }

  loadTileMap() {
    // map au format JSON
    this.load.tilemapTiledJSON('map', 'assets/level/large_level.json');
  }

  create() {
    this.scene.start('Title');
  }
}
