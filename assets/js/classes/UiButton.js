class UiButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, hoverKey, text, targetCallback) {
    super(scene, x, y);
    this.scene = scene; // LA scene dans laquelle ce bouton est ajouté
    this.x = x; // la position x de ce bouton
    this.y = y; // la position y de ce bouton
    this.key = key; // l'image de ce bouton
    this.hoverKey = hoverKey; // L'image affichée lorsque le joueur "hover" sur ce bouton
    this.text = text; // Le text qui s'affiche sur ce bouton
    this.targetCallback = targetCallback; // la fonction qui sera appelée lorsque le joueur appuiera sur ce bouton

    // créer l'UI de notre bouton
    this.createButton();
    // ajoute le bouton a nos scenes
    this.scene.add.existing(this);
  }

  // creation des boutons d'UI
  createButton() {
    // Creer le bouton jouer
    this.button = this.scene.add.image(0, 0, 'button1');
    // rendre le bouton interactif
    this.button.setInteractive();
    // mettre le bouton a l'echelle
    this.button.setScale(1.4);

    // créer le texte du bouton
    this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '26px', fill: '#fff' });
    // centrer le text sur le bouton
    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    // ajouter les deux elements à notre container
    this.add(this.button);
    this.add(this.buttonText);

    // ecouter les evenements
    this.button.on('pointerdown', () => {
      this.targetCallback();
    });

    this.button.on('pointerover', () => {
      this.button.setTexture(this.hoverKey);
    });

    this.button.on('pointerout', () => {
      this.button.setTexture(this.key);
    });
  }
}
