javascript
const password = document.getElementById("password");
const strength = document.getElementById("strength");
const bar = document.getElementById("bar");
const suggestions = document.getElementById("suggestions");

const lengthCheck = document.getElementById("length");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numberCheck = document.getElementById("number");
const specialCheck = document.getElementById("special");

function updateCheck(element, passed) {
    element.classList.toggle("pass", passed);

    if (passed) {
        element.textContent = "✓ " + element.dataset.label;
    } else {
        element.textContent = "✗ " + element.dataset.label;
    }
}

const checklist = [
    [lengthCheck, "At least 12 characters"],
    [uppercaseCheck, "An uppercase letter"],
    [lowercaseCheck, "A lowercase letter"],
    [numberCheck, "A number"],
    [specialCheck, "A special character"]
];

checklist.forEach(([element, label]) => {
    element.dataset.label = label;
    element.textContent = "○ " + label;
});

function analyzePassword() {
    const value = password.value;

    if (value.length === 0) {
        strength.textContent = "Strength: Not checked";
        bar.style.width = "0%";
        bar.style.background = "#64748b";
        suggestions.textContent = "Enter a password to begin.";
        
        checklist.forEach(([element, label]) => {
            element.classList.remove("pass");
            element.textContent = "○ " + label;
        });

        return;
    }

    const checks = [
        value.length >= 12,
        /[A-Z]/.test(value),
        /[a-z]/.test(value),
        /[0-9]/.test(value),
        /[^A-Za-z0-9]/.test(value)
    ];

    checklist.forEach(([element], index) => {
        updateCheck(element, checks[index]);
    });

    const commonPasswords = [
        "password",
        "password123",
        "123456",
        "12345678",
        "qwerty",
        "admin"
    ];

    const predictable =
        commonPasswords.includes(value.toLowerCase()) ||
        /^(.)\1+$/.test(value) ||
        /12345|23456|34567|45678|56789|abcdef|qwerty/i.test(value);

    let score = checks.filter(Boolean).length;

    if (value.length < 8 || predictable) {
        score = Math.min(score, 1);
    }

    let label;
    let color;
    let width;

    if (score <= 1) {
        label = "Weak";
        color = "#f87171";
        width = "20%";
    } else if (score <= 3) {
        label = "Medium";
        color = "#facc15";
        width = "45%";
    } else if (score === 4) {
        label = "Strong";
        color = "#38bdf8";
        width = "70%";
    } else {
        label = "Very Strong";
        color = "#4ade80";
        width = "100%";
    }

    strength.textContent = "Strength: " + label;
    strength.style.color = color;
    bar.style.width = width;
    bar.style.background = color;

    const tips = [];

    if (value.length < 12) {
        tips.push("Use at least 12 characters.");
    }

    if (!checks[1]) {
        tips.push("Add an uppercase letter.");
    }

    if (!checks[2]) {
        tips.push("Add a lowercase letter.");
    }

    if (!checks[3]) {
        tips.push("Add a number.");
    }

    if (!checks[4]) {
        tips.push("Add a special character.");
    }

    if (predictable) {
        tips.push("Avoid common passwords and predictable patterns.");
    }

    if (tips.length === 0) {
        tips.push("Your password passes these basic checks. Use a unique password for every account.");
    }

    suggestions.textContent = tips.join(" ");
}

password.addEventListener("input", analyzePassword);

// Show or hide the password
document.getElementById("toggle").addEventListener("click", function () {
    const hidden = password.type === "password";

    password.type = hidden ? "text" : "password";
    this.textContent = hidden ? "Hide Password" : "Show Password";
});

// Generate a random password
document.getElementById("generate").addEventListener("click", function () {
    const groups = [
        "ABCDEFGHJKLMNPQRSTUVWXYZ",
        "abcdefghijkmnopqrstuvwxyz",
        "23456789",
        "!@#$%&*+-_"
    ];

    const all = groups.join("");

    function randomIndex(max) {
        const array = new Uint32Array(1);
        const limit = Math.floor(4294967296 / max) * max;

        do {
            crypto.getRandomValues(array);
        } while (array[0] >= limit);

        return array[0] % max;
    }

    function pick(chars) {
        return chars[randomIndex(chars.length)];
    }

    const result = groups.map(pick);

    while (result.length < 16) {
        result.push(pick(all));
    }

    for (let i = result.length - 1; i > 0; i--) {
        const j = randomIndex(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }

    password.value = result.join("");
    password.type = "text";
    document.getElementById("toggle").textContent = "Hide Password";

    analyzePassword();
});

console.log("Password Strength Analyzer is running!");

