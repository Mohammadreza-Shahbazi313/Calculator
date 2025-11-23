// ============================================================
//  Project: Simple Calculator (v1.0)
//  Author: Mohammadreza Shahbazi (M.SH)
//  GitHub: https://github.com/Mohammadreza-Shahbazi-313
//  LinkedIn: https://www.linkedin.com/in/mohammadreza-shahbazi-313sh/
//  Telegram: https://t.me/STANsoSAD
//  Email: eminemengland2000@gmail.com
//  Year: 2025
// ============================================================

// Full expression string that stores the user's typed input (e.g. "99*36+5")
let expression = "";

// Helper: update the main display (input#display)
function updateDisplay() {
  const displayEl = document.getElementById('display');
  displayEl.value = expression || '0';
}

// Append a digit or decimal point to the expression
function appendNumber(number) {
  const ch = String(number);

  // Prevent two consecutive dots in the same numeric token
  if (ch === '.') {
    // find last token (after last operator)
    const lastToken = expression.split(/[\+\-\*\/]/).pop() || '';
    if (lastToken.includes('.')) return; // already has decimal
    if (lastToken === '') {
      // if starting a new number with '.', prepend '0'
      expression += '0';
    }
  }

  expression += ch;
  updateDisplay();
}

// Set an operator (+ - * /)
// Replaces last operator if user pressed operator twice
function setOperation(op) {
  if (expression === "") return; // nothing to operate on

  const lastChar = expression[expression.length - 1];

  // If last char is an operator, replace it with the new one
  if (["+", "-", "*", "/"].includes(lastChar)) {
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }

  updateDisplay();
}

// Evaluate the current expression and show result
function calculate() {
  if (expression === "") return;

  // Basic sanitization: allow only digits, operators, decimal point and spaces
  if (!/^[0-9+\-*/. ()]+$/.test(expression)) {
    document.getElementById("result").innerText = "Error: invalid input";
    return;
  }

  try {
    // Safe-ish evaluation: use Function constructor (still basic). This keeps code short.
    // We rely on the sanitization above to reduce risk.
    const result = Function('"use strict"; return (' + expression + ')')();

    // If result is number, round to avoid floating point artifacts
    const displayResult = (typeof result === 'number')
      ? Math.round((result + Number.EPSILON) * 100000000) / 100000000
      : result;

    document.getElementById("result").innerText = "Result: " + displayResult;
    expression = String(displayResult); // allow further chaining using the result
    updateDisplay();
  } catch (err) {
    document.getElementById("result").innerText = "Error in expression";
  }
}

// Clear everything
function clearDisplay() {
  expression = "";
  document.getElementById("display").value = "";
  document.getElementById("result").innerText = "";
}

// Delete last character (backspace)
function deleteLast() {
  if (expression.length === 0) return;
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Percent: convert current evaluated expression to percentage (value / 100)
function percent() {
  if (expression === "") return;

  // Try to evaluate current expression first
  if (!/^[0-9+\-*/. ()]+$/.test(expression)) {
    document.getElementById("result").innerText = "Error: invalid input";
    return;
  }

  try {
    const value = Function('"use strict"; return (' + expression + ')')();
    if (typeof value === 'number') {
      const pct = value / 100;
      const displayPct = Math.round((pct + Number.EPSILON) * 100000000) / 100000000;
      expression = String(displayPct);
      updateDisplay();
      document.getElementById("result").innerText = "Result: " + displayPct;
    } else {
      document.getElementById("result").innerText = "Error in expression";
    }
  } catch (err) {
    document.getElementById("result").innerText = "Error in expression";
  }
}

// ----------------------
// Keyboard support
// ----------------------
window.addEventListener('keydown', (e) => {
  const key = e.key;

  if ((key >= '0' && key <= '9') || key === '.') {
    appendNumber(key);
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    clearDisplay();
    return;
  }

  if (key === 'Enter' || key === '=') {
    calculate();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    setOperation(key);
    return;
  }
});

// Initialize display on load
updateDisplay();
