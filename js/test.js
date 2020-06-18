import DI from './DI.js';
import Car from './car.js';
import Engine from './engine.js';
import Wheels from './wheels.js';
import Pistons from './pistons.js';

DI.register('car', ['engine', 'wheels', Car]);
DI.register('engine', ['pistons', Engine]);
DI.register('wheels', [Wheels]);
DI.register('pistons', [Pistons]);
const car1 = DI.getInstanceOf('car', null);
Console.log(car1);