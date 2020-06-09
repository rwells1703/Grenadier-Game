import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../Constants.js';
import { loadImages, loadSounds } from '../loading/LoadGraphics.js';

export class LoseScene extends Phaser.Scene {
    constructor() {
        super({key: 'LoseScene'});
    }

    preload() {
        loadImages(this);
        loadSounds(this);

        this.load.script('WebFont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        this.add.tileSprite(0, 0, 2*WINDOW_WIDTH, 2*WINDOW_HEIGHT, 'Background');
        
        WebFont.load({
            google: {families: ['Roboto Mono']},
            active: () => {
                this.message = this.add.text(100, 100, 'You lose!', {font: '60px Roboto Mono', color:'#FFFFFF'});
                this.moreInfo = this.add.text(100, 200, '(General Kenobi)', {font: '14px Roboto Mono', color: '#FFFFFF'});

                this.btnSoundFX = this.sound.add('ButtonSound');
        
                this.replayButton = this.add.text(100, 450, 'Play again', {font: '35px Roboto Mono', color: '#FFFFFF'});
                this.replayButton.setInteractive();
                this.replayButton.on('pointerover', () => {
                    this.replayButton.setColor('#FF0000');
                });
                this.replayButton.on('pointerout', () => {
                    this.replayButton.setColor('#FFFFFF');
                });
                this.replayButton.on('pointerdown', () => {
                    this.btnSoundFX.play();
                    //this.scene.start('MenuScene');
                    location.reload();
                });
            }
        });
    }
}