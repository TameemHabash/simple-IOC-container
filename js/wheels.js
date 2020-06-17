export default class Wheels {
    constructor(sizeOfWheels = 15) {
        this.sizeOfWheels = sizeOfWheels;
        console.log(`wheels instance with size of ${this.sizeOfWheels} created`);
    }
    get sizeOfWheels() {
        return this.sizeOfWheels;
    }
}