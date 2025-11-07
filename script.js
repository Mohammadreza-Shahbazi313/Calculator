// ============================================================
//  Project: Simple Calculator (v1.0)
//  Author: Mohammadreza Shahbazi (M.SH)
//  GitHub: https://github.com/Mohammadreza-Shahbazi-313
//  LinkedIn: https://www.linkedin.com/in/mohammadreza-shahbazi-313sh/
//  Telegram: https://t.me/STANsoSAD
//  Email: eminemengland2000@gmail.com
//  Year: 2025
// ============================================================

// --- State Variables ---
let currentInput = '';   // Stores the current number being typed
let operation = '';      // Stores the current operator (+, -, *, /)
let firstOperand = null; // Stores the first operand in a calculation

// ------------------------------------------------------------
// Function: appendNumber()
// Purpose : Adds a digit to the current input and updates the display
// ------------------------------------------------------------
function appendNumber(number) {
  currentInput += number.toString(); // Convert number to string and append
  document.getElementById('display').value = currentInput; // Update the UI
}

// ------------------------------------------------------------
// Function: setOperation()
// Purpose : Sets the chosen operation (+, -, *, /) and prepares for next input
// ------------------------------------------------------------
function setOperation(op) {
  if (currentInput === '') return; // Ignore if no input

  if (firstOperand === null) {
    // First number in the operation
    firstOperand = parseFloat(currentInput);
  } else {
    // If already have a first operand, calculate first
    calculate();
  }

  // Store the selected operation and reset input for next number
  operation = op;
  currentInput = '';
}

// ------------------------------------------------------------
// Function: calculate()
// Purpose : Performs the selected operation between two operands
// ------------------------------------------------------------
function calculate() {
  if (firstOperand === null || currentInput === '') return;

  const secondOperand = parseFloat(currentInput);
  let result;

  // Perform calculation based on selected operator
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
      // Prevent division by zero
      result = secondOperand !== 0
        ? firstOperand / secondOperand
        : 'Division by zero is not possible.';
      break;
    default:
      return;
  }

  // Display result in the UI
  document.getElementById('result').innerText = 'Result: ' + result;

  // Reset calculator for next operation
  resetCalculator();
}

// ------------------------------------------------------------
// Function: clearDisplay()
// Purpose : Clears both display and result output
// ------------------------------------------------------------
function clearDisplay() {
  resetCalculator();
  document.getElementById('display').value = '';
  document.getElementById('result').innerText = '';
}

// ------------------------------------------------------------
// Function: resetCalculator()
// Purpose : Resets all stored values to their initial state
// ------------------------------------------------------------
function resetCalculator() {
  currentInput = '';
  operation = '';
  firstOperand = null;
}
