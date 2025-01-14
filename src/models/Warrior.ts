import Phaser from 'phaser';
import { touchingGround } from '../core/touchingground';

export class Warrior extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'warrior', 'walk001');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set warrior properties
        this.setBodySize(this.width * 0.4, this.height * 0.9);
        this.setCollideWorldBounds(true);

        // Create animations
        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNames('warrior', { prefix: 'walk', start: 1, end: 9, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        scene.anims.create({
            key: 'slash',
            frames: scene.anims.generateFrameNames('warrior', { prefix: 'slash', start: 1, end: 6, zeroPad: 3 }),
            frameRate: 20,
            repeat: 0,
        });

        // Reset animation after slash completes
        this.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
            if (animation.key === 'slash') {
                this.anims.play('walk', true);
            }
        });
    }

    handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (cursors.space?.isDown && this.anims.currentAnim?.key !== 'slash') {
            this.setVelocityX(0); // Stop movement during the slash
            this.anims.play('slash', true);
        } else if (cursors.left?.isDown) {
            this.setVelocityX(-120); // Move left
            this.flipX = true;
        } else if (cursors.right?.isDown) {
            this.setVelocityX(120); // Move right
            this.flipX = false;
        } else if (cursors.up?.isDown && touchingGround(this)) {
            this.setVelocityY(-200); // Jump up
        } else {
            this.setVelocityX(0); // Stop if no keys are pressed
        }
    }
}
