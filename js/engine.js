export default class Engine {
    constructor(pistons) {
        this.pistons = pistons;
        console.log(`engine instance with ${pistons.numbers} pistons  created`);
    }
    get details() {
        return `this engine contains ${pistons.numbers} pistons`;
    }
    get pistonsNumber() {
        return this.pistons.numbers;
    }
}