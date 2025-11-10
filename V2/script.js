// ============================================================
//  Project: Glass Calculator (v2.0)
//  Author: Mohammadreza Shahbazi (M.SH)
//  GitHub: https://github.com/Mohammadreza-Shahbazi-313
//  LinkedIn: https://www.linkedin.com/in/mohammadreza-shahbazi-313sh/
//  Telegram: https://t.me/STANsoSAD
//  Email: eminemengland2000@gmail.com
//  Year: 2025
// ============================================================

let currentInput = '';
let firstOperand = null;
let operation = null;

const display = document.getElementById('display');
const preview = document.getElementById('preview');
const keys = document.getElementById('keys');

function updateDisplay() {
  display.value = currentInput || '0';
  preview.textContent = firstOperand !== null && operation ? `${firstOperand} ${operation}` : '';
}

function appendNumber(char) {
  if (char === '.' && currentInput.includes('.')) return;
  if (char === '0' && currentInput === '0') return;
  currentInput += char;
  updateDisplay();
}

function setOperation(op) {
  if (currentInput === '' && firstOperand === null) return;
  if (firstOperand === null) {
    firstOperand = parseFloat(currentInput);
  } else if (currentInput !== '') {
    compute();
  }
  operation = op;
  currentInput = '';
  updateDisplay();
}

function compute() {
  if (operation === null || firstOperand === null || currentInput === '') return;
  const second = parseFloat(currentInput);
  let result;
  switch (operation) {
    case '+': result = firstOperand + second; break;
    case '-': result = firstOperand - second; break;
    case '*': result = firstOperand * second; break;
    case '/': result = second !== 0 ? firstOperand / second : 'Error'; break;
    default: return;
  }
  if (typeof result === 'number') {
    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    currentInput = result.toString();
    firstOperand = null;
    operation = null;
  } else {
    currentInput = '';
    firstOperand = null;
    operation = null;
  }
  updateDisplay();
}

function clearAll() {
  currentInput = '';
  firstOperand = null;
  operation = null;
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function percent() {
  if (!currentInput) return;
  const num = parseFloat(currentInput);
  currentInput = (num / 100).toString();
  updateDisplay();
}

keys.addEventListener('click', (e) => {
  const btn = e.target;
  if (!btn.classList.contains('btn')) return;
  if (btn.classList.contains('number')) appendNumber(btn.textContent.trim());
  else if (btn.dataset.operation) setOperation(btn.dataset.operation);
  else {
    const action = btn.dataset.action;
    if (action === 'clear') clearAll();
    else if (action === 'delete') deleteLast();
    else if (action === 'equals') compute();
    else if (action === 'percent') percent();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendNumber('.');
  if (['+', '-', '*', '/'].includes(e.key)) setOperation(e.key);
  if (e.key === 'Enter' || e.key === '=') compute();
  if (e.key === 'Backspace') deleteLast();
  if (e.key === 'Escape') clearAll();
});

updateDisplay();
