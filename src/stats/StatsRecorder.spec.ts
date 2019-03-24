import eventEmitter from "../events/EventEmitter";
import Events from "../events/Events";
import Sample from "./Sample";
import StatsRecorder from "./StatsRecorder";

describe("given a StatsRecorder with a storageInterval of 100 cycles", () => {
    test("when a STATS_UPDATED_EVENT event is emitted its samples are recorded every 100 cycles", () => {

        const statsRecorder = new StatsRecorder(100);

        statsRecorder.init();

        eventEmitter.emit(Events.STATS_UPDATED_EVENT,
            {
                cycle: 0,
                samples: [
                    new Sample("1_count", "My Counter 1", "1.0", 0),
                    new Sample("2_count", "My Counter 2", "2.0", 0),
                ],
            });

        expect(Object.keys(statsRecorder.samples)).toHaveLength(2);
        expect(statsRecorder.samples["1_count"]).toHaveLength(1);
        expect(statsRecorder.samples["1_count"][0]).toBe("1.0");
        expect(statsRecorder.samples["2_count"]).toHaveLength(1);
        expect(statsRecorder.samples["2_count"][0]).toBe("2.0");

        // This event samples should be skipped.
        eventEmitter.emit(Events.STATS_UPDATED_EVENT,
            {
                cycle: 50,
                samples: [
                    new Sample("1_count", "My Counter 1", "1.1", 50),
                    new Sample("2_count", "My Counter 2", "2.1", 50),
                ],
            });

        expect(Object.keys(statsRecorder.samples)).toHaveLength(2);
        expect(statsRecorder.samples["1_count"]).toHaveLength(1);
        expect(statsRecorder.samples["1_count"][0]).toBe("1.0");
        expect(statsRecorder.samples["2_count"]).toHaveLength(1);
        expect(statsRecorder.samples["2_count"][0]).toBe("2.0");

        eventEmitter.emit(Events.STATS_UPDATED_EVENT,
            {
                cycle: 100,
                samples: [
                    new Sample("1_count", "My Counter 1", "1.2", 100),
                    new Sample("2_count", "My Counter 2", "2.2", 100),
                ],
            });

        expect(Object.keys(statsRecorder.samples)).toHaveLength(2);
        expect(statsRecorder.samples["1_count"]).toHaveLength(2);
        expect(statsRecorder.samples["1_count"][0]).toBe("1.0");
        expect(statsRecorder.samples["1_count"][1]).toBe("1.2");
        expect(statsRecorder.samples["2_count"]).toHaveLength(2);
        expect(statsRecorder.samples["2_count"][0]).toBe("2.0");
        expect(statsRecorder.samples["2_count"][1]).toBe("2.2");

    });
});
