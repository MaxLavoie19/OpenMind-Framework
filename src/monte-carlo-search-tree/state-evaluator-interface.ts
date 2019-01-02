import { State } from "../state-machine/state";

export type StateEvaluator = (state: State) => number;
