export class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureName, staticBody) {
        super(scene, x, y, textureName);
        
        scene.add.existing(this);
        scene.physics.add.existing(this, staticBody);
    }

    updateGraphics() {
        this.play(this.texture.key + this.direction, true);
    }
}