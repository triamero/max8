import {IEnemyEngine} from "./enemy.engine";
import {GameCell} from "@m8/core/game-cell";
import {GameField} from "@m8/core/game-field";

export class EasyEnemyEngine implements IEnemyEngine {

    private _field: GameField;

    setField(gameField: GameField): void {
        this._field = gameField;
    }

    public makeTurnAsync(index: number): Promise<GameCell> {

        if (this._field == null) {
            throw new Error("Field is not initialized");
        }

        return new Promise<GameCell>(resolve => resolve(this.makeTurn(index)));
    }

    private makeTurn(index: number): GameCell {
        const row = this._field.getRow(index);

        return row.filter(x => !x.isDestroyed).orderByDesc(x => x.value)[0];
    }
}
