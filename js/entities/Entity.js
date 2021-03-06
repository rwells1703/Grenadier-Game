export class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, xPos, yPos, textureName, staticBody) {
        super(scene, xPos, yPos, textureName);

        scene.add.existing(this);
        scene.physics.add.existing(this, staticBody);
    }

    updateGraphics() {
        this.play(this.texture.key, true);
    }

    getDistanceFromPoint(x, y) {
        let xDist = x - this.x;
        let yDist = y - this.y;

        return Math.sqrt(xDist ** 2 + yDist ** 2);
    }
}