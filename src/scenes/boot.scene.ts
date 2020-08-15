import * as Phaser from "phaser";
import {AchievementsStorage} from "@m8/helpers";

export class BootScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    preload() {
        this.load.image("flat-button", "dist/flat-button.png");
        this.load.image("square-button", "dist/square-button.png");
        this.load.image("gear", "dist/gear.png");

        this.load.image("ach-icon", "dist/ach-icon.png");
        this.load.image("ach-back", "dist/ach-back.png");
        this.load.image("ach-end", "dist/ach-end.png");

        this.load.json("achievements", "dist/achs.json");
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        AchievementsStorage.init(this.cache.json.get("achievements"));

        this.scene.start("main-menu");
    }
}
