import * as _ from "lodash";
import * as PIXI from "pixi.js";

import Application = PIXI.Application;
import Container = PIXI.Container;
import Creature from "./Creature";
import Plant from "./Plant";
import Vegetarian from "./Vegetarian";

import eventEmitter from "../events/EventEmitter";
import Events from "../events/Events";

PIXI.utils.skipHello();

export default class World {

    private readonly _creatures: { [key: string]: Creature[] };
    private _cycle: number;
    private readonly _width: number;
    private readonly _height: number;
    private _application: Application;

    constructor() {
        this._creatures = {};
        this._cycle = 0;
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        // Creates the pixi application
        this._application = new PIXI.Application({width: this._width, height: this._height});
        document.body.appendChild(this._application.view);
    }

    public run(): void {
        this._application.ticker.add(() => this.update());
    }

    public add(creature: Creature): void {
        if (!this._creatures[creature.type()]) {
            this._creatures[creature.type()] = [];
        }
        this._creatures[creature.type()].push(creature);
        if (creature.graphic) {
            this._application.stage.addChild(creature.graphic);
        }
    }

    public get cycle(): number {
        return this._cycle;
    }

    public get creatureTypes(): string[] {
        return _.keys(this._creatures);
    }

    public getCreaturesOfType(type: string): Creature[] {
        return this._creatures[type];
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    // Implements the main world loop
    public update(): void {
        eventEmitter.emit(Events.WORLD_TICK_EVENT, {cycle: this._cycle});

        ++this._cycle;
        _.forIn(this._creatures, (creatures: Creature[]) => {
            creatures.forEach((creature) => {
                creature.update();
                this.handleCollisions(creature);
                if (creature.isDeath()) {
                    this.remove(creature);
                }
            });
        });
    }

    private remove(creature: Creature): void {
        this._application.stage.removeChild((creature.graphic as Container));
        const index = this._creatures[creature.type()].indexOf(creature);
        if (index !== -1) {
            this._creatures[creature.type()].splice(index, 1);
        }
        if (creature.type() === Vegetarian.TYPE) {
            this.add(new Plant(this, creature.position.clone()));
        }
    }

    private handleCollisions(creature: Creature) {
        _.forIn(this._creatures, (creatures: Creature[]) => {
            creatures.forEach((otherCreature) => {
                const distance = creature.position.distance(otherCreature.position);
                if (creature.id !== otherCreature.id && distance < (creature.size + otherCreature.size) / 2) {
                    creature.onCollision(otherCreature);
                }
            });
        });
    }
}
