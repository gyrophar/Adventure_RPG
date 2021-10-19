const SpawnerType = {
    MONSTER: 'MONSTER',
    CHEST: 'CHEST',
};

// récuperer un nombre aléatoire entre min et max
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}