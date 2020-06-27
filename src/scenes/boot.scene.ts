import {Difficulty, GameConfig} from "@m8/core";

export class BootScene extends Phaser.Scene {

    preload() {
        this.load.image("menu-button", "assets/menu-button.png");
        this.load.image("square-button", "assets/square.png");
    }

    create() {
        const config: GameConfig = {
            size: 6,
            difficulty: Difficulty.Easy
        };

        this.scene.start("menu", config);
    }
}
