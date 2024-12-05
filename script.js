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
let _act = 0; // cached

let inv = false; // functional toggle
let invtr = false; // inverse trigonametric (arcsin, arccos, arctg)

let write = 0; // for ( 2 * 4 ) and etc.
let writen = false;
let write_mem = 0; // 

let rad = false; // radians

let max = Math.pow(10, 99);
let min = Math.pow(10, -99);

let dot = false;

// -----
let real_value = 0;

let expression = [];
let save_expression = [];
let temp_expression = [];

let need_erase = true;

// -----

function countDigits(value) {
    return value.toString().replace('.', '').replace('-', '').length;
}

function cutDigit(value) {
    str = value.toString(); //.replace('e', '');
    return str.slice(0, str.includes('.') ? 8 : 7);
}

function financial(x) {
  return Number.parseFloat(x).toFixed(6);
}

function factorial(n) {
  if (n === 0 || n === 1) return 1; // Базовый случай: факториал 0 или 1 равен 1
  return n * factorial(n - 1); // Рекурсивное умножение
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

    if (write > 0) {
        //write_mem = value;
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

function calculateExpression(expression) {
  if (expression.length === 0) return 0;

    let result = Array.isArray(expression[0])
    ? calculateExpression(expression[0]) // Если первый элемент — вложенное выражение, вычисляем его
    : Number(expression[0]);

  for (let i = 1; i < expression.length; i += 2) {
    const operator = expression[i];
      let nextNumber = Array.isArray(expression[i + 1])
      ? calculateExpression(expression[i + 1]) // Если следующий элемент — вложенное выражение, вычисляем его
      : Number(expression[i + 1]);

    if (!isNaN(nextNumber)) {
      switch (operator) {
        case '+':
          result += nextNumber;
          break;
        case '-':
          result -= nextNumber;
          break;
        case '*':
          result *= nextNumber;
          break;
        case '/':
          result /= nextNumber;
          break;
        case '^':
          result = Math.pow(result, nextNumber);
          break;
        case 'vp':
          result *= Math.pow(10, nextNumber);
          break;
      }
    }
  }

  return result;
}

function simplifyExpression(expression) {
    let i = 0;
    if (expression.length <= 3) {
        return
    }
    
    for (let i = 1; i < expression.length; i += 2) {
        const operator = expression[i];

        if (operator === '+' || operator === '-') {
          const prevNumber = Number(expression[i - 1]);
          const nextNumber = Number(expression[i + 1]);

          let result;
          if (operator === '+') {
            result = prevNumber + nextNumber;
          } else if (operator === '-') {
            result = prevNumber - nextNumber;
          }

          expression.splice(i - 1, 3, result);
        }
    }

    return expression;
}

function displayInput(value) {
    if ((value % 1) !== 0) {
        const factor = Math.pow(10, 7);
        real_value = Math.trunc(value * factor) / factor;
    } else {
        real_value = Number(value);
    }

    input.value = value;
}

function displayOutput(value) {
    if (isNaN(value)) {
        input.value = "........";
        return
    }

    if (value == "Infinity") {
        input.value = "........";
        return;
    }

    if (real_value > max) {
        input.value = "........";
        d_vp.value = 99;
        return;
    }

    if (real_value > 0 && real_value < min) {
        input.value = "........";
        d_vp.value = -99;
        return;
    }

    if (value < 0) {
        d_minus.value = '-';
    } else {
        d_minus.value = '';
    }

    str = real_value.toString();
    if (str.includes("e")) {
        i = str.indexOf('e');
        if ((value % 1) == 0) {
            d_vp.value = str.substring(i+1) - 7;
            str = str.substring(0, str.indexOf('e'));
            str = parseFloat(str) * Math.pow(10, 8);
        } else {
            //console.log(str)
            //d_vp.value = str.substring(i+1);
            //str = str.substring(0, str.indexOf('e'));
            //str = parseFloat(str) * Math.pow(10, 8);
        }
        str = str.toString();
    } else {
        let c = countDigits(real_value)
        if (c > 8) {
            d_vp.value = c - 8;
        }
    }

    if ((value % 1) !== 0) {
        dot = true;
        input.value = str.replace('-', '').slice(0, dot ? 9 : 8);
    } else {
        dot = false;
        input.value = str.replace('-', '').slice(0, dot ? 9 : 8);
        input.value += '.';
    }
}

function preInput(mode) {
    if (mode) {
        //input.value = "0.";
        //d_minus.value = "";
        dot = false;
        need_erase = true;
    } else {
        input.value = "";
        d_minus.value = "";
        dot = false;
        need_erase = false;
    }
}

function isVP() {
    return d_vp.value !== '' && !isNaN(d_vp.value);
}

function isNegative() {
    return d_minus.value == '-' ? true : false;
}

function button_functional(value, action) {
    if (isNegative() && value > 0) {
        console.log("NEG");
        value = -value;
    }
    if (write > 0) {
        if (value !== "") {
            temp_expression.push(value);
        }
        temp_expression.push(action);
    } else {
        console.log(expression);
        if (value !== "") {
            expression.push(value);
        }
        expression.push(action);
        console.log(expression);
    }
    preInput(true);
}

const functionals = {
    kequal: (value, noexpr, nodisplay) => {
        if (inv) {
            displayInput(m);
            inv = false;
            return;
        }

        if (isNegative() && value > 0) {
            value = -value;
        }

        if (isVP()) {
            //console.log(d_vp.value);
            //value *= Math.pow(10, d_vp.value);
        }

        if (value !== "") {
            expression.push(value);
        }
        
        if (expression.length == 1) {
            save_expression.unshift(value);
            expression = save_expression;
        }

        //console.log(expression);

        const result = calculateExpression(expression); // Вычисляем
        if (!nodisplay) {
            displayInput(result);
            displayOutput(result);
        }
        
        if (expression.length >= 2 ) {
            save_expression = [expression[expression.length-2], expression[expression.length-1]];
        }

        if (!noexpr) {
            expression = []; // Сбрасываем выражение
        }

        need_erase = true;
        writen = false;

        //if (inv) { // ИП
            //input.value = m; 
            //return;
        //}

        //if (write_mem != 0) {
            //input.value = write_mem;
            //return;
        //}

        //if (_y == true) {
            //y = parseFloat(value);
            //if (d_minus.value == '-') {
                //y = -y;
                //d_minus.value = "";
            //}
            //d_vp.value = "";
            //_y = false;
        //}

        //console.log(act);

        //switch (act) {
            //case 0: // nothing
                //return;
            //case 1: // plus
                //x = +x + y;
                //writefor(x);
                //return;
            //case 2: // minus
                //x = +x - y;
                //writefor(x);
                //return;
            //case 3: // div
                //if (y == 0) {
                    //input.value = "Error";
                    //return;
                //}
                //x = +x / y;
                //writefor(x);
                //return;
            //case 4: // mul
                //x = +x * y;
                //writefor(x);
                //return;
            //case 5:
                //x = Math.pow(y, x);
                //writefor(x);
                //return;
            //default:
                //return
        //}
    },

    // PLUS
    kplus: (value) => {
        if (inv) {
            m = m + parseFloat(value);
            console.log(m);
            preInput(true);
            displayInput(value);
            displayOutput(m);
            inv = false;
        } else {
            button_functional(value, "+");
        }
    },

    // MINUS
    kminus: (value) => {
        if (inv) {
            m = m - parseFloat(value);
            console.log(m);
            preInput(true);
            displayInput(value);
            displayOutput(m);
            inv = false;
        } else {
            button_functional(value, "-");
        }
    },

    // DIVISION
    kdiv: (value) => {
        if (inv) {
            m = m / parseFloat(value);
            console.log(m);
            preInput(true);
            displayInput(value);
            displayOutput(m);
            inv = false;
        } else {
            button_functional(value, "/");
        }
    },

    // MULTIPLY
    kmul: (value) => {
        if (inv) {
            m = m * parseFloat(value);
            console.log(m);
            preInput(true);
            displayInput(value);
            displayOutput(m);
            inv = false;
        } else {
            button_functional(value, "*");
        }
    },
    //
    // Y^X
    k9: (value) => {
        button_functional(value, "^");
        inv = false;
    },

    // MINUS TOGGLE
    kswap: (value) => {
        if (inv) {
            value = 1 / value;
            displayInput(value);
            displayOutput(value);
            inv = false;
        } else {
            if (!isNaN(value) && value !== "") {
                d_minus.value = d_minus.value == '-' ? '' : '-';
            }
        } 
    },

    // VP
    kvp: (value) => {
        button_functional(value, "vp");
    },

    // SQRT
    k6: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        value = Math.sqrt(value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // E^X
    k7: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        value = Math.pow(Math.E, value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // 10^X
    k8: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        value = Math.pow(10, value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },


    // LN
    k4: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        value = Math.log(Math.abs(value));
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // LOG10
    k5: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        value = Math.log10(value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // SINUS
    k1: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        if (invtr) {
            value = Math.asin(value);
            value *= (180/Math.PI);
            displayInput(value);
            displayOutput(value);
            invtr = false;
        } else {
            value = Math.sin(rad ? value : value * Math.PI/180);
            displayInput(value);
            displayOutput(value);
            inv = false;
        } 
    },

    // COSINUS
    k2: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }

        if (invtr) {
            value = Math.acos(value);
            value *= (180/Math.PI);
            displayInput(value);
            displayOutput(value);
            invtr = false;
        } else {
            value = Math.cos(rad ? value : value * Math.PI/180);
            displayInput(value);
            displayOutput(value);
            inv = false;
        }
    },

    // TANGENS
    k3: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }

        if (invtr) {
            value = Math.atan(value);
            value *= (180/Math.PI);
            displayInput(value);
            displayOutput(value);
            invtr = false;
        } else {
            value = Math.tan(rad ? value : value * Math.PI/180);
            displayInput(value);
            displayOutput(value);
            inv = false;
        }
    },

    // RAD V GRAD
    k0: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        if (inv) {
            value = value * 180/Math.PI;
            displayInput(value);
            displayOutput(value);
            inv = false;
        }
    },

    // GRAD V RAD
    kdot: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }
        if (inv) {
            value = value * Math.PI/180;
            displayInput(value);
            displayOutput(value);
            inv = false;
        }
    },

    // SWAP <=>
    kmem: (value) => {
        if (isNegative() && value > 0) {
            value = -value;
        }

        if (inv) {
            tmp = real_value;
            displayInput(m);
            m = tmp;
        } else {
            if (expression.length > 2) {
                expression = simplifyExpression(expression);
            }

            if (expression.length == 2) {
                tmp = value;
                displayInput(expression[expression.length-2]);
                displayOutput(expression[expression.length-2]);
                expression[expression.length-2] = tmp;
            } else if (expression.length == 0) {
                expression[0] = value;
                displayInput(0);
                displayOutput("0.");
            } else if (expression.length == 1) {
                tmp = value;
                displayInput(expression[0])
                displayOutput(expression[0]);
                expression[0] = tmp;
            }

            need_erase = true;

        }
    },

    // LEFT (
    kleft: (value) => {
        if (inv) {
            if (value != "") {
                m = parseFloat(value);
                console.log(m);
                inv = false;
                preInput(true);
            }
        } else {
            write = 1; 
            writen = true;
            temp_expression = [];
        }
    },

    // RIGHT )
    kright: (value) => {
        if (inv) {
            m = 0;
            preInput(true);
        } else {
            temp_expression.push(value);
            expression.push(temp_expression);
            temp_expression = [];
            preInput(true);
            write = 0;
        }
    },

    // PI
    kpi: (value) => {
        if (inv) {
            if (isNegative() && value > 0) {
                value = -value;
            }

            value = factorial(value);
            displayInput(value);
            displayOutput(value);
            inv = false;
        } else {
            displayInput(Math.PI);
        }
    },

    // FUNCTIONAL BUTTON
    kf: () => {
        inv = !inv;
    },

    // ARC
    karc: () => {
        invtr = true;
    },

    // CLEAR
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
    displayInput('0.');
    d_minus.value = '';
    d_vp.value = '';
    expression = [];

    x = 0;
    y = 0;
    write_mem = 0;

    need_erase = true;
    write = false;
    dot = false;
}

displayInput('0.');
d_minus.value = '';
d_vp.value = '';


buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (nums.includes(button) && !inv && !invtr) {
            if (need_erase) {
                if (button.id !== "kdot") {
                    preInput();
                }
            }

            let num = input.value;
            if (countDigits(num) >= 8) {
                return;
            }

            if (button.id == "kdot") {
                dot = true;
                if (need_erase && input.value !== "0.") {
                    displayInput('0.');
                }

                need_erase = false;
                return;
            }

            if (button.id == "k0" && num == 0 && !dot) {
                need_erase = true;
                return;
            }
            
            let str = input.value;

            if (!dot) {
                str = str.replace('.', '');
            }

            str += button.value;

            if (button.id !== "kdot" && !dot) {
                console.log("HEY", dot, button.id);
                str += ".";
            }

            displayInput(str);
            return;
        }

        if (button.id in functionals) {
            functionals[button.id](real_value);
            _act = button.id;
        } else {
            console.log('Unknown operator');
        }
    });
});

