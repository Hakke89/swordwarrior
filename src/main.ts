// main.ts
import Phaser from 'phaser';
import { addPlatform } from "./models/platform";
import warriorPNG from './assets/img/warrior.png';
import warriorJSON from './assets/warrior_sprite.json';
import groundPNG from './assets/img/ground.png';
import groundJSON from './assets/ground.json';
import layer1 from './assets/img/summer6/layer1.png';
import layer2 from './assets/img/summer6/layer2.png';
import layer3 from './assets/img/summer6/layer3.png';
import layer4 from './assets/img/summer6/layer4.png';
import layer5 from './assets/img/summer6/layer5.png';

// Add some CSS margin
document.body.style.margin = '5px';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const GAME_WIDTH = 3000;

// Config for the Phaser game
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: false
        }
    },
    backgroundColor: '#999999',
    scene: {
        preload,
        create,
        update
    },
    pixelArt: true
};

// Initialize the Phaser game instance
const game = new Phaser.Game(config);

let warrior: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let background: Phaser.GameObjects.TileSprite[] = [];

let initialLeftXPosition: number;

let previousCameraX = 0; // Track the previous scrollX position of the camera

function preload(this: Phaser.Scene) {
    // warrior
    this.load.atlas('warrior', warriorPNG, warriorJSON);

    // ground
    this.load.atlas('ground', groundPNG, groundJSON);

    // parallax background
    this.load.image('background1', layer1);
    this.load.image('background2', layer2);
    this.load.image('background3', layer3);
    this.load.image('background4', layer4);
    this.load.image('background5', layer5);

    // this.load.image('background' + i, 'src/assets/PNG/summer6/layer' + i + '.png');

}

function create(this: Phaser.Scene) {
    // DUBBGING: Uncomment the line below to enable physics debugging
    // this.physics.world.createDebugGraphic();

    for (let i = 1; i <= 5; i++) {
        background[i] = this.add.tileSprite(i * 10, -70, GAME_WIDTH, 0, 'background' + i).setOrigin(0, 0);
        background[i].setScale(1.4, 1.4);
    }

    // Define walking and slash animations
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('warrior', { prefix: 'walk', start: 1, end: 9, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'slash',
        frames: this.anims.generateFrameNames('warrior', { prefix: 'slash', start: 1, end: 6, zeroPad: 3 }),
        frameRate: 20,
        repeat: 0
    });

    // Create a sample platform
    const groundY = 450;  // The y-position of the ground platform
    const platformGroup = addPlatform.call(this, (74 / 2), groundY, (GAME_WIDTH / 74));

    // Create warrior sprite
    warrior = this.physics.add.sprite(CANVAS_WIDTH / 2, 325, 'warrior', 'walk001');
    warrior.setBodySize(warrior.width * 0.4, warrior.height * 0.9);
    warrior.setCollideWorldBounds(true);


    // Add collision between the warrior and platforms
    if (platformGroup) {
        this.physics.add.collider(warrior, platformGroup);
    }

    // Set the world bounds' bottom based on the ground's bottom position
    this.physics.world.setBounds(0, 0, GAME_WIDTH, groundY);

    // Set world bounds and warrior collision with world bounds
    warrior.setCollideWorldBounds(true);

    // Set the camera to follow the warrior
    this.cameras.main.startFollow(warrior, true, 0.08, 0.08, -100, 120);
    previousCameraX = this.cameras.main.scrollX;

    // Initialize cursor keys for movement
    if (this.input.keyboard) {
        cursors = this.input.keyboard.createCursorKeys();
    }

    // Triggered at the start of the slash animation
    warrior.on('animationstart', (animation: Phaser.Animations.Animation) => {
        if (animation.key === 'slash') {
            // Capture the initial left edge position
            initialLeftXPosition = warrior.getLeftCenter().x;
        }
    });

    // Reset animation after slash completes
    warrior.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
        if (animation.key === 'slash') {
            warrior.anims.play('walk', true);
        }
    });

}

/**
 * Returns true if the given sprite is currently touching the ground.
 * @param sprite The sprite to check.
 * @returns True if the sprite was touching the ground, false otherwise.
 */
function touchingGround(sprite: Phaser.Physics.Arcade.Sprite, buffer: number = 25) {
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

function update(this: Phaser.Scene, time: number, delta: number) {
    if (!warrior) {
        console.error("Warrior sprite not found");
        return;
    }

    // Check for slash (attack) animation
    if (cursors.space?.isDown && warrior.anims.currentAnim?.key !== 'slash') {
        warrior.setVelocityX(0); // Stop horizontal movement during the slash
        warrior.anims.play('slash', true);
    }

    // Horizontal movement logic (applies even when airborne)
    if (cursors.left?.isDown) {
        warrior.setVelocityX(-120); // Move left
        warrior.flipX = true;
    } else if (cursors.right?.isDown) {
        warrior.setVelocityX(120); // Move right
        warrior.flipX = false;
    } else {
        // Stop horizontal movement if no left/right key is pressed
        warrior.setVelocityX(0);
    }

    // Jump movement logic
    if (cursors.up?.isDown && touchingGround(warrior)) {
        warrior.setVelocityY(-200); // Jump up
    }

    // Animation logic
    if (touchingGround(warrior) && warrior && warrior.body) {
        // Only play "walk" animation when grounded and moving horizontally
        if (warrior.body.velocity.x !== 0 && warrior.anims.currentAnim?.key !== 'slash') {
            warrior.anims.play('walk', true);
        } else if (warrior.body.velocity.x === 0 && warrior.anims.currentAnim?.key === 'walk') {
            warrior.anims.stop(); // Stop "walk" animation when idle on the ground
        }

        // Stop gravity or adjust it when walking
        warrior.setGravityY(0); // Disable gravity effect when grounded and walking
    } else {
        // If airborne (not grounded), gravity should be applied
        warrior.setGravityY(300); // Re-enable gravity (or the default value you prefer)
    }

    // Parallax background logic
    const cameraXChange = this.cameras.main.scrollX - previousCameraX;
    previousCameraX = this.cameras.main.scrollX;

    // Update background layers for parallax effect
    background[1].tilePositionX += cameraXChange * 0.01;
    background[2].tilePositionX += cameraXChange * 0.02;
    background[3].tilePositionX += cameraXChange * 0.04;
    background[4].tilePositionX += cameraXChange * 0.05;
}