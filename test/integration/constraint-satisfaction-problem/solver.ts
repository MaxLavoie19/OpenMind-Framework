import { expect } from "chai";
import "mocha";
import { IConflict } from "../../../src/constraint-satisfaction-problem/conflict";
import { convolve } from "../../../src/constraint-satisfaction-problem/convolve";
import { Solution } from "../../../src/constraint-satisfaction-problem/solution";
import { Solver } from "../../../src/constraint-satisfaction-problem/solver";
import { IVariable } from "../../../src/constraint-satisfaction-problem/variable";

type SudokuGrid = [
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number]
];

const GRID_1: SudokuGrid = [
    [1, 0, 0, 0, 0, 7, 0, 9, 0],
    [0, 3, 0, 0, 2, 0, 0, 0, 8],
    [0, 0, 9, 6, 0, 0, 5, 0, 0],
    [0, 0, 5, 3, 0, 0, 9, 0, 0],
    [0, 1, 0, 0, 8, 0, 0, 0, 2],
    [6, 0, 0, 0, 0, 4, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 7],
    [0, 0, 7, 0, 0, 0, 3, 0, 0],
];

/*
const GRID_1_SOLUTION: SudokuGrid = [
    [1, 0, 0, 0, 0, 7, 0, 9, 0],
    [0, 3, 0, 0, 2, 0, 0, 0, 8],
    [0, 0, 9, 6, 0, 0, 5, 0, 0],
    [0, 0, 5, 3, 0, 0, 9, 0, 0],
    [0, 1, 0, 0, 8, 0, 0, 0, 2],
    [6, 0, 0, 0, 0, 4, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 7],
    [0, 0, 7, 0, 0, 0, 3, 0, 0]
]
*/

const validGrid: SudokuGrid = [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

const invalidTileGrid: SudokuGrid = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 11, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidSquareGrid: SudokuGrid = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidRowGrid: SudokuGrid = [
    [1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidColumnGrid: SudokuGrid = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const completedGrid: SudokuGrid = [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9],
];

const completedInvalidTileGrid: SudokuGrid = [
    [11, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9],
];

function displaySolution(solution: Solution, sudokuGrid: IVariable[][]) {
    solution.apply();
    const grid = sudokuGrid.map((row) => {
        return row.map((tile) => {
            return tile.value;
        });
    });
    // tslint:disable-next-line
    console.warn(grid);
}

describe("ConstraintSatisfactionProblemSolver", () => {
    it("should be able to solve a sudoku", () => {
        const domain = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const sudokuVariableList: IVariable[] = [];
        const sudokuGrid: IVariable[][] = [];

        function* rowGenerator(grid: IVariable[][]) {
            for (const row of grid) {
                yield row;
            }
        }

        function* columnGenerator(grid: IVariable[][]) {
            for (let columnIndex = 0; columnIndex < grid[0].length; columnIndex++) {
                const column = [];
                for (const row of grid) {
                    column.push(row[columnIndex]);
                }
                yield column;
            }
        }

        function* square3x3Generator(grid: IVariable[][]) {
            for (let rowIndex = 0; rowIndex < grid.length; rowIndex += 3) {
                for (let columnIndex = 0; columnIndex < grid[0].length; columnIndex += 3) {
                    const squareContent = [];
                    for (let yIndex = rowIndex; yIndex < rowIndex + 3; yIndex++) {
                        for (let xIndex = columnIndex; xIndex < columnIndex + 3; xIndex++) {
                            squareContent.push(grid[yIndex][xIndex]);
                        }
                    }
                    yield squareContent;
                }
            }
        }
        function allDiff(valueList: Array<number | undefined>): IConflict[] {
            const distinctValueList: number[] = [];
            const duplicatedValueList: IConflict[] = [];
            valueList.forEach((tileValue: number | undefined) => {
                if (tileValue) {
                    if (distinctValueList.indexOf(tileValue) === -1) {
                        distinctValueList.push(tileValue);
                    } else  {
                        duplicatedValueList.push({duplicated: tileValue});
                    }
                }
            });
            return duplicatedValueList;
        }
        GRID_1.forEach((row) => {
            const varRow: IVariable[] = [];
            row.forEach((tile) => {
                const value = tile > 0 ? tile : undefined;
                const variable = {value, domain};
                varRow.push(variable);
                sudokuVariableList.push(variable);
            });
            sudokuGrid.push(varRow);
        });
        convolve(rowGenerator(sudokuGrid), allDiff);
        convolve(columnGenerator(sudokuGrid), allDiff);
        convolve(square3x3Generator(sudokuGrid), allDiff);
        const solver = new Solver(sudokuVariableList);
        solver.setStopCondition(() => {
            return solver.getSolutionList().length > 0;
        });
        solver.solve(100, 40);
        const solutionList = solver.getSolutionList();
        for (const solution of solutionList) {
            displaySolution(solution, sudokuGrid);
        }
    });
});
