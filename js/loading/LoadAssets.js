export function loadImages(scene) {
    scene.load.image('Background', 'assets/sprites/background.jpg')

    scene.load.spritesheet('ConcussionGrenade', 'assets/sprites/entities/grenade.png', {frameWidth: 30, frameHeight: 30});
    scene.load.spritesheet('Platform', 'assets/sprites/entities/platform.png', {frameWidth: 64, frameHeight: 64})
    scene.load.spritesheet('Player', 'assets/sprites/entities/player.png', {frameWidth: 256, frameHeight: 256});
    scene.load.spritesheet('ExplosionConcussion', 'assets/sprites/entities/explosion_concussion.png', {frameWidth: 64, frameHeight: 64});

    scene.load.image('HealthBar', 'assets/sprites/hud/health_bar/health_bar.png');
    scene.load.image('HealthBarOutline', 'assets/sprites/hud/health_bar/health_bar_outline.png');
}

export function loadSounds(scene) {
    scene.load.audio('ButtonSound', 'assets/sounds/button.wav');
}

export function parseSpriteSheets(scene) {
    parseGenericSpriteSheet(scene, 'ConcussionGrenade', 1, 1);
    parseGenericSpriteSheet(scene, 'ExplosionConcussion', 4, 8);
    parseGenericSpriteSheet(scene, 'Platform', 1, 1);
    parsePlayerSpriteSheet(scene, 'Player', 8, true);
}

function parsePlayerSpriteSheet(scene, spritesheetKey, frameRate) {
    scene.anims.create({
        key: spritesheetKey + 'RMoving',
        frames: scene.anims.generateFrameNumbers(spritesheetKey, {start: 0, end: 7}),
        frameRate: frameRate,
        repeat: -1
    });

    scene.anims.create({
        key: spritesheetKey + 'RStationary',
        frames: scene.anims.generateFrameNumbers(spritesheetKey, {start: 0, end: 0}),
        frameRate: frameRate,
        repeat: -1
    });

    scene.anims.create({
        key: spritesheetKey + 'LMoving',
        frames: scene.anims.generateFrameNumbers(spritesheetKey, {start: 15, end: 8}),
        frameRate: frameRate,
        repeat: -1
    });

    scene.anims.create({
        key: spritesheetKey + 'LStationary',
        frames: scene.anims.generateFrameNumbers(spritesheetKey, {start: 15, end: 15}),
        frameRate: frameRate,
        repeat: -1
    });
}

function parseGenericSpriteSheet(scene, spritesheetKey, framesTotal, frameRate) {
    scene.anims.create({
        key: spritesheetKey,
        frames: scene.anims.generateFrameNumbers(spritesheetKey, {start: 0, end: framesTotal - 1}),
        frameRate: frameRate,
        repeat: -1
    });
}