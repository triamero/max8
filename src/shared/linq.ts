interface Array<T> {
    max(selector: (value: T) => number): number;

    min(selector: (value: T) => number): number;

    sum(selector: (value: T) => number): number;

    orderBy(selector: (value: T) => any): this;

    orderByDesc(selector: (value: T) => any): this;

    toMap<TKey, TValue>(keySelector: (value: T) => TKey, valueSelector: (value: T) => TValue): Map<TKey, TValue>;
}


Array.prototype.max = function (selector) {
    return Math.max.apply(null, this.map(selector));
};

Array.prototype.min = function (selector) {
    return Math.min.apply(null, this.map(selector));
};

Array.prototype.sum = function (selector) {
    if (this.length < 1) {
        return 0;
    }
    return this.reduce((prev, curr) => prev += selector(curr), 0);
};

Array.prototype.orderBy = function (selector) {
    return this.sort((a, b) => {
        const valA = selector(a);
        const valB = selector(b);

        if (valA > valB) {
            return 1;
        } else if (valA < valB) {
            return -1;
        }

        return 0;
    });
};

Array.prototype.orderByDesc = function (selector) {
    return this.sort((a, b) => {
        const valA = selector(a);
        const valB = selector(b);

        if (valA > valB) {
            return -1;
        } else if (valA < valB) {
            return 1;
        }

        return 0;
    });
};

Array.prototype.toMap = function (keySelector, valueSelector) {
    const result = new Map();

    this.forEach(item => {
        const key = keySelector(item);

        if (result.has(key)) {
            throw Error(`An item with the same key '${key}' already added`);
        }
        result.set(key, valueSelector(item));
    });

    return result;
};

