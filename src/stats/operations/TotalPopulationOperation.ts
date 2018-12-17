import World from "../../ecosystem/World";
import Operation from "./Operation";

export default class TotalPopulationOperation implements Operation {

    public static readonly NAME = "total_population";

    private _species: string;

    public constructor(species: string) {
        this._species = species;
    }

    public name(): string {
        return TotalPopulationOperation.NAME;
    }

    public calculate(world: World): string {
        return world.getCreaturesOfType(this._species).length.toString();
    }

}
