import { IConstraint } from "./constraint";

export interface IVariable {
    domain?: any[];
    value?: any;
    unaryConstraintList?: IConstraint[];
    naryConstraintList?: IConstraint[];
}
