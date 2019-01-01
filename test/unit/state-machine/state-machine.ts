import { expect } from "chai";
import "mocha";
import { StateMachine } from "../../../src/state-machine/state-machine";

describe("StateMachine", () => {
    it("should be instantiable", () => {
        const stateMachine = new StateMachine({
            stateDict: {},
            transitionDict: {},
        });
        expect(stateMachine).to.be.instanceOf(StateMachine);
    });
});
