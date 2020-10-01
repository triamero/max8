import * as Phaser from "phaser";
import {AchievementsStorage} from "@m8/helpers";

export class BootScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    preload() {
        this.load.image("flat-button", "assets/flat-button.png");
        this.load.image("square-button", "assets/square-button.png");
        this.load.image("gear", "assets/gear.png");

        this.load.image("ach-icon", "assets/ach-icon.png");
        this.load.image("ach-back", "assets/ach-back.png");
        this.load.image("ach-end", "assets/ach-end.png");
        this.load.image("ach-icon-locked", "assets/ach-icon-locked.png");

        this.load.json("achievements", "dist/achs.json");

        this.load.scenePlugin({key: "rexuiplugin", url: "dist/rexuiplugin.min.js", sceneKey: 'rexUI'});
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        AchievementsStorage.init(this.cache.json.get("achievements"));

        this.scene.start("main-menu");
    }
}
