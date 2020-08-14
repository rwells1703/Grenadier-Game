import { Player } from './Player.js';
import { GrenadeConcussion } from './GrenadeConcussion.js';

export class PlayerThis extends Player {
    constructor (scene, xPos, yPos, id) {
        super(scene, xPos, yPos, id);

        // Increments every time a grenade is thrown
        this.grenadeId = 0;
    
        //this.GRENADE_THROW_SPEED = 1000;
        this.GRENADE_THROW_SPEED = 3;
        this.GRENADE_THROW_TIMEOUT = 400;
        this.GRENADE_THROW_RANGE = 400;

        this.throwGrenadeDelta = 0;
        
        // Throw a grenade
        scene.input.on('pointerdown', pointer => {
            // Disables grenade throws within joystick (if joystick is enabled)
            let clickedOnJoyStick = this.scene.joyStick.base.geom.contains(pointer.x-this.scene.joyStick.base.x, pointer.y-this.scene.joyStick.base.y);
            if (!this.scene.useJoyStick || !clickedOnJoyStick) {
                // If enough time has passed since the last grenade was thrown
                if (scene.time.now - this.throwGrenadeDelta >= this.GRENADE_THROW_TIMEOUT) {
                    // Reset the timer
                    this.throwGrenadeDelta = scene.time.now;

                    this.throwGrenade(pointer.worldX, pointer.worldY, "ConcussionGrenade");
                }
            }
        });
    }

    throwGrenade(xTarget, yTarget, grenadeType) {
        let xDistance = xTarget - this.x;
        let yDistance = yTarget - this.y;

        let xDirection = xDistance/Math.abs(xDistance);
        let yDirection = yDistance/Math.abs(yDistance);

        console.log(this.scene.player);
        let xVel = xDirection * Math.sqrt(Math.abs(2*this.body.drag.x*xDistance)) + this.scene.player.body.velocity.x;
        let yVel = yDirection * Math.sqrt(Math.abs(2*this.body.drag.y*yDistance)) + this.scene.player.body.velocity.y;

        let grenade;
        if (grenadeType == 'ConcussionGrenade') {
            grenade = new GrenadeConcussion(this.scene, this.x, this.y, this.grenadeId, this, xVel, yVel);
        }

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
        if ((this.scene.keys["A"].isDown || this.scene.joyStick.left) && !this.body.blocked.left) {
            this.body.velocity.x = -this.MOVE_FORCE;
        } else if ((this.scene.keys["D"].isDown || this.scene.joyStick.right) && !this.body.blocked.right) {
            this.body.velocity.x = this.MOVE_FORCE;
        }

        if (this.scene.keys["W"].isDown || this.scene.joyStick.up) {
            this.body.velocity.y = -this.MOVE_FORCE;
        } else if (this.scene.keys["S"].isDown || this.scene.joyStick.down) {
            this.body.velocity.y = this.MOVE_FORCE;
        }

        super.update();
    }
}