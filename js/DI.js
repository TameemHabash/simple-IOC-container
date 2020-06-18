let
    ERROR_RECURSION = 'Recursive failure : Circular reference for dependency ',
    ERROR_REGISTRATION = 'Already registered.',
    ERROR_ARRAY = 'Must pass array with constructor item at least',
    ERROR_FUNCTION = 'Must pass function to invoke.',
    ERROR_SERVICE = 'Service does not exist',
    ERROR_LABEL = 'lable must be a string',
    ERROR_DEPENDENCIES = 'Dependencies must be strings',
    ERROR_VALUES = 'values must be objects contains two properties: label string and value that will be passed to constructor',
    ERROR_VALUE = 'value must be an exist service',
    ERROR_TARGET_VALUE = 'pass null if there is no value  nedded',
    ERROR_DEPENDENT = 'This is not a dependent of the reqeusted instance';

function isArrayHasItems(array) {
    return Array.isArray(array) && array.length > 0;
}

class Injector {
    constructor() {
        this.container = {};
    }

    register(label, arrayOfDependencies) {
        if (this.container[label]) {
            throw new Error(ERROR_REGISTRATION);
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
        //checks the validaty of the passed parameters(future work below)
        //check if it's existing in the requested instance
        // if (!deliveredDependent) {
        //     throw new Error(ERROR_DEPENDENT);
        // }
        if (!service) {
            throw new Error(`'${label}'${ERROR_SERVICE}`);
        }
        if ((typeof targetValue === 'object' && targetValue !== null) || typeof targetValue === 'undefined' || typeof targetValue === 'function' || typeof targetValue === 'bigint') {
            throw new Error(ERROR_TARGET_VALUE);
        }
        if (isArrayHasItems(values)) {
            values.forEach((value, i) => {
                const valueLable = Object.keys(value)[0];

                if (typeof value !== 'object' || Object.keys(value).length !== 2 || typeof values[i][valueLable] !== 'string') {
                    throw new Error(ERROR_VALUES);
                }
                if (!this.container[valueLable]) {
                    throw new Error(ERROR_VALUE);
                }
                //has been commented because the value you passed may be for a low dependent of the requested service
                // if (service.deps) {
                //     const valueInServiceDeps = service.deps.find((dep, j) => {
                //         return dep === values[i][valueLable];
                //     });
                //     if (!valueInServiceDeps) {
                //         throw new Error(ERROR_DEPENDENT);
                //     }
                // }

            });
        }
        //do the process
        //values.map((value,i)=>{
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

                // const dependentConstructor = this.container[dep];
                //     dependentConstructor(deliveredValue)
                // }

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
        // });
    }
}

export default new Injector();