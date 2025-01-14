import { addPlatform } from '../models/addPlatform';
import { Warrior } from '../models/Warrior';
import { CustomScene } from '../scenes/CustomScene';

export function create(this: CustomScene) {
    // Create parallax backgrounds
    const backgrounds: Phaser.GameObjects.TileSprite[] = [];
    for (let i = 1; i <= 5; i++) {
        backgrounds[i] = this.add.tileSprite(i * 10, -70, 3000, 0, 'background' + i).setOrigin(0, 0);
        backgrounds[i].setScale(1.4, 1.4);
    }
    this.backgrounds = backgrounds;

    // Add platforms
    const groundY = 450;
    const platformGroup = addPlatform(this, 74 / 2, groundY, 3000 / 74);

    // Create warrior
    this.warrior = new Warrior(this, 400, 325);

    // Add collisions
    this.physics.add.collider(this.warrior, platformGroup);

    // Set cursors for input
    this.cursors = this.input.keyboard?.createCursorKeys() ?? {} as Phaser.Types.Input.Keyboard.CursorKeys;

    // Camera settings
    this.cameras.main.startFollow(this.warrior, true, 0.08, 0.08, -100, 120);
}
