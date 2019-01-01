import { IState } from "./state-interface";
import { ITransition } from "./transition-interface";

export class State {
    private data: {[name: string]: any} = {};
    private metaData: {[name: string]: any} = {};
    private transitionList: ITransition[] = [];
    constructor(stateDescription: IState) {
        this.data = stateDescription;
    }
    public getMetaData(key: string) {
        return this.metaData[key];
    }
    public getValue(key: string) {
        return this.data[key];
    }
    public getTransitionList() {
        return this.transitionList;
    }
    public setMetaData(key: string, value: any) {
        this.metaData[key] = value;
    }
    public setTransitionList(transitionList: ITransition[]) {
        this.transitionList = transitionList;
    }
}
