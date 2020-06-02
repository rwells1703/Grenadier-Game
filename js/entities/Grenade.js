import { Entity } from '../entities/Entity.js';

export class Grenade extends Entity {
    constructor(scene, textureName, originEntity, velocityX, velocityY, drag, bounce, maxBounces, fuseTime) {
        super(scene, originEntity.x, originEntity.y, textureName, false);

        scene.grenades.add(this);

        this.scale = 0.5;

        this.GRENADE_MAX_BOUNCES = maxBounces;
        this.bounceCount = 0;
        
        this.body.setBounce(bounce);
        
        this.body.velocity.x = velocityX;
        this.body.velocity.y = velocityY;

        this.body.drag.x = drag;
        this.body.drag.y = drag;

        this.scene.time.addEvent({
            delay: fuseTime,
            callback: this.explode,
            callbackScope: this
        });
    }

    addBounce() {
        this.bounceCount++;

        if (this.bounceCount >= this.GRENADE_MAX_BOUNCES) {
            this.explode();
        }
    }

    explode() {
        this.destroy();
    }
}

export class ConcussionGrenade extends Grenade {
    constructor(scene, originEntity, velocityX, velocityY) {
        super(scene, 'ConcussionGrenade', originEntity, velocityX, velocityY, 1000, 0.6, 3, 1500);
    }
}