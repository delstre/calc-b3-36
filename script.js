const buttons = document.querySelectorAll('.invisible-button');
const input = document.querySelector('.display');
const d0 = document.querySelector('.d0');
const d1 = document.querySelector('.d1');
const d2 = document.querySelector('.d2');
const d3 = document.querySelector('.d3');
const d4 = document.querySelector('.d4');
const d5 = document.querySelector('.d5');
const d6 = document.querySelector('.d6');
const d7 = document.querySelector('.d7');
const d_minus = document.querySelector('.dm');
const dv_minus = document.querySelector('.dvm');
const dv0 = document.querySelector('.dv0');
const dv1 = document.querySelector('.dv1');

let ENABLE = true;
let OF = false;
let VPINPUT = false;

let INPUT = '';
let REAL = 0;
let VP = 0;

let m = 0;

let act = 0;
let _act = 0;

let inv = false;
let invtr = false;

let write = -1;
let writen = false;

let rad = false;

let max = Math.pow(10, 99);
let min = Math.pow(10, -99);

let dot = false;


let expression = [];
let save_expression = [];
let texpressions = [];
texpressions[0] = [];

let need_erase = true;

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

const display = [
    d0,
    d1,
    d2,
    d3,
    d4,
    d5,
    d6,
    d7
]

const dv = [
    dv0,
    dv1
]

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

