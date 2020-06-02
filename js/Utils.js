export function throwGrenade(scene, originEntity, xTarget, yTarget, throwSpeed, throwRange, GrenadeClass) {
    let xDistance = xTarget - originEntity.sprite.body.x;
    let yDistance = yTarget - originEntity.sprite.body.y;
    let distance = Math.sqrt(xDistance**2 + yDistance**2);

    let speedCoefficient = distance / throwRange;

    // If they are throwing outside the range
    if (speedCoefficient > 1) {
        speedCoefficient = 1;
    }

    let xVelocity = xDistance/distance * throwSpeed * speedCoefficient + originEntity.sprite.body.velocity.x;
    let yVelocity = yDistance/distance * throwSpeed * speedCoefficient + originEntity.sprite.body.velocity.y;

    let grenade = new GrenadeClass(scene.grenades, scene.grenadesArr, originEntity, xVelocity, yVelocity);
}