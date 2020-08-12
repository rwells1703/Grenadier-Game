import { WINDOW_WIDTH, WINDOW_HEIGHT, SKIP_MENU } from '../Constants.js';
import { loadImages, loadSounds } from '../loading/LoadAssets.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {
        loadImages(this);
        loadSounds(this);

        this.load.script('WebFont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        if (SKIP_MENU) {
            this.scene.start('GameScene', {mapName: 'alpha', useJoyStick: false});
        }
        
        this.add.tileSprite(0, 0, 2*WINDOW_WIDTH, 2*WINDOW_HEIGHT, 'Background');
        
        WebFont.load({
            google: {families: ['Roboto Mono']},
            active: () => {
                this.gameTitle = this.add.text(100, 100, 'Grenadier Game', {font: '60px Roboto Mono', color:'#000000'});
                this.credits = this.add.text(100, 200, 'Developed by Richard Wells', {font: '25px Roboto Mono', color: '#000000'});

                this.btnSoundFX = this.sound.add('ButtonSound');
        
                this.backButton = this.add.text(100, 450, 'Play', {font: '35px Roboto Mono', color: '#000000'});
                this.backButton.setInteractive();
                this.backButton.on('pointerover', () => {
                    this.backButton.setColor('#FF0000');
                });
                this.backButton.on('pointerout', () => {
                    this.backButton.setColor('#000000');
                });
                this.backButton.on('pointerdown', () => {
                    this.btnSoundFX.play();
                    this.scene.start('GameScene', {mapName: 'alpha', useJoyStick: this.useJoyStick});
                });

                this.fullScreenButton = this.add.text(1150, 50, '⛶', {font: '85px Roboto Mono', color: '#000000'});
                this.fullScreenButton.setInteractive();
                this.fullScreenButton.on('pointerdown', () => {
                    if (this.scale.isFullscreen) {
                        this.scale.stopFullscreen();
                        this.fullScreenButton.setColor('#000000');
                    } else {
                        this.scale.startFullscreen();
                        this.fullScreenButton.setColor('#326ba8');
                    }
                });

                this.useJoyStick = false;
                this.toggleJoyStickButton = this.add.text(1160, 150, '+', {font: '85px Roboto Mono', color: '#000000'});
                this.toggleJoyStickButton.setInteractive();
                this.toggleJoyStickButton.on('pointerdown', () => {
                    this.useJoyStick = !this.useJoyStick;
                    if (this.useJoyStick) {
                        this.toggleJoyStickButton.setColor('#326ba8');
                    } else {
                        this.toggleJoyStickButton.setColor('#000000');
                    }
                });
            }
        });
    }
}