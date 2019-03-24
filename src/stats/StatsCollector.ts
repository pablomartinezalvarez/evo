import World from "../ecosystem/World";
import eventEmitter from "../events/EventEmitter";
import Events from "../events/Events";
import Counter from "./Counter";
import Sample from "./Sample";

export default class StatsCollector {

    private readonly _world: World;
    private readonly _counters: Counter[];
    private readonly _sampleInterval: number;

    constructor(world: World, sampleInterval: number) {
        this._world = world;
        this._sampleInterval = sampleInterval;
        this._counters = [];
    }

    public registerCounter(counter: Counter) {
        this._counters.push(counter);
    }

    public init() {
        eventEmitter.subscribe(Events.WORLD_TICK_EVENT, (data) => {
            if (data.cycle % this._sampleInterval === 0) {
                eventEmitter.emit(
                    Events.STATS_UPDATED_EVENT,
                    {cycle: data.cycle, samples: this.takeSamples(data.cycle)},
                );
            }
        });
    }

    private takeSamples(cycle: number): Sample[] {
        return this._counters.map((counter) => {
            return new Sample(
                counter.name,
                counter.label,
                counter.operation.calculate(this._world),
                cycle,
            );
        });
    }
}
