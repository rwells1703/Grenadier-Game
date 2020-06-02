export class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureName, staticBody) {
        super(scene, x, y, textureName);
        
        scene.add.existing(this);
        scene.physics.add.existing(this, staticBody);
    }

    updateGraphics() {
        if (this.body.velocity.x > 0) {
            this.play(this.texture.key + 'R', true);
        } else if (this.body.velocity.x < 0) {
            this.play(this.texture.key + 'L', true);
        }
    }
}