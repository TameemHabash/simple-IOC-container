export default class Engine {
    constructor(pistons) {
        this.pistons = pistons;
        console.log(`engine instance with ${pistons.number} pistons  created`);
    }
    get details() {
        return `this engine contains ${pistons.number} pistons`;
    }
    get pistonsNumber() {
        return this.pistons;
    }
}