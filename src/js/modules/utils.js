import { form } from "./selectors.js";
import Alert from "./classes/Alert.js";

export function formatCardNumber(e) {
    const value = e.target.value.replace(/\D/g, ''); // Remove letters
    const groups = value.match(/.{1,4}/g); //Create an array with blocks of 4 digits
    e.target.value = groups ? groups.join(" ") : value;
}

export function generateID(){
    return Date.now() + Math.random().toString(36).substring(2, 8);
}

//* Form Validations

export function getFormData(){
    const data = Object.fromEntries(new FormData(form))
    const isValid = Object.values(data).every(value => value !== "")
    if (!isValid) Alert.showAlert("error", "Todos los campos del formulario son obligatorios") 
    return { data, isValid };
}

//* Credit Card

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