import { State } from "./state";

export interface ITransition {
    origin: string;
    destination: string;
    destinationState?: State;
    onTransition?: () => void;
}
