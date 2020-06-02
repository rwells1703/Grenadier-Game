export function loadImages(scene) {
    scene.load.image('Background', 'assets/sprites/background.png')

    scene.load.spritesheet('ConcussionGrenade', 'assets/sprites/entities/grenade.png', {frameWidth: 30, frameHeight: 30});
    scene.load.spritesheet('Platform', 'assets/sprites/entities/platform.png', {frameWidth: 64, frameHeight: 64})
    scene.load.spritesheet('Player', 'assets/sprites/entities/player.png', {frameWidth: 48, frameHeight: 64});
}

export function parseSpriteSheets(scene) {
    parseSpriteSheet(scene, 'ConcussionGrenade', 1, 1, false);
    parseSpriteSheet(scene, 'Platform', 1, 1, false);
    parseSpriteSheet(scene, 'Player', 1, 1, true);
}

function parseSpriteSheet(scene, spritesheetKey, framesTotal, frameRate, directional) {
    let offset = 0;

    if (directional) {
        var animationKeyExtensions = ['R', 'L'];
    } else {
        var animationKeyExtensions = [''];
    }

    for (let animationKeyExtension of animationKeyExtensions) {
        scene.anims.create({
            key: spritesheetKey + animationKeyExtension,
            frames: scene.anims.generateFrameNumbers(spritesheetKey, {start: offset, end: offset + framesTotal - 1}),
            frameRate: frameRate,
            repeat: -1
        });

        offset += framesTotal;
    }
}