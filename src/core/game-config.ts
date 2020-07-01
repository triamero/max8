import {Factory} from "@m8/helpers";
import {GameField} from "./game-field";
import {IEnemyEngine} from "./engines";

export interface GameConfig {
    factory: Factory;

    gameField: GameField;

    engine: IEnemyEngine;

    pointerIndex: number;

    playerScore: number;
    enemyScore: number;
}
