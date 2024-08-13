let transactions = [];
let editId = null;

function addTransaction() {
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (description && !isNaN(amount)) {
    if (editId) {
      // Edytuj istniejącą transakcję
      transactions = transactions.map((transaction) =>
        transaction.id === editId
          ? { ...transaction, description, amount }
          : transaction
      );
      editId = null;
    } else {
      // Dodaj nową transakcję
      const transaction = { id: Date.now(), description, amount, type };
      transactions.push(transaction);
    }
    updateUI();
    clearForm();
  }
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateUI();
}

function editTransaction(id) {
  const transaction = transactions.find((transaction) => transaction.id === id);
  document.getElementById("description").value = transaction.description;
  document.getElementById("amount").value = transaction.amount;
  document.getElementById("type").value = transaction.type;
  editId = id;
}

function updateUI() {
  const transactionList = document.getElementById("transactions");
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income"
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  transactionList.innerHTML = "";

  transactions.forEach((transaction) => {
    const transactionItem = document.createElement("li");
    transactionItem.classList.add(transaction.type);
    transactionItem.innerHTML = `
            ${transaction.description}: ${transaction.amount} zł
            <div>
                <button onclick="editTransaction(${transaction.id})">Edytuj</button>
                <button onclick="deleteTransaction(${transaction.id})">Usuń</button>
            </div>
        `;
    transactionList.appendChild(transactionItem);
  });

  document.getElementById("balance").textContent = `${balance} zł`;
  const balanceMessage = document.getElementById("balance-message");

  if (balance > 0) {
    balanceMessage.textContent = `Możesz jeszcze wydać ${balance} złotych`;
  } else if (balance < 0) {
    balanceMessage.textContent = `Bilans jest ujemny. Jesteś na minusie ${-balance} złotych`;
  } else {
    balanceMessage.textContent = `Bilans wynosi zero`;
  }
}

function clearForm() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("type").value = "income";
}
