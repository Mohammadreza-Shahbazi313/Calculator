// ============================================================
//  Project: Glass Calculator (v2.0)
//  Author: Mohammadreza Shahbazi (M.SH)
//  GitHub: https://github.com/Mohammadreza-Shahbazi-313
//  LinkedIn: https://www.linkedin.com/in/mohammadreza-shahbazi-313sh/
//  Telegram: https://t.me/STANsoSAD
//  Email: eminemengland2000@gmail.com
//  Year: 2025
// ============================================================

let expression = "";

const display = document.getElementById("display");
const preview = document.getElementById("preview");

// ------------------------- Display Helpers -------------------------
function updateDisplay() {
  display.value = expression || "0";
  preview.textContent = expression;
}

// ------------------------- Number Input -------------------------
function appendNumber(char) {
  const ch = String(char);

  // Prevent multiple dots in same number
  if (ch === ".") {
    const lastToken = expression.split(/[\+\-\*\/\(\)]/).pop();
    if (lastToken.includes(".")) return;
    if (lastToken === "") expression += "0";
  }

  expression += ch;
  updateDisplay();
}

// ------------------------- Operator Input -------------------------
function setOperation(op) {
  if (!['+', '-', '*', '/'].includes(op)) return;

  if (expression === "") {
    if (op === "-") expression = "-"; // unary minus
    updateDisplay();
    return;
  }

  const last = expression[expression.length - 1];

  if (['+', '-', '*', '/'].includes(last)) {
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }

  updateDisplay();
}

// ------------------------- Tokenizer -------------------------
function tokenize(input) {
  const tokens = [];
  const s = input.replace(/\s+/g, "");
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    // number
    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let num = ch;
      i++;
      while (i < s.length && ((s[i] >= "0" && s[i] <= "9") || s[i] === ".")) {
        num += s[i++];
      }
      tokens.push({ type: "NUMBER", value: num });
      continue;
    }

    // parentheses
    if (ch === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }

    // operators
    if (['+', '-', '*', '/'].includes(ch)) {
      // unary minus
      if (ch === "-") {
        const prev = tokens.length ? tokens[tokens.length - 1] : null;
        if (!prev || prev.type === "OP" || prev.type === "LPAREN") {
          let j = i + 1;
          let num = "-";
          if (j < s.length && ((s[j] >= "0" && s[j] <= "9") || s[j] === ".")) {
            while (j < s.length && ((s[j] >= "0" && s[j] <= "9") || s[j] === ".")) {
              num += s[j++];
            }
            tokens.push({ type: "NUMBER", value: num });
            i = j;
            continue;
          }
        }
      }
      tokens.push({ type: "OP", value: ch });
      i++;
      continue;
    }

    throw new Error("Invalid character: " + ch);
  }
  return tokens;
}

// ------------------------- Shunting Yard -------------------------
function infixToRPN(tokens) {
  const out = [];
  const stack = [];
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2 };

  for (const t of tokens) {
    if (t.type === "NUMBER") {
      out.push(t);
    } else if (t.type === "OP") {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type === "OP" && prec[top.value] >= prec[t.value]) {
          out.push(stack.pop());
        } else break;
      }
      stack.push(t);
    } else if (t.type === "LPAREN") {
      stack.push(t);
    } else if (t.type === "RPAREN") {
      while (stack.length && stack[stack.length - 1].type !== "LPAREN") {
        out.push(stack.pop());
      }
      if (!stack.length) throw new Error("Mismatched parentheses");
      stack.pop();
    }
  }

  while (stack.length) {
    const t = stack.pop();
    if (t.type === "LPAREN") throw new Error("Mismatched parentheses");
    out.push(t);
  }
  return out;
}

// ------------------------- RPN Evaluation -------------------------
function evalRPN(rpn) {
  const s = [];
  for (const t of rpn) {
    if (t.type === "NUMBER") {
      s.push(Number(t.value));
    } else if (t.type === "OP") {
      const b = s.pop();
      const a = s.pop();
      let res;
      switch (t.value) {
        case "+": res = a + b; break;
        case "-": res = a - b; break;
        case "*": res = a * b; break;
        case "/":
          if (b === 0) throw new Error("Cannot divide by zero");
          res = a / b;
          break;
      }
      s.push(res);
    }
  }
  return s[0];
}

// ------------------------- Main Calculate -------------------------
function calculate() {
  if (!expression) return;

  try {
    const tokens = tokenize(expression);
    const rpn = infixToRPN(tokens);
    let result = evalRPN(rpn);

    result = Math.round((result + Number.EPSILON) * 1e10) / 1e10;

    expression = String(result);
    updateDisplay();

  } catch (e) {
    preview.textContent = "Error";
  }
}

// ------------------------- Clear -------------------------
function clearAll() {
  expression = "";
  updateDisplay();
}

// ------------------------- Delete -------------------------
function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// ------------------------- Percent -------------------------
function percent() {
  const m = expression.match(/([0-9.]+)$/);
  if (!m) return;
  const num = Number(m[1]) / 100;
  expression = expression.slice(0, -m[1].length) + num;
  updateDisplay();
}

// ------------------------- Button Events -------------------------
document.getElementById("keys").addEventListener("click", (e) => {
  const b = e.target;
  if (!b.classList.contains("btn")) return;

  if (b.classList.contains("number")) appendNumber(b.textContent.trim());
  else if (b.dataset.operation) setOperation(b.dataset.operation);
  else if (b.dataset.action === "equals") calculate();
  else if (b.dataset.action === "clear") clearAll();
  else if (b.dataset.action === "delete") deleteLast();
  else if (b.dataset.action === "percent") percent();
});

// ------------------------- Keyboard Support -------------------------
window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") appendNumber(e.key);
  if (e.key === ".") appendNumber(".");
  if (['+', '-', '*', '/'].includes(e.key)) setOperation(e.key);
  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") deleteLast();
  if (e.key === "Escape") clearAll();
});

updateDisplay();
