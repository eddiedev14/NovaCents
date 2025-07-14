import { creditNumberInput, form, sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals } from "./modules/components/modal.js";
import { formatCardNumber, getFormData, validateExpirationDate } from "./modules/utils.js";

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
function submitCreditCardForm(e) {
    e.preventDefault();

    //Default validation
    const {data, isValid} = getFormData();
    if(!isValid) return

    const isExpirationDateValid = validateExpirationDate(data["card-expiration-date"]);
    if(!isExpirationDateValid) return
}