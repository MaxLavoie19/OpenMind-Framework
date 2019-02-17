import { expect } from "chai";
import { createHash } from "crypto";
import "mocha";
import { Simulator } from "../../../src/monte-carlo-search-tree/simulator";
import { RandomSelector } from "../../../src/selector/random-selector";
import { LazyStateMachine } from "../../../src/state-machine/lazy-state-machine";
import { State } from "../../../src/state-machine/state";
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
        /**
         * reflextions:
         * return the probability of the transition occuring considering agents preferences?
         * Theory of mind will take care of preferences.
         * The search tree is not responsible for solving a princess bride problem.
         * The search tree does not expect a value function but a probability function.
         * A value function could be used in a turn based game.
         * In a synchronous or real time game, the probability is solved by
         *  [inser game theory solution here]
         * An agent will want to know the long term outcome of an action for himself.
         *  Return the most likely outcome? no. To compute it we would need the probability
         *  Compute at each node? yes, Ua = Σ V(o) * P(o|a)
         *      Where o = outcome, a = action, V a value function, U the utility of an action
         * The probability will change with beliefs about other's evaluation.
         *  A risk averse agent will avoid a risky behavior which would make him predictable.
         *      If he is predictable, his opponent will easily maximize against him
         *          by maximizing against safe moves.
         *      Safe action will lead to terrible outcome.
         *      To be safe he should take risks.
         * Is it possible that the probabilities will converge after some itterations?
         */
        const simulator = new Simulator(
            stateMachine,
            (originState: State, state: State, childStateList: State[]) => {
                // for tic-tac-toe,
                //  return the value of the action using the following formula.
                //  Ua = Σ(V(o) * P(o|a))
                return 10;
            },
            RandomSelector,
        );
        simulator.simulate("initial");
    });
});
