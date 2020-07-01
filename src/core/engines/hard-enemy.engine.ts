import {IEnemyEngine} from "./enemy.engine";
import {GameCell} from "@m8/core/game-cell";
import {GameField} from "@m8/core/game-field";

export class HardEnemyEngine implements IEnemyEngine {

    private _field: GameField;

    setField(gameField: GameField): void {
        this._field = gameField;
    }

    public async makeTurnAsync(index: number): Promise<GameCell> {

        if (this._field == null) {
            throw new Error("Field is not initialized");
        }

        const row = this._field.getRow(index);

        let max: number = -9;
        let maxIndex: number = -1;

        for (let i = 0; i < row.length; i++) {
            const cell = row[i];

            if (cell.isDestroyed) {
                continue;
            }

            if (cell.value > max) {
                max = cell.value;
                maxIndex = i;
            }
        }

        return row[maxIndex];
    }
}
