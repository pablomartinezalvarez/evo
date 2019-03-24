import "./style.css";
import "./ui/index";
import {saveAs} from "file-saver";

import Victor = require("victor");
import Dna from "./ecosystem/Dna";
import Plant from "./ecosystem/Plant";
import Vegetarian from "./ecosystem/Vegetarian";
import World from "./ecosystem/World";
import Counter from "./stats/Counter";
import CSVExporter from "./stats/exporters/CSVExporter";
import CycleCountOperation from "./stats/operations/CycleCountOperation";
import PropertyAverageOperation from "./stats/operations/PropertyAverageOperation";
import TotalPopulationOperation from "./stats/operations/TotalPopulationOperation";
import StatsCollector from "./stats/StatsCollector";
import StatsExporter from "./stats/StatsExporter";
import StatsRecorder from "./stats/StatsRecorder";
import Random from "./utils/Random";

const world = new World();

// Init plants population.
for (let i = 0; i < 250; i++) {
    const randomPosition = new Victor(
        Random.integer(0, world.width),
        Random.integer(0, world.height),
    );

    world.add(new Plant(world, randomPosition));
}

// Init vegetarians population.
for (let i = 0; i < 10; i++) {
    const randomPosition = new Victor(
        Random.integer(0, world.width),
        Random.integer(0, world.height),
    );
    const randomGenes: { [key: string]: number } = {};

    randomGenes[Vegetarian.DNA_SIZE_GEN] = Random.real(0, 1);
    randomGenes[Vegetarian.DNA_SPEED_GEN] = Random.real(0, 1);
    randomGenes[Vegetarian.DNA_VISION_GEN] = Random.real(0, 1);

    const randomDna = new Dna(randomGenes);

    world.add(new Vegetarian(world, randomPosition, randomDna));
}

// Init the stats collector and register the stats counters.
const statsCollector = new StatsCollector(world, 10);

statsCollector.registerCounter(new Counter(
    "cycle_count",
    "Cycle",
    new CycleCountOperation(),
));
statsCollector.registerCounter(new Counter(
    "vegetarians_total_population",
    "Vegetarians",
    new TotalPopulationOperation(Vegetarian.TYPE),
));
statsCollector.registerCounter(new Counter(
    "plants_total_population",
    "Plants",
    new TotalPopulationOperation(Plant.TYPE),
));
statsCollector.registerCounter(new Counter(
    "vegetarians_age_average",
    "Avg. age",
    new PropertyAverageOperation(Vegetarian.TYPE, "age"),
));
statsCollector.registerCounter(new Counter(
    "vegetarians_size_average",
    "Avg. size",
    new PropertyAverageOperation(Vegetarian.TYPE, "size"),
));
statsCollector.registerCounter(new Counter(
    "vegetarians_topSpeed_average",
    "Avg. top speed",
    new PropertyAverageOperation(Vegetarian.TYPE, "topSpeed"),
));
statsCollector.registerCounter(new Counter(
    "vegetarians_vision_average",
    "Avg. vision",
    new PropertyAverageOperation(Vegetarian.TYPE, "vision"),
));

const statsRecorder = new StatsRecorder(500);
const statsExporter = new StatsExporter(statsRecorder);

statsExporter.registerExporter(new CSVExporter(saveAs, "stats.csv"));

world.run();
statsCollector.init();
statsRecorder.init();
statsExporter.init();
