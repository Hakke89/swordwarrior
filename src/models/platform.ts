// models/platform.ts

import Phaser from 'phaser';

export function addPlatform(this: Phaser.Scene, x: number, y: number, tileCount: number): Phaser.Physics.Arcade.StaticGroup | null {
    if (!this.physics) {
        console.error("Physics engine not initialized.");
        return null;
    }

    const TILE_WIDTH = 74;
    const TILE_HEIGHT = 74;
    const platforms = this.physics.add.staticGroup();

    if (!platforms) {
        console.error("Static group creation failed.");
        return null;
    }

    for (let i = 0; i < tileCount; i++) {
        const platformX = x + (i * TILE_WIDTH);
        const platform = platforms.create(platformX, y - TILE_HEIGHT / 2, 'ground', 'ground_mid');
        if (!platform) {
            console.error(`Platform creation failed at x=${platformX}, y=${y}`);
            return null;
        }
    }

    return platforms;
}
