import { IConflict } from "./conflict";
import { IVariable } from "./variable";

export function convolve(
        generator: IterableIterator<any>, callback: (valueList: any[]) => IConflict[],
    ) {
    for (const variableList of generator) {
        const constraint = () => {
            return callback(variableList.map((variable: IVariable) => variable.value));
        };
        for (const variable of variableList) {
            if (!variable.naryConstraintList) {
                variable.naryConstraintList = [];
            }
            variable.naryConstraintList.push(constraint);
        }
    }
}
