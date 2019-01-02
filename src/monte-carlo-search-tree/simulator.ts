import { RandomSelector } from "../selector/random-selector";
import { StateMachine } from "../state-machine/state-machine";
import { ITransition } from "../state-machine/transition-interface";
import { RandomSelectorInterface } from "./random-selector-interface";
import { StateEvaluator } from "./state-evaluator-interface";

export class Simulator {
    private stateMachine: StateMachine;
    private nbIteration: number = 0;
    private randomSelector: RandomSelector<ITransition>;
    constructor(
        stateMachine: StateMachine,
        valueEvaluationFunction: StateEvaluator,
        randomSelector: RandomSelectorInterface,
    ) {
        this.stateMachine = stateMachine;
        this.randomSelector = new randomSelector((transition: ITransition) => {
            // if it's a final node
            //  get the value for the playing agent
            // else
            //  recursively get the value
            const state = this.stateMachine.getState(transition.destination);
            return valueEvaluationFunction(state);
        });
    }
    public simulate(stateName: string, nbIteration: number = 100) {
        this.nbIteration = nbIteration;
        this._monteCarlo(stateName);
    }
    private _monteCarlo(stateName: string): ITransition | undefined {
        let selectedTransition;
        if (this.nbIteration > 0 ) {
            const stateTransitionList = this._getStateTransitionList(stateName);
            selectedTransition = this._select(stateTransitionList);
        }
        return selectedTransition;
    }
    private _getStateTransitionList(stateName: string) {
        return this.stateMachine.getStateTransitionList(stateName);
    }
    private _select(transitionList: ITransition[]) {
        return this.randomSelector.rouletteSelect(transitionList);
        // roulette select a state to simulate from
    }
}
