import { Entity } from './Entity.js';

export class PlayerGeneric extends Entity {
    constructor (scene, xPos, yPos, id) {
        super(scene, xPos, yPos, 'Player', false);

        scene.otherPlayers.add(this);

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

        this.grenadeTimer = 0;
        this.prevGrenadeTimer = 0;

        this.grenades = scene.physics.add.group();
    }

    damage(damageValue) {
        this.health -= damageValue;

        if (this.health <= 0) {
            this.health = 0;
        }
    }

    update() {
        this.updateGraphics();
    }
}