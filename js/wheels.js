export default class Wheels {
    constructor(sizeOfWheels = 15) {
        this._sizeOfWheels = sizeOfWheels;
        console.log(`wheels instance with size of ${this.sizeOfWheels} created`);
    }
    get sizeOfWheels() {
        return this._sizeOfWheels;
    }
    set sizeOfWheels(newSize) {
        this._sizeOfWheels = newSize;
    }
}