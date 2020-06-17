import { Player } from './Player.js';

export class PlayerEnemy extends Player {
    constructor (scene, xPos, yPos, id) {
        super(scene, xPos, yPos, id);

        scene.otherPlayers.add(this);
    }
}