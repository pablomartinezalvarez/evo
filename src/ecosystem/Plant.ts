import Victor = require("victor");

import * as PIXI from "pixi.js";
import Random from "../utils/Random";
import Creature from "./Creature";
import World from "./World";
import Graphics = PIXI.Graphics;

export default class Plant extends Creature {

    public static readonly TYPE = "plant";

    constructor(world: World, position: Victor) {
        super(world, position);

        this._size = 5;

        this._graphic = new PIXI.Graphics();
        (this._graphic as Graphics).beginFill(0x00ff99);
        (this._graphic as Graphics).drawRect(0, 0, this.size, this.size);
        (this._graphic as Graphics).endFill();

        this._graphic.position.x = this.position.x;
        this._graphic.position.y = this.position.y;
    }

    public type(): string {
        return Plant.TYPE;
    }

    public update(): void {
        this.reproduce();
        this.die();
        super.update();
    }

    private die(): void {
        this._health -= 0.0005;
    }

    private reproduce(): void {
        if (
            this._world.getCreaturesOfType(this.type()).length < 1000
            && this._age % 100 === 0
            && 0.1 > Random.real(0, 1)
        ) {
            const numChildren = Random.integer(1, 3);

            for (let child = 0; child < numChildren; child++) {
                const xOffset = Random.integer(
                    Random.integer(-100, 100),
                    Random.integer(-100, 100),
                );
                const yOffset = Random.integer(
                    Random.integer(-100, 100),
                    Random.integer(-100, 100),
                );
                const childPosition = this.position.clone().add(new Victor(xOffset, yOffset));

                if (childPosition.x > this._world.width) {
                    childPosition.x = childPosition.x - this._world.width;
                } else if (childPosition.x < 0) {
                    childPosition.x = this._world.width + childPosition.x;
                }

                if (childPosition.y > this._world.height) {
                    childPosition.y = childPosition.y - this._world.height;
                } else if (this.position.y < 0) {
                    childPosition.y = this._world.height + childPosition.y;
                }

                this._world.add(new Plant(this._world, childPosition));
            }
        }
    }
}
