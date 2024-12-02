const buttons = document.querySelectorAll('.invisible-button');
const input = document.querySelector('.display');
const d_minus = document.querySelector('.dminus');
const d_vp = document.querySelector('.dvp');

let x = 0;
let y = 0;
let _y = false;
let z = 0; // result
let m = 0; // memory var

let act = 0;
//let _act = 0; // cached

let inv = false; // functional toggle
let invtr = false; // inverse trigonametric (arcsin, arccos, arctg)

let write = false; // for ( 2 * 4 ) and etc.
let write_mem = 0; // 

let rad = false; // radians

let max = Math.pow(10, 99);
let min = Math.pow(10, -99);

function countDigits(value) {
    return value.toString().replace('.', '').length;
}

function cutDigit(value) {
    str = value.toString(); //.replace('e', '');
    return str.slice(0, str.includes('.') ? 9 : 8);
}

function financial(x) {
  return Number.parseFloat(x).toFixed(6);
}


// ERR
// e - убрать или заменить на ^
// при e нужно выводить последние 3 таким образом: -12, +24 и так далее

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
    document.getElementById('k7'),
    document.getElementById('k8'),
    document.getElementById('k9'),
    document.getElementById('k4'),
    document.getElementById('k5'),
    document.getElementById('k6'),
    document.getElementById('k1'),
    document.getElementById('k2'),
    document.getElementById('k3'),
    document.getElementById('k0'),
    document.getElementById('kdot'),
]

function prepare(_act) {
    input.value = "";
    act = _act;
}

function writex(_act, value) {
    prepare(_act);

    if (write_mem != 0) {
        x = write_mem;
        write_mem = 0;
        return;
    }

    if (x == 0) {
        if (value != "") {
            x = parseFloat(value);
            if (d_minus.value == '-') {
                x = -x;
                d_minus.value = "";
            }
            d_vp.value = "";
        }
        _y = true;
        return;
    }
}

function writey(_act, value) {
    prepare(_act);

    if (value != "") {
        y = parseFloat(value);
        if (d_minus.value == '-') {
            y = -y;
            d_minus.value = "";
            d_vp.value = "";
        }
    }
    _y = true;
}

function actfunc_equal(_act, value) {
    writex(_act, value);
    functionals.kequal(value);
}

function writefor(value, neg) {
    if (value.toString() == "NaN") {
        input.value = ".........";
        return;
    }

    if (write) {
        write_mem = value;
    } else {
        let val = parseFloat(value);
        if (Math.abs(val) > max) {
            input.value = "............";
            x = 0;
            return;
        } else if (Math.abs(val) < min) {
            input.value = "............";
            x = 0;
            return;
        }

        value = value.toString().replace('-', '');

        str = value.toString();
        needval = str.includes('.') ? 9 : 8;
        realval = value.toString().replace('.', '').length;

        if (value.includes("e")) {
            i = str.indexOf('e');
            d_vp.value = str.substring(i+1);
            value = value.substring(0, value.indexOf('e'));

            //let [base, exponent] = str.split('e');
            //exponent = parseInt(exponent, 10);
        }

        //base = base.replace('.', '');
        //const significantPart = base.slice(0, 8);
        //const remainingPart = base.slice(8);
        
        //let exponent = firstSignificantIndex - str.indexOf('.') - 1;

        //exponent -= remainingPart.length;

        //value = `${significantPart.slice(0,1)}.${significantPart.slice(1)}e${exponent}`;

        if (neg) {
            if (val < 0) {
                d_minus.value = '';
            } else {
                d_minus.value = '-';
            }
        } else {
            if (val < 0) {
                d_minus.value = '-';
            } else {
                d_minus.value = '';
            }
        }

        
        input.value = cutDigit(value); //+ "^" + (countDigits(cutDigit(value))-12);
    }
}

