const Modal = {
    open(){
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },

    close(){
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')

    }
}

const ModalDelete = {
    open(){
        document
        .querySelector('.modal-delete')
        .classList
        .add('active')
    },

    close(){
        document
        .querySelector('.modal-delete')
        .classList
        .remove('active')

    },

}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []


    },

    set (transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))

    },


    
}

const transactions = [

    {
        description: "Luz",
        amount: -50001,
        date: '23/01/2021'

    },

    {
        description: "Website",
        amount: 500000,
        date: '23/01/2021'

    },

    {
        description: "Internet",
        amount: -20012,
        date: '23/01/2021'

    },

    {
        description: "App",
        amount: 200000,
        date: '26/01/2021'

    },


]

const Transaction = {

    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {

        //somar as entradas

        let income = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {

                income = income + transaction.amount
            }
        })



        return income

    },

    expenses() {

        //somar as saidas

        let expense = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {

                expense = expense + transaction.amount
            }
        })



        return expense
    },

    total() {
        //entradas - saidas

        let total = Transaction.incomes() + Transaction.expenses()

        return total

    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount )

        const html = `                    
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação"></td>           
        `

        return html
    },

    updateBalance() {

        //Card de Entradas
        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        //Card de Saídas
        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        //Card do total
        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100

        return Math.round(value)
    },

    formatDate(date) {

        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },

    formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value / 100)

    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return signal + value
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    
    },

    validateFields() {
        const {description, amount, date} = Form.getValues()

        if( description.trim() === "" ||
            amount.trim() === "" || 
            date.trim() === ""){
                throw new  Error("Por favor, preencha todos os campos")
        }
    },
    
    formatValues() {

        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {

            description,
            amount,
            date,
        }


    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {
            alert(error.message)
        }

 
    }

}

const App = {

    init() {

        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)

    },

    reload() {



        DOM.clearTransactions()
        App.init()

    }
}

const Delete = {

    closeExecute() {


        const query = Transaction.all

        let size = JSON.parse(localStorage.getItem("dev.finances:transactions"))

        //query.splice(0 ,1)
        console.log(size.length)

        for(let elements of size ) {
            query.splice(0, 1)
        }

        App.reload()


        document
        .querySelector('.modal-delete')
        .classList
        .remove('active')
    }
}

const Panel = {

    switchThemeToDark() {

        let activeDark = true;

        //body
        document.querySelector("body").style.backgroundColor = "#384e36";

        //h2
        document.querySelector("h2").style.color = "#a5a5d4";

        //card
        document.querySelectorAll('.card')[0].style.background = "rgb(185, 204, 191)"
        document.querySelectorAll('.card')[1].style.background = "rgb(185, 204, 191)"

        //table th
        document.querySelectorAll("table th")[0].style.background = "#1a2719";
        document.querySelectorAll("table th")[1].style.background = "#1a2719";
        document.querySelectorAll("table th")[2].style.background = "#1a2719";
        document.querySelectorAll("table th")[3].style.background = "#1a2719";

        //modal
        document.querySelectorAll(".modal")[0].style.backgroundColor = "#0c150a";
        document.querySelectorAll(".modal")[1].style.backgroundColor = "#0c150a";

        //input
        document.querySelectorAll("input")[0].style.backgroundColor = "#3e5f3b";
        document.querySelectorAll("input")[1].style.backgroundColor = "#3e5f3b";
        document.querySelectorAll("input")[2].style.backgroundColor = "#3e5f3b";

        //input
        document.querySelector(".input-group small").style.backgroundColor = "#fff";

        //footer
        document.querySelector("footer").style.color = "#a1a1cf";




    },

    switchThemeToLight() {

        let activeDark = false;

        //body
        document.querySelector("body").style.backgroundColor = "";

        //h2
        document.querySelector("h2").style.color = "";

        //card
        document.querySelectorAll('.card')[0].style.background = ""
        document.querySelectorAll('.card')[1].style.background = ""

        //table th
        document.querySelectorAll("table th")[0].style.background = "";
        document.querySelectorAll("table th")[1].style.background = "";
        document.querySelectorAll("table th")[2].style.background = "";
        document.querySelectorAll("table th")[3].style.background = "";

        //modal
        document.querySelectorAll(".modal")[0].style.backgroundColor = "";
        document.querySelectorAll(".modal")[1].style.backgroundColor = "";

        //input
        document.querySelectorAll("input")[0].style.backgroundColor = "";
        document.querySelectorAll("input")[1].style.backgroundColor = "";
        document.querySelectorAll("input")[2].style.backgroundColor = "";

        //input
        document.querySelector(".input-group small").style.backgroundColor = "";

        //footer
        document.querySelector("footer").style.color = "";


    },

    options(){
        alert("Aguarde novos updates")
    }
}

App.init()
