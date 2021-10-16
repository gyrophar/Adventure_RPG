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

    setup() {
        this.parseMapData();
        this.setupEventListeners();
        this.setupSpawners();
        this.spawnPlayer();
    }

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

    setupEventListeners() {
        this.scene.events.on('pickUpChest', (chestId) => {
            //mettre a jour le spawner
            if (this.chests[chestId]) {
                this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
            }
        });

        this.scene.events.on('monsterAttacked', (monsterId) => {
            //mettre a jour le spawner
            if (this.monsters[monsterId]) {
                // soustrait la vie du MonsterModel
                this.monsters[monsterId].loseHealth();

                //verifier la vie du monstre, si mort, enlever l'objet monstre
                if (this.monsters[monsterId].health <= 0) {
                    this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
                    this.scene.events.emit('monsterRemoved', monsterId);
                } else {
                    this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);
                }

            }
        });
    }

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
                this.deleteMonster.bind(this)
            );
            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const player = new PlayerModel(this.playerLocations);
        this.players[player.id] = player;
        this.scene.events.emit('spawnPlayer', player); 
    }

    addChest(chestId, chest) {
        this.chests[chestId] = chest;
        this.scene.events.emit('chestSpawned', chest);
    }

    deleteChest(chestId) {
        delete this.chests[chestId];
    }

    addMonster(monsterId, monster) {
        this.monsters[monsterId] = monster;
        this.scene.events.emit('monsterSpawned', monster);
    }

    deleteMonster(monsterId) {
        delete this.monsters[monsterId];
    }
}