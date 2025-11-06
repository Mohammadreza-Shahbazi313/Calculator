// ============================================================
//  Project: Simple Calculator (v1.0)
//  Author: Mohammadreza Shahbazi (M.SH)
//  GitHub: https://github.com/Mohammadreza-Shahbazi-313
//  LinkedIn: https://www.linkedin.com/in/mohammadreza-shahbazi-313sh/
//  Telegram: https://t.me/STANsoSAD
//  Email: eminemengland2000@gmail.com
//  Year: 2025
// ============================================================

let currentInput = '';
let operation = '';
let firstOperand = null;

function appendNumber(number) {
  currentInput += number.toString();
  document.getElementById('display').value = currentInput;
}

function setOperation(op) {
  if (currentInput === '') return;

  if (firstOperand === null) {
    firstOperand = parseFloat(currentInput);
  } else {
    calculate();
  }

  operation = op;
  currentInput = '';
}

function calculate() {
  if (firstOperand === null || currentInput === '') return;

  let secondOperand = parseFloat(currentInput);
  let result;

  switch (operation) {
    case '+':
      result = firstOperand + secondOperand;
      break;
    case '-':
      result = firstOperand - secondOperand;
      break;
    case '*':
      result = firstOperand * secondOperand;
      break;
    case '/':
      result = secondOperand !== 0
        ? firstOperand / secondOperand
        : 'Division by zero is not possible.';
      break;
    default:
      return;
  }

  document.getElementById('result').innerText = 'Result: ' + result;
  resetCalculator();
}

function clearDisplay() {
  resetCalculator();
  document.getElementById('display').value = '';
  document.getElementById('result').innerText = '';
}

function resetCalculator() {
  currentInput = '';
  operation = '';
  firstOperand = null;
}
