import { effectiveID } from "./modules/variables.js";
import { categorieForm, closeButtons, openModalsBtns, openTransactionModalBtn, sidebar, sidebarMenu, transactionCategorieInput, transactionMethodInput } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals, openModal, openModalTrigger } from "./modules/components/modal.js";
import { cleanForm, formSubmitHandler, isResourceUnique } from "./modules/components/form.js";
import API from "./modules/classes/API.js";
import Alert from "./modules/classes/Alert.js";

//* Event Listeners
document.addEventListener("DOMContentLoaded", initModals)
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

//* Functions

async function loadTransactionForm() {
    try {
        const [cards, effective, categories] = await Promise.all([API.getResources("cards"), API.getResourceByID("effective", effectiveID), API.getResources("categories")]);
        
        //1. Show payment methods

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