import { ItemValueTuple } from "./item-value-tuple-type";

export class RandomSelector<T> {
    private valueEvaluatorFunction: (item: T) => number;
    constructor(valueEvaluatorFunction: (item: T) => number) {
        this.valueEvaluatorFunction = valueEvaluatorFunction;
    }
    public rouletteSelect(itemList: any[]) {
        const itemValueTupleList = itemList.map((item: T) => {
            const value = this.valueEvaluatorFunction(item);
            const itemValueTuple: ItemValueTuple<T> = [item, value];
            return itemValueTuple;
        });
        const totalValue = itemValueTupleList.reduce(
            (sum: number, [item, value]: ItemValueTuple<T>) => {
                return sum += value;
            },
            0,
        );
        const randomIndex = this.randomNumberGenerator(0, totalValue);
        let counter = 0;
        let selectedItem;
        for (const [item, value] of itemValueTupleList) {
            counter += value;
            if (counter > randomIndex) {
                selectedItem = item;
                break;
            }
        }
        return selectedItem;
    }
    public randomNumberGenerator(min: number, max: number) {
        const range = max - min;
        return min + Math.floor(Math.random() * range);
    }
}
