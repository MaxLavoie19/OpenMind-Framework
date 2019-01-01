import { expect } from "chai";
import "mocha";
import { LazyStateMachine } from "../../../src/state-machine/lazy-state-machine";
import { IState } from "../../../src/state-machine/state-interface";
import { ITransition } from "../../../src/state-machine/transition-interface";

describe("LazyStateMachine", () => {
    it("should be instantiable", () => {
        const lazyStateMachine = new LazyStateMachine(
            {
                stateDict: {},
                transitionDict: {},
            },
            (state) => {
                return [{}, []];
            },
        );
        expect(lazyStateMachine).to.be.instanceOf(LazyStateMachine);
    });
    describe("getStateTransitionList", () => {
        it("should create new states and transitions", () => {
            const blankState = {
                name: "blank",
            };
            const lazyStateMachine = new LazyStateMachine(
                {
                    stateDict: {
                        blank: blankState,
                    },
                    transitionDict: {},
                },
                (state) => {
                    const stateDict: IState = {};
                    const name = state.getValue("name");
                    const transitionList: ITransition[] = [];
                    if (name === "blank") {
                        const childName = "child";
                        stateDict[childName] = {name: "child"};
                        transitionList.push({
                            destination: "child",
                            origin: "blank",
                        });
                    }
                    return [stateDict, transitionList];
                },
            );
            const stateTransitionList = lazyStateMachine.getStateTransitionList("blank");
            expect(stateTransitionList.length).to.equal(1);
        });
    });
});
