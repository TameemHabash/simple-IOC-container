export default class Pistons {
    constructor(numberOfPistons = 4) {
        this.numbers = numberOfPistons;
        console.log(`pistons instance with "${numberOfPistons}" pistons  created`);
    }
    get number() {
        return this.numbers;
    }
}
