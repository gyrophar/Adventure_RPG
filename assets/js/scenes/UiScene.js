class UiScene extends Phaser.Scene {
  constructor() {
    super('Ui');
  }
  // prendre pour référence la gamescene
  init() {

    this.gameScene = this.scene.get('Game');
  }

  // créer l'affichage de l'UI.
  create() {
    this.setupUiElements();
    this.setupEvents();
  }

  // créer les éléments d'UI à afficher
  setupUiElements() {
    // creer l'objet texte 'score'
    this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });
    // creer l'icon 'coin'
    this.coinIcon = this.add.image(15, 15, 'items', 3);
  }
  
  // Ecouter l'evenement 'updateScore' depuis la GameScene.
  setupEvents() {
    this.gameScene.events.on('updateScore', (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });
  }
}
