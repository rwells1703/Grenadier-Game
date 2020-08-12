import { Grenade } from '../entities/Grenade.js';
import { Explosion } from './Explosion.js';

export class GrenadeConcussion extends Grenade {
    constructor(scene, xPos, yPos, id, player, xVel, yVel) {
        super(scene, xPos, yPos, 'ConcussionGrenade', id, player, xVel, yVel);

        this.fuseTime = 1000;
        this.radius = 128;
        this.damage = 40;
        this.explosionDuration = 500;

        this.body.drag.x = this.body.drag.y = 1000;
        this.body.setBounce(0.6);
        this.GRENADE_MAX_BOUNCES = 3;
    }

    explode() {
        let distance = this.getDistanceFromPoint(this.scene.player.x, this.scene.player.y);

        let cameraShakeRadius = 256;
        if (distance <= cameraShakeRadius) {
            this.scene.cameras.main.shake(200, cameraShakeRadius/distance*0.005);
        }

        new Explosion(this.scene, this.x, this.y, 'ExplosionConcussion', this.explosionDuration);

        super.explode(distance, 500);
    }

    applyDamage(player, distance) {
        if (distance < this.radius) {
            player.damage(this.damage*(distance/this.radius));
        }
    }
}