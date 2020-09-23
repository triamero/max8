import {Factory} from "@m8/helpers";
import {Difficulty} from "./difficulty";
import {IEnemyEngine} from "./engines";
import {GameField} from "./game-field";

export interface GameConfig {
    factory: Factory;

    gameField: GameField;

    engine: IEnemyEngine;

    pointerIndex: number;

    difficulty: Difficulty

    playerScore: number;
    enemyScore: number;
}
