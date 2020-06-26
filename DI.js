let
    ERROR_RECURSION = 'Recursive failure : Circular reference for dependency ',
    ERROR_REGISTRED = 'Already registered.',
    ERROR_NOT_REGISTRED = 'Not registered yet service',
    ERROR_ARRAY = 'Must pass array with constructor item at least',
    ERROR_FUNCTION = 'Must pass function to invoke.',
    ERROR_SERVICE = 'Service does not exist',
    ERROR_LABEL = 'lable must be a string',
    ERROR_DEPENDENCIES = 'Dependencies must be strings',
    ERROR_VALUES = 'values must be objects contains two properties: label string and value that will be passed to constructor',
    ERROR_VALUE = 'value must be an exist service',
    ERROR_TARGET_VALUE = 'pass null if there is no value  nedded',
    WARNNING_DEPENDENT = 'This is not a dependent of the reqeusted instance';

function isArrayHasItems(array) {
    return Array.isArray(array) && array.length > 0;
}

class Injector {
    constructor() {
        this.container = {};
    }

    register(label, arrayOfDependencies) {
        if (this.container[label]) {
            throw new Error(ERROR_REGISTRED);
        }
        if (!isArrayHasItems(arrayOfDependencies)) {
            throw new Error(ERROR_ARRAY);
        }
        if (typeof arrayOfDependencies[arrayOfDependencies.length - 1] !== 'function') {
            throw new Error(ERROR_FUNCTION);
        }
        if (typeof label !== 'string') {
            throw new Error(ERROR_LABEL);
        }
        if (arrayOfDependencies.length > 1) {
            arrayOfDependencies.slice(0, arrayOfDependencies.length - 1).forEach((dependency) => {
                if (typeof dependency !== 'string') {
                    throw new Error(ERROR_DEPENDENCIES);
                }
            });
        }
        this.container[label] = {
            construct: arrayOfDependencies[arrayOfDependencies.length - 1],
            deps: arrayOfDependencies.length > 1 ? arrayOfDependencies.slice(0, arrayOfDependencies.length - 1) : null
        };
    }
    getInstanceOf(label, targetValue, ...values) {
        const service = this.container[label];

        if (!service) {
            throw new Error(`'${label}'${ERROR_SERVICE}`);
        }
        if ((typeof targetValue === 'object' && targetValue !== null) || typeof targetValue === 'undefined' || typeof targetValue === 'function' || typeof targetValue === 'bigint') {
            throw new Error(ERROR_TARGET_VALUE);
        }
        if (service.deps) {
            service.deps.forEach((dep) => {
                if (!this.container[dep]) {
                    throw new Error(`'${dep}' ${ERROR_NOT_REGISTRED}`);
                }
            });
        }
        if (isArrayHasItems(values)) {
            values.forEach((value, i) => {
                const valueLable = Object.keys(value)[0];

                if (typeof value !== 'object' || Object.keys(value).length !== 2 || typeof values[i][valueLable] !== 'string') {
                    throw new Error(`${ERROR_VALUES} for '${values[i][valueLable]}'`);
                }
                if (!this.container[values[i][valueLable]]) {
                    throw new Error(`${ERROR_VALUE} for '${values[i][valueLable]}'`);
                }

            });
        }

        //   future work: [check if the passed parameters {objects} are low dependent of the requested service or not, and throw WARNNING_DEPENDENT if any parameters is not needed ] and [check for circular reference for dependency to throw ERROR_RECURSION Error].


        //do the process
        if (service.deps) {
            const neededParams = [];
            const readyParams = [];
            let deliveredDependentValue;
            service.deps.forEach((dep, i) => {
                const deliveredDependent = values.find((value, j) => {
                    return values[j][Object.keys(value)[0]] === dep;
                });
                if (deliveredDependent) {
                    deliveredDependentValue = deliveredDependent[Object.keys(deliveredDependent)[1]];
                } else {
                    deliveredDependentValue = null;
                }
                //get the needed parameters for dependent to call getInstanceOf with new params
                const existDependent = this.container[dep];
                if (existDependent.deps) {
                    existDependent.deps.forEach((edep) => {
                        const val = values.find((val, s) => {
                            return values[s][Object.keys(val)[0]] === edep;
                        });
                        if (val) {
                            neededParams.push(val);
                        }
                    });
                }
                //call getInstanceOf with new params
                readyParams.push(this.getInstanceOf(dep, deliveredDependentValue, ...neededParams));
                //clear array for the immediate function call
                neededParams.splice(0, neededParams.length);
            });
            if (targetValue) {
                return new service.construct(targetValue, ...readyParams);
            }
            return new service.construct(...readyParams);

        } else {
            if (targetValue) {
                return new service.construct(targetValue);
            }
            return new service.construct();
        }
    }
}

export default new Injector();