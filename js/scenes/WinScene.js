import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../Constants.js';

export class WinScene extends Phaser.Scene {
    constructor() {
        super({key: 'WinScene'});
    }

    create() {
        this.add.tileSprite(0, 0, 2*WINDOW_WIDTH, 2*WINDOW_HEIGHT, 'Background');
        
        WebFont.load({
            google: {families: ['Finger Paint']},
            active: () => {
                this.winTitle = this.add.text(100, 100, 'Game Finished!', {font: '60px Finger Paint', color:'#FFFFFF'});

                this.tweens.add({
                    targets: [this.winTitle],
                    duration: 1500,
                    alpha: {from: 0.3, to: 1},
                    yoyo: true,
                    repeat: -1
                });

                this.btnSoundFX = this.sound.add('ButtonSound');
        
                this.backButton = this.add.text(100, 450, 'Back to main menu', {font: '35px Finger Paint', color: '#FFFFFF'});
                this.backButton.setInteractive().on('pointerdown', () => {
                    this.btnSoundFX.play();
                    this.scene.start('MenuScene');
                });
            }
        });
    }
}