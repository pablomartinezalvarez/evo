export default class Sample {

    private readonly _name: string;
    private readonly _label: string;
    private readonly _value: string;
    private readonly _cycle: number;

    constructor(name: string, label: string, value: string, cycle: number) {
        this._name = name;
        this._label = label;
        this._value = value;
        this._cycle = cycle;
    }

    public get name(): string {
        return this._name;
    }

    public get label(): string {
        return this._label;
    }

    public get value(): string {
        return this._value;
    }

    public get cycle(): number {
        return this._cycle;
    }
}