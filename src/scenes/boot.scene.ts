import {Difficulty, GameConfig} from "@m8/core";

export class BootScene extends Phaser.Scene {

    preload() {
        this.load.image("menu-button", "dist/menu-button.png");
        this.load.image("square-button", "dist/square.png");
    }

    create() {
        const config: GameConfig = {
            size: 6,
            difficulty: Difficulty.Easy
        };

        this.scene.start("menu", config);
    }
}
