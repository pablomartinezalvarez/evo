import World from "../../ecosystem/World";

export default interface Operation {

    name(): string;

    calculate(world: World): string;
}
