const buttons = document.querySelectorAll('.buttons');
const input = document.querySelector('#display');

let x = 0; // calc vars
let y = 0; //
let m = 0; // memory var

let act = 0;

let inv = false; // functional toggle
let invtr = false; // inverse trigonametric (arcsin, arccos, arctg)

let write = false; // for ( 2 * 4 ) and etc.
let write_mem = 0; // 

/*
 *
 *  act = 0 - nothing
 *  act = 1 - plus
 *  act = 2 - minus
 *  act = 3 - div
 *  act = 4 - mul
 *  act = 5 - sqrt
 *  act = 6 - pow
 *  act = 7 - pow10
 *  act = 8 - powy
 *  act = 9 - ln
 *  act = 10 - log
 *  act = 11 - sin
 *  act = 12 - cos
 *  act = 13 - tg
 *  act = 14 - fact
 *
*/

const nums = [
    document.getElementById('7'),
    document.getElementById('8'),
    document.getElementById('9'),
    document.getElementById('4'),
    document.getElementById('5'),
    document.getElementById('6'),
    document.getElementById('1'),
    document.getElementById('2'),
    document.getElementById('3'),
    document.getElementById('0'),
    document.getElementById('dot'),
]

const mappings = {
    clear: { current: 'C', toggle: 'CF' },
    swap: { current: '/-/', toggle: '1/x' },
    7: { current: '7', toggle: 'e^x' },
    8: { current: '8', toggle: '10^x' },
    9: { current: '9', toggle: 'y^x' },
    left: { current: '[(', toggle: 'ЗП' },
    right: { current: ')]', toggle: 'СП' },
    4: { current: '4', toggle: 'ln' },
    5: { current: '5', toggle: 'lq' },
    6: { current: '6', toggle: 'sqrt(x)' },
    mul: { current: '*', toggle: 'Пх' },
    div: { current: '/', toggle: 'П/' }, // need edit
    1: { current: '1', toggle: 'sin' },
    2: { current: '2', toggle: 'cos' },
    3: { current: '3', toggle: 'tg' },
    plus: { current: '+', toggle: 'П+' },
    minus: { current: '-', toggle: 'П-' },
    0: { current: '0', toggle: 'P->Г' },
    dot: { current: '.', toggle: 'Г->P' },
    pi: { current: 'pi', toggle: 'n!' },
    back: { current: '<->', toggle: 'x-П' },
    equal: { current: '=', toggle: 'ИП' },
};

function actfunc(_act, value) {
    input.value = "";
    act = _act;

    if (write_mem != 0) {
        x = write_mem;
        write_mem = 0;
        return;
    }

    if (x == 0) {
        if (value != "") {
            x = parseFloat(value);
        }
        return;
    }
}

function actfunc_equal(_act, value) {
    actfunc(_act, value);
    functionals.equal(value);
}

function writefor(value) {
    if (write) {
        write_mem = value;
    } else {
        input.value = value;
    }
}

const functionals = {
    equal: (value) => {
        if (inv) { // ИП
            input.value = m; 
            return;
        }

        if (write_mem != 0) {
            input.value = write_mem;
            return;
        }

        if (value != "") {
            y = parseFloat(value);
        }

        switch (act) {
            case 0:
                return;
            case 1:
                x = x + y;
                writefor(x);
                return;
            case 2:
                x = x - y;
                writefor(x);
                return;
            case 3:
                if (y == 0) {
                    input.value = "Error";
                    return;
                }
                x = x / y;
                writefor(x);
                return;
            case 4:
                x = x * y;
                writefor(x);
                return;
            case 5:
                x = Math.sqrt(x);
                writefor(x);
                return;
            case 6:
                x = Math.pow(Math.E, x);
                writefor(x);
                return;
            case 7:
                x = Math.pow(10, x);
                writefor(x);
                return;
            case 8:
                x = Math.pow(y, x);
                writefor(x);
                return;
            case 9:
                // ln
                x = Math.log(x);
                writefor(x);
                return;
            case 10:
                // log
                x = Math.log10(x);
                writefor(x);
                return;
            case 11:
                // sin
                if (invtr) {
                    x = Math.asin(x);
                } else {
                    x = Math.sin(x);
                } 
                writefor(x);
                return;
            case 12:
                // cos
                if (invtr) {
                    x = Math.acos(x);
                } else {
                    x = Math.cos(x);
                }
                writefor(x);
                return;
            case 13:
                // tg
                if (invtr) {
                    x = Math.atan(x);
                } else {
                    x = Math.tan(x);
                }
                writefor(x);
                return;
            case 14:
                // fact
                x = factorial(x);
                writefor(x);
                return;
            case 15:
                // 1/x
                x = 1/x;
                writefor(x);
                return;

            default:
                return
        }
    },

    plus: (value) => {
        if (inv) {
            m = m + parseFloat(value);
            clear();
        } else {
            actfunc(1, value);
        }
    },
    minus: (value) => {
        if (inv) {
            m = m - parseFloat(value);
            clear();
        } else {
            actfunc(2, value);
        }
    },
    div: (value) => {
        if (inv) {
            m = m / parseFloat(value);
            clear();
        } else {
            actfunc(3, value);
        }
    },
    mul: (value) => {
        if (inv) {
            m = m * parseFloat(value);
            clear();
        } else {
            actfunc(4, value);
        }
    },
    6: (value) => actfunc_equal(5, value),
    7: (value) => actfunc_equal(6, value),
    8: (value) => actfunc_equal(7, value),
    9: (value) => actfunc(8, value),
    4: (value) => actfunc_equal(9, value),
    5: (value) => actfunc_equal(10, value),
    1: (value) => actfunc_equal(11, value),
    2: (value) => actfunc_equal(12, value),
    3: (value) => actfunc_equal(13, value),
    0: (value) => {
        x = x * 180/Math.PI;
        writefor(x);
    },
    dot: (value) => {
        x = x * Math.PI/180;
        writefor(x);
    },
    fact: (value) => actfunc_equal(14, value),
    swap: (value) => actfunc_equal(15, value),
    mem: (value) => {
        // <->
        _t = x;
        x = m;
        m = _t;

        writefor(x);
    },

    left: (value) => {
        if (inv) {
            if (value != "") {
                m = parseFloat(value);
                clear();
            }
        } else {
            write = true;
        }
    },
    
    right: (value) => {
        if (inv) {
            m = 0;
            clear();
        } else {
            input.value = "";
            functionals.equal(value);
            write = false;
        }
    },

    pi: () => {
        if (inv) {
            actfunc_equal(14, value);
        } else {
            x = Math.PI; // to mem need
            input.value = x;
        }
    },
    f: () => swap(),
    arc: () => {
        invtr = true;
    },
    clear: () => {
        if (inv) {
            swap();
            return;
        }
        clear();
    },
};

function clear() {
    input.value = "";

    x = 0;
    y = 0;
    write_mem = 0;

    write = false;
}

function swap() {
    Object.entries(mappings).forEach(([key, { current, toggle }]) => {
        const button = document.getElementById(key);
        if (button) {
            button.innerHTML = button.innerHTML === current ? toggle : current;
        }

    });

    inv = !inv;
}

buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (nums.includes(button) && !inv) {
            input.value += button.innerHTML;
            return;
        }

        if (button.id in functionals) {
            functionals[button.id](input.value);
        } else {
            console.log('Unknown operator');
        }
    });
});

