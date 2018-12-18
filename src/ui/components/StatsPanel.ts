import Vue from "vue";
import Component from "vue-class-component";
import Counter from "../../stats/Counter";
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
            v-for="counter in counters"
            v-bind:key="counter.name"
            v-bind:counter="counter"
            ></counter-data-row>
    </div>`,
})
export default class StatsPanel extends Vue {

    private counters: Counter[] = [];

    private mounted() {
        eventEmitter.subscribe("stats:updated", (stats) => {
            this.counters = stats.counters;
        });
    }
}
