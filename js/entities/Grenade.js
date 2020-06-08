import { Entity } from '../entities/Entity.js';

export class Grenade extends Entity {
    constructor(scene, xPos, yPos, grenadeType, id, player, xVel, yVel) {
        super(scene, xPos, yPos, grenadeType, false);

        scene.grenades.add(this);
        player.grenades.add(this);

        // REMOVE FOR BEST PIXEL ART LOOK
        this.scale = 0.5;

        this.id = id;
        this.playerId = id;

        this.body.velocity.x = xVel;
        this.body.velocity.y = yVel;

        let drag, bounce, maxBounces, fuseTime;
        if (grenadeType == "ConcussionGrenade") {
            drag = 1000;
            bounce = 0.6;
            maxBounces = 3;
            fuseTime = 1500;
        }

        this.body.drag.x = drag;
        this.body.drag.y = drag;

        this.body.setBounce(bounce);

        this.GRENADE_MAX_BOUNCES = maxBounces;
        this.bounceCount = 0;

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