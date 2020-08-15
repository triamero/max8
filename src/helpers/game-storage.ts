import {GameParameters, SavedGame} from "@m8/core";

const GameKey = "saved-game";
const GameInitKey = "saved-game-initial";
const GameConfigKey = "game-config";

export class GameStorage {

    public static removeGame() {
        localStorage.removeItem(GameKey);
    }

    public static removeGameInitial() {
        localStorage.removeItem(GameInitKey);
    }

    public static saveGame(game: SavedGame): void {
        localStorage.setItem(GameKey, JSON.stringify(game));
    }

    public static saveGameInitial(game: SavedGame): void {
        localStorage.setItem(GameInitKey, JSON.stringify(game));
    }

    public static getGame(): SavedGame {
        const json = localStorage.getItem(GameKey);
        return JSON.parse(json);
    }

    public static getGameInitial(): SavedGame {
        const json = localStorage.getItem(GameInitKey);
        return JSON.parse(json);
    }

    public static hasGame(): boolean {
        const value = localStorage.getItem(GameKey);
        return !!value;
    }

    public static getGameParams(): GameParameters {

        const prevGameJson = localStorage.getItem(GameConfigKey);

        if (prevGameJson != null) {
            return JSON.parse(prevGameJson);
        }

        return null;
    }

    public static saveGameParams(params: GameParameters): void {
        localStorage.setItem(GameConfigKey, JSON.stringify(params));
    }
}
