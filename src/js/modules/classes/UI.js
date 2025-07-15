import { effectiveID } from "../variables.js";
import MicroModal from "micromodal";
import { addCreditCardContainer, creditCardsContainer, effectiveBalance, effectiveCard, effectiveModalTemplate, modalsContainer } from "../selectors.js";
import { formatThousands, getCardID } from "../utils.js";
import { formatBalance, formSubmitHandler } from "../components/form.js";
import { showCardInForm } from "../../account.js";
import Alert from "./Alert.js";
import API from "./API.js";

class UI{
    async showCards(){
        const cards = await API.getResources("cards");

        //Clean the credit cards container
        this.cleanContainer(creditCardsContainer)
        
        cards.forEach(card => {
            const {id, ["card-number"]: cardNumber, ["card-owner"]: cardOwner, ["card-expiration-date"]: cardExpirationDate, ["card-entity"]: cardEntity, ["card-balance"]: cardBalance} = card;

            //* Create card structure

            //Article
            const article = document.createElement("ARTICLE");
            article.classList.add("credit__card", `credit__card--${cardEntity}`);
            article.dataset.id = id;

            //Entity Logo
            const cardImage = document.createElement("IMG");
            cardImage.src = `/public/icons/${cardEntity}.svg`;
            cardImage.alt = "Payment method";

            //Subtitle
            const cardSubtitle = document.createElement("H5");
            cardSubtitle.classList.add("card__subtitle");
            cardSubtitle.textContent = "Saldo";

            //Balance
            const cardBalanceText = document.createElement("H4");
            cardBalanceText.classList.add("card__balance");
            cardBalanceText.textContent = `$${formatThousands(cardBalance)}`;

            //cards number
            const cardNumberText = document.createElement("SPAN");
            cardNumberText.classList.add("card__number");
            cardNumberText.textContent = cardNumber;

            //* cards bottom
            const cardBottom = document.createElement("DIV");
            cardBottom.classList.add("card__bottom");

            //First column
            const firstcardColumn = document.createElement("DIV");
            firstcardColumn.classList.add("card__column");
            
            const firstColumnTitle = document.createElement("H5");
            firstColumnTitle.classList.add("column__title");
            firstColumnTitle.textContent = "NOMBRE";

            const firstColumnValue = document.createElement("strong");
            firstColumnValue.classList.add("column__value");
            firstColumnValue.textContent = cardOwner;

            firstcardColumn.appendChild(firstColumnTitle);
            firstcardColumn.appendChild(firstColumnValue);

            //Second column
            const secondcardColumn = document.createElement("DIV");
            secondcardColumn.classList.add("card__column");
            
            const secondColumnTitle = document.createElement("H5");
            secondColumnTitle.classList.add("column__title");
            secondColumnTitle.textContent = "FECHA EXPIRACIÓN";

            const secondColumnValue = document.createElement("strong");
            secondColumnValue.classList.add("column__value");
            secondColumnValue.textContent = cardExpirationDate;

            secondcardColumn.appendChild(secondColumnTitle);
            secondcardColumn.appendChild(secondColumnValue);

            //Add columns to the cards bottom div
            cardBottom.appendChild(firstcardColumn)
            cardBottom.appendChild(secondcardColumn)

            //* Buttons
            const cardButtons = document.createElement("DIV");
            cardButtons.classList.add("card__buttons")

            //* Edit button
            const editBtn = document.createElement("BUTTON");
            editBtn.type = "button";
            editBtn.classList.add("card__button");
            editBtn.ariaLabel = "Edit card";
            editBtn.onclick = e => {
                const cardID = getCardID(e.target);
                showCardInForm(cardID)
            }

            const editIcon = document.createElement("I");
            editIcon.classList.add("ri-pencil-fill");

            editBtn.appendChild(editIcon)

            //* Delete button
            const deleteBtn = document.createElement("BUTTON");
            deleteBtn.type = "button";
            deleteBtn.classList.add("card__button");
            deleteBtn.ariaLabel = "Delete card";
            deleteBtn.onclick = e => {
                const cardID = getCardID(e.target);
                Alert.showConfirmationAlert("cards", "tarjeta", cardID, () => this.showCards())
            }

            const deleteIcon = document.createElement("I");
            deleteIcon.classList.add("ri-delete-bin-7-fill");

            deleteBtn.appendChild(deleteIcon)

            cardButtons.appendChild(editBtn)
            cardButtons.appendChild(deleteBtn)

            //* Add elements to article
            article.appendChild(cardImage)
            article.appendChild(cardSubtitle)
            article.appendChild(cardBalanceText)
            article.appendChild(cardNumberText)
            article.appendChild(cardBottom)
            article.appendChild(cardButtons)

            //* Add cards card to DOM
            creditCardsContainer.insertBefore(article, addCreditCardContainer)
        });
    }

    async showEffective(){
        const effective = await API.getResourceByID("effective", effectiveID);
        const balance = effective["effective-balance"];
        const isEditable = balance == null;
        
        if (!isEditable) {  
            effectiveBalance.textContent = `$${formatThousands(balance)}`;

            //Remove modal and edit btn
            const effectiveModal = document.querySelector("#modal-effective");
            const editBtn = document.querySelector(".effective__edit");

            if (effectiveModal && editBtn){
                effectiveModal.remove();
                editBtn.remove();
            }

            return;
        }

        effectiveBalance.textContent = "SIN EDITAR";

        //Edit button
        const editBtn = document.createElement("BUTTON");
        editBtn.type = "button";
        editBtn.classList.add("effective__edit");
        editBtn.ariaLabel = "Edit effective";
        editBtn.onclick = e => {
            MicroModal.show("modal-effective");
        }

        const editIcon = document.createElement("I");
        editIcon.classList.add("ri-pencil-fill");

        editBtn.appendChild(editIcon)
        effectiveCard.appendChild(editBtn)

        //Modal Template
        const effectiveModal = effectiveModalTemplate.content.cloneNode(true);
        modalsContainer.appendChild(effectiveModal)

        //Add close event to reset the form
        const effectiveForm = document.querySelector("#modal-effective-content form");
        const closeBtn = effectiveForm.querySelector(".form__btn--close");
        closeBtn.addEventListener("click", () => effectiveForm.reset())

        //Add balance input event
        const balanceInput = effectiveForm.querySelector("#effective-balance");
        balanceInput.addEventListener("input", formatBalance)

        //Add submit event
        effectiveForm.addEventListener("submit", (e) => {
            formSubmitHandler(e, {
                onEdit: async (resource) => await API.editResource("effective", resource, { resourceName: "efectivo", modalId: "modal-effective" }),
                onSuccess: () => this.showEffective(),
                integerFields: ["effective-balance"],
                modalID: "modal-effective"
            })
        })
    }

    cleanContainer(container){
        const children = Array.from(container.children);
        for (const child of children) {
            if (!child.classList.contains("credit__card--add")) {
                child.remove();
            }
        }
    }
}

export default new UI();