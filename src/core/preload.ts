export function preload(this: Phaser.Scene) {
    // Warrior
    this.load.atlas('warrior', 'src/assets/warrior.png', 'src/assets/warrior_sprite.json');

    // Ground
    this.load.atlas('ground', 'src/assets/ground.png', 'src/assets/ground.json');

    // Background
    for (let i = 1; i <= 5; i++) {
        this.load.image('background' + i, 'src/assets/PNG/summer6/layer' + i + '.png');
    }
}
