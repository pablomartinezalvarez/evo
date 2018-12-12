import _ = require("lodash");
import * as PIXI from "pixi.js";
import Victor = require("victor");
import Creature from "./Creature";
import Dna from "./Dna";
import Plant from "./Plant";
import Random from "./Random";
import World from "./World";
import Graphics = PIXI.Graphics;

export default class Vegetarian extends Creature {

    public static readonly TYPE = "vegetarian";

    public static readonly DNA_SIZE_GEN = "size";
    public static readonly DNA_VISION_GEN = "vision";
    public static readonly DNA_SPEED_GEN = "speed";

    private static readonly DEFAULT_COLOR = 0x00ccff;
    private static readonly PREGNANT_COLOR = 0xff66ff;
    private static readonly MAX_SIZE = 50;
    private static readonly MAX_VISION = 100;
    private static readonly MAX_SPEED = 1;

    private _color: number;
    private _coupleDna: Dna;
    private _vision: number;
    private _pregnant: boolean;
    private _gestation: number;
    private _target: Creature;
    private _targeted: Creature[];
    private _neighbors: Creature[];

    private _bodyGraphic: Graphics;
    private _targetGraphic: Graphics;

    constructor(world: World, position: Victor, dna: Dna) {
        super(world, position);
        this._dna = dna;

        this._velocity = new Victor(0, 0);
        this._acceleration = new Victor(0, 0);
        this._size = this.dna.getGenOfType(Vegetarian.DNA_SIZE_GEN) * Vegetarian.MAX_SIZE;
        this._vision = this.dna.getGenOfType(Vegetarian.DNA_VISION_GEN) * Vegetarian.MAX_VISION;
        this._topSpeed = this.dna.getGenOfType(Vegetarian.DNA_SPEED_GEN) * Vegetarian.MAX_SPEED;

        // reproduction
        this._pregnant = false;
        this._gestation = 0;
        this._coupleDna = null;

        // social behavior
        this._neighbors = [];
        this._targeted = [];
        this._target = null;
        this._color = Vegetarian.DEFAULT_COLOR;

        // Draws the creature
        this._graphic = new PIXI.Container();

        this._bodyGraphic = new PIXI.Graphics();
        this.drawBody();
        this.graphic.addChild(this._bodyGraphic);

        this._targetGraphic = new PIXI.Graphics();
        this.graphic.addChild(this._targetGraphic);

        this.graphic.position.x = this.position.x;
        this.graphic.position.y = this.position.y;
    }

    public type(): string {
        return Vegetarian.TYPE;
    }

    public update(): void {
        this.draw();
        // skip if it is a blind creature
        if (this._vision > this.size / 2) {
            this.updateNeighbors();
            this.updateTarget();
        }
        this.move();
        this.checkEdges();
        this.reproduce();
        this.die();
        super.update();
    }

    public onCollision(creature: Creature): void {
        // Eats plant
        if (creature instanceof Plant && this.isHungry()) {
            this._health = Math.min(this._health + 0.1, 1);
            creature.hurt(1);
        }
        // Get pregnant
        if (
            this.isFertile()
            && this.type() === creature.type()
            && creature.isFertile()
            && 0.1 > Random.real(0, 1)
        ) {
            this._pregnant = true;
            this._gestation = 250;
            this._color = Vegetarian.PREGNANT_COLOR;
            this._coupleDna = creature.dna;
        }
        // The target has been reached.
        this._targeted.push(this._target);
        this.cleanTarget();
    }

    // Determined by creature age and health.
    public isFertile(): boolean {
        return this._age > 500 && !this._pregnant && this._health > 0.5;
    }

    // Creature motion logic. If it has a target follows it, otherwise moves randomly.
    private move(): void {

        if (!this._target) {
            this._acceleration.x = Random.integer(-1, 1);
            this._acceleration.y = Random.integer(-1, 1);
        } else {
            this._acceleration = this._target.position.clone().subtract(this.position).norm();
        }

        this._velocity = this._velocity.add(this._acceleration);
        this._velocity.limit(this._topSpeed, 0.9);
        this._position = this.position.add(this._velocity);
    }

