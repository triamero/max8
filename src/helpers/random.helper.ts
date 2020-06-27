export class RandomHelper {

    public static GenerateIndex(max: number): number {
        return Math.min(max - 1, Math.floor(Math.random() * max));
    }

    public static GenerateValue(): number {
        let coef = 1;

        if (Math.random() < 0.5) {
            coef = -1;
        }

        let value = RandomHelper.GenerateRandom();

        return value * coef;
    }

    private static GenerateRandom(): number {
        return Math.floor(1 + Math.random() * 8);
    }
}
