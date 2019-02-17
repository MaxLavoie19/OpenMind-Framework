import { State } from "../state-machine/state";

export type StateEvaluator = (originState: State, state: State, childStateList: State[]) => number;
