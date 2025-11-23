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

// --- NEW STATE: Full expression handling ---
let expression = "";  // stores full typed expression

// ------------------------------------------------------------
// Function: appendNumber()
// Purpose : Adds a digit to the current input and updates the display
// ------------------------------------------------------------
function appendNumber(number) {
  expression += number.toString();
  document.getElementById('display').value = expression;
}

// ------------------------------------------------------------
// Function: setOperation()
// Purpose : Sets the chosen operation (+, -, *, /) and prepares for next input
// ------------------------------------------------------------
function setOperation(op) {
  if (currentInput === '') return; // Ignore if no input

function setOperation(op) {
  if (expression === "") return;
  const lastChar = expression[expression.length - 1];

  // Prevent double operators (e.g., 5++6)
  if (["+", "-", "*", "/"].includes(lastChar)) {
    expression = expression.slice(1);
  }

  expression += op;
  document.getElementById('display').value = expression;
}

// ------------------------------------------------------------
// Function: calculate()
// Purpose : Performs the selected operation between two operands
// ------------------------------------------------------------

function calculate() {
  if (expression === "") return;

  try {
    // Safe evaluation using Function()
    const result = Function("return " + expression)();
    document.getElementById("result").innerText = "Result: " + result;
    expression = result.toString();
    document.getElementById("display").value = expression;

  } catch (err) {
    document.getElementById("result").innerText = "Error in expression";
  }
}

// ------------------------------------------------------------
// Function: clearDisplay()
// Purpose : Clears both display and result output
// ------------------------------------------------------------
function clearDisplay() {
  expression = "";
  document.getElementById("display").value = "";
  document.getElementById("result").innerText = "";
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
