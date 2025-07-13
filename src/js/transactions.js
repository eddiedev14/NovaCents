import { sidebar, sidebarMenu } from "./modules/selectors.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";

//Event Listeners
sidebarMenu.addEventListener("click", openSidebar);
sidebar.addEventListener("focusout", closeSidebar);