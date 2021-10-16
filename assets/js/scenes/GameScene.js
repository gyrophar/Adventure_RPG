class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.scene.launch('Ui');
    this.score = 0;
  }

  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();
    this.createInput();
    this.createGameManager();
  }

  update() {
    if (this.player) this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.2 });
  }

  createPlayer(playerObject) {
    this.player = new PlayerContainer(
      this, 
      playerObject.x * 2, 
      playerObject.y * 2, 
      'characters', 
      0,
      playerObject.health,
      playerObject.maxHealth,
      playerObject.id);
  }

  createGroups() {
    // créer un groupe de coffres
    this.chests = this.physics.add.group();
    // créer un groupe de monstres
    this.monsters = this.physics.add.group();
  }

  spawnChest(chestObject) {
   let chest = this.chests.getFirstDead();

    if (!chest) {
      chest = new Chest(this, chestObject.x * 2, chestObject.y * 2, 'items', 0, chestObject.gold, chestObject.id);
      // ajouter un coffre au groupe de coffre
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold;
      chest.id = chestObject.id;
      chest.setPosition(chestObject.x * 2, chestObject.y * 2);
      chest.makeActive();
    }
  }

  spawnMonster(monsterObject) {
    let monster = this.monsters.getFirstDead();

    if (!monster) {
      monster = new Monster(
        this,
        monsterObject.x * 2, 
        monsterObject.y * 2, 
        'monsters', 
        monsterObject.frame,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth
      );
      // ajouter un monstre au groupe de monstre
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.setTexture('monsters', monsterObject.frame);
      monster.setPosition(monsterObject.x * 2, monsterObject.y * 2);
      monster.makeActive();
    }
  }


  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  

  addCollisions() {
    // verifier les collision entre notre joueur et le "Blocked layer"
    this.physics.add.collider(this.player, this.map.blockedLayer);
    // vérifier les overlap entre notre joueur et les coffres
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    // verifier les collision entre nos monstres et le "Blocked layer"
    this.physics.add.collider(this.monsters, this.map.blockedLayer);
    // vérifier les overlaps entre l'arme de notre joueur et les monstres
    this.physics.add.overlap(this.player.weapon, this.monsters, this.ennemyOverlap, null, this);
  }

  ennemyOverlap(player, ennemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit('monsterAttacked', ennemy.id);
    }
  }

  collectChest(player, chest) {
    // joue le son du gold pickup
    this.goldPickupAudio.play();
    // mettre a jour le score
    this.score += chest.coins;
    // afficher le nouveau score
    this.events.emit('updateScore', this.score);
    // rendre l'objet "coffre" inactif
    chest.makeInactive();
    // faire apparaitre un nouveau coffre
    this.events.emit('pickUpChest', chest.id);
  }

  createMap() {
    // Créer la carte
    this.map = new Map(this, 'map', 'background', 'background', 'blocked');
  }

  createGameManager() {
    this.events.on('spawnPlayer', (playerObject) => {
      this.createPlayer(playerObject);
      this.addCollisions();
    });

    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });

    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });

    this.events.on('monsterRemoved', (monsterId) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.makeInactive();
        }
      })
    });

    this.events.on('updateMonsterHealth', (monsterId, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
        }
      })
    });

    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }
}

