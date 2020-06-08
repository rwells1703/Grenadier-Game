import { TEXTURE_SIZE } from '../Constants.js';
import { loadMapBmp, loadMap } from '../loading/LoadMap.js';
import { parseSpriteSheets } from '../loading/LoadGraphics.js';
import { PlayerGeneric } from '../entities/PlayerGeneric.js';
import { Player } from '../entities/Player.js';
import { Grenade } from '../entities/Grenade.js';

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

        this.updateCounter = 0;

        this.platforms = this.physics.add.staticGroup();
        this.grenades = this.physics.add.group();
        this.otherPlayers = this.physics.add.group();

        let [map_width, map_height] = loadMap(this, this.mapName);

        this.socket = io();

        this.socket.on('thisPlayerJoin', player => {
            this.player = new Player(this, player.xPos, player.yPos, player.id);
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

        this.socket.on('otherPlayerUpdate', updatedPlayer => {
            for (let otherPlayer of this.otherPlayers.children.entries) {
                if (otherPlayer.id == updatedPlayer.id) {
                    // They are an existing player, so update their status
                    otherPlayer.x = updatedPlayer.xPos;
                    otherPlayer.y = updatedPlayer.yPos;
                    otherPlayer.body.velocity.x = updatedPlayer.xVel;
                    otherPlayer.body.velocity.y = updatedPlayer.yVel;

                    for (let grenadeId of Object.keys(updatedPlayer.grenades)) {
                        let updatedGrenade = updatedPlayer.grenades[grenadeId];

                        for (let grenade of otherPlayer.grenades.children.entries) {
                            if (grenade.id == updatedGrenade.id) {
                                grenade.x = updatedGrenade.xPos;
                                grenade.y = updatedGrenade.yPos;
                                grenade.body.velocity.x = updatedGrenade.xVel;
                                grenade.body.velocity.y = updatedGrenade.yVel;
                            } else {
                                new Grenade(
                                    this,
                                    updatedGrenade.xPos,
                                    updatedGrenade.yPos,
                                    updatedGrenade.type,
                                    updatedGrenade.id,
                                    otherPlayer,
                                    updatedGrenade.xVel,
                                    updatedGrenade.yVel
                                );
                            }
                        }
                    }
                } else {
                    // They are a new player, so create a new game object for them
                    new PlayerGeneric(
                        this,
                        updatedPlayer.xPos,
                        updatedPlayer.yPos,
                        updatedPlayer.id
                    );
                }
            }
        });
    }

    update(delta) {
        if (this.connected) {
            if (!this.mapComplete) {
                // Handles keyboard input every frame
                this.player.update(delta);

                if (this.updateCounter % 10 == 0) {
                    let playerUpdate = {
                        xPos: this.player.x,
                        yPos: this.player.y,
                        xVel: this.player.body.velocity.x,
                        yVel: this.player.body.velocity.y,
                        grenades: {}
                    };

                    for (let grenade of this.player.grenades.children.entries) {
                        playerUpdate.grenades[grenade.id] = {
                            id: grenade.id,
                            xPos: grenade.x,
                            yPos: grenade.y,
                            xVel: grenade.body.velocity.x,
                            yVel: grenade.body.velocity.y
                        };
                    }
                    
                    this.socket.emit('thisPlayerUpdate', playerUpdate);
                }

                for (let otherPlayer of this.otherPlayers.children.entries) {
                    otherPlayer.updateGraphics();
                }

                this.updateCounter++;
            } else {
                // If the map has been completed
                this.registry.destroy();
                this.events.off();

                this.scene.start('WinScene');
            }
        }
    }
}