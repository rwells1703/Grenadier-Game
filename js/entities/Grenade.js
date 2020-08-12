import { Entity } from '../entities/Entity.js';

export class Grenade extends Entity {
    constructor(scene, xPos, yPos, grenadeType, id, player, xVel, yVel) {
        super(scene, xPos, yPos, grenadeType, false);

        scene.grenades.add(this);
        player.grenades.add(this);

        // REMOVE FOR BEST PIXEL ART LOOK
        this.scale = 0.5;
        this.rotation = Math.random()*360;
        this.body.angularVelocity = Math.random()*100;

        this.id = id;
        this.playerId = id;

        this.body.velocity.x = xVel;
        this.body.velocity.y = yVel;

        let drag, bounce, maxBounces;
        if (grenadeType == "ConcussionGrenade") {
            drag = 1000;
            bounce = 0.6;
            maxBounces = 3;
            this.fuseTime = 1500;
            this.radius = 64;
            this.damage = 5;
        }

        this.body.drag.x = drag;
        this.body.drag.y = drag;

        this.body.setBounce(bounce);

        this.GRENADE_MAX_BOUNCES = maxBounces;
        this.bounceCount = 0;

        this.exploded = false;
        this.thrownDelta = scene.time.now;
    }

    addBounce() {
        this.bounceCount++;

        if (this.bounceCount >= this.GRENADE_MAX_BOUNCES) {
            this.explode();
        }
    }

    explode() {
        this.exploded = true;
        let distance = this.getDistanceFromPoint(this.scene.player.x, this.scene.player.y);

        this.applyDamage(this.scene.player, distance);

        let cameraShakeRadius = 448;
        if (distance <= cameraShakeRadius) {
            this.scene.cameras.main.shake(cameraShakeRadius/distance*200, 0.01);
        }

        for (let otherPlayer of this.scene.otherPlayers.getChildren()) {
            distance = this.getDistanceFromPoint(otherPlayer.x, otherPlayer.y);
            this.applyDamage(otherPlayer, distance);
        }

        this.play('Explosion', true);
        this.rotation = 0;
        this.body.angularVelocity = 0;
        this.scale = 1;

        this.scene.time.addEvent({
            delay: 500,
            callback: this.destroy,
            callbackScope: this
        });
    }

    applyDamage(player, distance) {
        if (distance < this.radius) {
            player.damage(this.damage);
        }
    }

    update(delta) {
        if (delta - this.thrownDelta >= this.fuseTime && !this.exploded) {
            this.explode();
        }
    }
}