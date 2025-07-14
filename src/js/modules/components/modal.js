import MicroModal from "micromodal";

export function initModals() {
    MicroModal.init()
}

export function updateModalTexts(resourceName, action, modal){
    const modalTitle = modal.querySelector(".modal__title");
    const modalSubmitBtn = modal.querySelector(".form__btn--submit")

    modalTitle.textContent = action === "edit" ? `Editar ${resourceName}` : `Añadir ${resourceName}`;
    modalSubmitBtn.textContent = action === "edit" ? `Guardar Cambios` : `Añadir ${resourceName}`;
}