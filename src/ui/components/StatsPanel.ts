import Vue from "vue";
import Component from "vue-class-component";

// The @Component decorator indicates the class is a Vue component
@Component({template: '<button @click="onClick">Click!</button>'})
export default class StatsPanel extends Vue {

    private message: string = "Hello!";

    public onClick(): void {
        window.alert(this.message);
    }
}