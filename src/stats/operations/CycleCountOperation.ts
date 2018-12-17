import World from "../../ecosystem/World";
import Operation from "./Operation";

export default class CycleCountOperation implements Operation {

    public static readonly NAME = "cycle_count";

    public name(): string {
        return CycleCountOperation.NAME;
    }

    public calculate(world: World): string {
        return world.cycle.toString();
    }

}