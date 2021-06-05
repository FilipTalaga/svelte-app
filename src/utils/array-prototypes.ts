/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
interface Array<T> {
    sum: () => number;
    last: () => T;
}

Array.prototype.sum = function () {
    return this.reduce<number>((prev: number, curr: number) => prev + curr, 0);
};

Array.prototype.last = function <T>() {
    return this[this.length - 1] as T;
};
