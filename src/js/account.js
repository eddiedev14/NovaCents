import { creditNumberInput, form, sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals } from "./modules/components/modal.js";
import { formatCardNumber, getFormData, validateExpirationDate } from "./modules/utils.js";
import API from "./modules/classes/API.js";

//* Event Listeners
document.addEventListener("DOMContentLoaded", initModals)

//* Sidebar
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Form

//* Credit card form
form.addEventListener("submit", submitCreditCardForm)
creditNumberInput.addEventListener("input", formatCardNumber)

//* Functions
async function submitCreditCardForm(e) {
    e.preventDefault();

    //Default validation
    const {data, isValid} = getFormData();
    if(!isValid) return;

    const isExpirationDateValid = validateExpirationDate(data["card-expiration-date"]);
    if(!isExpirationDateValid) return;

    const id = Date.now() + Math.random().toString(36).substring(2, 8);
    const card = {
        id,
        ...data,
    }

    const isCardAdded = await API.addResource("cards", card, { resourceName: "tarjeta", modalId: "modal-credit-card" })
    if (!isCardAdded) return;

    //Método para obtener los recursos
}