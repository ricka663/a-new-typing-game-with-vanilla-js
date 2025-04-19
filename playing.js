/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */

// Variables globales
let startTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let totalCorrectChars = 0;
let totalCharsTyped = 0;

// Éléments DOM
const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

// Listes de mots par difficulté
const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry", "melon", "peach", "lemon", "kiwi", "plum"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery", "computer", "network", "software", "hardware", "program"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception", "opportunity", "intelligence", "philosophy", "experience", "technology"]
};

// Obtenir un mot aléatoire du mode sélectionné
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialiser le test de frappe
const startTest = (wordCount = 30) => {
    wordsToType.length = 0; // Effacer les mots précédents
    wordDisplay.innerHTML = ""; // Effacer l'affichage
    currentWordIndex = 0;
    startTime = null;
    totalCorrectChars = 0;
    totalCharsTyped = 0;

    // Générer de nouveaux mots
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    // Afficher les mots
    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.className = index === 0 ? "current-word" : "";
        wordDisplay.appendChild(span);
    });

    // Réinitialiser les champs
    inputField.value = "";
    results.textContent = "WPM: 0, Accuracy: 0%";
    
    // Mettre le focus sur le champ de saisie
    inputField.focus();
};

// Démarrer le chronomètre quand l'utilisateur commence à taper
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculer et retourner WPM & précision
const calculateStats = () => {
    if (!startTime) return { wpm: 0, accuracy: 0 };
    
    const elapsedTime = (Date.now() - startTime) / 1000; // Secondes
    
    // WPM = (caractères / 5) / (temps en minutes)
    const wpm = ((totalCorrectChars / 5) / (elapsedTime / 60)).toFixed(2);
    
    // Précision = (caractères corrects / caractères totaux) * 100
    const accuracy = totalCharsTyped > 0 
        ? ((totalCorrectChars / totalCharsTyped) * 100).toFixed(2) 
        : "0.00";
    
    return { wpm, accuracy };
};

// Mettre à jour les statistiques en temps réel
const updateStats = () => {
    const { wpm, accuracy } = calculateStats();
    results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
};

// Vérifier la précision du mot actuel
const checkWordAccuracy = (input, target) => {
    let correctChars = 0;
    
    for (let i = 0; i < Math.min(input.length, target.length); i++) {
        if (input[i] === target[i]) {
            correctChars++;
        }
    }
    
    return correctChars;
};

// Passer au mot suivant
const moveToNextWord = () => {
    const currentWord = wordsToType[currentWordIndex];
    const currentInput = inputField.value.trim();
    
    // Calculer les caractères corrects pour ce mot
    const correctChars = checkWordAccuracy(currentInput, currentWord);
    
    // Mettre à jour les totaux
    totalCorrectChars += correctChars;
    totalCharsTyped += currentInput.length;
    
    // Marquer le mot actuel comme complété
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
        wordElements[currentWordIndex].className = "completed-word";
    }
    
    // Passer au mot suivant
    currentWordIndex++;
    
    // Mettre en évidence le nouveau mot actuel
    if (currentWordIndex < wordElements.length) {
        wordElements[currentWordIndex].className = "current-word";
    } else {
        // Fin du test
        const { wpm, accuracy } = calculateStats();
        results.textContent = `Test terminé! WPM: ${wpm}, Accuracy: ${accuracy}%`;
        
        // Attendre un peu avant de redémarrer
        setTimeout(() => {
            startTest();
        }, 2000);
        
        return;
    }
    
    // Mettre à jour les statistiques
    updateStats();
    
    // Effacer le champ de saisie
    inputField.value = "";
};

// Gérer la saisie de l'utilisateur
inputField.addEventListener("input", () => {
    startTimer();
});

// Gérer les touches spéciales
inputField.addEventListener("keydown", (event) => {
    // Si l'utilisateur appuie sur Espace ou Entrée
    if (event.key === " " || event.key === "Enter") {
        const currentWord = wordsToType[currentWordIndex];
        const currentInput = inputField.value.trim();
        
        if (currentInput.length > 0) {
            moveToNextWord();
            event.preventDefault();
        }
    }
});

// Changer de mode
modeSelect.addEventListener("change", () => {
    startTest();
});

// Démarrer le test au chargement de la page
window.addEventListener("load", () => {
    startTest();
});