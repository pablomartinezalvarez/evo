import World from "../../ecosystem/World";
import CycleCountOperation from "./CycleCountOperation";

describe("given a World for a running experiment", () => {
    test("the cycle counter value is equals to the world cycle", () => {
        const world = new World();
        const cycleCounterOperation = new CycleCountOperation();

        expect(cycleCounterOperation.calculate(world)).toBe("0");
        world.update();
        expect(cycleCounterOperation.calculate(world)).toBe("1");
    });
});
