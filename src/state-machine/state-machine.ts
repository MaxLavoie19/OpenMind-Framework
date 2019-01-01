import { State } from "./state";
import { IState } from "./state-interface";
import { IStateMachine } from "./state-machine-interface";
import { ITransition } from "./transition-interface";

export class StateMachine {
    private transitionDict: {[transitionName: string]: ITransition} = {};
    private stateDict: {[stateName: string]: State} = {};
    private currentStateName: string = "";
    constructor(stateMachine: IStateMachine) {
        this.setStates(stateMachine.stateDict);
        this._setTransitions(stateMachine.transitionDict);
    }
    public getCurrentStateName(): string {
        return this.currentStateName;
    }
    public getCurrentStateTransitionList(): ITransition[] {
        return this.getStateTransitionList(this.currentStateName);
    }
    public getState(stateName: string) {
        return this.stateDict[stateName];
    }
    public getStateTransitionList(stateName: string): ITransition[] {
        const state = this.stateDict[stateName];
        return state.getTransitionList();
    }
    public getStateMetaData(stateName: string, key: string) {
        const state = this.getState(stateName);
        return state.getMetaData(key);
    }
    public setCurrentState(stateName: string) {
        this.currentStateName = stateName;
    }
    public setStateMetaData(stateName: string, key: string, value: any) {
        const state = this.getState(stateName);
        state.setMetaData(key, value);
    }
    protected getCurrentState() {
        return this.getState(this.currentStateName);
    }
    protected setStates(stateDict: {[stateName: string]: IState}) {
        Object.keys(stateDict).forEach((stateName) => {
            if (!this.stateDict[stateName]) {
                const state = new State(stateDict[stateName]);
                this.stateDict[stateName] = state;
            }
        });
    }
    private _setTransitions(transitionDict: {[transitionName: string]: ITransition}) {
        for (const transitionName in transitionDict) {
            if (transitionName) {
                const transition = transitionDict[transitionName];
                const origin = this.stateDict[transition.origin];
                const destination = this.stateDict[transition.destination];
                if (origin && destination) {
                    this.transitionDict[transitionName] = transition;
                } else {
                    throw new Error(`
                        Invalid transition ${transitionName}.
                        The origin or the destination state does not exist.
                    `);
                }
            }
        }
    }
}
