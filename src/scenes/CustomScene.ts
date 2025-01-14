import Phaser from 'phaser';
import { preload } from '../core/preload';
import { create } from '../core/create';
import { update } from '../core/update';

export class CustomScene extends Phaser.Scene {
    warrior!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    backgrounds!: Phaser.GameObjects.TileSprite[];

    constructor() {
        super('CustomScene');
    }

    preload() {
        preload.call(this);
    }

    create() {
        create.call(this);
    }

    update() {
        update.call(this);
    }
}