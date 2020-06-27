import {GameCell} from "@m8/core/game-cell";
import {GameField} from "@m8/core/game-field";

export interface IEnemyEngine {

    setField(gameField: GameField): void;

    makeTurnAsync(index: number): Promise<GameCell>;
}
