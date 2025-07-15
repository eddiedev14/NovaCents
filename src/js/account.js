import { closeButtons, creditBalanceInput, creditEntityInput, creditExpirationDateInput, creditNumberInput, creditOwnerInput, form, sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals, updateModalTexts } from "./modules/components/modal.js";
import { cleanForm, formatBalance, formatCardNumber, formSubmitHandler, isCardUnique, isExpirationDateValid } from "./modules/components/form.js";
import API from "./modules/classes/API.js";
import UI from "./modules/classes/UI.js";
import MicroModal from "micromodal";

//* Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
    initModals();
    UI.showCards();
})

//* Sidebar
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Form
closeButtons.forEach(btn => btn.addEventListener("click", e => cleanForm(e.target.closest(".modal"))))

//* Credit card form
creditNumberInput.addEventListener("input", formatCardNumber)
creditBalanceInput.addEventListener("input", formatBalance)

form.addEventListener("submit", (e) => {
    formSubmitHandler(e, {
        onAdd: async (resource) => await API.addResource("cards", resource, { resourceName: "tarjeta", modalId: "modal-credit-card" }),
        onEdit: async (resource) => await API.editResource("cards", resource, { resourceName: "tarjeta", modalId: "modal-credit-card" }),
        onSuccess: () => UI.showCards(),
        customValidations: [
            {
                field: "card-expiration-date",
                validate: isExpirationDateValid
            },
        ],
        integerFields: ["card-balance"],
        uniqueValidation: (resource, isEdit) => isCardUnique(resource, isEdit),
        modalID: "modal-credit-card"
    })
})

//* Functions

//Function to display the information of the card selected in the form.
export async function showCardInForm(id) {
    const selectedCard = await API.getResourceByID("cards", id)
    if (!selectedCard) return;

    const { ["card-number"]: cardNumber, ["card-owner"]: cardOwner, ["card-expiration-date"]: cardExpirationDate, ["card-entity"]: cardEntity, ["card-balance"]: cardBalance } = selectedCard;

    form.dataset.id = id;
    creditNumberInput.value = cardNumber;
    creditOwnerInput.value = cardOwner;
    creditExpirationDateInput.value = cardExpirationDate;
    creditEntityInput.value = cardEntity;
    creditBalanceInput.value = cardBalance;
    creditBalanceInput.setAttribute("readonly", "true")

    const modal = document.querySelector("#modal-credit-card");
    updateModalTexts("Tarjeta", "edit", modal)
    MicroModal.show("modal-credit-card")
}