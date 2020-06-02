import { WINDOW_WIDTH, WINDOW_HEIGHT, DEBUG } from '../Constants.js';
import { loadImages } from '../loading/LoadGraphics.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {
        this.load.audio('ButtonSound', 'assets/sounds/button.wav');
        this.load.script('WebFont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        
        loadImages(this);
    }

    create() {
        if (DEBUG) {
            this.scene.start('GameScene', {mapName: "alpha"});
        }

        this.add.tileSprite(0, 0, 2*WINDOW_WIDTH, 2*WINDOW_HEIGHT, 'Background');

        WebFont.load({
            google: {families: ['Finger Paint']},
            active: () => {
                this.gameTitle = this.add.text(100, 100, 'Grenadier', {font: '60px Finger Paint', color: '#FFFFFF'});

                this.tweens.add({
                    targets: [this.gameTitle],
                    duration: 1500,
                    alpha: {from: 0.3, to: 1},
                    yoyo: true,
                    repeat: -1
                });

                this.credits = this.add.text(100, 200, 'Developed by Richard Wells', {font: '22px Finger Paint', color: '#FFFFFF'});

                this.btnSoundFX = this.sound.add('ButtonSound');

                this.startButton = this.add.text(100, 350, 'Start', {font: '35px Finger Paint', color: '#FFFFFF'});
                this.startButton.setInteractive()
                                .on('pointerover', () => this.startButton.setColor('#EB4034'))
                                .on('pointerout', () => this.startButton.setColor('#FFFFFF'))
                                .on('pointerdown', () => {
                                    this.btnSoundFX.play();
                                    this.scene.start('GameScene', {mapName: "alpha"});
                                });
            }
        });
    }
}