import { State } from "./state";
import { IState } from "./state-interface";
import { ITransition } from "./transition-interface";

export type TransitionGenerator = (state: State) =>
    [{[stateName: string]: IState}, ITransition[]];
