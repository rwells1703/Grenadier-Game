export class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, xPos, yPos, textureName, staticBody) {
        super(scene, xPos, yPos, textureName);
        
        scene.add.existing(this);
        scene.physics.add.existing(this, staticBody);
    }

    updateGraphics() {
        this.play(this.texture.key + this.direction, true);
    }
}