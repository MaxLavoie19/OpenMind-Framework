import { ITransition } from "../state-machine/transition-interface";

export type ValueEvaluator = (ITransition: ITransition) => number;
