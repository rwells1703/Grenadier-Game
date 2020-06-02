import { Entity } from '../entities/Entity.js';
import { ConcussionGrenade } from './Grenade.js';

export class Player extends Entity {
    constructor (scene, x, y) {
        super(scene, x, y, 'Player', false);

        this.health = 15;

        this.MOVE_FORCE = 500;
        this.DRAG = 2000;

        this.GRENADE_THROW_SPEED = 1200;
        this.GRENADE_THROW_TIMEOUT = 500;
        this.GRENADE_THROW_RANGE = 300;

        this.body.drag.x = this.DRAG;
        this.body.drag.y = this.DRAG;

        this.grenadeTimer = 0;
        this.prevGrenadeTimer = 0;

        // Throw a grenade
        scene.input.on('pointerdown', pointer => {
            // If enough time has passed since the last grenade was thrown
            if (this.grenadeTimer > this.GRENADE_THROW_TIMEOUT) {
                this.throwGrenade(pointer.worldX, pointer.worldY, ConcussionGrenade);

                // Reset the timer
                this.prevGrenadeTimer = this.grenadeTimer;
            }
        });

    }

    throwGrenade(xTarget, yTarget, GrenadeClass) {
        let xDistance = xTarget - this.x;
        let yDistance = yTarget - this.y;
        let distance = Math.sqrt(xDistance**2 + yDistance**2);

        let speedCoefficient = distance / this.GRENADE_THROW_RANGE;

        // If they are throwing outside the range
        if (speedCoefficient > 1) {
            speedCoefficient = 1;
        }

        let xVelocity = xDistance/distance * this.GRENADE_THROW_SPEED * speedCoefficient;// + originEntity.body.velocity.x;
        let yVelocity = yDistance/distance * this.GRENADE_THROW_SPEED * speedCoefficient;// + originEntity.body.velocity.y;

        let grenade = new GrenadeClass(this.scene, this, xVelocity, yVelocity);
        console.log(grenade.body.velocity.x);
        // possible error here? RESETS PHYSICS
        //this.scene.grenades.add(grenade);
    }

    damage(damageValue) {
        this.health -= damageValue;

        if (this.health <= 0) {
            this.health = 0;
        }
    }

    update(delta) {
        if (this.scene.keys["A"].isDown && !this.body.blocked.left) {
            this.body.velocity.x = -this.MOVE_FORCE;
        } else if (this.scene.keys["D"].isDown && !this.body.blocked.right) {
            this.body.velocity.x = this.MOVE_FORCE;
        }

        if (this.scene.keys["W"].isDown) {
            this.body.velocity.y = -this.MOVE_FORCE;
        } else if (this.scene.keys["S"].isDown) {
            this.body.velocity.y = this.MOVE_FORCE;
        }

        // Update the timer for throwing a grenade
        this.grenadeTimer = delta;

        this.updateGraphics();
    }
}