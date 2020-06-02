import { Entity } from '../entities/Entity.js';

export class Platform extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'Platform', true);
    }
}