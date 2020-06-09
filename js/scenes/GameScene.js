import { TEXTURE_SIZE } from '../Constants.js';
import { loadImages, loadSounds, parseSpriteSheets } from '../loading/LoadGraphics.js';
import { loadMapBmp, loadMap } from '../loading/LoadMap.js';
import { PlayerGeneric } from '../entities/PlayerGeneric.js';
import { Player } from '../entities/Player.js';
import { Grenade } from '../entities/Grenade.js';

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
        loadImages(this);
        loadSounds(this);
        loadMapBmp(this);
    }

    create() {
        parseSpriteSheets(this);

        this.gameOver = false;

        this.updateCounter = 0;

        this.platforms = this.physics.add.staticGroup();
        this.grenades = this.physics.add.group();
        this.otherPlayers = this.physics.add.group();

        let [map_width, map_height] = loadMap(this, this.mapName);

        this.socket = io();

        this.socket.on('thisPlayerJoin', player => {
            this.player = new Player(
                this,
                player.xPos,
                player.yPos,
                player.id
            );
        });

        this.socket.on('otherPlayerAdd', otherPlayer => {
            new PlayerGeneric(
                this,
                otherPlayer.xPos,
                otherPlayer.yPos,
                otherPlayer.id
            );
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

        this.socket.on('otherPlayerLeave', playerId => {
            for (let otherPlayer of this.otherPlayers.children.entries) {
                if (otherPlayer.id == playerId) {
                    otherPlayer.destroy();
                }
            }
        });

        this.socket.on('otherPlayerMove', movementUpdate => {
            for (let otherPlayer of this.otherPlayers.getChildren()) {
                if (movementUpdate.id === otherPlayer.id) {
                  otherPlayer.setPosition(movementUpdate.xPos, movementUpdate.yPos);
                  otherPlayer.body.velocity.x = movementUpdate.xVel;
                  otherPlayer.body.velocity.y = movementUpdate.yVel;
                }
            }
        });

        this.socket.on('otherPlayerThrowGrenade', newGrenade => {
            for (let otherPlayer of this.otherPlayers.getChildren()) {
                if (newGrenade.playerId == otherPlayer.id) {
                    new Grenade(
                        this,
                        newGrenade.xPos,
                        newGrenade.yPos,
                        'ConcussionGrenade',
                        newGrenade.grenadeId,
                        otherPlayer,
                        newGrenade.xVel,
                        newGrenade.yVel
                    );
                }
            }
        });

        this.socket.on("disconnect", () => {
            this.scene.start('DisconnectedScene');
            this.socket.disconnect();
        });
    }

    update(delta) {
        if (this.connected) {
            if (!this.gameOver) {
                // Handles keyboard input every frame
                this.player.update(delta);
                
                if (this.player.x != this.player.xPrev || this.player.y != this.player.yPrev) {
                    let movementUpdate = {
                        xPos: this.player.x,
                        yPos: this.player.y,
                        xVel: this.player.body.velocity.x,
                        yVel: this.player.body.velocity.y
                    };

                    this.player.xPrev = this.player.x;
                    this.player.yPrev = this.player.y;

                    this.socket.emit('thisPlayerMove', movementUpdate);
                }

                for (let otherPlayer of this.otherPlayers.getChildren()) {
                    otherPlayer.update();
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