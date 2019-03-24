import Vue from "vue";
import Component from "vue-class-component";
import eventEmitter from "../../events/EventEmitter";
import Events from "../../events/Events";
import Sample from "../../stats/Sample";
import CounterDataRow from "./CounterDataRow";

import "./stats-panel.css";
import CSVExporter from "../../stats/exporters/CSVExporter";

@Component({
    components: {
        "counter-data-row": CounterDataRow,
    },
    template: `
    <div class="stats-panel">
        <counter-data-row
            v-for="sample in samples"
            v-bind:key="sample.name"
            v-bind:sample="sample"
            ></counter-data-row>
           <button v-on:click="exportStats">Export Stats</button>
    </div>`,
})
export default class StatsPanel extends Vue {

    private samples: Sample[] = [];

    private mounted() {
        eventEmitter.subscribe(Events.STATS_UPDATED_EVENT, (data) => {
            this.samples = data.samples;
        });
    }

    private exportStats() {
        eventEmitter.emit(Events.STATS_EXPORT_EVENT, {type: CSVExporter.TYPE});
    }
}
