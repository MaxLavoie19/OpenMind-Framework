import { IVariable } from "./variable";
import { IVariableValue } from "./variable-value";

export class Solution {
    private variableValueList: IVariableValue[];
    constructor(variableValueList: IVariableValue[]) {
        this.variableValueList = variableValueList;
    }
    public apply(): void {
        this.variableValueList.forEach(({variable, value}) => {
            variable.value = value;
        });
    }
}
