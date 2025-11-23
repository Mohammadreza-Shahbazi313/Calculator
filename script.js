// ============================================================
//  Project: Simple Calculator (v1.0) - Expression engine (Shunting-yard + RPN eval)
//  Author: Mohammadreza Shahbazi (M.SH)
//  GitHub: https://github.com/Mohammadreza-Shahbazi-313
//  Year: 2025
// ============================================================

/*
  Overview:
  - Maintains a single `expression` string that represents the user's input (infix).
  - Tokenizes input into numbers/operators/parentheses, converts to RPN via Shunting-yard,
    evaluates RPN with a safe stack-based evaluator.
  - Supports: + - * /, decimal point, unary minus, percent (applies to last number),
    backspace, clear, keyboard entry.
  - Results are rounded to 8 decimal places and trailing zeros are trimmed.
*/

// -----------------------------
// State
// -----------------------------
let expression = ""; // main expression string (infix)

// -----------------------------
// Utility / Display helpers
// -----------------------------
function getDisplayEl() {
  return document.getElementById('display');
}
function getResultEl() {
  return document.getElementById('result');
}
function updateDisplay() {
  const el = getDisplayEl();
  el.value = expression || '0';
}

// Round to n decimals and trim trailing zeros
function formatNumber(num, decimals = 8) {
  if (!isFinite(num)) return String(num);
  const rounded = Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
  // Remove trailing zeros
  let s = String(rounded);
  if (s.indexOf('.') !== -1) {
    s = s.replace(/\.?0+$/, '');
  }
  return s;
}

// -----------------------------
// Tokenizer
// -----------------------------
/*
  Token types: NUMBER (e.g., "123", "12.34", "-5"), OP ("+", "-", "*", "/"), LPAREN "(", RPAREN ")"
  Rules:
   - Unary minus is supported: when '-' appears at the start or right after '(' or another operator, it's unary -> attach to number token.
   - Spaces are ignored.
*/
function tokenize(input) {
  const tokens = [];
  const s = input.replace(/\s+/g, ''); // remove spaces
  let i = 0;
  while (i < s.length) {
    const ch = s[i];

    // number (digit or leading dot)
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let num = ch;
      i++;
      while (i < s.length && ((s[i] >= '0' && s[i] <= '9') || s[i] === '.')) {
        num += s[i++];
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // parentheses
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++; continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++; continue;
    }

    // operators
    if (['+', '-', '*', '/'].includes(ch)) {
      // detect unary minus: unary if at start OR previous token is operator or LPAREN
      if (ch === '-') {
        const prev = tokens.length ? tokens[tokens.length - 1] : null;
        if (!prev || prev.type === 'OP' || prev.type === 'LPAREN') {
          // parse as part of a number: consume following digits/decimal as negative number
          let j = i + 1;
          let num = '-';
          // If next char is digit or dot, parse number
          if (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) {
            while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) {
              num += s[j++];
            }
            tokens.push({ type: 'NUMBER', value: num });
            i = j;
            continue;
          } else {
            // treat as operator minus if no number follows (fallback)
            tokens.push({ type: 'OP', value: '-' });
            i++; continue;
          }
        }
      }
      // normal binary operator
      tokens.push({ type: 'OP', value: ch });
      i++; continue;
    }

    // any other char: invalid
    // to be safe, include as raw operator to trigger validation later
    tokens.push({ type: 'INVALID', value: ch });
    i++;
  }
  return tokens;
}

// -----------------------------
// Shunting-yard: infix -> RPN (array of tokens)
// -----------------------------
function infixToRPN(tokens) {
  const output = [];
  const opStack = [];

  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const leftAssoc = { '+': true, '-': true, '*': true, '/': true };

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      output.push(token);
    } else if (token.type === 'OP') {
      const o1 = token.value;
      while (opStack.length) {
        const top = opStack[opStack.length - 1];
        if (top.type === 'OP') {
          const o2 = top.value;
          if ((leftAssoc[o1] && precedence[o1] <= precedence[o2]) ||
              (!leftAssoc[o1] && precedence[o1] < precedence[o2])) {
            output.push(opStack.pop());
            continue;
          }
        }
        break;
      }
      opStack.push(token);
    } else if (token.type === 'LPAREN') {
      opStack.push(token);
    } else if (token.type === 'RPAREN') {
      // pop until LPAREN
      let foundLP = false;
      while (opStack.length) {
        const popped = opStack.pop();
        if (popped.type === 'LPAREN') { foundLP = true; break; }
        output.push(popped);
      }
      if (!foundLP) {
        throw new Error('Mismatched parentheses');
      }
    } else {
      // invalid token
      throw new Error('Invalid token: ' + token.value);
    }
  }

  while (opStack.length) {
    const popped = opStack.pop();
    if (popped.type === 'LPAREN' || popped.type === 'RPAREN') {
      throw new Error('Mismatched parentheses');
    }
    output.push(popped);
  }
  return output;
}

