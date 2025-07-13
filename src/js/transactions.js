import { sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";
import { initModals } from "./modules/components/modal.js";

//Event Listeners
document.addEventListener("DOMContentLoaded", initModals)
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);