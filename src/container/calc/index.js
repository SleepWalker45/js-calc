class Calc {
    static #NAME = 'calc';
    static #value = '';
    static #isDot = false;

    static add = (newValue) => {
        if (isNaN(this.#value[this.#value.length - 2])) {
            if (
                Number(this.#value[this.#value.length - 1]) === 0 &&
                this.#isDot == false
            ) {
                return null;
            }
        }
        
        this.#value = this.#value.concat(newValue)
        this.#output();
    }

    static #output = () => {
        this.#save();
        window.output.innerHTML = this.#value
    }

    static dot = () => {
        if (this.#isDot) {
            return null;
        }

        if (isNaN(this.#value[this.#value.length - 1])) {
            return null;
        }

        this.#value = this.#value.concat('.');
        this.#output();
        this.#isDot = true;
    }

    static op = (opValue) => {
        if (isNaN(this.#value[this.#value.length - 1])) {
            return null;
        }

        this.#value = this.#value.concat(opValue);
        this.#output();
        this.#isDot = false;
    }

    static reset = () => {
        this.#value = '';
        this.#isDot = false;
        this.#output();
    }

    static result = () => {
        this.#value = String(eval(this.#value));
        this.#output();
    }

    static #save = () => {
        window.localStorage.setItem(this.#NAME, this.#value);
    }

    static #load = () => {
        this.#value = window.localStorage.getItem(this.#NAME) || '';
        console.log(this.#value)
    }

    static init = () => {
        this.#load();
        this.#output();
        console.log('Calc is init 1')
    }
}

Calc.init();
window.calc = Calc