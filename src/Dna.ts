import _ = require("lodash");
import Random from "./Random";

export default class Dna {

    private _genes: { [key: string]: number };

    constructor(newGenes: { [key: string]: number }) {
        this._genes = newGenes;
    }

    public get genes(): { [key: string]: number } {
        return this._genes;
    }

    public getGenOfType(type: string) {
        return this._genes[type];
    }

    public copy(): Dna {
        return new Dna(_.clone(this._genes));
    }

    public mutate(m: number): Dna {
        return new Dna(_.mapValues(this._genes, (value) => {
            return Random.real(0, 1, true) < m
                ? Random.real(0, 1, true)
                : value;
        }));
    }
}
