class Monster extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame, id, health, maxHealth) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.id = id;
        this.health = health;
        this.maxHealth = maxHealth;


        // permet la physique
        this.scene.physics.world.enable(this);
        // rend immobile si un objet rencontre notre monstre
        this.setImmovable(false);
        // change l'echelle de notre monstre
        this.setScale(2);
        // rencontre avec les limite du monde de jeu
        this.setCollideWorldBounds(true);
        // ajoute le monstre a notre scene
        this.scene.add.existing(this);

        // mettre a jour l'origine du monstre
        this.setOrigin(0);

        this.createHealthBar();
    }

    // créer la barre de vie du monstre
    createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }

    // mettre à jour la barre de vie du monstre
    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.x, this.y - 8, 64, 5);
        this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
        this.healthBar.fillRect(this.x, this.y - 8, 64 * this.health / this.maxHealth, 5);
    }

    // mettre à jour la vie du monstre
    updateHealth(health) {
        this.health = health;
        this.updateHealthBar();
    }

    // afficher un nouveau monstre sur la carte
    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false;
        this.updateHealthBar();
    }

    //enlever le monstre de la carte lorsque vaincu
    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body.checkCollision.none = true;
        this.healthBar.clear();
    }

    // mecanique de mise à jour (barre de vie)
    update() {
        this.updateHealthBar();
    }
}