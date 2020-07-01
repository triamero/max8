import {GameParameters} from "./game-parameters";

export interface SavedGame extends GameParameters {

    /** Ячейки игрового поля, если значение 0, то ячейка уничтожена */
    cells: number[][];

    /** Индекс колонки, на которой находится указатель */
    index: number;

    /** Очки каждой из сторон, первый элемент - очки игрока, второй элемент - очки противника */
    score: number[];
}
