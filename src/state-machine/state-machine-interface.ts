import { IState } from "./state-interface";
import { ITransition } from "./transition-interface";

export interface IStateMachine {
    stateDict: {
        [stateName: string]: IState,
    };
    transitionDict: {
        [transitionName: string]: ITransition,
    };
}
