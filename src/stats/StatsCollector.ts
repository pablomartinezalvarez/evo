import World from "../ecosystem/World";
import Counter from "./Counter";
import Sample from "./Sample";
import Events from "../events/Events";
import eventEmitter from "../events/EventEmitter";

export default class StatsCollector {

    private _world: World;
    private readonly _counters: Counter[];
    private readonly _sampleInterval: number;

    constructor(world: World, sampleInterval: number) {
        this._world = world;
        this._sampleInterval = sampleInterval;
        this._counters = [];
    }

    public set world(world: World) {
        this._world = world;
    }

    public registerCounter(counter: Counter) {
        this._counters.push(counter);
    }

    public init() {
        eventEmitter.subscribe(Events.WORLD_TICK_EVENT, (data) => {
            if (data.cycle % this._sampleInterval === 0) {
                eventEmitter.emit(Events.STATS_UPDATED_EVENT, {cycle: data.cycle, samples: this.takeSamples()});
            }
        });
    }

    private takeSamples(): Sample[] {
        return this._counters.map((counter) => {
            return new Sample(
                counter.name,
                counter.label,
                counter.operation.calculate(this._world),
                this._world.cycle,
            );
        });
    }
}
