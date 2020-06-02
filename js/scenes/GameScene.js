import { TEXTURE_SIZE } from '../Constants.js';
import { loadMapBmp, loadMap } from '../loading/LoadMap.js';
import { parseSpriteSheets } from '../loading/LoadGraphics.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene',
            physics: {
                default: 'arcade',
                arcade: {debug: false}
            }
        });
    }

    init(data) {
        // Gets the map name from the menu
        this.mapName = data.mapName;
    }

    preload() {
        loadMapBmp(this);
    }

    create() {
        parseSpriteSheets(this);

        this.mapComplete = false;

        this.platforms = this.physics.add.staticGroup();
        this.grenades = this.physics.add.group();


        let [map_width, map_height] = loadMap(this, this.mapName);


        this.physics.add.collider(this.grenades, this.platforms, grenade => {
            grenade.addBounce();
        });

        // Grenades collide with other grenades
        this.physics.add.collider(this.grenades, this.grenades, grenade => {
            grenade.addBounce();
        });

        this.physics.add.collider(this.player, this.platforms);


        this.cameras.main.startFollow(this.player);

        this.cameras.main.setBounds(0, 0, map_width*TEXTURE_SIZE, map_height*TEXTURE_SIZE);

        this.keys = this.input.keyboard.addKeys('W,S,A,D');
    }

    update(delta) {
        if (!this.mapComplete) {
            // Handles keyboard input every frame
            this.player.update(delta);
        } else {
            // If the map has been completed
            this.registry.destroy();
            this.events.off();

            this.scene.start('WinScene');
        }
    }
}