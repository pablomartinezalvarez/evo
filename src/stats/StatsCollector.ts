import World from "../ecosystem/World";
import Counter from "./Counter";

import eventEmitter from "../events/EventEmitter";

export default class StatsCollector {

    private _world: World;
    private readonly _interval: number;
    private readonly _counters: Counter[];

    constructor(world: World, interval: number) {
        this._world = world;
        this._interval = interval;
        this._counters = [];
    }

    public set world(world: World) {
        this._world = world;
    }

    public registerCounter(counter: Counter) {
        this._counters.push(counter);
    }

    public init() {
        setInterval(() => {
            this.updateStats();
            eventEmitter.emit("stats:updated", {counters: this._counters});
        }, this._interval);
    }

    private updateStats() {
        this._counters.forEach((counter) => {
            counter.value = counter.operation.calculate(this._world);
        });
    }
}
