import { expect } from "chai";
import "mocha";
import { State } from "../../../src/state-machine/state";

describe("State", () => {
    it("should be instantiable", () => {
        const state = new State({});
        expect(state).to.be.instanceOf(State);
    });
});
