import Operation from "./operations/Operation";

export default class Counter {

    private readonly _name: string;
    private readonly _label: string;
    private _value: string;
    private readonly _operation: Operation;

    constructor(name: string, label: string, operation: Operation, value?: string) {
        this._name = name;
        this._label = label;
        this._operation = operation;
        this._value = value || "0";
    }

    public get name(): string {
        return this._name;
    }

    public get label(): string {
        return this._label;
    }

    public get operation(): Operation {
        return this._operation;
    }

    public get value(): string {
        return this._value;
    }

    public set value(value: string) {
        this._value = value;
    }
}
