import Vue from "vue";
import StatsPanel from "./components/StatsPanel";

new Vue({render: (s) => s(StatsPanel)}).$mount("#stats-panel");
