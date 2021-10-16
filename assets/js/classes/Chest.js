class Chest extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, coins, id) {
    super(scene, x, y, key, frame);
    this.scene = scene; // La scene sur laquelle cet objet sera ajouté
    this.coins = coins; // Le nombre de pièce que ce coffre contient
    this.id = id;

    // permet la physique du jeu
    this.scene.physics.world.enable(this);
    // ajoute le coffre a notre scene
    this.scene.add.existing(this);

    this.setScale(2);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }
}