import { closeButtons, creditBalanceInput, creditEntityInput, creditExpirationDateInput, creditNumberInput, creditOwnerInput, form, sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals, updateModalTexts } from "./modules/components/modal.js";
import { cleanForm, formatBalance, formatCardNumber, getFormData, validateExpirationDate } from "./modules/components/form.js";
import { generateID } from "./modules/utils.js";
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
form.addEventListener("submit", submitCreditCardForm)

//* Functions
async function submitCreditCardForm(e) {
    e.preventDefault();

    //Default validation
    const {data, isValid} = getFormData();
    if(!isValid) return;

    //Custom Validations
    const isExpirationDateValid = validateExpirationDate(data["card-expiration-date"]);
    if(!isExpirationDateValid) return;

    //Convert credit balance to integer
    data["card-balance"] = parseInt(data["card-balance"]);

    const card = {
        id: generateID(),
        ...data
    }

    //Add resource
    const isCardAdded = await API.addResource("cards", card, { resourceName: "tarjeta", modalId: "modal-credit-card" })
    if (!isCardAdded) return;

    //Get resources and show them
    UI.showCards();
}

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

    const modal = document.querySelector("#modal-credit-card");
    updateModalTexts("Tarjeta", "edit", modal)
    MicroModal.show("modal-credit-card")
}