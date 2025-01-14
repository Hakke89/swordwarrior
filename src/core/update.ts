import { CustomScene } from '../scenes/CustomScene';
import { touchingGround } from './touchingground';
import { Warrior } from '../models/Warrior';



export function update(this: CustomScene) {
    const warrior = this.warrior as Warrior;
    const cursors = this.cursors;
    const backgrounds = this.backgrounds;

    // Handle warrior movement
    warrior.handleMovement(cursors);

    // Parallax background scrolling
    // const cameraXChange = this.cameras.main.scrollX;
    // backgrounds[1].tilePositionX += cameraXChange * 0.01;
    // backgrounds[2].tilePositionX += cameraXChange * 0.02;
    // backgrounds[3].tilePositionX += cameraXChange * 0.04;
    // backgrounds[4].tilePositionX += cameraXChange * 0.05;

    // Apply gravity if not touching ground
    if (!touchingGround(warrior)) {
        warrior.setGravityY(300);
    } else {
        warrior.setGravityY(0);
    }
}
