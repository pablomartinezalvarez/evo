import Creature from "../ecosystem/Creature";
import World from "../ecosystem/World";
import eventEmitter from "../events/EventEmitter";
import Events from "../events/Events";
import Counter from "./Counter";
import CycleCountOperation from "./operations/CycleCountOperation";
import TotalPopulationOperation from "./operations/TotalPopulationOperation";
import StatsCollector from "./StatsCollector";

class TestCreature extends Creature {

    public static readonly TYPE = "test_creature";

    constructor(world: World) {
        super(world);
    }

    public type() {
        return TestCreature.TYPE;
    }
}

describe("given a StatsCollector with a sampleInterval of 100 cycles and a world with multiple stat counters", () => {
    test("when a WORLD_TICK_EVENT event is emitted the world counter stats are collected every 100 cycles", () => {

        const world = new World();

        world.add(new TestCreature(world));
        world.add(new TestCreature(world));
        world.add(new TestCreature(world));
        world.add(new TestCreature(world));
        world.add(new TestCreature(world));

        const statsCollector = new StatsCollector(world, 100);

        statsCollector.registerCounter(new Counter(
            "cycle_count",
            "Cycle",
            new CycleCountOperation(),
        ));

        statsCollector.registerCounter(new Counter(
            "test_creatures_total_population",
            "Creatures",
            new TotalPopulationOperation(TestCreature.TYPE),
        ));

        const handlerMock = jest.fn();

        eventEmitter.subscribe(Events.STATS_UPDATED_EVENT, handlerMock);

        statsCollector.init();

        eventEmitter.emit(Events.WORLD_TICK_EVENT, {cycle: 0});
        eventEmitter.emit(Events.WORLD_TICK_EVENT, {cycle: 50});

        world.add(new TestCreature(world));
        eventEmitter.emit(Events.WORLD_TICK_EVENT, {cycle: 100});

        expect(handlerMock).toHaveBeenCalledTimes(2);

        expect(handlerMock.mock.calls[0][0].cycle).toBe(0);
        expect(handlerMock.mock.calls[0][0].samples).toHaveLength(2);
        expect(handlerMock.mock.calls[0][0].samples[0]._name).toBe("cycle_count");
        expect(handlerMock.mock.calls[0][0].samples[1]._name).toBe("test_creatures_total_population");

        expect(handlerMock.mock.calls[1][0].cycle).toBe(100);
        expect(handlerMock.mock.calls[1][0].samples).toHaveLength(2);
        expect(handlerMock.mock.calls[1][0].samples[0]._name).toBe("cycle_count");
        expect(handlerMock.mock.calls[1][0].samples[1]._name).toBe("test_creatures_total_population");

    });
});
