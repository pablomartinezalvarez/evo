import eventEmitter from "../events/EventEmitter";
import Events from "../events/Events";
import Sample from "./Sample";

export default class StatsRecorder {

    private readonly _samples: { [name: string]: string[] };
    private readonly _storageInterval: number;

    constructor(storageInterval: number) {
        this._storageInterval = storageInterval;
        this._samples = {};
    }

    public init() {
        // Save the last samples every "storageInterval" cycles.
        eventEmitter.subscribe(Events.STATS_UPDATED_EVENT, (data) => {
            if (data.cycle % this._storageInterval === 0) {
                this.saveSamples(data.samples);
            }
        });
    }

    private saveSamples(lastSamples: Sample[]) {
        lastSamples.forEach((sample: Sample) => {
            if (!this._samples[sample.name]) {
                this._samples[sample.name] = [];
            }
            this._samples[sample.name].push(sample.value);
        });
    }

    public get samples() {
        return this._samples;
    }
}
