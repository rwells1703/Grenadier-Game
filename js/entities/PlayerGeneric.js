import { Entity } from './Entity.js';

export class PlayerGeneric extends Entity {
    constructor (scene, xPos, yPos, id) {
        super(scene, xPos, yPos, 'Player', false);

        scene.otherPlayers.add(this);

        this.scale = 0.25;

        this.id = id;
        this.health = 15;
        this.direction = 'R';

        this.MOVE_FORCE = 500;
        this.DRAG = 2000;

        this.GRENADE_THROW_SPEED = 1000;
        this.GRENADE_THROW_TIMEOUT = 1000;
        this.GRENADE_THROW_RANGE = 300;

        this.body.drag.x = this.DRAG;
        this.body.drag.y = this.DRAG;

        this.grenades = scene.physics.add.group();
    }

    damage(damageValue) {
        this.health -= damageValue;

        if (this.health <= 0) {
            if (this.id == this.scene.player.id) {
                this.scene.scene.start('LoseScene');
                this.scene.gameOver = true;
                this.scene.events.off();
                this.scene.registry.destroy();
            }
            
            this.destroy();
        }
    }

    update() {
        if (this.body.velocity.x > 0) {
            this.direction = 'R';
            this.movement = 'Moving'
        } else if (this.body.velocity.x < 0) {
            this.direction = 'L';
            this.movement = 'Moving';
        } else {
            this.movement = 'Stationary';
        }

        this.updateGraphics();
    }
}