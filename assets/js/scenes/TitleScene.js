class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  // créer le texte du titre
  create() {
    this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Adventure RPG', { fontSize: '64px', fill: '#fff' });
    this.titleText.setOrigin(0.5);

    // créer le bouton "start"
    this.startGameButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.65, 'button1', 'button2', 'Start', this.startScene.bind(this, 'Game'));
  }

  // changer la scene active
  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
