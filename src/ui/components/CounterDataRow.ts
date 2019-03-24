import Vue from "vue";
import Component from "vue-class-component";
import Sample from "../../stats/Sample";

import "./counter-data-row.css";

@Component({
    props: {
        sample: Sample,
    },
    template: `
    <div class="counter-data-row">
        <div class="row-cell counter-data-row-label">{{sample.label}}</div>
        <div class="row-cell counter-data-row-value">{{sample.value}}</div>
    </div>`,
})
export default class CounterDataRow extends Vue {}
