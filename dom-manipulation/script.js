// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself!", category: "Motivation" },
  { text: "To be or not to be.", category: "Philosophy" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote based on selected category
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <small>— ${quote.category}</small>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText").value.trim();
  const categoryInput = document.getElementById("newQuoteCategory").value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    saveQuotes();
    populateCategories();
    alert("New quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// Create the form using createElement and appendChild
function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);
}

// Populate category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastSelected = localStorage.getItem("selectedCategory");
  if (lastSelected) {
    categoryFilter.value = lastSelected;
    filterQuotes();
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Load last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `
      <p>"${quote.text}"</p>
      <small>— ${quote.category}</small>
    `;
  }
}

// Export quotes as JSON file
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        notifyUser("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Failed to parse the JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Notify user via sync notice
function notifyUser(message) {
  const div = document.getElementById("syncNotice");
  div.textContent = message;
  setTimeout(() => (div.textContent = ""), 5000);
}

// Sync with simulated server
async function syncWithServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await res.json();

    const mappedQuotes = serverQuotes.slice(0, 10).map(q => ({
      text: q.title,
      category: `Server-${q.userId}`
    }));

    const newQuotes = mappedQuotes.filter(
      sq => !quotes.some(local => local.text === sq.text)
    );

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      notifyUser("Quotes synced from server.");
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
}

// Periodic sync every 30 seconds
setInterval(syncWithServer, 30000);

// On page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  populateCategories();
  loadLastViewedQuote();
  syncWithServer(); // initial sync
});
