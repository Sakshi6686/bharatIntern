let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById("category_select");
const amountInput = document.getElementById("amount_input");
const infoInput = document.getElementById("info");
const dateInput = document.getElementById("date_input");
const expenseTableBody = document.getElementById("expense-table-body");
const totalAmountCell = document.getElementById("total-amount");

document.addEventListener("DOMContentLoaded", function () {
    fetch('/expenses')
        .then(response => response.json())
        .then(data => {
            expenses = data;
            totalAmount = 0;
            expenseTableBody.innerHTML = '';
            expenses.forEach(expense => {
                addExpenseToTable(expense);
                if (expense.Category === "Income") {
                    totalAmount += expense.Amount;
                } else if (expense.Category === "Expense") {
                    totalAmount -= expense.Amount;
                }
            });
            totalAmountCell.textContent = totalAmount;
        })
        .catch(error => console.error('Error fetching data:', error));
});

document.querySelector("#expense-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const category = categorySelect.value;
    const info = infoInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === "") {
        alert("Please select a category");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    if (info === "") {
        alert("Please enter valid info");
        return;
    }
    if (date === "") {
        alert("Please select a date");
        return;
    }

    const expense = { category_select: category, amount_input: amount, info: info, date_input: date };

    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
        expenses.push(expense);
        if (category === "Income") {
            totalAmount += amount;
        } else if (category === "Expense") {
            totalAmount -= amount;
        }
        totalAmountCell.textContent = totalAmount;
        addExpenseToTable(expense);
    })
    .catch(error => console.error('Error:', error));

    amountInput.value = "";
    infoInput.value = "";
    dateInput.value = "";
});

function addExpenseToTable(expense) {
    const newRow = expenseTableBody.insertRow();
    const index = expenses.length - 1;
    newRow.dataset.index = index;

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    categoryCell.textContent = expense.category_select;
    amountCell.textContent = expense.amount_input;
    infoCell.textContent = expense.info;
    dateCell.textContent = expense.date_input;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteCell.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function () {
        const id = expenses[index]._id;
        fetch(`/delete/${id}`, { method: 'DELETE' })
            .then(response => response.text())
            .then(data => {
                console.log('Deleted:', data);
                if (expense.category_select === "Income") {
                    totalAmount -= expense.amount_input;
                } else if (expense.category_select === "Expense") {
                    totalAmount += expense.amount_input;
                }
                totalAmountCell.textContent = totalAmount;
                expenses.splice(index, 1);
                expenseTableBody.removeChild(newRow);
            })
            .catch(error => console.error('Error:', error));
    });
}
