import Vue from "vue";
import Component from "vue-class-component";
import Counter from "../../stats/Counter";

import "./counter-data-row.css";

@Component({
    props: {
        counter: Counter,
    },
    template: `
    <div class="counter-data-row">
        <div class="row-cell counter-data-row-label">{{counter.label}}</div>
        <div class="row-cell counter-data-row-value">{{counter.value}}</div>
    </div>`,
})
export default class CounterDataRow extends Vue {}
