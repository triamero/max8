import {IEnemyEngine} from "./enemy.engine";
import {GameCell} from "@m8/core/game-cell";
import {GameField} from "@m8/core/game-field";

export class HardEnemyEngine implements IEnemyEngine {

    private _field: GameField;
    private readonly _depth: number = 2;

    private _paths: GameCell[][];

    setField(gameField: GameField): void {
        this._field = gameField;
    }

    public async makeTurnAsync(index: number): Promise<GameCell> {

        this._paths = [];

        if (this._field == null) {
            throw new Error("Field is not initialized");
        }

        const row = this._field.getRow(index);

        for (let i = 0; i < row.length; i++) {
            const cell = row[i];

            if (cell.isDestroyed) {
                continue;
            }

            await this._dfsAsync([cell], cell.x, cell.y, true);

            console.log(`count of paths: ${this._paths.length}`);
        }

        console.log("paths", this._paths);

        return await this._findPerfectTurnAsync();
    }

    private async _findPerfectTurnAsync(): Promise<GameCell> {

        const maxLength = Math.max.apply(null, this._paths.map(x => x.length));

        console.log("max length:", maxLength);

        let weights: { player: number, enemy: number, cell: GameCell }[] = [];

        // сортировка по убыванию
        this._paths = this._paths.sort((a, b) => a.length > b.length ? -1 : a.length < b.length ? 1 : 0);

        for (let i = 0; i < this._paths.length; i++) {
            const path = this._paths[i];

            if (path.length < maxLength) {
                break;
            }

            const playerPoints = this._getSum(path.filter((val, index) => index % 2 != 0));
            const enemyPoints = this._getSum(path.filter((val, index) => index % 2 == 0));

            weights.push({
                cell: this._paths[i][0],
                player: playerPoints,
                enemy: enemyPoints
            });
        }

        weights = weights
            .sort((a, b) => {
                // сортировка по убыванию
                if (a.enemy > b.enemy) {
                    return -1;
                } else if (a.enemy < b.enemy) {
                    return 1;
                }

                return 0;
            });

        const bestEnemyTurn = weights[0].enemy;

        const map = weights
            .filter(x => x.enemy == bestEnemyTurn)
            .reduce(
                (prev, curr) => {
                    const key = `${curr.cell.x}_${curr.cell.y}`;

                    if (!prev.has(key)) {
                        prev.set(key, []);
                    }

                    prev.get(key).push(curr);

                    return prev;
                },
                new Map<string, PathWeight[]>());

        let minPlayerValueKey = null;
        let minPlayerValue = 10000;

        for (let key of map.keys()) {
            const turns = map.get(key);
            const maxPlayerValue = Math.max.apply(null, turns.map(x => x.player));

            if (maxPlayerValue < minPlayerValue) {
                minPlayerValue = maxPlayerValue;
                minPlayerValueKey = key;
            }
        }

        return map.get(minPlayerValueKey)[0].cell;
    }

    private _getSum(cells: GameCell[]): number {

        if (cells.length < 1) {
            return 0;
        }

        return cells.map(x => x.value).reduce((prev, curr) => prev + curr);
    }

    private async _dfsAsync(path: GameCell[], cellX: number, cellY: number, byColumn: boolean): Promise<void> {

        if (path.length >= this._depth) {
            this._paths.push([...path]);
            path.pop();
            return;
        } else if (this._field.getExistsCount() == path.length) {
            this._paths.push([...path]);
            path.pop();
            return;
        }

        let anyExists = false;

        if (byColumn) {
            const column = this._field.getColumn(cellX);

            for (let y = 0; y < column.length; y++) {
                if (column[y].isDestroyed) {
                    continue;
                }

                if (path.some(z => z.x === cellX && z.y === y)) {
                    continue;
                }
                anyExists = true;

                path.push(column[y]);

                await this._dfsAsync(path, cellX, y, !byColumn);
            }
        } else {
            const row = this._field.getRow(cellY);

            for (let x = 0; x < row.length; x++) {
                if (row[x].isDestroyed) {
                    continue;
                }

                if (path.some(z => z.x === x && z.y === cellY)) {
                    continue;
                }
                anyExists = true;

                path.push(row[x]);

                await this._dfsAsync(path, x, cellY, !byColumn);
            }
        }

        if (!anyExists) {
            this._paths.push([...path]);
            path.pop();
            return;
        }
    }
}

interface PathWeight {
    player: number;
    enemy: number;
    cell: GameCell;
}
