export default class Car {
    constructor(engine, wheels) {
        this.engine = engine;
        this.wheels = wheels;
        console.log(`car instance with (engine with ${this.engine.pistonsNumber} pistons and wheels of size ${this.wheels.sizeOfWheels}) created`);
    }
}