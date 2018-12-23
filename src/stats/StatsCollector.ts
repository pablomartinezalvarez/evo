import World from "../ecosystem/World";
import Counter from "./Counter";
import Sample from "./Sample";

import eventEmitter from "../events/EventEmitter";

export default class StatsCollector {

    public static STATS_UPDATED_EVENT = "stats:updated";

    private _world: World;
    private readonly _counters: Counter[];
    private readonly _sampleInterval: number;
    private _interval?: NodeJS.Timeout;

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
        eventEmitter.emit(StatsCollector.STATS_UPDATED_EVENT, {samples: this.takeSamples()});
        this._interval = setInterval(() => {
            eventEmitter.emit(StatsCollector.STATS_UPDATED_EVENT, {samples: this.takeSamples()});
        }, this._sampleInterval);
    }

    public clear() {
        if (this._interval) {
            clearInterval(this._interval);
        }
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
