import { RandomSelector } from "../selector/random-selector";
import { ITransition } from "../state-machine/transition-interface";
import { ValueEvaluator } from "./value-evaluator-interface";

export type RandomSelectorInterface =
    new (valueEvaluatorFunction: ValueEvaluator) => RandomSelector<ITransition>;
