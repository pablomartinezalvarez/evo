import eventEmitter from "./EventEmitter";

describe("given an event with multiple subscribers", () => {
    test("when the event is emitted the subscribers handlers are called", () => {

        const mockHandler01 = jest.fn();
        const mockHandler02 = jest.fn();
        const mockHandler03 = jest.fn();
        const data = {field: "value"};

        eventEmitter.subscribe("test-event-01", mockHandler01);
        eventEmitter.subscribe("test-event-01", mockHandler02);
        eventEmitter.subscribe("test-event-02", mockHandler03);

        eventEmitter.emit("test-event-01", data);

        expect(mockHandler01.mock.calls[0].length).toBe(1);
        expect(mockHandler01.mock.calls[0][0]).toBe(data);
        expect(mockHandler02.mock.calls[0].length).toBe(1);
        expect(mockHandler02.mock.calls[0][0]).toBe(data);
        expect(mockHandler03.mock.calls.length).toBe(0);
    });
});
