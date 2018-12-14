import _ from "lodash";
import * as PIXI from "pixi.js";
import Application = PIXI.Application;
import Creature from "./Creature";
import Plant from "./Plant";
import Vegetarian from "./Vegetarian";
import Container = PIXI.Container;

export default class World {

    private _creatures: { [key: string]: Creature[] };
    private _width: number;
    private _height: number;
    private _application: Application;

    constructor() {
        this._creatures = {};

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
        this._application.stage.addChild((creature.graphic as Container));
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
    private update(): void {
        _.forIn(this._creatures, (creatures) => {
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
        _.forIn(this._creatures, (creatures) => {
            creatures.forEach((otherCreature) => {
                const distance = creature.position.distance(otherCreature.position);
                if (creature.id !== otherCreature.id && distance < (creature.size + otherCreature.size) / 2) {
                    creature.onCollision(otherCreature);
                }
            });
        });
    }
}
