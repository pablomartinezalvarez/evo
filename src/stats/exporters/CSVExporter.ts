import * as _ from "lodash";
import Exporter from "./Exporter";

export default class CSVExporter implements Exporter {

    public static TYPE = "csv";

    private readonly _save: any;
    private readonly _fileName: string;

    constructor(save: any, fileName: string) {
        this._save = save;
        this._fileName = fileName;
    }

    public type() {
        return CSVExporter.TYPE;
    }

    public export(samples: { [name: string]: string[] }): void {

        // Create headers
        const csvContent: string[] = [];
        const keys: string[] = _.keys(samples);

        if (keys.length) {
            let row: number = 0;

            // Header
            csvContent.push(keys.join(",") + "\r\n");

            // Rows
            while (row < samples[keys[0]].length) {
                csvContent.push(keys.map((key) => samples[key][row]).join(",") + "\r\n");
                row++;
            }
        }

        const blob = new Blob(csvContent, {type: "text/csv;charset=utf-8"});

        this._save(blob, this._fileName);
    }
}
