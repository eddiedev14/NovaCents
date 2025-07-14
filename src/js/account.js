import { creditBalanceInput, creditNumberInput, form, sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals } from "./modules/components/modal.js";
import { formatBalance, formatCardNumber, getFormData, validateExpirationDate } from "./modules/components/form.js";
import { generateID } from "./modules/utils.js";
import API from "./modules/classes/API.js";

//* Event Listeners
document.addEventListener("DOMContentLoaded", initModals)

//* Sidebar
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Form

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

}