import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../Constants.js';
import { loadImages, loadSounds } from '../loading/LoadGraphics.js';

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
                    //let gameScene = this.scene.get('GameScene');
                    //gameScene.registry.destroy();
                    //gameScene.events.off();
                    //gameScene.scene.restart({mapName: 'alpha'});
                    this.scene.start('GameScene', {mapName: 'alpha'});
                });
            }
        });
    }
}