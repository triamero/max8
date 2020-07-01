import {Difficulty} from "./difficulty";

export interface GameParameters {
    difficulty: Difficulty;
    size: number;
    isNew: boolean;
    restart: boolean;
}
