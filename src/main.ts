import * as Phaser from "phaser";
import {
    BootScene,
    GameOverScene,
    GameScene,
    GameMenuScene,
    HallOfFameScene,
    MainMenuScene,
    NewGameScene,
    PrepareGameScene,
    TrainingScene,
    NewAchievementScene
} from "./scenes";
require("./shared/linq");

class Main extends Phaser.Game {
    constructor() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 700,
            height: 800,
            scale: {
                autoCenter: Phaser.Scale.Center.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT
            },
            render: {
                transparent: true
            }
        };

        super(config);

        this.scene.add("boot", BootScene, false);
        this.scene.add("game", GameScene, false);
        this.scene.add("game-over", GameOverScene, false);
        this.scene.add("hall-of-fame", HallOfFameScene, false);
        this.scene.add("main-menu", MainMenuScene, false);
        this.scene.add("new-achievement", NewAchievementScene, false);
        this.scene.add("new-game", NewGameScene, false);
        this.scene.add("training", TrainingScene, false);
        this.scene.add("prepare-game", PrepareGameScene, false);
        this.scene.add("game-menu", GameMenuScene, false);

        this.scene.start("boot");
    }
}

window.onload = () => {
    const GameApp: Phaser.Game = new Main();
};