    // Updates the list of neighbors, targeted neighbors are blacklisted during 100 cycles.
    private updateNeighbors(): void {
        this._neighbors = [];

        if (this._age % 100 === 0) {
            this._targeted = [];
        }

        this._world.creatureTypes.forEach((type) => {
            this._world.getCreaturesOfType(type).forEach((otherCreature) => {
                const distance = this._position.distance(otherCreature.position);

                if (
                    this._id !== otherCreature.id
                    && distance < this._vision
                    && this._targeted.indexOf(otherCreature) === -1
                ) {
                    this._neighbors.push(otherCreature);
                }
            });
        });
    }

    // A random target is selected from the creature neighbors.
    private updateTarget(): void {

        if (this._target && this._neighbors.indexOf(this._target) === -1) {
            this.cleanTarget();
        }

        if (!this._target || this._neighbors.indexOf(this._target) === -1) {
            if (this.isHungry()) {
                this._neighbors.some((neighbor) =>
                    Plant.TYPE === neighbor.type() ? ((this._target = neighbor), true) : false);
            } else {
                this._neighbors.some((neighbor) =>
                    Vegetarian.TYPE === neighbor.type() && neighbor.isFertile()
                        ? ((this._target = neighbor), true) : false);
            }
        }
    }

    // Reproduction logic. Once the gestation period is reached, a new creature is born.
    private reproduce(): void {
        if (this._pregnant) {
            this._gestation -= 1;
            if (this._gestation <= 0 && this._health > 0.5) {
                let childDna = this.crossover(this._coupleDna);

                childDna = childDna.mutate(0.01);
                this._world.add(new Vegetarian(this._world, this.position.clone(), childDna));
                this._pregnant = false;
                this._gestation = 0;
                this._color = Vegetarian.DEFAULT_COLOR;
            }
        }
    }

    private crossover(coupleDna: Dna): Dna {
        return new Dna(_.mapValues(this.dna.genes, (value, type) => {
            return 0.5 < Random.real(0, 1)
                ? value
                : coupleDna.getGenOfType(type);
        }));
    }

    // The creature dies on each world cycle.
     private die() {
        this.hurt(this._pregnant ? 0.002 : 0.001);
    }

    private isHungry(): boolean {
        return this._health < 0.75 || this._pregnant;
    }

    // Removes the current target.
    private cleanTarget(): void {
        this._target = null;
        this._targetGraphic.clear();
    }

    // Redraws the creature target and changes its color if it is pregnant.
    private draw(): void {

        if (this._bodyGraphic.lineColor !== this._color) {
            this._bodyGraphic.clear();
            this.drawBody();
        }

        if (this._target) {
            this._targetGraphic.clear();
            this.drawTarget();
        }
    }

    // Draws the creature body
    private drawBody(): void {
        this._bodyGraphic.beginFill(this._color);
        this._bodyGraphic.drawCircle(0, 0, this.size / 2);
        this._bodyGraphic.endFill();
        if (this._vision > this.size / 2) {
            this._bodyGraphic.lineStyle(1, this._color, 1);
            this._bodyGraphic.drawCircle(0, 0, this._vision);
        }
    }

    // Draws current target
    private drawTarget(): void {
        this._targetGraphic.lineStyle(1, this._color, 1);
        this._targetGraphic.alpha = this._health;
        this._targetGraphic.moveTo(0, 0);
        this._targetGraphic.lineTo(
            this._target.position.x - this.position.x,
            this._target.position.y - this.position.y);
    }

    // Changes the creature position to deal with the world edges.
    private checkEdges(): void {
        if (this.position.x > this._world.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = this._world.width;
        }

        if (this.position.y > this._world.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = this._world.height;
        }
    }
}
