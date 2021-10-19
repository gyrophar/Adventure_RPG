class Spawner {
    constructor(config, spawnLocations, addObject, deleteObject, moveObjects) {
        this.id = config.id;
        this.spawnerInterval = config.spawnerInterval;
        this.limit = config.limit;
        this.objectType = config.spawnerType;
        this.spawnLocations = spawnLocations;
        this.addObject = addObject;
        this.deleteObject = deleteObject;
        this.moveObjects = moveObjects;

        this.objectsCreated = [];

        this.start();
    }

    //faire apparaitre toutes les "x" secondes un objet si le nombre d'objet maximum n'est pas atteint
    // et faire bouger les monstres toutes les "x" secondes
    start() {
        this.interval = setInterval(() => {
            if (this.objectsCreated.length < this.limit) {
                this.spawnObject();
            }
        }, this.spawnerInterval);
        if (this.objectType === SpawnerType.MONSTER) this.moveMonsters();
    }

    // faire apparaitre les coffres et les monstres
    spawnObject() {
        if (this.objectType === SpawnerType.CHEST) {
            this.spawnChest();
        } else if (this.objectType === SpawnerType.MONSTER) {
            this.spawnMonster();
        }
    }

    // lors de l'apparition d'un coffre, choisir la location
    spawnChest() {
        const location = this.pickRandomLocation();
        const chest = new ChestModel(location[0], location[1], randomNumber(10, 20), this.id);
        this.objectsCreated.push(chest);
        this.addObject(chest.id, chest);
    }

    // lors de l'apparition d'un monstre, choisir sa location et les caractéristiques du monstre
    spawnMonster() {
        const location = this.pickRandomLocation();
        const monster = new MonsterModel(
            location[0], 
            location[1], 
            randomNumber(10, 20), 
            this.id,
            randomNumber(10,20),
            randomNumber(3, 5),
            1,
            );
        this.objectsCreated.push(monster);
        this.addObject(monster.id, monster);
    }

    // mécanique de choix aleatoire de location
    pickRandomLocation() {
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        const invalidLocation = this.objectsCreated.some((object) => {
            if (object.x === location[0] && object.y === location[1]) {
                return true;
            } 
            return false;
        });

        if (invalidLocation) return this.pickRandomLocation();
        return location;
    }

    // mecanique de soustraction d'objets de la carte
    removeObject(id) {
        this.objectsCreated = this.objectsCreated.filter(object => object.id !== id);
        this.deleteObject(id);
    }

    // mécanique de mouvement des monstres
    moveMonsters() {
        this.moveMonsterInterval = setInterval(() => {
            this.objectsCreated.forEach((monster) => {
                monster.move();
            });

            this.moveObjects();
        }, 1000);
    }
}