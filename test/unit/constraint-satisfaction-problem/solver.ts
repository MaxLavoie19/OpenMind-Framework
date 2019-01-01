import { expect } from "chai";
import "mocha";
import { Solver } from "../../../src/constraint-satisfaction-problem/solver";

describe("Solver", () => {
    it("should be instantiable", () => {
        const solver = new Solver([]);
        expect(solver).to.be.instanceOf(Solver);
    });
    it("should return all possible solution", () => {
        const domain = [1, 2, 3];
        const blank = {domain};
        const one = {value: 1};
        const two = {value: 2};
        const varList = [blank, one, two];
        const solver = new Solver(varList);
        solver.solve();
        const solutionList = solver.getSolutionList();
        expect(solutionList.length).to.be.equal(3);
        solutionList.forEach((solution, index) => {
            solution.apply();
            expect(varList).to.be.deep.equal([{value: index + 1, domain}, one, two]);
        });
    });
    it("should use constraint to restrict options", () => {
        const domain = [1, 2, 3];
        const blank = {value: undefined, domain, naryConstraintList: [allDiff]};
        const one = {value: 1, naryConstraint: [allDiff]};
        const two = {value: 2, naryConstraint: [allDiff]};
        const varList = [blank, one, two];
        function allDiff() {
            const conflictList = [];
            const value =  blank.value;
            if (value !== 3) {
                conflictList.push({isDuplicated: value});
            }
            return conflictList;
        }
        const solver = new Solver(varList);
        solver.solve();
        const solutionList = solver.getSolutionList();
        expect(solutionList.length).to.be.equal(1);
        solutionList[0].apply();
        expect(varList).to.be.deep.equal([
            {value: 3, domain, naryConstraintList: [allDiff]}, one, two,
        ]);
    });

    it("should use minconflict to solve a conflicted solution", () => {
        const domain = [1, 2, 3];
        function constraint() {
            const conflictList = [];
            if (one.value !== 1) {
                conflictList.push({one: one.value});
            }
            if (two.value !== 2) {
                conflictList.push({two: two.value});
            }
            if (three.value !== 3) {
                conflictList.push({three: three.value});
            }
            return conflictList;
        }
        const one = {value: 1, domain, naryConstraintList: [constraint]};
        const two = {value: 1, domain, naryConstraintList: [constraint]};
        const three = {value: 1, domain, naryConstraintList: [constraint]};
        const varList = [one, two, three];
        const solver = new Solver(varList);
        solver.solve();
        const solutionList = solver.getSolutionList();
        expect(solutionList.length).to.be.equal(1);
        solutionList[0].apply();
        expect(varList).to.be.deep.equal([
            {value: 1, domain, naryConstraintList: [constraint]},
            {value: 2, domain, naryConstraintList: [constraint]},
            {value: 3, domain, naryConstraintList: [constraint]},
        ]);
    });
    describe("Solve", () => {
        it("should be callable", () => {
            const solver = new Solver([]);
            solver.solve();
        });
    });
    describe("getSolutionList", () => {
        it("should return a solution list", () => {
            const solver = new Solver([]);
            const solutionList = solver.getSolutionList();
            expect(solutionList).to.be.an("Array");
        });
    });
});
