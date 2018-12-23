import Vue from "vue";
import Component from "vue-class-component";
import Sample from "../../stats/Sample";
import CounterDataRow from "./CounterDataRow";

import eventEmitter from "../../events/EventEmitter";

import "./stats-panel.css";

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
    </div>`,
})
export default class StatsPanel extends Vue {

    private samples: Sample[] = [];

    private mounted() {
        eventEmitter.subscribe("stats:updated", (data) => {
            this.samples = data.samples;
        });
    }
}
