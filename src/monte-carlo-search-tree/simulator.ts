import { RandomSelector } from "../selector/random-selector";
import { StateMachine } from "../state-machine/state-machine";
import { ITransition } from "../state-machine/transition-interface";
import { RandomSelectorInterface } from "./random-selector-interface";
import { ValueEvaluator } from "./value-evaluator-interface";

export class Simulator {
    private currentStateName: string = "";
    private stateMachine: StateMachine;
    private nbIteration: number = 0;
    private randomSelector: RandomSelector<ITransition>;
    constructor(
        stateMachine: StateMachine,
        valueEvaluationFunction: ValueEvaluator,
        randomSelector: RandomSelectorInterface,
    ) {
        this.stateMachine = stateMachine;
        this.randomSelector = new randomSelector(valueEvaluationFunction);
    }
    public setCurrentState(stateName: string) {
        this.currentStateName = stateName;
        this.stateMachine.setCurrentState(stateName);
    }
    public simulate(nbIteration: number = 100) {
        this.nbIteration = nbIteration;
        this._monteCarlo();
    }
    private _monteCarlo(): ITransition | undefined {
        let selectedTransition;
        if (this.nbIteration > 0 ) {
            const stateTransitionList = this._getStateTransitionList(this.currentStateName);
            selectedTransition = this._select(stateTransitionList);
        }
        return selectedTransition;
    }
    private _getStateTransitionList(stateName: string) {
        return this.stateMachine.getStateTransitionList(stateName);
    }
    private _select(transitionList: ITransition[]) {
        transitionList.forEach(
            (transition) => {
                transition.destinationState = this.stateMachine.getState(transition.destination);
            },
        );
        return this.randomSelector.rouletteSelect(transitionList);
        // roulette select a state to simulate from
    }
}
