import {IEnemyEngine} from "./enemy.engine";
import {GameCell} from "@m8/core/game-cell";
import {GameField} from "@m8/core/game-field";

export class HardEnemyEngine implements IEnemyEngine {

    private _field: GameField;
    private readonly _depth: number = 4;

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
        }

        console.log("paths:", this._paths.length);

        return await this._getPerfectTurnAsync();
    }

    private async _getPerfectTurnAsync(): Promise<GameCell> {

        const maxLength = this._paths.max(x => x.length);

        console.log("max length:", maxLength);

        const map = this._paths
            .filter(x => x.length >= maxLength)
            .map(path => {

                const playerTurns = path.filter((x, index) => index % 2 !== 0);

                let playerPoints = 0;
                if (playerTurns.length > 0) {
                    playerPoints = playerTurns.sum(x => x.value) / playerTurns.length;
                }

                return {
                    playerPoints: playerPoints,
                    enemyPoints: path.filter((x, index) => index % 2 === 0).sum(x => x.value),
                    path: path
                };
            })
            // сортировка по двум полям по убыванию
            .sort((a, b) => {
                if (a.enemyPoints > b.enemyPoints) {
                    return -1;
                } else if (a.enemyPoints < b.enemyPoints) {
                    return 1;
                }

                if (a.playerPoints > b.playerPoints) {
                    return -1;
                } else if (a.playerPoints < b.playerPoints) {
                    return 1;
                }

                return 0;
            });

        console.log("first path:", this.stringifyPath(map[0].path));

        let bestPath = map.find(x => x.enemyPoints > x.playerPoints * x.path.length)?.path;

        if (!bestPath) {
            console.log("path with enemyPoints > playerPoints not found, took first");
            bestPath = map[0].path;
        }

        console.log("best path:", this.stringifyPath(bestPath));

        return bestPath[0];
    }

    private async _dfsAsync(path: GameCell[], cellX: number, cellY: number, byColumn: boolean): Promise<void> {

        if (path.length >= this._depth) {
            this._paths.push([...path]);
            return;
        } else if (this._field.getExistsCount() == path.length) {
            this._paths.push([...path]);
            return;
        }

        let anyExists = false;

        if (byColumn) {
            const column = this._field.getColumn(cellX);

            for (let y = 0; y < column.length; y++) {

                const cell = column[y];

                if (cell.isDestroyed) {
                    continue;
                }

                if (path.some(z => z.x === cell.x && z.y === cell.y)) {
                    continue;
                }
                anyExists = true;

                path.push(cell);

                await this._dfsAsync(path, cellX, y, !byColumn);

                path.pop();
            }
        } else {
            const row = this._field.getRow(cellY);

            for (let x = 0; x < row.length; x++) {

                const cell = row[x];

                if (cell.isDestroyed) {
                    continue;
                }

                if (path.some(z => z.x === cell.x && z.y === cell.y)) {
                    continue;
                }
                anyExists = true;

                path.push(cell);

                await this._dfsAsync(path, x, cellY, !byColumn);

                path.pop();
            }
        }

        if (!anyExists) {
            this._paths.push([...path]);
            return;
        }
    }

    private stringifyPath(path: GameCell[]): string {
        return path
            .map(x => `[${x.x};${x.y}](${x.value})`)
            .reduce(
                (prev, curr) => {
                    if (prev.length > 0) {
                        prev += "=>";
                    }
                    prev += curr;
                    return prev;
                },
                "");
    }
}
