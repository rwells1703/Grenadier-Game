import { WINDOW_WIDTH, WINDOW_HEIGHT } from './Constants.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { WinScene } from './scenes/WinScene.js';
import { DisconnectedScene } from './scenes/DisconnectedScene.js';

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    scene: [MenuScene, GameScene, WinScene, DisconnectedScene],
    audio: { noAudio: true }
};

let game = new Phaser.Game(config);