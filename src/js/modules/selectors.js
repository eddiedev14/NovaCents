//* Sidebar
export const sidebar = document.querySelector(".nav");
export const sidebarMenu = document.querySelector("#sidebar__menu")

//* Modal
export const openModalsBtns = document.querySelectorAll(".header__btn--modal")
export const modalsContainer = document.querySelector(".modals")

//* Credit card
export const creditCardsContainer = document.querySelector(".credit__cards");
export const addCreditCardContainer = document.querySelector(".credit__card--add")

//* Effective
export const effectiveCard = document.querySelector(".card__effective");
export const effectiveBalance = document.querySelector(".effective__balance");
export const effectiveModalTemplate = document.querySelector("#modal-effective-template");

//* Forms
export const cardForm = document.querySelector("#card-form");
export const categorieForm = document.querySelector("#categorie-form");
export const transactionForm = document.querySelector("#transaction-form")

export const closeButtons = document.querySelectorAll(".form__btn--close");

//* Card form
export const cardNumberInput = document.querySelector("#card-number");
export const cardOwnerInput = document.querySelector("#card-owner");
export const cardExpirationDateInput = document.querySelector("#card-expiration-date");
export const cardEntityInput = document.querySelector("#card-entity");
export const cardBalanceInput = document.querySelector("#card-balance");

//* Transactions form
export const openTransactionModalBtn = document.querySelector("#open-transaction-modal-btn");
export const transactionMethodInput = document.querySelector("#transaction-method");
export const transactionCategorieInput = document.querySelector("#transaction-categorie")
export const transactionAmountInput = document.querySelector("#transaction-amount");