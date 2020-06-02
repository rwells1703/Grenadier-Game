import { TEXTURE_SIZE } from '../Constants.js';
import { loadMapBmp, loadMap } from '../loading/LoadMap.js';
import { parseSpriteSheets } from '../loading/LoadGraphics.js';
import { PlayerGeneric } from '../entities/PlayerGeneric.js';
import { Player } from '../entities/Player.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene',
            physics: {
                default: 'arcade',
                arcade: {debug: true}
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
        this.otherPlayers = this.physics.add.group();

        let [map_width, map_height] = loadMap(this, this.mapName);

        this.socket = io();

        this.socket.on('addOtherPlayer', player => {
            new PlayerGeneric(this, player.x, player.y, player.id);
        });

        this.socket.on('addThisPlayer', player => {
            this.player = new Player(this, player.x, player.y, player.id);
        });

        this.socket.on('play', () => {
            this.physics.add.collider(this.grenades, this.platforms, grenade => {
                grenade.addBounce();
            });

            this.physics.add.collider(this.grenades, this.grenades, grenade => {
                grenade.addBounce();
            });
    
            this.physics.add.collider(this.player, this.platforms);
            this.physics.add.collider(this.otherPlayers, this.platforms);
    
    
            this.cameras.main.startFollow(this.player);
    
            this.cameras.main.setBounds(0, 0, map_width*TEXTURE_SIZE, map_height*TEXTURE_SIZE);
    
            this.keys = this.input.keyboard.addKeys('W,S,A,D');

            this.connected = true;
        });

        this.socket.on('receivePlayerMoved', player => {
            for (let otherPlayer of this.otherPlayers.children.entries) {
                if (otherPlayer.id == player.id) {
                    otherPlayer.x = player.x;
                    otherPlayer.y = player.y;
                    otherPlayer.direction = player.direction;
                }
            }
        });

    }

    update(delta) {
        if (this.connected) {
            if (!this.mapComplete) {
                // Handles keyboard input every frame
                this.player.update(delta);

                for (let otherPlayer of this.otherPlayers.children.entries) {
                    otherPlayer.updateGraphics();
                }
            } else {
                // If the map has been completed
                this.registry.destroy();
                this.events.off();

                this.scene.start('WinScene');
            }
        }
    }
}