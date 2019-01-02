import { RandomSelector } from "../selector/random-selector";
import { ITransition } from "../state-machine/transition-interface";
import { TransitionEvaluator } from "./transition-evaluator-interface";

export type RandomSelectorInterface =
    new (valueEvaluatorFunction: TransitionEvaluator) => RandomSelector<ITransition>;
