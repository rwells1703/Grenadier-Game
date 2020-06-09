import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../Constants.js';
import { loadImages, loadSounds } from '../loading/LoadGraphics.js';

export class DisconnectedScene extends Phaser.Scene {
    constructor() {
        super({key: 'DisconnectedScene'});
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
                this.message = this.add.text(100, 100, 'Network error!', {font: '60px Roboto Mono', color:'#FFFFFF'});
                this.moreInfo = this.add.text(100, 200, 'You have lost connection with the server', {font: '25px Roboto Mono', color: '#FFFFFF'});

                this.btnSoundFX = this.sound.add('ButtonSound');
        
                this.reloadButton = this.add.text(100, 450, 'Reload game', {font: '35px Roboto Mono', color: '#FFFFFF'});
                this.reloadButton.setInteractive();
                this.reloadButton.on('pointerover', () => {
                    this.reloadButton.setColor('#FF0000');
                });
                this.reloadButton.on('pointerout', () => {
                    this.reloadButton.setColor('#FFFFFF');
                });
                this.reloadButton.on('pointerdown', () => {
                    this.btnSoundFX.play();
                    location.reload();
                });
            }
        });
    }
}