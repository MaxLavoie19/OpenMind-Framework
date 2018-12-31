import { IConflict } from "./conflict";
import { IConstraint } from "./constraint";
import { IConstraintSatisfactionProblem } from "./constraint-satisfaction-problem";
import { Solution } from "./solution";
import { IVariable } from "./variable";

export class Solver {
    private iterationCounter: number = 0;
    private maxNbMinConflictIteration: number = 0;
    private solutionList: Solution[] = [];
    private stopCondition: undefined | (() => boolean);
    private problem: IConstraintSatisfactionProblem;
    private rootGenerator: IterableIterator<void> | undefined;
    constructor(problem: IConstraintSatisfactionProblem) {
        this.problem = problem;
    }
    public getSolutionList(): Solution[] {
        return this.solutionList;
    }
    public solve(maxNumberOfIteration = 100, maxNbMinConflictIteration = 10): boolean {
        this.iterationCounter = maxNumberOfIteration;
        this.maxNbMinConflictIteration = maxNbMinConflictIteration;
        if (!this.rootGenerator) {
            this.rootGenerator = this._iterate();
        }
        const iteration = this.rootGenerator.next();
        return iteration.done;
    }
    public setStopCondition(stopCondition: () => boolean) {
        this.stopCondition = stopCondition;
    }
    private _addSolution(): void {
        const solution = new Solution(this.problem.map((variable) => {
            return {variable, value: variable.value};
        }));
        this.solutionList.push(solution);
    }
    private* _backtrack(): IterableIterator<void> {
        const variable = this._getNextUnassignedVariable();
        if (variable) {
            yield* this._solveUnassignedVariable(variable);
        } else {
            const isValid = this._isValid();
            if (isValid) {
                this._addSolution();
                yield;
            } else {
                yield* this._minConflict();
            }
        }
    }
    private* _bruteForceDomain(variable: IVariable, domain: any[]): IterableIterator<void> {
        for (variable.value of domain) {
            this.iterationCounter -= 1;
            yield* this._backtrack();
        }
        delete variable.value;
    }
    private _canIterate(): boolean {
        let canIterate = this.iterationCounter > 0;
        if (canIterate && this.stopCondition) {
            canIterate = !this.stopCondition();
        }
        return canIterate;
    }
    private _randomItemSelector(itemList: any[]) {
        const randomIndex = Math.floor(Math.random() * itemList.length);
        return itemList[randomIndex];

    }
    private* _fill(): IterableIterator<void> {
        const unassignedVariableList = this._getUnassignedVariableList(this.problem);
        for (const unassignedVariable of unassignedVariableList) {
            const domain = this._getDomain(unassignedVariable);
            unassignedVariable.value = this._randomItemSelector(domain);
        }
        yield* this._backtrack();
        for (const unassignedVariable of unassignedVariableList) {
            delete unassignedVariable.value;
        }
    }
    private _getConflictList(constraintList: IConstraint[] | undefined): IConflict[] {
        let conflictList: IConflict[] = [];
        if (constraintList) {
            constraintList.forEach((constraint: IConstraint) => {
                const newConflictList = constraint();
                conflictList = conflictList.concat(newConflictList);
            });
        }
        return conflictList;
    }
    private _getVariableConflict(variable: IVariable): IConflict[] {
        const unaryConflictList = this._getConflictList(variable.unaryConstraintList);
        const naryConflictList = this._getConflictList(variable.naryConstraintList);
        return unaryConflictList.concat(naryConflictList);
    }
    private _getDomain(variable: IVariable): any[] {
        let domain;
        if (variable.domain) {
            domain = variable.domain;
        } else {
            domain = [];
        }
        return domain;
    }
    private _getNextUnassignedVariable(): IVariable | undefined {
        const unassignedVariableList = this._getUnassignedVariableList(this.problem);
        this._sortVariable(unassignedVariableList);
        const variable = unassignedVariableList.shift();
        return variable;
    }
    private _getUnassignedVariableList(solution: IConstraintSatisfactionProblem): IVariable[] {
        return solution.filter((variable) => {
            return variable.value === undefined;
        });
    }
    private _getValidDomain(variable: IVariable): any[] {
        const unaryConstraintList = variable.unaryConstraintList;
        const naryConstraintList = variable.naryConstraintList;
        let domain;
        if (variable.domain) {
            domain = variable.domain.filter((value) => {
                variable.value = value;
                const unaryConflictList = this._getConflictList(unaryConstraintList);
                const naryConflictList = this._getConflictList(naryConstraintList);
                const conflictList = unaryConflictList.concat(naryConflictList);
                return conflictList.length === 0;
            });
            delete variable.value;
        } else {
            domain = [];
        }
        return domain;
    }
    private _isValid(): boolean {
        let conflictList: IConflict = [];
        this.problem.forEach((variable) => {
            conflictList = conflictList.concat(this._getVariableConflict(variable));
        });
        const isValid = conflictList.length === 0;
        return isValid;
    }
    private* _iterate(): IterableIterator<void> {
        let isDone = false;
        let canIterate;
        const solutionGenerator = this._backtrack();
        do {
            canIterate = this._canIterate();
            if (canIterate) {
                const iteration = solutionGenerator.next();
                isDone = iteration.done;
            } else {
                yield;
            }
        } while (!isDone);
    }
    private* _minConflict(): IterableIterator<void> {
        const initialValueList: Array<[IVariable, any]> = [];
        for (let index = 0; index < this.maxNbMinConflictIteration; index++) {
            const conflictedVariableList = this.problem.filter((variable) => {
                const conflictList = this._getVariableConflict(variable);
                return conflictList.length > 0;
            });
            if (conflictedVariableList.length) {
                const selectedVariable = this._randomItemSelector(conflictedVariableList);
                initialValueList.push([selectedVariable, selectedVariable.value]);
                this._setMinConflictValue(selectedVariable);
            } else {
                break;
            }
            if (this._isValid()) {
                this._addSolution();
            }
        }
        while (initialValueList.length) {
            const lastChange = initialValueList.shift();
            if (lastChange) {
                const [variable, value] = lastChange;
                variable.value = value;
            }
        }
    }
    private _setMinConflictValue(variable: IVariable) {
        const domain = this._getDomain(variable);
        let minConflictValue;
        let minNbConflict = Infinity;
        for (const value of domain) {
            variable.value = value;
            const nbConflict = this._getVariableConflict(variable).length;
            if (nbConflict < minNbConflict) {
                minNbConflict = nbConflict;
                minConflictValue = value;
            }
        }
        variable.value = minConflictValue;
    }
    private* _solveUnassignedVariable(variable: IVariable): IterableIterator<void> {
        const domain = this._getValidDomain(variable);
        if (domain.length) {
            yield* this._bruteForceDomain(variable, domain);
        } else {
            yield* this._fill();
        }
    }
    private _sortVariable(variableList: IVariable[]): void {
        variableList.sort((variableA, variableB) => {
            const domainLengthA = this._getValidDomain(variableA).length;
            const domainLengthB = this._getValidDomain(variableB).length;
            let comparisonValue = domainLengthA - domainLengthB;
            if (comparisonValue === 0) {
                const constraintLengthA = this._getNumberOfConstraint(variableA);
                const constraintLengthB = this._getNumberOfConstraint(variableB);
                comparisonValue = constraintLengthB - constraintLengthA;
            }
            return comparisonValue;
        });
    }
    private _getNumberOfConstraint(variable: IVariable) {
        const variableNaryConstraintList = variable.naryConstraintList ?
            variable.naryConstraintList : [];
        const variableUnaryConstraintList = variable.unaryConstraintList ?
            variable.unaryConstraintList : [];
        const naryConstraintLength = variableNaryConstraintList.length;
        const unaryConstraintLength = variableUnaryConstraintList.length;
        const constraintLength = naryConstraintLength + unaryConstraintLength;
        return constraintLength;
    }
}
