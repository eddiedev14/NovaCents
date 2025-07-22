import Alert from "../classes/Alert.js";
import API from "../classes/API.js";
import { generateID } from "../utils.js";
import { effectiveID } from "../variables.js";
import { updateModalTexts } from "./modal.js";

export function getFormData(form){
    const data = Object.fromEntries(new FormData(form))
    const isValid = Object.values(data).every(value => value !== "")
    if (!isValid) Alert.showAlert("error", "Todos los campos del formulario son obligatorios") 
    return { data, isValid };
}

export async function formSubmitHandler(e, { onAdd, onEdit, onSuccess, customValidations = [], integerFields = [], uniqueValidation, modalID }){
    e.preventDefault();

    const form = e.target;

    //1. Default validation (All fields are required)
    const {data, isValid} = getFormData(form);
    if(!isValid) return;

    //2. Parse integer fields
    integerFields.forEach(field => data[field] = parseInt(data[field]))

    //3. Custom validations
    for (const validation of customValidations) {
        const { field, validate } = validation;
        const isValid = validate(data[field])
        if (!isValid) return
    }

    //4. Define whether you are adding or editing
    const isEdit = !!form.dataset.id;
    const resourceID = form.dataset.id || generateID();  

    //5. Create resource
    const resource = {
        id: resourceID,
        ...data
    }

    //6. Validate if it is unique
    if (uniqueValidation) {
        const isValid = await uniqueValidation(resource, isEdit);
        if (!isValid) return;
    }

    //7. Run form action
    const success = isEdit ? await onEdit(resource) : await onAdd(resource);
    if (!success) return;

    //8. Get resources and show them
    if(onSuccess) onSuccess();

    //9. Reset form
    const modal = document.querySelector(`#${modalID}`);
    cleanForm(modal)
}

export function cleanForm(modal) {
    const modalResourceName = modal.dataset.resource;
    if (modalResourceName === "Efectivo") return; // Return if it's effective
    
    const form = modal.querySelector("form");
    form.reset();

    if (form.getAttribute("data-id")) {
        form.removeAttribute("data-id");
        form.querySelectorAll("input[readonly]").forEach(input => input.removeAttribute("readonly"))
        updateModalTexts(modalResourceName, "add", modal)
    }
}

//* Unique Validation

export async function isResourceUnique(data, uniqueFields, resource, resourceName, isEdit){
    const fieldsToCheck = {};
    uniqueFields.forEach(field => fieldsToCheck[field] = data[field]) //Add unique fields to object
    
    const results = await API.getResourceByFields(resource, fieldsToCheck);
    if (!results) return false;

    const duplicate = isEdit ? results.some(resource => resource.id !== data.id) : results.length > 0;
    if (duplicate) Alert.showAlert("error", `La ${resourceName} ingresada ya existe`);

    return !duplicate;
}

//* Card

export function formatCardNumber(e) {
    const value = e.target.value.replace(/\D/g, ''); // Remove letters
    const groups = value.match(/.{1,4}/g); //Create an array with blocks of 4 digits
    e.target.value = groups ? groups.join(" ") : value;
}

export function formatBalance(e) {
    const formattedBalance = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, ''); // Remove non-numeric characters and leading zeros
    if (e.target.value !== formattedBalance) e.target.value = formattedBalance;
}

export function isExpirationDateValid(expirationDate){
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

//* Transaction

export async function validateAndGetBalance(transactionMethodID, transactionType, transactionAmount) {
    //1. Get the balance of the selected payment method
    const paymentMethod = transactionMethodID === effectiveID ? await API.getResourceByID("effective", effectiveID) : await API.getResourceByID("cards", transactionMethodID);
    const balance = paymentMethod["effective-balance"] || paymentMethod["card-balance"];

    //2. Compare balance with transaction amount    
    if (balance < transactionAmount && transactionType === "expense") {
        Alert.showAlert("error", "Saldo insuficiente para completar la transacción.")
        return null;
    }

    return balance;
}