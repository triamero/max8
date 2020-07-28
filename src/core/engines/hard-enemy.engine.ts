// noinspection TypeScriptPreferShortImport
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

        for (let cell of row.filter(x => !x.isDestroyed)) {
            await this._dfsAsync([cell], cell.x, cell.y, true);
        }

        // console.log("paths:", this._paths.length);

        return await this._getBestTurnAsync();
    }

    private async _getBestTurnAsync(): Promise<GameCell> {

        const maxLength = this._paths.max(x => x.length);

        // console.log("max length:", maxLength);
        const paths = this._paths.filter(x => x.length === maxLength);

        const bestScoresMap: Map<string, number[]> = new Map<string, number[]>();

        for (let path of paths) {

            const firstCell = path[0];

            const firstCellKey = `${firstCell.x}_${firstCell.y}`;

            if (!bestScoresMap.has(firstCellKey)) {
                bestScoresMap.set(firstCellKey, []);
            }

            let scores = bestScoresMap.get(firstCellKey);

            for (let i = 0; i < path.length; i++) {
                const cell = path[i];

                while (scores.length < i + 1) {
                    scores.push(cell.value);
                }

                if (scores[i] < cell.value) {
                    scores[i] = cell.value;
                }
            }
        }

        // console.log("map:", bestScoresMap);

        const bestScores = [];

        for (let key of bestScoresMap.keys()) {
            const playerScore = bestScoresMap.get(key).filter((x, i) => i % 2 !== 0).sum(x => x);
            const enemyScore = bestScoresMap.get(key).filter((x, i) => i % 2 === 0).sum(x => x);
            const coords = key.split('_');

            bestScores.push({
                playerScore: playerScore,
                enemyScore: enemyScore,
                cell: this._field.getCell(+coords[0], +coords[1])
            });
        }

        const map = bestScores
            .sort((a, b) => {
                if (a.enemyScore > b.enemyScore) {
                    return -1;
                } else if (a.enemyScore < b.enemyScore) {
                    return 1;
                }

                if (a.playerScore > b.playerScore) {
                    return -1;
                } else if (a.playerScore < b.playerScore) {
                    return 1;
                }

                return 0;
            });


        // console.log("first path cell:", this.stringify(map[0].cell));

        let bestPathCell = map.find(x => x.enemyScore > x.playerScore)?.cell;

        if (!bestPathCell) {
            // console.log("path with enemyPoints > playerPoints not found, took first");
            bestPathCell = map[0].cell;
        }

        // console.log("best turn:", this.stringify(bestPathCell));

        return bestPathCell;
    }

    private async _dfsAsync(path: GameCell[], cellX: number, cellY: number, byColumn: boolean): Promise<void> {

        if (path.length >= this._depth) {
            this._paths.push([...path]);
            return;
        } else if (this._field.getExistsCount() == path.length) {
            this._paths.push([...path]);
            return;
        }

        let cells: GameCell[] = byColumn
            ? this._field.getColumn(cellX)
            : this._field.getRow(cellY);

        let anyExists = false;

        for (let cell of cells.filter(x => !x.isDestroyed)) {
            if (path.some(z => z.x === cell.x && z.y === cell.y)) {
                continue;
            }
            anyExists = true;

            path.push(cell);

            await this._dfsAsync(path, cell.x, cell.y, !byColumn);

            path.pop();
        }

        if (!anyExists) {
            this._paths.push([...path]);
            return;
        }
    }

    private stringify(cell: GameCell): string {
        return `[${cell.x};${cell.y}](${cell.value})`;
    }
}
