class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  // Précharger les données avant affichage
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

  // charger les images présentes plus tard dans la page
  loadImages() {
    this.load.image('button1', 'assets/images/ui/blue_button01.png');
    this.load.image('button2', 'assets/images/ui/blue_button02.png');
    // charger l'image du tileset
    this.load.image('background', 'assets/level/background-extruded.png');
  }

  // charger les spriteSheets utilisés plus tard dans la page
  loadSpriteSheets() {
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monsters', 'assets/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
  }

  // charger les fichiers audio utilisé plus tard dans la page
  loadAudio() {
    this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
    this.load.audio('ennemyDeath', ['assets/audio/EnemyDeath.wav']);
    this.load.audio('playerAttack', ['assets/audio/PlayerAttack.wav']);
    this.load.audio('playerDamage', ['assets/audio/PlayerDamage.wav']);
    this.load.audio('playerDeath', ['assets/audio/PlayerDeath.wav']);
  }

  // charger le fichier de la carte
  loadTileMap() {
    // map au format JSON
    this.load.tilemapTiledJSON('map', 'assets/level/large_level.json');
  }

  // afficher la page "title screen"
  create() {
    this.scene.start('Title');
  }
}
