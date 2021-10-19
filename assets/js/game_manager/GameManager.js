class GameManager {
    constructor(scene, mapData) {
        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};
        this.players = {};

        this.playerLocations = [];
        this.chestLocations = {};
        this.monsterLocations = {};
    }

    // 
    setup() {
        this.parseMapData();
        this.setupEventListeners();
        this.setupSpawners();
        this.spawnPlayer();
    }

    // recuperer les données de la carte et de chaque objet sur la carte (joueur, coffre, monstre)
    parseMapData() {
        this.mapData.forEach((layer) => {
            if (layer.name === 'player_locations') {
                layer.objects.forEach((object) => {
                    this.playerLocations.push([object.x + (object.width/2), object.y - (object.height/2)]);
                });
            } else if (layer.name === 'chest_locations') {
                layer.objects.forEach((object) => {
                    if (this.chestLocations[object.properties.spawner]) {
                        this.chestLocations[object.properties.spawner].push([object.x + (object.width/2), object.y - (object.height/2)]);
                    } else {
                        this.chestLocations[object.properties.spawner] = [[object.x + (object.width/2), object.y - (object.height/2)]];
                    }
                });
            } else if (layer.name === 'monster_locations') {
                layer.objects.forEach((object) => {
                    if (this.monsterLocations[object.properties.spawner]) {
                        this.monsterLocations[object.properties.spawner].push([object.x + (object.width/2), object.y - (object.height/2)]);
                    } else {
                        this.monsterLocations[object.properties.spawner] = [[object.x+ (object.width/2), object.y - (object.height/2)]];
                    }
            });
            }
        });
    }

    // ajouter les evenements pour futures références/actions
    setupEventListeners() {
        this.scene.events.on('pickUpChest', (chestId, playerId)  => {
            //mettre a jour le spawner
            if (this.chests[chestId]) {
                const { gold } = this.chests[chestId];

                //mettre à jour les gold de notre joueur
                this.players[playerId].updateGold(gold);
                this.scene.events.emit('updateScore', this.players[playerId].gold);
                
                //enlever le coffre
                this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
                this.scene.events.emit('chestRemoved', chestId);

            }
        });

        this.scene.events.on('monsterAttacked', (monsterId, playerId) => {
            //mettre a jour le spawner
            if (this.monsters[monsterId]) {
                const { gold, attack } = this.monsters[monsterId];
                // soustrait la vie du MonsterModel
                this.monsters[monsterId].loseHealth();

                //verifier la vie du monstre, si mort, enlever l'objet monstre
                if (this.monsters[monsterId].health <= 0) {

                    //mettre à jour les gold de notre joueur
                    this.players[playerId].updateGold(gold);
                    this.scene.events.emit('updateScore', this.players[playerId].gold);

                    //enleve le monstre
                    this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
                    this.scene.events.emit('monsterRemoved', monsterId);

                    //ajouter de la vie bonus à notre joueur
                    this.players[playerId].updateHealth(2);
                    this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);
                } else {
                    //mettre a jour la vie du joueur
                    this.players[playerId].updateHealth(-attack);
                    this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);

                    //mettre a jour la vie du monstre
                    this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);

                    //vérifier la santé du joueur, si en dessous de 0, le respawn
                    if (this.players[playerId].health <= 0) {
                        //mettre a jour les golds du joueur
                        this.players[playerId].updateGold(parseInt(-this.players[playerId].gold / 2, 10));
                        this.scene.events.emit('updateScore', this.players[playerId].gold);

                        //respawn le joueur
                        this.players[playerId].respawn();
                        this.scene.events.emit('respawnPlayer', this.players[playerId]);
                    }
                }

            }
        });
    }

    // créer le spawner des objets
    setupSpawners() {

        const config = {
            spawnInterval: 3000,
            limit: 3,
            spawnerType: SpawnerType.CHEST,
            id: ``,
        };

        let spawner;

        //créer notre chest spawner
        Object.keys(this.chestLocations).forEach((key) => {
            config.id = `chest-${key}`;
            
            spawner = new Spawner(
                config, 
                this.chestLocations[key], 
                this.addChest.bind(this), 
                this.deleteChest.bind(this)
            );
            this.spawners[spawner.id] = spawner;
        });

        //créer le spawner de monstre
        Object.keys(this.monsterLocations).forEach((key) => {
            config.id = `monster-${key}`;
            config.spawnerType = SpawnerType.MONSTER;
            
            spawner = new Spawner(
                config, 
                this.monsterLocations[key], 
                this.addMonster.bind(this), 
                this.deleteMonster.bind(this),
                this.moveMonsters.bind(this),
            );
            this.spawners[spawner.id] = spawner;
        });
    }

    // créer le spawner du joueur
    spawnPlayer() {
        const player = new PlayerModel(this.playerLocations);
        this.players[player.id] = player;
        this.scene.events.emit('spawnPlayer', player); 
    }

    // émission de l'evenement d'ajout de coffres
    addChest(chestId, chest) {
        this.chests[chestId] = chest;
        this.scene.events.emit('chestSpawned', chest);
    }

    //  émission de l'evenement de retrait de coffres
    deleteChest(chestId) {
        delete this.chests[chestId];
    }

    //  émission de l'evenement d'ajout de monstres
    addMonster(monsterId, monster) {
        this.monsters[monsterId] = monster;
        this.scene.events.emit('monsterSpawned', monster);
    }

    //  émission de l'evenement de retrait de monstres
    deleteMonster(monsterId) {
        delete this.monsters[monsterId];
    }

    //  émission de l'evenement de mouvement des monstres
    moveMonsters() {
        this.scene.events.emit('monsterMovement', this.monsters);
    }
}