function calculateExpression(expression) {
  if (expression.length === 0) return 0;

    let result = Array.isArray(expression[0])
    ? calculateExpression(expression[0])
    : Number(expression[0]);

 for (let i = 1; i < expression.length; i += 2) {
    const operator = expression[i];
      let nextNumber = Array.isArray(expression[i + 1])
      ? calculateExpression(expression[i + 1])
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

function formatNumberWithDot(num) {
  return num
    .toString()
    .split("")
    .map((char, index, arr) => {
      if (char === "." && !isNaN(arr[index - 1])) {
        return ".";
      }
      return char;
    })
    .reduce((acc, char, index, arr) => {
      if (char === "." && !isNaN(arr[index - 1])) {
        acc[acc.length - 1] += char;
      } else {
        acc.push(char);
      }
      return acc;
    }, [])
}

function displayOverflow() {
    display.forEach(function(d) {
        d.value = '0.';
    })
    dv.forEach(function(d) {
        d.value = '0.';
    });
    
    OF = true;
    return;
}

function processVP() {
    if (VPINPUT) {
        if (REAL < 1) {
            const exponent = Math.floor(Math.log10(Math.abs(REAL)));
            let mantissa = REAL / Math.pow(10, exponent);
            if (REAL.toString()[0] != "0") {
                REAL = REAL * Math.pow(10, -exponent);
            }

            console.log(REAL, VP);
        }
        REAL = REAL * Math.pow(10, VP);
        VPINPUT = false;
    }

    if (VP > 99 || VP < -99) {
        displayOverflow();
        return;
    }

    return REAL;
}

function displayProcess_VP(str_vp) {
    if (str_vp < 0) {
        dv_minus.value = '-';
        str_vp = -str_vp;
    } else {
        dv_minus.value = '';
    }

    let md = formatNumberWithDot(str_vp);
    dv.forEach(function(d) {
        d.value = '';
    });

    if (str_vp !== 0) {
        if (str_vp <= 9) {
            dv[0].value = (isNaN(md[1]) ? '0' : md[1]);
            dv[1].value = (isNaN(md[0]) ? '' : md[0]);
        } else {
            dv[0].value = (isNaN(md[0]) ? '' : md[0]);
            dv[1].value = (isNaN(md[1]) ? '' : md[1]);
        }
    }
}

function displayProcess(str, str_vp = 0) {
    let m = formatNumberWithDot(str);
    display.forEach(function(d) {
        d.value = '';
    })

    m.forEach(function(val, i) {
        if (i <= 7) {
            display[i].value = val;
        } 
    });

    displayProcess_VP(str_vp);

}

function displayInput(value) {
    if (VPINPUT) {
        REAL = REAL;
        VP = value;
        displayProcess_VP(VP);

    } else {
        REAL = parseFloat(value);
        INPUT = value;
        displayProcess(value, VP);
    }
}

function formatToFixedLength(num, length = 8) {
    if (num === 0) return [0, 0];
    num = Number(num.toExponential(length));

    if (Math.abs(num) < 1)  {
        const exponent = Math.floor(Math.log10(Math.abs(num)));
        let mantissa = num / Math.pow(10, exponent);

        if (Math.abs(mantissa) < 1) {
            mantissa *= 10;
            exponent -= 1;
        }
        return [mantissa, exponent];
    }

    let strNum = num.toString();
    if (Math.abs(num) <= 99999999 && !strNum.includes('e')) {
        return [num, 0];
    }


    const exponent = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exponent);

    const fixedMantissa = mantissa.toFixed(length - 1);
    return [fixedMantissa, exponent];
}

function displayOutput(value, vpno) {
    if (isNaN(value)) {
        displayOverflow();
        return
    }

    if (value == "Infinity") {
        displayOverflow();
        return;
    }

    if (REAL > max) {
        displayOverflow();
        return;
    }

    if (REAL > 0 && REAL < min) {
        displayOverflow();
        return;
    }

    if (vpno) {
        [INPUT, _] = formatToFixedLength(REAL);
    } else {
        [INPUT, VP] = formatToFixedLength(REAL);
    }
    INPUT = INPUT.toString();

    if (value < 0) {
        d_minus.value = '-';
    } else {
        d_minus.value = '';
    }

    if (INPUT[0] === "-") {
        INPUT = INPUT.slice(1);
    }

    if ((value % 1) !== 0) {
        dot = true;
        if (VP < 0 && INPUT.length == 1) {
            INPUT += '.';
        }
    } else {
        dot = false;
        if (VP == 0) {
            INPUT += '.';
        }
    }

    displayProcess(INPUT, VP);
}

function preInput(mode) {
    if (mode) {
        dot = false;
        VPINPUT = false;
        need_erase = true;
    } else {
        INPUT = '';
        if (!VPINPUT) {
            d_minus.value = '';
        }
        dv0.value = '';
        dv1.value = '';
        dv_minus.value = '';
        VP = 0;
        dot = false;
        need_erase = false;
    }
}

function isVP() {
    return VP !== '' && !isNaN(VP);
}

function isNegative() {
    return d_minus.value == '-' ? true : false;
}

function button_functional(value, action) {
    value = processNegative(value);
    if (write > -1) {
        if (value !== "") {
            texpressions[write].push(value);
        }
        texpressions[write].push(action);
    } else {
        if (value !== "") {
            expression.push(value);
        }
        expression.push(action);
    }
    preInput(true);
}

function processNegative(value) {
    value = processVP();
    if (isNegative() && value > 0) {
        value = -value;
    } else if (!isNegative() && value < 0) {
        value = -value;
    }

    return value;
}

const functionals = {
    kequal: (value, noexpr, nodisplay) => {
        if (inv) {
            displayInput(m);
            displayOutput(m);
            inv = false;
            return;
        }

        value = processNegative(value);

        if (value !== "") {
            expression.push(value);
        }

        if (expression.length == 1) {
            save_expression.unshift(value);
            expression = save_expression;
        }


        const result = calculateExpression(expression);
        if (!nodisplay) {
            displayInput(result);
            displayOutput(result);
        }
        
        if (expression.length >= 2 ) {
            save_expression = [expression[expression.length-2], expression[expression.length-1]];
        }

        if (!noexpr) {
            expression = [];
        }

        need_erase = true;
        writen = false;
    },

    // PLUS
    kplus: (value) => {
        if (inv) {
            value = processNegative(value);
            m = m + parseFloat(value);

            if (m > max) {
                m = parseFloat(value);
            } else if (m > 0 && REAL < min) {
                m = parseFloat(value);
            } else if (isNaN(m) || m == "Infinity") {
                m = parseFloat(value);
            } 

            preInput(true);
            inv = false;
        } else {
            button_functional(value, "+");
        }
    },

    // MINUS
    kminus: (value) => {
        if (inv) {
            value = processNegative(value);
            m = m - parseFloat(value);

            if (m > max) {
                m = parseFloat(value);
            } else if (m > 0 && REAL < min) {
                m = parseFloat(value);
            } else if (isNaN(m) || m == "Infinity") {
                m = parseFloat(value);
            }

            preInput(true);
            inv = false;
        } else {
            button_functional(value, "-");
        }
    },

    // DIVISION
    kdiv: (value) => {
        if (inv) {
            value = processNegative(value);
            m = m / parseFloat(value);

            if (m > max) {
                m = parseFloat(value);
            } else if (m > 0 && REAL < min) {
                m = parseFloat(value);
            } else if (isNaN(m) || m == "Infinity") {
                m = parseFloat(value);
            }

            preInput(true);
            inv = false;
        } else {
            button_functional(value, "/");
        }
    },

    // MULTIPLY
    kmul: (value) => {
        if (inv) {
            value = processNegative(value);
            m = m * parseFloat(value);

            if (m > max) {
                m = parseFloat(value);
            } else if (m > 0 && REAL < min) {
                m = parseFloat(value);
            } else if (isNaN(m) || m == "Infinity") {
                m = parseFloat(value);
            }

            preInput(true);
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
            if (VPINPUT) {
                if (Math.abs(VP) > 0) {
                    VP = -VP;
                    displayInput(VP);
                }
            } else {
                if (!isNaN(value) && value !== "") {
                    d_minus.value = d_minus.value == '-' ? '' : '-';
                }
            }
        } 
    },

    // VP
    kvp: (value) => {
        VPINPUT = true;
        dv0.value = '0';
        dv1.value = '0';
        need_erase = true;
    },

    // SQRT
    k6: (value) => {
        value = processNegative(value);
        value = Math.sqrt(value);
        displayInput(value);
        displayOutput(value);
        inv = false;
        preInput(true);
    },

    // E^X
    k7: (value) => {
        value = processNegative(value);
        value = Math.pow(Math.E, value);
        displayInput(value);
        displayOutput(value);
        inv = false;
        preInput(true);
    },

    // 10^X
    k8: (value) => {
        if (inv) {
            value = processNegative(value);
            value = Math.pow(10, value);
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        }
    },


    // LN
    k4: (value) => {
        if (inv) {
            value = processNegative(value);
            value = Math.log(Math.abs(value));
            console.log(value);
            if (isNaN(value) || value == "Infinity") {
                displayOverflow();
                return;
            }
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        }
    },

    // LOG10
    k5: (value) => {
        if (inv) {
            value = processNegative(value);
            value = Math.log10(value);
            if (isNaN(value) || value == "Infinity") {
                displayOverflow();
                return;
            }
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        } 
    },

    // SINUS
    k1: (value) => {
        value = processNegative(value);
        if (invtr) {
            value = Math.asin(value);
            value = (rad ? value : value * 180/Math.PI);
            value = value.toFixed(8);
            displayInput(value);
            displayOutput(value);
            invtr = false;
            preInput(true);
        } else {
            value = Math.sin(rad ? value : value * Math.PI/180);
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        } 
    },

    // COSINUS
    k2: (value) => {
        value = processNegative(value);

        if (invtr) {
            value = Math.acos(value);
            value = (rad ? value : value * 180/Math.PI);
            value = value.toFixed(8);
            displayInput(value);
            displayOutput(value);
            invtr = false;
            preInput(true);
        } else {
            value = Math.cos(rad ? value : value * Math.PI/180);
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        }
    },

    // TANGENS
    k3: (value) => {
        value = processNegative(value);

        if (invtr) {
            value = Math.atan(value);
            value = (rad ? value : value * 180/Math.PI);
            value = value.toFixed(8);
            displayInput(value);
            displayOutput(value);
            invtr = false;
            preInput(true);
        } else {
            value = Math.tan(rad ? value : value * Math.PI/180);
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        }
    },

    // RAD V GRAD
    k0: (value) => {
        value = processNegative(value);
        if (inv) {
            value = value * 180/Math.PI;
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        }
    },

    // GRAD V RAD
    kdot: (value) => {
        value = processNegative(value);
        if (inv) {
            value = value * Math.PI/180;
            displayInput(value);
            displayOutput(value);
            inv = false;
            preInput(true);
        }
    },

    // SWAP <=>
    kmem: (value) => {
        value = processNegative(value);

        if (inv) {
            let tmp = INPUT;
            displayInput(m);
            displayOutput(m);
            m = tmp;
            inv = false;
            preInput(true);
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
                if (save_expression.length > 1) {
                    expression.unshift(save_expression[1])
                    expression.push(save_expression[0])
                } else {
                    expression.unshift(0);
                    //expression.push("+");
                }
                functionals.kmem();
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
                value = processNegative(value);
                m = parseFloat(value);
                inv = false;
                preInput(true);
            }
        } else {
            writen = true;
            write = write + 1; 
            texpressions[write] = [];
            preInput(true);
        }
    },

    // RIGHT )
    kright: (value) => {
        if (inv) {
            m = 0;
            inv = false;
            preInput(true);
        } else {
            if (write == -1) {
                texpressions = []
                texpressions[0] = [];
                write = -1;
                return;
            }

            texpressions[write].push(value);
            write = write - 1;
            
            const result = calculateExpression(texpressions[write+1]);
            displayInput(result);
            displayOutput(result);

            if (write == -1) {
                preInput(true);
                return
            }

            preInput(true);
        }
    },

    // PI
    kpi: (value) => {
        if (inv) {
            value = processNegative(value);

            if (value == 0) {
                value = 1;
            } else if (value < 0) {
                displayOverflow();
                return;
            }

            value = factorial(value.toFixed(0));
            displayInput(value);
            displayOutput(value);
            preInput(true);
            inv = false;
        } else {
            d_minus.value = '';
            displayInput(Math.PI);
            preInput(true);
        }
    },

    // FUNCTIONAL BUTTON
    kf: () => {
        if (VPINPUT) {
            functionals.kequal();
        }
        inv = !inv;
    },

    // ARC
    karc: () => {
        invtr = true;
    },

    // CLEAR
    kclear: () => {
        invtr = false;
        if (inv) {
            inv = !inv;
            return;
        }
        clear();
    },
    ktoggle: () => {
        let button = document.querySelector('.ktoggle-image');
        button.src = rad ? "toggle_grad.png" : "toggle_rad.png";
        rad = !rad;
    },
    kenable: () => {
        let button = document.querySelector('.kenable-image');
        button.src = ENABLE ? "enable_off.png" : "enable_on.png";
        ENABLE = !ENABLE;

        if (ENABLE) {
            displayInput('0.');
        } else {
            clear();
            displayInput('');
        }
    }
};

