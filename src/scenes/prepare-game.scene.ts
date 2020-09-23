import {GameConfig, GameParameters, GameField, SavedGame} from "@m8/core";
import {Factory, GameStorage, RandomHelper} from "@m8/helpers";

export class PrepareGameScene extends Phaser.Scene {

    private _savedGame: SavedGame;
    private _params: GameParameters;

    // noinspection JSUnusedGlobalSymbols
    init(config: GameParameters) {
        this._params = config;
        this._savedGame = null;
    }

    // noinspection JSUnusedGlobalSymbols
    preload() {
        if (!this._params.isNew) {
            this._savedGame = GameStorage.getGame();
        }

        if (this._params.restart) {
            this._savedGame = GameStorage.getGameInitial();
        }
    }

    // noinspection JSUnusedGlobalSymbols
    create() {

        let factory: Factory;
        let gameField: GameField;
        let pointerIndex: number;
        let playerScore: number;
        let enemyScore: number;

        if (this._savedGame != null) {
            factory = new Factory(this._savedGame);
            gameField = factory.createFieldFromCells(this._savedGame.cells);
            pointerIndex = this._savedGame.index;
            playerScore = this._savedGame.score[0];
            enemyScore = this._savedGame.score[1];
        } else {
            factory = new Factory(this._params);
            gameField = factory.createField();
            pointerIndex = RandomHelper.GenerateIndex(gameField.size);
            playerScore = 0;
            enemyScore = 0;

            GameStorage.saveGameInitial({
                restart: false,
                isNew: true,
                difficulty: this._params.difficulty,
                size: this._params.size,
                cells: gameField.getCells(),
                index: pointerIndex,
                score: [0, 0]
            });
        }

        const engine = factory.createEngine();
        engine.setField(gameField);

        const config: GameConfig = {
            factory,
            gameField,
            engine,
            pointerIndex,
            playerScore,
            enemyScore,
            difficulty: this._params.difficulty
        };

        this.scene.start("game", config);
    }
}
