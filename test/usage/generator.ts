import { expect } from "chai";
import "mocha";

describe("generator", () => {
    it("should start from root generator at each yield", () => {
        function* level1() {
            yield* level2();
        }
        function* level2() {
            yield 1;
            yield* level3();
            yield 5;
        }
        function* level3() {
            yield 2;
            yield 3;
            yield 4;
        }
        const generator = level1();
        let iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
    });
    it("should start from root generator at each yield", () => {
        let index = 0;
        function* level1() {
            const lvl2generator = level2();
            let isDone = false;
            do {
                const canIterate = index < 4;
                if (canIterate) {
                    const tmpIteration = lvl2generator.next();
                    isDone = tmpIteration.done;
                } else {
                    yield;
                }
            } while (!isDone);
        }
        function* level2() {
            for (let index2 = 0; index2 < 8; index2++) {
                yield* level3();
            }
            yield;
        }
        function* level3() {
            index++;
            yield;
        }
        const generator = level1();
        let iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
        iteration = generator.next();
    });
});
