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

// input.value 
let INPUT = '';
let REAL = 0;
let VP = 0;

// d_vp.value

let m = 0; // memory var

let act = 0;
let _act = 0; // cached

let inv = false; // functional toggle
let invtr = false; // inverse trigonametric (arcsin, arccos, arctg)

let write = -1; // for ( 2 * 4 ) and etc.
let writen = false;

let rad = false; // radians

let max = Math.pow(10, 99);
let min = Math.pow(10, -99);

let dot = false;

// -----
let expression = [];
let save_expression = [];
let texpressions = []; // temp expressions
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
        d.value = ' .';
    })
    return;
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
            dv[0].value = (isNaN(md[1]) ? '' : md[1]);
            dv[1].value = (isNaN(md[0]) ? '' : md[0]);
        } else {
            dv[0].value = (isNaN(md[0]) ? '' : md[0]);
            dv[1].value = (isNaN(md[1]) ? '' : md[1]);
        }
    }
}

function displayInput(value) {
    REAL = parseFloat(value);
    INPUT = value;
    displayProcess(value, VP);
}

function formatToFixedLength(num, length = 8) {
    if (num === 0) return [0, 0];

    if (Math.abs(num) < 1) {
        console.log("FLOAT");
        const exponent = Math.floor(Math.log10(Math.abs(num)));
        let mantissa = num / Math.pow(10, exponent);

        if (Math.abs(mantissa) < 1) {
            mantissa *= 10;
            exponent -= 1;
        }
        return [mantissa, exponent];
    }

    console.log("NUMBER");
    let strNum = num.toString();

    if (strNum.length <= length && !strNum.includes('e')) {
        return [num, 0];
    }

    const exponent = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exponent);

    const formattedMantissa = mantissa.toFixed(length - 2);

    return [formattedMantissa, exponent];
}

function displayOutput(value) {
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

    [INPUT, VP] = formatToFixedLength(REAL);

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
    } else {
        dot = false;
        console.log(VP);
        if (VP == 0) {
            INPUT += '.';
        }
    }

    displayProcess(INPUT, VP);
}

function preInput(mode) {
    if (mode) {
        //input.value = "0.";
        //d_minus.value = "";
        dot = false;
        need_erase = true;
    } else {
        INPUT = "";
        d_minus.value = "";
        dv0.value = '';
        dv1.value = '';
        dv_minus.value = '';
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
    console.log(value);
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
            inv = false;
            return;
        }

        value = processNegative(value);

        if (value !== "") {
            expression.push(value);
        }

        console.log(expression);
        
        if (expression.length == 1) {
            save_expression.unshift(value);
            expression = save_expression;
        }

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
        value = processNegative(value);
        value = Math.sqrt(value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // E^X
    k7: (value) => {
        value = processNegative(value);
        value = Math.pow(Math.E, value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // 10^X
    k8: (value) => {
        value = processNegative(value);
        value = Math.pow(10, value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },


    // LN
    k4: (value) => {
        value = processNegative(value);
        value = Math.log(Math.abs(value));
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // LOG10
    k5: (value) => {
        value = processNegative(value);
        value = Math.log10(value);
        displayInput(value);
        displayOutput(value);
        inv = false;
    },

    // SINUS
    k1: (value) => {
        value = processNegative(value);
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
        value = processNegative(value);

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
        value = processNegative(value);

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
        value = processNegative(value);
        if (inv) {
            value = value * 180/Math.PI;
            displayInput(value);
            displayOutput(value);
            inv = false;
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
        }
    },

    // SWAP <=>
    kmem: (value) => {
        value = processNegative(value);

        if (inv) {
            tmp = REAL;
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
            writen = true;
            write = write + 1; 
            texpressions[write] = [];
            console.log(write, texpressions);
        }
    },

    // RIGHT )
    kright: (value) => {
        if (inv) {
            m = 0;
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
}

displayInput('0.');
d_minus.value = '';


buttons.forEach(function(button) {
    button.addEventListener('click', function() {
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

        if (button.id in functionals) {
            functionals[button.id](REAL);
            _act = button.id;
        }
    });
});

