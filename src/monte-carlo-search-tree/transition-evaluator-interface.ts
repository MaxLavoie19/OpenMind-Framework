import { ITransition } from "../state-machine/transition-interface";

export type TransitionEvaluator = (transition: ITransition) => number;
