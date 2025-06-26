// Array of quote objects
const quotes = [
  { text: "Believe in yourself!", category: "Motivation" },
  { text: "To be or not to be.", category: "Philosophy" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <small>— ${quote.category}</small>
  `;
}

// Function to add a new quote from user input
function addQuote() {
  const textInput = document.getElementById("newQuoteText").value.trim();
  const categoryInput = document.getElementById("newQuoteCategory").value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    alert("New quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both the quote and its category.");
  }
}

// Function to dynamically create the quote form using innerHTML
function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");

  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();
});
