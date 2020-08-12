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

    explode(distance) {
        this.exploded = true;

        this.visible = false;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.applyDamage(this.scene.player, distance);

        for (let otherPlayer of this.scene.otherPlayers.getChildren()) {
            distance = this.getDistanceFromPoint(otherPlayer.x, otherPlayer.y);
            this.applyDamage(otherPlayer, distance);
        }


        this.scene.time.addEvent({
            delay: this.explosionDuration,
            callback: this.destroy,
            callbackScope: this
        });
    }

    update(delta) {
        if (delta - this.thrownDelta >= this.fuseTime && !this.exploded) {
            this.explode();
        }

        if (this.exploded) {
            this.drawnRadius = new Phaser.Geom.Circle(this.body.x, this.body.y, this.radius);
            this.scene.graphics.fillStyle(0xFFFFFF, 0.3);
            this.drawnRadius.setTo(this.body.x, this.body.y, this.radius);
            this.scene.graphics.fillCircleShape(this.drawnRadius);
        }
    }
}