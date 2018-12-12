import Victor = require("victor");
import Dna from "./Dna";
import Random from "./Random";
import World from "./World";
import Container = PIXI.Container;

export default abstract class Creature {

    protected _id: string;
    protected _position: Victor;
    protected _velocity: Victor;
    protected _acceleration: Victor;
    protected _topSpeed: number;
    protected _size: number;
    protected _graphic: Container;
    protected _world: World;
    protected _health: number;
    protected _age: number;
    protected _dna: Dna;

    protected constructor(world: World, position: Victor) {
        this._id = Random.uuid4();
        this._world = world;
        this._position = position;
        this._health = 1;
        this._age = 0;
    }

    public abstract type(): string;

    public update(): void {
        this._graphic.alpha = this._health;
        this._graphic.position.x = this.position.x;
        this._graphic.position.y = this.position.y;
        this._age += 1;
    }

    public isDeath(): boolean {
        return this._health <= 0;
    }

    public isFertile(): boolean {
        return false;
    }

    public hurt(damage: number): void {
        this._health = Math.max(0, this._health - damage);
    }

    public onCollision(_otherCreature: Creature): void {
        // To be implemented on subclasses
    }

    public get id(): string {
        return this._id;
    }

    public get position(): Victor {
        return this._position;
    }

    public get size(): number {
        return this._size;
    }

    public get graphic(): Container {
        return this._graphic;
    }

    public get dna(): Dna {
        return this._dna;
    }
}
