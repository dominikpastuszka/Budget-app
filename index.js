const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const balanceText = document.getElementById("balance");

// Modal elements
const editModal = document.getElementById("edit-modal");
const closeModal = document.getElementsByClassName("close")[0];
const editForm = document.getElementById("edit-form");
const editDescriptionInput = document.getElementById("edit-description");
const editAmountInput = document.getElementById("edit-amount");
const editTypeInput = document.getElementById("edit-type");
const editIdInput = document.getElementById("edit-id");

let transactions = [];

transactionForm.addEventListener("submit", addTransaction);
editForm.addEventListener("submit", saveEditedTransaction);

function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (validateForm(description, amount)) {
    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
    };

    transactions.push(transaction);
    updateDOM();
    updateBalance();

    transactionForm.reset();
  }
}

function validateForm(description, amount) {
  let isValid = true;

  if (description.trim() === "") {
    showError("description-error", "Opis jest wymagany.");
    isValid = false;
  } else {
    hideError("description-error");
  }

  if (isNaN(amount) || amount < 0.01) {
    showError("amount-error", "Kwota musi być większa lub równa 0.01.");
    isValid = false;
  } else {
    hideError("amount-error");
  }

  return isValid;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.style.display = "none";
}

function updateDOM() {
  transactionList.innerHTML = "";

  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.classList.add(transaction.type);
    li.innerHTML = `${transaction.description}: ${transaction.amount} zł 
                        <button onclick="editTransaction(${transaction.id})">Edytuj</button>
                        <button onclick="confirmDeleteTransaction(${transaction.id})">Usuń</button>`;
    transactionList.appendChild(li);
  });
}

function updateBalance() {
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income"
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  balanceText.textContent = `Bilans: ${balance} zł`;

  if (balance > 0) {
    balanceText.textContent += ` Możesz jeszcze wydać ${balance} złotych`;
  } else if (balance === 0) {
    balanceText.textContent += ` Bilans wynosi zero`;
  } else {
    balanceText.textContent += ` Bilans jest ujemny. Jesteś na minusie ${Math.abs(
      balance
    )} złotych`;
  }
}

function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);

  editIdInput.value = transaction.id;
  editDescriptionInput.value = transaction.description;
  editAmountInput.value = transaction.amount;
  editTypeInput.value = transaction.type;

  editModal.style.display = "block";
}

function saveEditedTransaction(e) {
  e.preventDefault();

  const id = parseInt(editIdInput.value);
  const description = editDescriptionInput.value;
  const amount = parseFloat(editAmountInput.value);
  const type = editTypeInput.value;

  if (validateForm(description, amount)) {
    const transaction = transactions.find((t) => t.id === id);
    transaction.description = description;
    transaction.amount = amount;
    transaction.type = type;

    updateDOM();
    updateBalance();

    editModal.style.display = "none";
  }
}

function confirmDeleteTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);

  if (
    confirm(
      `Czy na pewno chcesz usunąć "${transaction.description}" o wartości ${transaction.amount} zł?`
    )
  ) {
    deleteTransaction(id);
  }
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateDOM();
  updateBalance();
}

closeModal.onclick = function () {
  editModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === editModal) {
    editModal.style.display = "none";
  }
};
