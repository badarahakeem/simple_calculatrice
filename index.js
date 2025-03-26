document.addEventListener("DOMContentLoaded", () => {
  // Éléments DOM
  const themeButton = document.getElementById("theme-button");
  const body = document.body;
  const previousOperandElement = document.querySelector(".previous-operand");
  const currentOperandElement = document.querySelector(".current-operand");
  const buttons = document.querySelectorAll("button");

  // Variables pour la calculatrice
  let currentOperand = "0";
  let previousOperand = "";
  let operation = undefined;
  let shouldResetScreen = false;

  // Fonction pour basculer entre les thèmes
  function toggleTheme() {
    if (body.classList.contains("dark")) {
      body.classList.remove("dark");
      body.classList.add("light");
      themeButton.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      body.classList.remove("light");
      body.classList.add("dark");
      themeButton.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  // Fonction pour mettre à jour l'affichage
  function updateDisplay() {
    // Formater le nombre pour l'affichage
    const formattedNumber = formatNumber(currentOperand);
    currentOperandElement.textContent = formattedNumber;

    if (operation != null) {
      previousOperandElement.textContent = `${formatNumber(
        previousOperand
      )} ${operation}`;
    } else {
      previousOperandElement.textContent = "";
    }
  }

  // Fonction pour formater les nombres (ajouter des séparateurs de milliers)
  function formatNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("fr-FR", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // Fonction pour ajouter un nombre
  function appendNumber(number) {
    // Empêcher plusieurs points décimaux
    if (number === "." && currentOperand.includes(".")) return;

    // Réinitialiser l'écran si nécessaire
    if (currentOperand === "0" || shouldResetScreen) {
      if (number === ".") {
        currentOperand = "0.";
      } else {
        currentOperand = number;
      }
      shouldResetScreen = false;
    } else {
      currentOperand += number;
    }

    updateDisplay();
  }

  // Fonction pour choisir une opération
  function chooseOperation(op) {
    if (currentOperand === "") return;

    if (previousOperand !== "") {
      calculate();
    }

    operation = op;
    previousOperand = currentOperand;
    currentOperand = "";
    updateDisplay();
  }

  // Fonction pour effectuer le calcul
  function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        // Vérifier la division par zéro
        if (current === 0) {
          alert("Erreur: Division par zéro");
          clear();
          return;
        }
        computation = prev / current;
        break;
      case "%":
        computation = prev * (current / 100);
        break;
      default:
        return;
    }

    // Limiter le nombre de décimales pour éviter les erreurs de précision
    currentOperand = Math.round(computation * 1000000000) / 1000000000;
    operation = undefined;
    previousOperand = "";
    shouldResetScreen = true;
    updateDisplay();
  }

  // Fonction pour effacer l'écran
  function clear() {
    currentOperand = "0";
    previousOperand = "";
    operation = undefined;
    updateDisplay();
  }

  // Fonction pour supprimer le dernier chiffre
  function deleteNumber() {
    if (
      currentOperand.length === 1 ||
      (currentOperand.length === 2 && currentOperand.startsWith("-"))
    ) {
      currentOperand = "0";
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  // Fonction pour calculer le pourcentage
  function percent() {
    if (currentOperand === "") return;

    if (previousOperand === "") {
      // Si pas d'opération en cours, simplement diviser par 100
      currentOperand = (parseFloat(currentOperand) / 100).toString();
    } else {
      // Si une opération est en cours, calculer le pourcentage de la valeur précédente
      chooseOperation("%");
    }

    updateDisplay();
  }

  // Gestionnaire d'événements pour les boutons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Ajouter une animation de pression
      button.classList.add("button-press");
      setTimeout(() => {
        button.classList.remove("button-press");
      }, 200);

      // Traiter l'action du bouton
      if (button.hasAttribute("data-number")) {
        appendNumber(button.getAttribute("data-number"));
      } else if (button.hasAttribute("data-action")) {
        const action = button.getAttribute("data-action");

        switch (action) {
          case "add":
            chooseOperation("+");
            break;
          case "subtract":
            chooseOperation("-");
            break;
          case "multiply":
            chooseOperation("*");
            break;
          case "divide":
            chooseOperation("/");
            break;
          case "percent":
            percent();
            break;
          case "clear":
            clear();
            break;
          case "delete":
            deleteNumber();
            break;
          case "calculate":
            calculate();
            break;
        }
      } else if (button.id === "theme-button") {
        toggleTheme();
      }
    });
  });

  // Support clavier
  document.addEventListener("keydown", (event) => {
    if (/[0-9]/.test(event.key)) {
      appendNumber(event.key);
    } else if (event.key === ".") {
      appendNumber(".");
    } else if (event.key === "+") {
      chooseOperation("+");
    } else if (event.key === "-") {
      chooseOperation("-");
    } else if (event.key === "*") {
      chooseOperation("*");
    } else if (event.key === "/") {
      chooseOperation("/");
    } else if (event.key === "%") {
      percent();
    } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      calculate();
    } else if (event.key === "Backspace") {
      deleteNumber();
    } else if (event.key === "Escape") {
      clear();
    } else if (event.key === "t") {
      toggleTheme();
    }
  });

  // Initialiser l'affichage
  updateDisplay();
});
