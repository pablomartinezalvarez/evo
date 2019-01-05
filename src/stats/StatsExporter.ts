import eventEmitter from "../events/EventEmitter";
import Events from "../events/Events";
import Exporter from "./exporters/Exporter";
import StatsRecorder from "./StatsRecorder";

export default class StatsExporter {

    private readonly _recorder: StatsRecorder;
    private readonly _exporters: { [type: string]: Exporter };

    constructor(recorder: StatsRecorder) {
        this._recorder = recorder;
        this._exporters = {};
    }

    public init() {
        eventEmitter.subscribe(Events.STATS_EXPORT_EVENT, (data) => {
            const exporter = this._exporters[data.type];

            if (exporter) {
                exporter.export(this._recorder.samples);
            }
        });
    }

    public registerExporter(exporter: Exporter) {
        this._exporters[exporter.type()] = exporter;
    }

}