/* The buttons */
const operation = document.querySelectorAll('[data-operation]');
const numbers = document.querySelectorAll('[data-number]');
const equals = document.querySelector('[data-equals]');
const deleteCalc = document.querySelector('[data-delete]');
const allClear = document.querySelector('[data-all-clear]');

/* The display output */
const previousOperand = document.querySelector('[data-previous-operand]');
const currentOperand = document.querySelector('[data-current-operand]');

/* calculator computation function */
const Operations = {
  add(valueOne, valueTwo) {
    return valueOne + valueTwo;
  },

  subtract(valueOne, valueTwo) {
    return valueOne - valueTwo;
  },

  multiply(valueOne, valueTwo) {
    return valueOne * valueTwo;
  },

  divide(valueOne, valueTwo) {
    if (valueTwo === 0) {
      return null;
    }
    return valueOne / valueTwo;
  },
};

/* calculator functions */
const Calculator = {
  currentOperand: '',
  previousOperand: '',
  operation: undefined,

  // stores the references
  previousOperandText: previousOperand,
  currentOperandText: currentOperand,

  allClear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = '';
  },

  deleteNumber() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  },

  appendNumber(number) {
    // if '.' exist, do nothing
    if (number === '.' && this.currentOperand.includes('.')) return;

    this.currentOperand = this.currentOperand.toString() + number.toString();
  },

  chooseOperation(operation) {
    // do nothing if empty
    if (this.currentOperand === '') return;

    // if previous exist, compute first
    if (this.previousOperand !== '') {
      this.compute();
    }

    // set operation and move current to previous
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  },

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // computation
    switch (this.operation) {
      case '+':
        computation = Operations.add(prev, current);
        break;
      case '-':
        computation = Operations.subtract(prev, current);
        break;
      case '÷':
        computation = Operations.divide(prev, current);
        if (computation === null) {
          computation = '';
          this.errorAlert();
        }
        break;
      case '×':
        computation = Operations.multiply(prev, current);
        break;
      default:
        return 'Error';
    }

    // Setting current operand to show result
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
  },

  displayNumber(number) {
    const stringNumber = number.toString();
    const integerNumber = parseFloat(stringNumber.split('.')[0]);
    const decimalNumber = stringNumber.split('.')[1];

    let displayNumber;
    // if it is integer
    if (isNaN(integerNumber)) {
      displayNumber = '';
    } else {
      displayNumber = integerNumber.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }

    // if it is float
    if (decimalNumber != null) {
      return `${displayNumber}.${decimalNumber}`;
    } else {
      return displayNumber;
    }
  },

  updateDisplay() {
    // update the current operand
    this.currentOperandText.textContent = this.displayNumber(
      this.currentOperand
    );

    // update the previous operand
    if (this.operation != null) {
      const result = `${this.displayNumber(this.previousOperand)} ${
        this.operation
      }`;
      this.previousOperandText.textContent = result;
    } else {
      this.previousOperandText.textContent = '';
    }
  },

  errorAlert() {
    this.allClear();
    this.updateDisplay();
    alert('Please pick another number for divisor!');
  },
};

/* Event Listener for buttons */
// for numbers
numbers.forEach((button) => {
  button.addEventListener('click', () => {
    Calculator.appendNumber(button.textContent);
    Calculator.updateDisplay();
  });
});

// for operation
operation.forEach((button) => {
  button.addEventListener('click', () => {
    Calculator.chooseOperation(button.textContent);
    Calculator.updateDisplay();
  });
});

// for equals
equals.addEventListener('click', () => {
  Calculator.compute();
  Calculator.updateDisplay();
});

// for AC
allClear.addEventListener('click', () => {
  Calculator.allClear();
  Calculator.updateDisplay();
});

// for delete
deleteCalc.addEventListener('click', () => {
  Calculator.deleteNumber();
  Calculator.updateDisplay();
});

/* Event Listener keyboard functionality */
document.addEventListener('keydown', (event) => {
  // variables
  const changeOperator = {
    '*': '×',
    '/': '÷',
  };

  // Button ui pressed the keyboard indication
  const animate = function () {
    const list = {
      Enter: '=',
      Backspace: 'DEL',
      Escape: 'AC',
    };

    const button = Array.from(document.querySelectorAll('button')).find(
      (btn) =>
        btn.textContent.trim() === event.key ||
        btn.textContent.trim() === changeOperator[event.key] ||
        btn.textContent.trim() === list[event.key]
    );

    if (button) {
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), 50);
    }
  };

  // for number keys
  if ((event.key >= 0 && event.key <= 9) || event.key === '.') {
    Calculator.appendNumber(event.key);
    Calculator.updateDisplay();
    animate();
  }

  // for operators
  if (['+', '-', '*', '/'].includes(event.key)) {
    const operation = changeOperator[event.key] || event.key;
    Calculator.chooseOperation(operation);
    Calculator.updateDisplay();
    animate();
  }

  // for equals
  if (event.key === 'Enter' || event.key === '=') {
    Calculator.compute();
    Calculator.updateDisplay();
    animate();
  }

  // for delete (backspace)
  if (event.key === 'Backspace') {
    Calculator.deleteNumber();
    Calculator.updateDisplay();
    animate();
  }

  // for AC
  if (event.key === 'Escape') {
    Calculator.allClear();
    Calculator.updateDisplay();
    animate();
  }

  // to prevent for certain keys to avoid unintended behavior
  if (
    ['Enter', 'Backspace', 'Escape', '*', '/', '+', '-'].includes(event.key)
  ) {
    event.preventDefault();
  }
});
