import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../Constants.js';

export class DisconnectedScene extends Phaser.Scene {
    constructor() {
        super({key: 'DisconnectedScene'});
    }

    create() {
        this.add.tileSprite(0, 0, 2*WINDOW_WIDTH, 2*WINDOW_HEIGHT, 'Background');
        
        WebFont.load({
            google: {families: ['Finger Paint']},
            active: () => {
                this.disconnectedMessage = this.add.text(100, 100, 'Disconnected from server!', {font: '60px Finger Paint', color:'#FFFFFF'});

                //this.btnSoundFX = this.sound.add('ButtonSound');
        
                this.backButton = this.add.text(100, 450, 'Play again', {font: '35px Finger Paint', color: '#FFFFFF'});
                this.backButton.setInteractive().on('pointerdown', () => {
                    //this.btnSoundFX.play();
                    this.scene.start('GameScene');
                });
            }
        });
    }
}