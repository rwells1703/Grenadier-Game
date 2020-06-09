import { PlayerGeneric } from './PlayerGeneric.js';
import { Grenade } from './Grenade.js';

export class Player extends PlayerGeneric {
    constructor (scene, xPos, yPos, id) {
        super(scene, xPos, yPos, id);

        // Increments every time a grenade is thrown
        this.grenadeId = 0;
    
        this.grenadeTimer = 0;
        this.prevGrenadeTimer = 0;

        // Throw a grenade
        scene.input.on('pointerdown', pointer => {
            this.throwGrenade(pointer.worldX, pointer.worldY, "ConcussionGrenade");

            // Reset the timer
            this.prevGrenadeTimer = this.grenadeTimer;

            // If enough time has passed since the last grenade was thrown
            /*if (this.grenadeTimer - this.prevGrenadeTimer > this.GRENADE_THROW_TIMEOUT) {

            }*/
        });
    }

    throwGrenade(xTarget, yTarget, grenadeType) {
        let xDistance = xTarget - this.x;
        let yDistance = yTarget - this.y;
        let distance = Math.sqrt(xDistance**2 + yDistance**2);

        let speedCoefficient = distance / this.GRENADE_THROW_RANGE;

        // If they are throwing outside the range
        if (speedCoefficient > 1) {
            speedCoefficient = 1;
        }

        let xVel = xDistance/distance * this.GRENADE_THROW_SPEED * speedCoefficient;// + this.body.velocity.x;
        let yVel = yDistance/distance * this.GRENADE_THROW_SPEED * speedCoefficient;// + this.body.velocity.y;

        let grenade = new Grenade(this.scene, this.x, this.y, grenadeType, this.grenadeId, this, xVel, yVel);

        let newGrenade = {
            grenadeId: grenade.id,
            xPos: this.x,
            yPos: this.y,
            xVel: xVel,
            yVel: yVel
        };

        this.scene.socket.emit('thisPlayerThrowGrenade', newGrenade);

        this.grenadeId += 1;
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

        super.update();
    }
}