import * as Phaser from "phaser";
import {BootScene, GameOverScene, GameScene, HallOfFameScene, MenuScene, NewGameScene, TrainingScene} from "./scenes";

class Main extends Phaser.Game {
    constructor() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 600,
            height: 800,
            scale: {
                autoCenter: Phaser.Scale.Center.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT
            }
        };

        console.log("window size:", [window.innerWidth, window.innerHeight]);
        super(config);

        this.scene.add("boot", BootScene, false);
        this.scene.add("game", GameScene, false);
        this.scene.add("game-over", GameOverScene, false);
        this.scene.add("hall-of-fame", HallOfFameScene, false);
        this.scene.add("menu", MenuScene, false);
        this.scene.add("new-game", NewGameScene, false);
        this.scene.add("training", TrainingScene, false);

        this.scene.start("boot");
    }
}

window.onload = () => {
    const GameApp: Phaser.Game = new Main();
};


/*
* Ачивки:
* ГТО - пройти обучение
* Первая кровь - победить 1 раз на низком уровне сложности
* Последняя кровь - победить 1 раз на высоком уровне сложности
* Я никогда отсюда не выберусь - противник не оставил игроку возможности для хода
* Выхода нет - не оставить сопернику возможности для хода
* Нарцисс - зайти на сцену достижений
* Так можно было?! - завершить игру ничьей
* Сапер - завершить игру, не взяв ни одного отрицательного числа
* Моя прелесть - взять число 8
* Они украли мою прелесть! - взять число -8
*/
