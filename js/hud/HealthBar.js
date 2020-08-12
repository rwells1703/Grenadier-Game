export class HealthBar extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        this.bar = this.create(50, 50, 'HealthBar');
        this.bar.setOrigin(0);
        this.bar.setScrollFactor(0);
        this.bar.depth = 1;

        this.outline = this.create(50, 50, 'HealthBarOutline');
        this.outline.setOrigin(0);
        this.outline.setScrollFactor(0);
        this.outline.depth = 1;
    }

    setPercent(proportion){
        this.bar.scaleX = proportion;
    }
}