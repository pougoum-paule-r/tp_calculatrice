// Fichier: code.js
// Calculatrice web - Version compatible avec le HTML fourni

// Variables globales
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let lastResult = null;

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'élément d'affichage
    const box = document.getElementById('box');
    if (!box) {
        console.error("Élément 'box' non trouvé!");
        return;
    }
    
    // Mettre à jour l'affichage initial
    updateDisplay();
    
    // Afficher un message de confirmation
    console.log("Calculatrice initialisée avec succès!");
});

// Fonction pour mettre à jour l'affichage
function updateDisplay() {
    const box = document.getElementById('box');
    if (box) {
        // Formater la valeur pour l'affichage
        let displayText = displayValue;
        
        // Remplacer "zéro" initial si nécessaire
        if (displayText === '0' && box.textContent === 'zéro') {
            box.textContent = '0';
        } else {
            box.textContent = displayText;
        }
    }
}

// Fonction pour les boutons numériques et opérateurs
function button_number(value) {
    console.log("Bouton appuyé:", value);
    
    // Si c'est un chiffre (0-9)
    if (!isNaN(value) && value !== '.') {
        inputDigit(value.toString());
    }
    // Si c'est un point décimal
    else if (value === '.') {
        inputDecimal();
    }
    // Si c'est un opérateur (+, -, *, /)
    else if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
    }
    // Si c'est le signe égal
    else if (value === '=') {
        performCalculation();
    }
    
    updateDisplay();
}

// Fonction pour ajouter un chiffre
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    
    // Limiter la longueur
    if (displayValue.length > 15) {
        displayValue = displayValue.substring(0, 15);
    }
}

// Fonction pour ajouter une décimale
function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }
    
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

// Fonction pour gérer les opérateurs
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }
    
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation();
        displayValue = `${parseFloat(result.toFixed(10))}`;
        firstOperand = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
    
    updateDisplay();
}

// Fonction pour effectuer le calcul
function performCalculation() {
    if (operator === null || firstOperand === null) {
        return;
    }
    
    const inputValue = parseFloat(displayValue);
    let result;
    
    switch (operator) {
        case '+':
            result = firstOperand + inputValue;
            break;
        case '-':
            result = firstOperand - inputValue;
            break;
        case '*':
            result = firstOperand * inputValue;
            break;
        case '/':
            if (inputValue === 0) {
                displayValue = 'Erreur';
                resetCalculator();
                return;
            }
            result = firstOperand / inputValue;
            break;
        default:
            return;
    }
    
    // Arrondir le résultat
    result = Math.round(result * 100000000) / 100000000;
    
    // Stocker le résultat
    lastResult = result;
    displayValue = result.toString();
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;
    
    return result;
}

// Fonction pour le pourcentage (%)
function calculate_percentage() {
    const currentValue = parseFloat(displayValue);
    if (!isNaN(currentValue)) {
        displayValue = (currentValue / 100).toString();
        updateDisplay();
    }
}

// Fonction pour effacer l'entrée (CE)
function clear_entry() {
    displayValue = '0';
    updateDisplay();
}

// Fonction pour tout effacer (C)
function button_clear() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    lastResult = null;
    updateDisplay();
}

// Fonction pour le backspace
function backspace_remove() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

// Fonction pour l'inverse (1/x)
function division_one() {
    const currentValue = parseFloat(displayValue);
    if (!isNaN(currentValue)) {
        if (currentValue === 0) {
            displayValue = 'Erreur';
            setTimeout(() => {
                displayValue = '0';
                updateDisplay();
            }, 1500);
        } else {
            const result = 1 / currentValue;
            displayValue = Math.round(result * 100000000) / 100000000;
            displayValue = displayValue.toString();
            waitingForSecondOperand = true;
        }
        updateDisplay();
    }
}

// Fonction pour le carré (x²)
function power_of() {
    const currentValue = parseFloat(displayValue);
    if (!isNaN(currentValue)) {
        const result = currentValue * currentValue;
        displayValue = Math.round(result * 100000000) / 100000000;
        displayValue = displayValue.toString();
        waitingForSecondOperand = true;
        updateDisplay();
    }
}

// Fonction pour la racine carrée (√x)
function square_root() {
    const currentValue = parseFloat(displayValue);
    if (!isNaN(currentValue)) {
        if (currentValue < 0) {
            displayValue = 'Erreur';
            setTimeout(() => {
                displayValue = '0';
                updateDisplay();
            }, 1500);
        } else {
            const result = Math.sqrt(currentValue);
            displayValue = Math.round(result * 100000000) / 100000000;
            displayValue = displayValue.toString();
            waitingForSecondOperand = true;
        }
        updateDisplay();
    }
}

// Fonction pour changer le signe (±)
function plus_minus() {
    if (displayValue !== '0') {
        if (displayValue.startsWith('-')) {
            displayValue = displayValue.substring(1);
        } else {
            displayValue = '-' + displayValue;
        }
        updateDisplay();
    }
}

// Fonction pour réinitialiser la calculatrice
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    lastResult = null;
    
    // Réinitialiser après une erreur
    setTimeout(() => {
        updateDisplay();
    }, 100);
}

// Support du clavier
document.addEventListener('keydown', function(event) {
    event.preventDefault();
    const key = event.key;
    
    console.log("Touche pressée:", key);
    
    // Chiffres 0-9
    if (key >= '0' && key <= '9') {
        button_number(parseInt(key));
    }
    // Point décimal
    else if (key === '.' || key === ',') {
        button_number('.');
    }
    // Opérateurs
    else if (key === '+') {
        button_number('+');
    }
    else if (key === '-') {
        button_number('-');
    }
    else if (key === '*') {
        button_number('*');
    }
    else if (key === '/') {
        button_number('/');
    }
    // Égal
    else if (key === 'Enter' || key === '=') {
        button_number('=');
    }
    // Effacement
    else if (key === 'Escape' || key === 'Delete') {
        button_clear();
    }
    // Backspace
    else if (key === 'Backspace') {
        backspace_remove();
    }
    // Pourcentage
    else if (key === '%') {
        calculate_percentage();
    }
});

// Ajouter des styles pour l'affichage
const style = document.createElement('style');
style.textContent = `
    #box {
        min-height: 1.5em;
        word-wrap: break-word;
        overflow-wrap: break-word;
        transition: all 0.3s ease;
    }
    
    #box:empty::before {
        content: 'zéro';
        color: #666;
    }
    
    .error-message {
        color: #ff4444;
        animation: blink 0.5s ease 3;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);