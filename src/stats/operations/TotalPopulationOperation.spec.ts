import Creature from "../../ecosystem/Creature";
import World from "../../ecosystem/World";
import TotalPopulationOperation from "./TotalPopulationOperation";

class TestCreature extends Creature {

    public static readonly TYPE = "test_creature";

    constructor(world: World) {
        super(world);
    }

    public type() {
        return TestCreature.TYPE;
    }
}

describe("given a World for a running experiment including a set of creatures", () => {

    test("the calculation of the total population for an existing species is correct", () => {
        const world = new World();
        const totalPopulationOperation = new TotalPopulationOperation(TestCreature.TYPE);

        world.add(new TestCreature(world));
        world.add(new TestCreature(world));
        world.add(new TestCreature(world));
        world.add(new TestCreature(world));
        world.add(new TestCreature(world));

        expect(totalPopulationOperation.calculate(world)).toBe("5");
    });

    test("the calculation of the total population for a non-existing species throws an error", () => {
        const world = new World();
        const totalPopulationOperation = new TotalPopulationOperation(TestCreature.TYPE);

        expect(() => totalPopulationOperation.calculate(world))
            .toThrow("The species test_creature is not present in the world");
    });
});