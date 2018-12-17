class EventEmitter {

    private readonly _events: { [key: string]: Array<(event: any) => void> };

    public constructor() {
        this._events = {};
    }

    public emit(eventName: string, data: any) {
        const event = this._events[eventName];
        if (event) {
            event.forEach((fn) => {
                fn.call(null, data);
            });
        }
    }

    public subscribe(eventName: string, fn: (event: any) => void) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }

        this._events[eventName].push(fn);
        return () => {
            this._events[eventName] = this._events[eventName].filter((eventFn) => fn !== eventFn);
        };
    }
}

export default new EventEmitter();
