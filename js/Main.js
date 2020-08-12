import { WINDOW_WIDTH, WINDOW_HEIGHT, MUTED } from './Constants.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { DisconnectedScene } from './scenes/DisconnectedScene.js';
import { LoseScene } from './scenes/LoseScene.js';


let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    scene: [ MenuScene, GameScene, LoseScene, DisconnectedScene ],
    audio: { noAudio: MUTED }
};

let game = new Phaser.Game(config);