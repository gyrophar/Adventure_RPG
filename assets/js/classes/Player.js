class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.scene = scene; // La scene sur laquel ce joueur sera ajouté
    this.velocity = 160; // La vitesse de notre joueur

    // permet la physique
    this.scene.physics.world.enable(this);
    // rend immobile si un objet rencontre notre joueur
    this.setImmovable(false);
    // change l'echelle de notre joueur
    this.setScale(2);
    // rencontre avec les limite du monde de jeu
    this.setCollideWorldBounds(true);
    // ajoute le joueur a notre scene
    this.scene.add.existing(this);
    // la camera suit le joueur
    this.scene.cameras.main.startFollow(this);
  }

  update(cursors) {
    this.body.setVelocity(0);

    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
    }

    if (cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
    }
  }
}
