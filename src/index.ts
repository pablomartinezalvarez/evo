import "./style.css";

import Victor from "victor";
import Dna from "./Dna";
import Plant from "./Plant";
import Random from "./Random";
import "./ui";
import Vegetarian from "./Vegetarian";
import World from "./World";

const world = new World();

for (let i = 0; i < 100; i++) {
    const randomPosition = new Victor(Random.integer(0, world.width), Random.integer(0, world.height));

    world.add(new Plant(world, randomPosition));
}

for (let i = 0; i < 10; i++) {
    const randomPosition = new Victor(Random.integer(0, world.width), Random.integer(0, world.height));
    const randomGenes: { [key: string]: number } = {};

    randomGenes[Vegetarian.DNA_SIZE_GEN] = Random.real(0, 1);
    randomGenes[Vegetarian.DNA_SPEED_GEN] = Random.real(0, 1);
    randomGenes[Vegetarian.DNA_VISION_GEN] = Random.real(0, 1);

    const randomDna = new Dna(randomGenes);

    world.add(new Vegetarian(world, randomPosition, randomDna));
}

world.run();
