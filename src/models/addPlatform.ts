import Phaser from 'phaser';

export function addPlatform(scene: Phaser.Scene, tileWidth: number, y: number, tileCount: number) {
    const platformGroup = scene.physics.add.staticGroup();

    for (let i = 0; i < tileCount; i++) {
        platformGroup.create(i * tileWidth, y, 'ground');
    }

    return platformGroup;
}
