import { Entity } from '../entities/Entity.js';

export class Explosion extends Entity {
    constructor(scene, xPos, yPos, explosionTexture, explosionDuration) {
        super(scene, xPos, yPos, explosionTexture, false);

        this.setDisplayOrigin(0.5);
        this.updateGraphics();

        this.scene.time.addEvent({
            delay: explosionDuration,
            callback: this.destroy,
            callbackScope: this
        });
    }
}