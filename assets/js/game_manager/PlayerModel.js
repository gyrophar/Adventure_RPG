class PlayerModel {
    constructor(spawnLocations) {
        this.health = 10;
        this.maxHealth = 10;
        this.gold = 0;
        this.id = `player-${uuid.v4()}`;
        this.spawnLocations = spawnLocations;


        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        [this.x, this.y] = location;
    }   

    // mettre à jour le nombre de gold du joueur
    updateGold(gold) {
        this.gold += gold;
    }

    // mettre à jour les points de vie du joueur
    updateHealth(health) {
        this.health += health;
        if (this.health > 10) {
            this.health = 10;
        }
    }

    // mécanique de respawn du joueur (vie max, location random)
    respawn() {
        this.health = this.maxHealth;
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        this.x = location[0] * 2;
        this.y = location[1] * 2;
    }
}