class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.scene = scene; // La scene sur laquel ce joueur sera ajouté

    // permet la physique
    this.scene.physics.world.enable(this);
    // rend immobile si un objet rencontre notre joueur
    this.setImmovable(true);
    // change l'echelle de notre joueur
    this.setScale(2);
    // ajoute le joueur a notre scene
    this.scene.add.existing(this);
  }
}
