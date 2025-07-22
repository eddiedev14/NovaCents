import MicroModal from "micromodal";

export function initModals() {
    MicroModal.init()
}

export function openModal(modalID) {
    MicroModal.show(modalID)
}

export function openModalTrigger(e){
    const target = e.target;
    const modal = target.dataset.modal ? target : target.closest("[data-modal]");
    const modalID = modal.dataset.modal;
    openModal(modalID)
} 

export function closeModal(modalID){
    MicroModal.close(modalID)
} 

export function updateModalTexts(resourceName, action, modal){
    const modalTitle = modal.querySelector(".modal__title");
    const modalSubmitBtn = modal.querySelector(".form__btn--submit")

    modalTitle.textContent = action === "edit" ? `Editar ${resourceName}` : `Añadir ${resourceName}`;
    modalSubmitBtn.textContent = action === "edit" ? `Guardar Cambios` : `Añadir ${resourceName}`;
}