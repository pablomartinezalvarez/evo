import Creature from "../../ecosystem/Creature";
import World from "../../ecosystem/World";
import PropertyAverageOperation from "./PropertyAverageOperation";

class TestCreature extends Creature {

    public static readonly TYPE = "test_creature";

    private _numericProperty: number;

    constructor(world: World, numericProperty: number) {
        super(world);
        this._numericProperty = numericProperty;
    }

    public type() {
        return TestCreature.TYPE;
    }
}

describe("given a World for a running experiment including a set of creatures", () => {

    test("the calculation of the average for an existing property of the creatures is correct", () => {
        const world = new World();
        const propertyAverageOperation = new PropertyAverageOperation(
            TestCreature.TYPE,
            "numericProperty",
        );

        world.add(new TestCreature(world, 0));
        world.add(new TestCreature(world, 500));
        world.add(new TestCreature(world, 250));
        world.add(new TestCreature(world, 120));
        world.add(new TestCreature(world, 1));

        expect(propertyAverageOperation.calculate(world)).toBe("174.20");
    });

    test("the calculation of the average for a non-existing species throws an error", () => {
        const world = new World();
        const propertyAverageOperation = new PropertyAverageOperation(
            TestCreature.TYPE,
            "numericProperty",
        );

        expect(() => propertyAverageOperation.calculate(world))
            .toThrow("The species test_creature is not present in the world");
    });

    test("the calculation of the average for a non-existing property throws an error", () => {
        const world = new World();
        const propertyAverageOperation = new PropertyAverageOperation(
            TestCreature.TYPE,
            "unknownProperty",
        );

        world.add(new TestCreature(world, 0));

        expect(() => propertyAverageOperation.calculate(world))
            .toThrow("Unknown property unknownProperty");
    });
});
