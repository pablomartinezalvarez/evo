import World from "../../ecosystem/World";
import Operation from "./Operation";

export default class PropertyAverageOperation implements Operation {

    public static readonly NAME = "property_average";

    private readonly _species: string;
    private readonly _property: string;

    public constructor(species: string, property: string) {
        this._species = species;
        this._property = property;
    }

    public name(): string {
        return PropertyAverageOperation.NAME;
    }

    public calculate(world: World): string {
        const creatures = world.getCreaturesOfType(this._species);

        return (creatures.reduce((sum, creature) => {
            const propertyDescription = Object.getOwnPropertyDescriptor(creature, `_${this._property}`);

            return propertyDescription ? sum + propertyDescription.value : 0;
        }, 0) / creatures.length).toFixed(2);
    }

}
