class UiScene extends Phaser.Scene {
  constructor() {
    super('Ui');
  }

  init() {
    // prendre pour référence la gamescene
    this.gameScene = this.scene.get('Game');
  }

  create() {
    this.setupUiElements();
    this.setupEvents();
  }

  setupUiElements() {
    // creer l'objet texte 'score'
    this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });
    // creer l'icon 'coin'
    this.coinIcon = this.add.image(15, 15, 'items', 3);
  }

  setupEvents() {
    // Ecouter l'evenement 'updateScore' depuis la GameScene.
    this.gameScene.events.on('updateScore', (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });
  }
}
