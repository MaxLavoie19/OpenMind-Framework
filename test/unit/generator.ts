/*
import { expect } from "chai";
import "mocha";
import { columnGenerator, rowGenerator, square3x3Generator, tileGenerator }
    from "../../../../demo/sudoku/generator";

const grid = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ["2", "3", "4", "5", "6", "7", "8", "9", "1"],
    ["3", "4", "5", "6", "7", "8", "9", "1", "2"],
    ["4", "5", "6", "7", "8", "9", "1", "2", "3"],
    ["5", "6", "7", "8", "9", "1", "2", "3", "4"],
    ["6", "7", "8", "9", "1", "2", "3", "4", "5"],
    ["7", "8", "9", "1", "2", "3", "4", "5", "6"],
    ["8", "9", "1", "2", "3", "4", "5", "6", "7"],
    ["9", "1", "2", "3", "4", "5", "6", "7", "8"],
];

describe("row", () => {
    it("should return a row generator", () => {
        const rowG = rowGenerator(grid);
        let counter = 0;
        for (const row in rowG) {
            expect(row).to.be.deep.equal(grid[counter]);
            counter++;
        }
    });
});

describe("column", () => {
    it("should return a column generator", () => {
        const columnG = columnGenerator(grid);
        let counter = 0;
        for (const column in columnG) {
            expect(column).to.be.deep.equal(grid[counter]);
            counter++;
        }
    });
});

const squareList = [
    [
        "1", "2", "3",
        "2", "3", "4",
        "3", "4", "5",
    ], [
        "4", "5", "6",
        "5", "6", "7",
        "6", "7", "8",
    ], [
        "7", "8", "9",
        "8", "9", "1",
        "9", "1", "2",
    ], [
        "4", "5", "6",
        "5", "6", "7",
        "6", "7", "8",
    ], [
        "7", "8", "9",
        "8", "9", "1",
        "9", "1", "2",
    ], [
        "1", "2", "3",
        "2", "3", "4",
        "3", "4", "5",
    ], [
        "7", "8", "9",
        "8", "9", "1",
        "9", "1", "2",
    ], [
        "1", "2", "3",
        "2", "3", "4",
        "3", "4", "5",
    ], [
        "4", "5", "6",
        "5", "6", "7",
        "6", "7", "8",
    ],
];

describe("square3x3Generator", () => {
    it("should return a square generator", () => {
        const squareG = square3x3Generator(grid);
        let counter = 0;
        for (const square in squareG) {
            expect(square).to.be.deep.equal(squareList[counter]);
            counter++;
        }
    });
});

const tileList = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "2", "3", "4", "5", "6", "7", "8", "9", "1",
    "3", "4", "5", "6", "7", "8", "9", "1", "2",
    "4", "5", "6", "7", "8", "9", "1", "2", "3",
    "5", "6", "7", "8", "9", "1", "2", "3", "4",
    "6", "7", "8", "9", "1", "2", "3", "4", "5",
    "7", "8", "9", "1", "2", "3", "4", "5", "6",
    "8", "9", "1", "2", "3", "4", "5", "6", "7",
    "9", "1", "2", "3", "4", "5", "6", "7", "8",
];

describe("tileGenerator", () => {
    it("should return a tile generator", () => {
        const tileG = tileGenerator(grid);
        let counter = 0;
        for (const tile in tileG) {
            expect(tile).to.equal(tileList[counter]);
            counter++;
        }
    });
});
*/
