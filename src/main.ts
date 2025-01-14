import Phaser from 'phaser';
import { CustomScene } from './scenes/CustomScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    width: 800,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: false,
        },
    },
    backgroundColor: '#999999',
    scene: new CustomScene(),
    pixelArt: true,
};

new Phaser.Game(config);
