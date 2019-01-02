import { expect } from "chai";
import { createHash } from "crypto";
import "mocha";
import { Simulator } from "../../../src/monte-carlo-search-tree/simulator";
import { RandomSelector } from "../../../src/selector/random-selector";
import { LazyStateMachine } from "../../../src/state-machine/lazy-state-machine";
import { IState } from "../../../src/state-machine/state-interface";
import { ITransition } from "../../../src/state-machine/transition-interface";

const ticTacToeStateMachineDefinition = {
    stateDict: {
        initial: {
            grid: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ],
            player: "X",
        },
    },
    transitionDict: {},
};

describe("Simulator", () => {
    it("should be instantiable", () => {
        const stateMachine = new LazyStateMachine(
            ticTacToeStateMachineDefinition,
            (state) => {
                return [{}, []];
            },
        );
        const simulator = new Simulator(stateMachine, () => 10, RandomSelector);
        expect(simulator).to.be.instanceOf(Simulator);
    });
    it("should be able to play tic-tac-toe", () => {
        const stateMachine = new LazyStateMachine(
            ticTacToeStateMachineDefinition,
            (state) => {
                const grid = state.getValue("grid");
                const player = state.getValue("player");
                const nextPlayer = player === "X" ? "Y" : "X";
                const stateDict: {[stateName: string]: IState} = {};
                const transitionList: ITransition[] = [];
                grid.forEach((row: string[], rowIndex: number) => {
                    row.forEach((tile: string, tileIndex: number) => {
                        if (tile === "") {
                            const newGrid = JSON.parse(JSON.stringify(grid));
                            newGrid[rowIndex][tileIndex] = player;
                            const hasher = createHash("sha256");
                            const stateDescription = {
                                grid: newGrid,
                                player: nextPlayer,
                            };
                            hasher.update(JSON.stringify(stateDescription));
                            const stateName = hasher.digest("base64");
                            stateDict[stateName] = stateDescription;
                        }
                    });
                });
                return [stateDict, transitionList];
            },
        );
        const simulator = new Simulator(
            stateMachine,
            (transition: ITransition) => {
                return 10;
            },
            RandomSelector,
        );
        simulator.simulate("initial");
    });
});
