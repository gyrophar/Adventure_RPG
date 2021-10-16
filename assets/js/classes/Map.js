class Map {
    constructor(scene, key, tileSetName, backgroundLayerName, blockedLayerName) {
        this.scene = scene; // la scene où se trouve cette carte
        this.key = key; // nom du fichier JSON de notre carte
        this.tileSetName = tileSetName; // nom du fichier du Tileset
        this.backgroundLayerName = backgroundLayerName; // nom du layer créé dans Tiled pour le background
        this.blockedLayerName = blockedLayerName; // nom du layer créé dans Tiled pour les collisions
        this.createMap();
    }


createMap() {

    // créer la carte Tiled
    this.map = this.scene.make.tilemap({key: this.key});

    // ajouter l'image du tileset à notre carte
    this.tiles = this.map.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2);

    // créer notre background layer
    this.backgroundLayer = this.map.createStaticLayer(this.tileSetName, this.tiles, 0, 0);
    this.backgroundLayer.setScale(2);

    // créer notre blocked Layer
    this.blockedLayer = this.map.createStaticLayer(this.blockedLayerName, this.tiles, 0, 0);
    this.blockedLayer.setScale(2);
    this.blockedLayer.setCollisionByExclusion([-1]);

    // mettre à jour les limite du monde
    this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

    // limiter la caméra à notre carte
    this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);
    }

}