import { creditNumberInput, sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals } from "./modules/components/modal.js";
import { formatCardNumber } from "./modules/utils.js";

//* Event Listeners
document.addEventListener("DOMContentLoaded", initModals)

//* Sidebar
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);

//* Form

