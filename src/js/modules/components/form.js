import Alert from "../classes/Alert.js";
import { updateModalTexts } from "./modal.js";

export function getFormData(){
    const data = Object.fromEntries(new FormData(form))
    const isValid = Object.values(data).every(value => value !== "")
    if (!isValid) Alert.showAlert("error", "Todos los campos del formulario son obligatorios") 
    return { data, isValid };
}

export function cleanForm(modal) {
    const form = modal.querySelector("form");
    const modalResourceName = modal.dataset.resource;

    form.reset();

    if (form.getAttribute("data-id")) {
        form.removeAttribute("data-id");
        updateModalTexts(modalResourceName, "add", modal)
    }
}

//* Credit card

export function formatCardNumber(e) {
    const value = e.target.value.replace(/\D/g, ''); // Remove letters
    const groups = value.match(/.{1,4}/g); //Create an array with blocks of 4 digits
    e.target.value = groups ? groups.join(" ") : value;
}

export function formatBalance(e) {
    const formattedBalance = e.target.value.replace(/[^0-9]/g, ''); // Remove everything that is not a digit
    if (e.target.value !== formattedBalance) e.target.value = formattedBalance;
}

export function validateExpirationDate(expirationDate){
    //1. Validate expiration date format
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
        Alert.showAlert("error", "La fecha de expiración no cumple el formato esperado")
        return false;
    }

    //2. Compare expiration date with the current date
    const [monthStr, yearStr] = expirationDate.split("/");
    const month = parseInt(monthStr)
    const year = parseInt(yearStr)

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (currentYear > year || (currentYear === year && currentMonth > month)) {
        Alert.showAlert("error", "La tarjeta ingresada está vencida")
        return false;
    }

    return true;
}