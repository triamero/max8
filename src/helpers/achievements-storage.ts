const myKey = "my-achs";

export class AchievementsStorage {

    private static _map: Map<number, { enabled: boolean, name: string, description: string }>;
    private static _my: number[];

    public static init(allAchievements: any[]): void {
        if (!localStorage.getItem(myKey)) {
            localStorage.setItem(myKey, "[]");
        }

        const myAchs = this._my = JSON.parse(localStorage.getItem(myKey));

        const map = AchievementsStorage._map = allAchievements
            .toMap(
                (x: any) => <number>x[0],
                (x: any) => {
                    return {
                        enabled: !!x[1],
                        name: <string>x[2],
                        description: <string>x[3]
                    };
                });

        while (myAchs.length < map.size) {
            myAchs.push(0);
        }

        localStorage.setItem(myKey, JSON.stringify(myAchs));
    }

    public static getMy(): number[] {
        return [...this._my];
    }

    public static getById(id: number): { name: string, description: string } {
        if (!this._map.get(id)?.enabled) {
            return null;
        }
        return this._map.get(id);
    }

    public static give(id: number): void {
        if (!this._map.get(id)?.enabled) {
            return;
        }

        this._my[id] = 1;
        localStorage.setItem(myKey, JSON.stringify(this._my));
    }
}
