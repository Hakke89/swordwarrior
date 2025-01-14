export function touchingGround(sprite: Phaser.Physics.Arcade.Sprite) {
    // Make sure the sprite exists and has a body
    if (!sprite || !sprite.body) {
        console.warn("touchingGround was called with a sprite that has no body.");
        return false;
    }
    // Check if the sprite is actually touching the ground
    const isTouching = sprite.body.touching.down; // This is more reliable than checking world bounds

    // If not touching the ground, check for a small buffer zone before assuming it is in the air
    if (!isTouching && sprite.body.velocity.y > 5) {
        // The sprite is falling, return false
        return false;
    }

    return isTouching;
}