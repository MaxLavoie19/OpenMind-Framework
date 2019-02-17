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
        evaluateState: StateEvaluator,
        randomSelector: RandomSelectorInterface,
    ) {
        this.stateMachine = stateMachine;
        this.randomSelector = new randomSelector((transition: ITransition) => {
            const originStateName = transition.destination;
            const originState = this._getState(originStateName);
            const stateName = transition.destination;
            const state = this._getState(stateName);
            const stateTransitionList = this._getStateTransitionList(stateName);
            const childStateList = stateTransitionList.map((childTransition) => {
                return this._getState(childTransition.destination);
            });
            return evaluateState(originState, state, childStateList);
        });
    }
    public simulate(stateName: string, nbIteration: number = 100) {
        this.nbIteration = nbIteration;
        this._monteCarlo(stateName);
    }
    private _monteCarlo(stateName: string): void {
        let selectedTransition;
        if (this.nbIteration > 0 ) {
            const transitionList = this._getStateTransitionList(stateName);
            selectedTransition = this._selectTransition(transitionList);
            if (selectedTransition) {
                this._monteCarlo(selectedTransition.destination);
            } else {
                this.nbIteration--;
            }
            // update the node's value
        }
    }
    private _getState(stateName: string) {
        return this.stateMachine.getState(stateName);
    }
    private _getStateTransitionList(stateName: string) {
        return this.stateMachine.getStateTransitionList(stateName);
    }
    private _selectTransition(transitionList: ITransition[]) {
        return this.randomSelector.rouletteSelect(transitionList);
    }
}