const functionals = {
    kequal: (value) => {
        if (inv) { // ИП
            input.value = m; 
            return;
        }

        if (write_mem != 0) {
            input.value = write_mem;
            return;
        }

        if (_y == true) {
            y = parseFloat(value);
            if (d_minus.value == '-') {
                y = -y;
                d_minus.value = "";
            }
            d_vp.value = "";
            _y = false;
        }

        console.log(act);

        switch (act) {
            case 0: // nothing
                return;
            case 1: // plus
                x = +x + y;
                writefor(x);
                return;
            case 2: // minus
                x = +x - y;
                writefor(x);
                return;
            case 3: // div
                if (y == 0) {
                    input.value = "Error";
                    return;
                }
                x = +x / y;
                writefor(x);
                return;
            case 4: // mul
                x = +x * y;
                writefor(x);
                return;
            case 5:
                x = Math.pow(y, x);
                writefor(x);
                return;
            default:
                return
        }
    },

    kplus: (value) => {
        if (inv) {
            m = m + parseFloat(value);
            clear();
        } else {
            if (x == 0) {
                writex(1, value);
            } else {
                writey(1, value);
            }
        }
    },
    kminus: (value) => {
        if (inv) {
            m = m - parseFloat(value);
            clear();
        } else {
            if (x == 0) {
                writex(2, value);
            } else {
                writey(2, value);
            }
        }
    },
    kdiv: (value) => {
        if (inv) {
            m = m / parseFloat(value);
            clear();
        } else {
            if (x == 0) {
                writex(3, value);
            } else {
                writey(3, value);
            }
        }
    },
    kmul: (value) => {
        if (inv) {
            m = m * parseFloat(value);
            clear();
        } else {
            if (x == 0) {
                writex(4, value);
            } else {
                writey(4, value);
            }
        }
    },
    k6: (value) => {
        writex(0, value);

        x = Math.sqrt(x);
        writefor(x);
    },
    k7: (value) => {
        writex(0, value);

        x = Math.pow(Math.E, x);
        writefor(x);
    },
    k8: (value) => {
        writex(0, value);

        x = Math.pow(10, x);
        writefor(x);
    },
    k9: (value) => writex(5, value),
    k4: (value) => {
        writex(0, value);

        x = Math.log(Math.abs(x));
        writefor(x);
    },
    k5: (value) => {
        writex(0, value);
        x = Math.log10(x);
        writefor(x);
    },
    k1: (value) => {
        writex(0, value);

        if (invtr) {
            x = financial(Math.asin(x));
        } else {
            x = financial(Math.sin((rad ? x : x * Math.PI/180)));
        } 
        writefor(x);
    },
    k2: (value) => {
        writex(0, value);

        if (invtr) {
            x = Math.round(Math.acos(x), 10);
        } else {
            x = Math.round(Math.cos(x), 10);
        }
        writefor(x);
    },
    k3: (value) => {
        writex(0, value);

        if (invtr) {
            x = Math.round(Math.atan(x), 10);
        } else {
            x = Math.round(Math.tan(x), 10);
        }
        writefor(x);
    },
    k0: (value) => {
        if (inv) {
            x = x * 180/Math.PI;
            writefor(x);
        }
    },
    kdot: (value) => {
        if (inv) {
            x = x * Math.PI/180;
            writefor(x);
        }
    },
    kfact: (value) => {
        writex(0, value);

        x = factorial(x);
        writefor(x);
    },
    kswap: (value) => {
        if (inv) {
            writex(0, value);

            x = 1/x;
            writefor(x);
        } else {
            value = parseFloat(value);
            value = -value; 
            writefor(value, d_minus.value == '-' ? true : false);
        } 
    },
    kmem: (value) => {
        // <->
        if (inv) {
            if (x == 0) {
                if (value != "") {
                    x = parseFloat(value);
                }
            }
            _t = x;
            x = m;
            m = _t;
        } else {
            if (y == 0 && value != "") {
                y = parseFloat(value);
            }
            console.log(x, y);
            _t = x;
            x = y;
            y = _t;
            console.log(x, y);
            writefor(y);
        }
    },
    kleft: (value) => {
        if (inv) {
            if (value != "") {
                m = parseFloat(value);
                clear();
            }
        } else {
            write = true;
        }
    },
    kright: (value) => {
        if (inv) {
            m = 0;
            clear();
        } else {
            input.value = "";
            functionals.kequal(value);
            write = false;
        }
    },
    kpi: () => {
        if (inv) {
            actfunc_equal(14, value);
        } else {
            input.value = Math.PI;
        }
    },
    kf: () => {
        inv = !inv;
    },
    karc: () => {
        invtr = true;
    },
    kclear: () => {
        if (inv) {
            inv = !inv;
            return;
        }
        clear();
    },
    ktoggle: () => {
        let button = document.querySelector('.toggle');
        button.style.background = rad ? "red" : "green";
        rad = !rad;
    }
};

function clear() {
    input.value = "";
    d_minus.value = "";
    d_vp.value = "";

    x = 0;
    y = 0;
    write_mem = 0;

    write = false;
}

buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (nums.includes(button) && !inv) {
            let num = parseFloat(input.value);
            if (countDigits(num) >= 8) {
                return;
            }

            if (!input.value.includes(".") && button.id !== "kdot") {
                if (num == 0) {
                    input.value = "";
                }
            }

            if (button.id == "kdot") {
                if (input.value.includes(".")) {
                    return;
                }
            }
            input.value += button.value;
            return;
        }

        console.log(button.id);
        if (button.id in functionals) {
            functionals[button.id](input.value);
        } else {
            console.log('Unknown operator');
        }
    });
});

