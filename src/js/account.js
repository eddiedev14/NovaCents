import { closeButtons, cardBalanceInput, cardEntityInput, cardExpirationDateInput, cardNumberInput, cardOwnerInput, cardForm, sidebar, sidebarMenu, openModalsBtns } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals, openModal, openModalTrigger, updateModalTexts } from "./modules/components/modal.js";
import { cleanForm, formatBalance, formatCardNumber, formSubmitHandler, isExpirationDateValid, isResourceUnique } from "./modules/components/form.js";
import API from "./modules/classes/API.js";
import UI from "./modules/classes/UI.js";

//* Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
    initModals();
    UI.showCards();
    UI.showEffective();
})

//* Sidebar
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Modals
openModalsBtns.forEach(btn => btn.addEventListener("click", openModalTrigger))

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
        uniqueValidation: (resource, isEdit) => isResourceUnique(resource, ["card-number", "card-entity"], "cards", "tarjeta", isEdit),
        modalID: "modal-card"
    })
})