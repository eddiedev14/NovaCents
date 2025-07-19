import { categorieForm, closeButtons, openModalsBtns, sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals, openModal } from "./modules/components/modal.js";
import { cleanForm, formSubmitHandler, isResourceUnique } from "./modules/components/form.js";
import API from "./modules/classes/API.js";

//* Event Listeners
document.addEventListener("DOMContentLoaded", initModals)
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Modals
openModalsBtns.forEach(btn => btn.addEventListener("click", (e) => openModal(e.target.dataset.modal)))

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