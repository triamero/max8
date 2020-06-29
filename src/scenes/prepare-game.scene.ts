import {GameConfig} from "@m8/core";
import {Factory} from "@m8/helpers";

export class PrepareGameScene extends Phaser.Scene {

    private _config: GameConfig;
    private _factory: Factory;

    init(config: GameConfig) {

        if (!config.isNew) {
            const game = JSON.parse(localStorage.getItem("last-game-field"));
            this._config = JSON.parse(localStorage.getItem("last-game-config"));
        }
    }

    create() {

        this._factory = new Factory(this._config);

        const gameField = this._factory.createField();
        const engine = this._factory.createEngine();
        engine.setField(gameField);


    }
}