// -----------------------------
// Evaluate RPN
// -----------------------------
function evalRPN(rpn) {
  const stack = [];
  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const n = Number(token.value);
      if (Number.isNaN(n)) throw new Error('Invalid number: ' + token.value);
      stack.push(n);
    } else if (token.type === 'OP') {
      if (stack.length < 2) throw new Error('Insufficient operands');
      const b = stack.pop();
      const a = stack.pop();
      let res;
      switch (token.value) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          res = a / b;
          break;
        default: throw new Error('Unknown operator: ' + token.value);
      }
      stack.push(res);
    } else {
      throw new Error('Invalid RPN token: ' + token.type);
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

// -----------------------------
// Public UI functions (used by HTML buttons)
// -----------------------------

// Append digit or '.' to expression
function appendNumber(number) {
  // Accept numbers or '.' string
  const ch = String(number);

  // Prevent two decimals in the same number token
  if (ch === '.') {
    // find last token after last operator
    const lastToken = expression.split(/[\+\-\*\/\(\)]/).pop() || '';
    if (lastToken.includes('.')) return; // already a dot in current number
    if (lastToken === '') {
      // if starting a number with '.', prepend 0
      expression += '0';
    }
  }

  expression += ch;
  updateDisplay();
}

// Set operator (+ - * /)
function setOperation(op) {
  if (!['+', '-', '*', '/'].includes(op)) return;

  if (expression === '') {
    // allow unary minus to start expression
    if (op === '-') {
      expression = '-';
      updateDisplay();
    }
    return;
  }

  const lastChar = expression[expression.length - 1];

  // If last char is operator (binary), replace it
  if (['+', '-', '*', '/'].includes(lastChar)) {
    // replace last operator with new one
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }
  updateDisplay();
}

// Calculate/evaluate expression (called by '=' button)
function calculate() {
  if (expression.trim() === '') return;

  // Basic sanitization: only allow digits, operators, parentheses, spaces, dot
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    getResultEl().innerText = 'Error: invalid characters';
    return;
  }

  try {
    const tokens = tokenize(expression);
    const rpn = infixToRPN(tokens);
    const value = evalRPN(rpn);
    const formatted = formatNumber(value, 8);
    getResultEl().innerText = 'Result: ' + formatted;
    // allow chaining: expression becomes the result
    expression = String(formatted);
    updateDisplay();
  } catch (err) {
    getResultEl().innerText = 'Error: ' + (err.message || 'invalid expression');
  }
}

// Clear everything
function clearDisplay() {
  expression = "";
  updateDisplay();
  getResultEl().innerText = '';
}

// Delete last character (backspace)
function deleteLast() {
  if (expression.length === 0) return;
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Percent: convert last number token to its percent (divide by 100)
// Example: "200+50" -> press % -> "200+0.5"
function percent() {
  if (expression.trim() === '') return;

  // find last number token index
  const match = expression.match(/([0-9]*\.?[0-9]+)$/);
  if (!match) return; // nothing to percent

  const lastNumStr = match[1];
  const startIdx = expression.length - lastNumStr.length;
  const value = Number(lastNumStr);
  if (Number.isNaN(value)) return;

  const pct = value / 100;
  const formatted = formatNumber(pct, 8);
  expression = expression.slice(0, startIdx) + formatted;
  updateDisplay();
  getResultEl().innerText = 'Result: ' + formatted;
}

// -----------------------------
// Keyboard support
// -----------------------------
window.addEventListener('keydown', (e) => {
  const k = e.key;

  if ((k >= '0' && k <= '9') || k === '.') {
    appendNumber(k);
    e.preventDefault();
    return;
  }

  if (k === '+' || k === '-' || k === '*' || k === '/') {
    setOperation(k);
    e.preventDefault();
    return;
  }

  if (k === 'Enter' || k === '=') {
    calculate();
    e.preventDefault();
    return;
  }

  if (k === 'Backspace') {
    deleteLast();
    e.preventDefault();
    return;
  }

  if (k === 'Escape') {
    clearDisplay();
    e.preventDefault();
    return;
  }

  if (k === '%') {
    percent();
    e.preventDefault();
    return;
  }
});

// Initialize display
updateDisplay();
