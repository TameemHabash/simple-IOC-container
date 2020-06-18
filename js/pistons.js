export default class Pistons {
    constructor(numberOfPistons = 4) {
        this._numbers = numberOfPistons;
        console.log(`pistons instance with "${numberOfPistons}" pistons  created`);
    }
    get numbers() {
        return this._numbers;
    }
    set numbers(newNum) {
        this._numbers = newNum;
    }
}
