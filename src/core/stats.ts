export interface Stats {

    /** Количество игр на низком уровне сложности */
    gamesEasy: number;

    /** Количество выигранных игр на низком уровне сложности */
    gamesEasyWon: number;

    /** Количество игр на высоком уровне сложности */
    gamesHard: number;

    /** Количество выигранных игр на высоком уровне сложности */
    gamesHardWon: number;

    /** Количество ничьих */
    draws: number;

    /** Обучение пройдено */
    trainingCompleted: number;

    /** Страница достижений посещена */
    achievementsVisited: number;
}
