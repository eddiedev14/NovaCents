import { addCreditCardContainer, creditCardsContainer } from "../selectors.js";
import { formatThousands, getCardID } from "../utils.js";
import { showCardInForm } from "../../account.js";
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
                console.log("Eliminando...")
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