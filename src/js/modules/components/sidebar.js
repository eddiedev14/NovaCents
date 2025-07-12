import { sidebar } from "../selectors";

export function openSidebar() {
    sidebar.classList.add("visible");
    sidebar.focus()
}

export function closeSidebar(e) {
    const newFocus = e.relatedTarget;
    
    if (!sidebar.contains(newFocus)) {
        sidebar.classList.remove("visible")
    }
}