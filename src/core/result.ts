import {Turn} from "@m8/core/turn";

export interface Result {

    boardEmpty: boolean;

    playerScore: number;
    enemyScore: number;

    turn: Turn;
}
