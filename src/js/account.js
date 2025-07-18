import { closeButtons, cardBalanceInput, cardEntityInput, cardExpirationDateInput, cardNumberInput, cardOwnerInput, cardForm, sidebar, sidebarMenu } from "./modules/selectors.js";
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
    UI.showEffective();
})

//* Sidebar
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Form
closeButtons.forEach(btn => btn.addEventListener("click", e => cleanForm(e.target.closest(".modal"))))

//* Card form
cardNumberInput.addEventListener("input", formatCardNumber)
cardBalanceInput.addEventListener("input", formatBalance)

cardForm.addEventListener("submit", (e) => {
    formSubmitHandler(e, {
        onAdd: async (resource) => await API.addResource("cards", resource, { resourceName: "tarjeta", modalId: "modal-card" }),
        onEdit: async (resource) => await API.editResource("cards", resource, { resourceName: "tarjeta", modalId: "modal-card" }),
        onSuccess: () => UI.showCards(),
        customValidations: [
            {
                field: "card-expiration-date",
                validate: isExpirationDateValid
            },
        ],
        integerFields: ["card-balance"],
        uniqueValidation: (resource, isEdit) => isCardUnique(resource, isEdit),
        modalID: "modal-card"
    })
})

//* Functions

//Function to display the information of the card selected in the form.
export async function showCardInForm(id) {
    const selectedCard = await API.getResourceByID("cards", id)
    if (!selectedCard) return;

    const { ["card-number"]: cardNumber, ["card-owner"]: cardOwner, ["card-expiration-date"]: cardExpirationDate, ["card-entity"]: cardEntity, ["card-balance"]: cardBalance } = selectedCard;

    cardForm.dataset.id = id;
    cardNumberInput.value = cardNumber;
    cardOwnerInput.value = cardOwner;
    cardExpirationDateInput.value = cardExpirationDate;
    cardEntityInput.value = cardEntity;
    cardBalanceInput.value = cardBalance;
    cardBalanceInput.setAttribute("readonly", "true")

    const modal = document.querySelector("#modal-card");
    updateModalTexts("Tarjeta", "edit", modal)
    MicroModal.show("modal-card")
}