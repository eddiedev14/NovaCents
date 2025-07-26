import { effectiveID } from "./modules/variables.js";
import { categorieForm, closeButtons, openModalsBtns, openTransactionModalBtn, sidebar, sidebarMenu, transactionAmountInput, transactionCategorieInput, transactionForm, transactionMethodInput } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals, openModal, openModalTrigger } from "./modules/components/modal.js";
import { cleanForm, formatBalance, formSubmitHandler, isResourceUnique } from "./modules/components/form.js";
import { initDatatable } from "./modules/components/datatable.js";
import API from "./modules/classes/API.js";
import Alert from "./modules/classes/Alert.js";
import UI from "./modules/classes/UI.js";
import { maskCardNumber } from "./modules/utils.js";

//* Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    initModals();
    initDatatable();
})

//* Sidebar
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Modals
openModalsBtns.forEach(btn => btn.addEventListener("click", openModalTrigger));
openTransactionModalBtn.addEventListener("click", loadTransactionForm)

//* Form
closeButtons.forEach(btn => btn.addEventListener("click", e => cleanForm(e.target.closest(".modal"))))

//* Categorie form
categorieForm.addEventListener("submit", (e) => {
    formSubmitHandler(e, {
        onAdd: async (resource) => await API.addResource("categories", resource, { resourceName: "categoría", modalId: "modal-categorie" }),
        onEdit: async (resource) => "Pendiente",
        uniqueValidation: (resource, isEdit) => isResourceUnique(resource, ["categorie-name"], "categories", "categoría", isEdit),
        modalID: "modal-categorie"
    })
})

//* Transaction form
transactionAmountInput.addEventListener("input", formatBalance)

transactionForm.addEventListener("submit", (e) => {
    formSubmitHandler(e, {
        onAdd: async (resource) => await API.addTransaction(resource),
        onEdit: async (resource) => "Pendiente",
        integerFields: ["transaction-amount"],
        modalID: "modal-transaction"
    })
})

//* Functions

export async function formatTableTransactions(){
    const transactions = await API.getResources("transactions");
    const formattedTransactions = await Promise.all(transactions.map(async (transaction) => formatSingleTransaction(transaction)))
    return formattedTransactions;
}

export async function formatSingleTransaction(transaction){
    const { ["transaction-categorie"]: categorie, ["transaction-method"]: method } = transaction;

    //1. Get the categorie & payment method
    const isEffectiveMethod = method === effectiveID;
    const promises = [
        API.getResourceByID("categories", categorie),
        isEffectiveMethod ? Promise.resolve(null) : API.getResourceByID("cards", method)
    ];

    try {
        const [ categorieData, methodData ] = await Promise.all(promises);
        
        const categorieName = categorieData["categorie-name"];
        const paymentMethod = isEffectiveMethod ? "Efectivo" : maskCardNumber(methodData["card-number"]);
        const paymentEntity = isEffectiveMethod ? null : methodData["card-entity"];

        return ({
            ...transaction,
            "transaction-categorie": categorieName,
            "transaction-method": paymentMethod,
            "transaction-entity": paymentEntity
        })
    } catch (error) {
        Alert.showAlert("error", "Ha ocurrido un error obteniendo las transacciones")
        setTimeout(() => window.location.reload(), 1500);
    }
}

async function loadTransactionForm() {
    try {
        const [cards, effective, categories] = await Promise.all([API.getResources("cards"), API.getResourceByID("effective", effectiveID), API.getResources("categories")]);
        
        //1. Show payment methods
        UI.cleanContainer(transactionMethodInput);

        //1.1 Effective
        const { ["effective-balance"]: effectiveBalance } = effective;
        if (effectiveBalance) {
            const effectiveOption = document.createElement("OPTION");
            effectiveOption.value = effectiveID;
            effectiveOption.textContent = "Efectivo";

            transactionMethodInput.appendChild(effectiveOption);
        }

        //1.2 Credit cards
        const cardOptGroup = document.createElement("OPTGROUP");
        cardOptGroup.label = "Tarjetas de Crédito";

        cards.forEach(card => {
            const { id, ["card-number"]: cardNumber, ["card-owner"]: cardOwner, ["card-entity"]: cardEntity } = card;

            const cardOption = document.createElement("OPTION");
            cardOption.value = id;
            cardOption.textContent = `${cardOwner}: ${cardEntity.toUpperCase()} - ${cardNumber}`;      
            
            cardOptGroup.appendChild(cardOption);
            transactionMethodInput.appendChild(cardOptGroup)
        })

        //2. Show categories
        UI.cleanContainer(transactionCategorieInput);

        categories.forEach(categorie => {
            const { id, ["categorie-name"]: categorieName } = categorie;

            const categorieOption = document.createElement("OPTION");
            categorieOption.value = id;
            categorieOption.textContent = categorieName;      
            
            transactionCategorieInput.appendChild(categorieOption)
        })

        //3. Open modal
        openModal("modal-transaction")
    } catch (error) {
        console.log(error)
        Alert.showAlert("error", "Hubo un error recopilando la información de la base de datos")
    }
}