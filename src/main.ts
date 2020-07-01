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
    TrainingScene
} from "./scenes";

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


/*
* Ачивки:
* ГТО - пройти обучение
* Первая кровь - победить на низком уровне сложности
* Последняя кровь - победить на высоком уровне сложности
* AI lives matter - проиграть 10 раз
* Я отсюда никогда не выберусь - противник не оставил игроку возможности для хода
* Выхода нет - не оставить сопернику возможности для хода
* Нарцисс - зайти на сцену достижений
* Так можно было?! - завершить игру ничьей
* Сапер - завершить игру, не взяв ни одного отрицательного числа
* Моя прелесть - взять число 8
* Они украли мою прелесть! - взять число -8
*/
