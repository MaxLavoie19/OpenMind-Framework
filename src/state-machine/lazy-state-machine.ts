import { StateMachine } from "./state-machine";
import { IStateMachine } from "./state-machine-interface";
import { TransitionGenerator } from "./transition-generator-interface";

export class LazyStateMachine extends StateMachine {
    private isGenerated: {[stateName: string]: boolean} = {};
    private transitionGenerator: TransitionGenerator;
    constructor(stateMachine: IStateMachine, transitionGenerator: TransitionGenerator) {
        super(stateMachine);
        this.transitionGenerator = transitionGenerator;
    }
    public getStateTransitionList(stateName: string) {
        const state = this.getState(stateName);
        let transitionList;
        if (this.isGenerated[stateName]) {
            transitionList = state.getTransitionList();
        } else {
            let stateDict;
            [stateDict, transitionList] = this.transitionGenerator(state);
            state.setTransitionList(transitionList);
            this.setStates(stateDict);
            this.isGenerated[stateName] = true;
        }
        return transitionList;
    }
}
