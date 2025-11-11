// ============================================================
//  Project: Glass Calculator (v2.0)
//  Author: Mohammadreza Shahbazi (M.SH)
//  GitHub: https://github.com/Mohammadreza-Shahbazi-313
//  LinkedIn: https://www.linkedin.com/in/mohammadreza-shahbazi-313sh/
//  Telegram: https://t.me/STANsoSAD
//  Email: eminemengland2000@gmail.com
//  Year: 2025
// ============================================================

// Initialize variables to store current input, first operand, and operation
let currentInput = ''; // Holds the input value from user
let firstOperand = null; // First operand for operations (e.g., number before +, -, etc.)
let operation = null; // Stores the current operation (+, -, *, /)

// Get references to the display elements and keys
const display = document.getElementById('display');
const preview = document.getElementById('preview');
const keys = document.getElementById('keys');

// Function to update the display with the current input and operation preview
function updateDisplay() {
  display.value = currentInput || '0'; // Show current input or default to 0 if empty
  preview.textContent = firstOperand !== null && operation ? `${firstOperand} ${operation}` : ''; // Show operation preview
}

// Function to append a number or character to the current input
function appendNumber(char) {
  // Prevent adding multiple decimal points or leading zeros
  if (char === '.' && currentInput.includes('.')) return;
  if (char === '0' && currentInput === '0') return;
  
  // Append the character to the current input
  currentInput += char;
  updateDisplay(); // Update the display with the new input
}

// Function to set the selected operation (+, -, *, /)
function setOperation(op) {
  if (currentInput === '' && firstOperand === null) return; // Prevent setting operation without input
  if (firstOperand === null) {
    firstOperand = parseFloat(currentInput); // Set the first operand when it's null
  } else if (currentInput !== '') {
    compute(); // Compute the result if there is already an operand
  }
  
  operation = op; // Store the current operation
  currentInput = ''; // Clear the current input for the next number
  updateDisplay(); // Update the display
}

// Function to perform the calculation based on the selected operation
function compute() {
  if (operation === null || firstOperand === null || currentInput === '') return; // Validate inputs before computing
  const second = parseFloat(currentInput); // Get the second operand
  let result;

  // Perform the corresponding operation based on the selected operator
  switch (operation) {
    case '+': result = firstOperand + second; break;
    case '-': result = firstOperand - second; break;
    case '*': result = firstOperand * second; break;
    case '/': result = second !== 0 ? firstOperand / second : 'Error'; break; // Handle division by zero
    default: return;
  }

  // If the result is valid, round it and reset the operation
  if (typeof result === 'number') {
    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000; // Round to prevent floating point errors
    currentInput = result.toString(); // Set result as the current input
    firstOperand = null; // Reset the first operand
    operation = null; // Reset the operation
  } else {
    currentInput = ''; // If there's an error, reset everything
    firstOperand = null;
    operation = null;
  }
  updateDisplay(); // Update the display with the result
}

// Function to clear all inputs and reset the calculator
function clearAll() {
  currentInput = '';
  firstOperand = null;
  operation = null;
  updateDisplay(); // Update the display to show 0
}

// Function to delete the last character from the input
function deleteLast() {
  currentInput = currentInput.slice(0, -1); // Remove the last character
  updateDisplay(); // Update the display after deletion
}

// Function to calculate the percentage of the current input
function percent() {
  if (!currentInput) return; // Return if no input is present
  const num = parseFloat(currentInput); // Convert input to number
  currentInput = (num / 100).toString(); // Convert the number to percentage
  updateDisplay(); // Update the display with the new value
}

// Event listener for mouse click on calculator buttons
keys.addEventListener('click', (e) => {
  const btn = e.target;
  if (!btn.classList.contains('btn')) return; // Ensure the clicked element is a button
  if (btn.classList.contains('number')) appendNumber(btn.textContent.trim()); // If a number button is clicked, append it
  else if (btn.dataset.operation) setOperation(btn.dataset.operation); // If an operation button is clicked, set the operation
  else {
    const action = btn.dataset.action;
    if (action === 'clear') clearAll(); // If clear button is clicked, reset the calculator
    else if (action === 'delete') deleteLast(); // If delete button is clicked, delete the last character
    else if (action === 'equals') compute(); // If equals button is clicked, perform the calculation
    else if (action === 'percent') percent(); // If percent button is clicked, calculate percentage
  }
});

// Event listener for keyboard input to interact with the calculator
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key); // If a number key is pressed, append the number
  if (e.key === '.') appendNumber('.'); // If decimal key is pressed, append a decimal
  if (['+', '-', '*', '/'].includes(e.key)) setOperation(e.key); // If an operator key is pressed, set the operation
  if (e.key === 'Enter' || e.key === '=') compute(); // If enter or equals key is pressed, compute the result
  if (e.key === 'Backspace') deleteLast(); // If backspace key is pressed, delete the last character
  if (e.key === 'Escape') clearAll(); // If escape key is pressed, clear all inputs
});

// Initialize the display with the default value
updateDisplay();
