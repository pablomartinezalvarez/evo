export default interface Exporter {

    type(): string;

    export(samples: { [name: string]: string[] }): void;
}