function clear() {
    displayInput('0.');
    d_minus.value = '';
    dv0.value = '';
    dv1.value = '';
    dv_minus.value = '';
    VP = 0;
    expression = [];
    texpressions = []
    texpressions[0] = [];
    save_expression = [];
    write = -1;

    need_erase = true;
    dot = false;
    OF = false;
    VPINPUT = false;
}

displayInput('0.');
d_minus.value = '';


buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (OF && button.id !== 'kclear') {
            return;
        }

        if (!ENABLE && button.id !== "kenable") {
            return;
        }

        if (nums.includes(button) && !inv && !invtr) {
            if (need_erase) {
                if (button.id !== "kdot") {
                    preInput();
                }
            }

            let num = INPUT;
            if (num.toString().replace('.', '').replace('-', '').length >= 8) {
                return;
            }

            if (VPINPUT) {
                let str = VP == 0 ? '' : VP.toString();
                str = str.replace('.', '');
                if (str.length >= (str.includes('-') ? 3 : 2)) {
                    str = '';
                }

                str += button.value;

                displayInput(str);
                return;
            } else {
                if (button.id == "kdot") {
                    dot = true;
                    if (need_erase && INPUT !== "0.") {
                        displayInput('0.');
                    }

                    need_erase = false;
                    return;
                }

                if (button.id == "k0" && num == 0 && !dot) {
                    displayInput('0.');
                    need_erase = true;
                    return;
                }

                let str = INPUT;

                if (!dot) {
                    str = str.replace('.', '');
                }

                str += button.value;

                if (button.id !== "kdot" && !dot) {
                    str += ".";
                }

                displayInput(str);
                return;
            }
        }

        if (button.id in functionals) {
            functionals[button.id](REAL);
            _act = button.id;
        }
    });
});

