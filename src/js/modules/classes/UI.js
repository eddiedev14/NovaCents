import MicroModal from "micromodal";
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
            const creditImage = document.createElement("IMG");
            creditImage.src = `/public/icons/${cardEntity}.svg`;
            creditImage.alt = "Payment method";

            //Subtitle
            const creditSubtitle = document.createElement("H5");
            creditSubtitle.classList.add("credit__subtitle");
            creditSubtitle.textContent = "Saldo";

            //Balance
            const creditBalance = document.createElement("H4");
            creditBalance.classList.add("credit__balance");
            creditBalance.textContent = `$${formatThousands(cardBalance)}`;

            //Credit number
            const creditNumber = document.createElement("SPAN");
            creditNumber.classList.add("credit__number");
            creditNumber.textContent = cardNumber;

            //* Credit bottom
            const creditBottom = document.createElement("DIV");
            creditBottom.classList.add("credit__bottom");

            //First column
            const firstCreditColumn = document.createElement("DIV");
            firstCreditColumn.classList.add("credit__column");
            
            const firstColumnTitle = document.createElement("H5");
            firstColumnTitle.classList.add("column__title");
            firstColumnTitle.textContent = "NOMBRE";

            const firstColumnValue = document.createElement("strong");
            firstColumnValue.classList.add("column__value");
            firstColumnValue.textContent = cardOwner;

            firstCreditColumn.appendChild(firstColumnTitle);
            firstCreditColumn.appendChild(firstColumnValue);

            //Second column
            const secondCreditColumn = document.createElement("DIV");
            secondCreditColumn.classList.add("credit__column");
            
            const secondColumnTitle = document.createElement("H5");
            secondColumnTitle.classList.add("column__title");
            secondColumnTitle.textContent = "FECHA EXPIRACIÓN";

            const secondColumnValue = document.createElement("strong");
            secondColumnValue.classList.add("column__value");
            secondColumnValue.textContent = cardExpirationDate;

            secondCreditColumn.appendChild(secondColumnTitle);
            secondCreditColumn.appendChild(secondColumnValue);

            //Add columns to the credit bottom div
            creditBottom.appendChild(firstCreditColumn)
            creditBottom.appendChild(secondCreditColumn)

            //* Edit button
            const editBtn = document.createElement("BUTTON");
            editBtn.type = "button";
            editBtn.classList.add("credit__button");
            editBtn.ariaLabel = "Edit credit card";
            editBtn.onclick = e => {
                const cardID = getCardID(e.target);
                showCardInForm(cardID)
            }

            const editIcon = document.createElement("I");
            editIcon.classList.add("ri-pencil-fill");

            editBtn.appendChild(editIcon)

            //* Add elements to article
            article.appendChild(creditImage)
            article.appendChild(creditSubtitle)
            article.appendChild(creditBalance)
            article.appendChild(creditNumber)
            article.appendChild(creditBottom)
            article.appendChild(editBtn)

            //* Add credit card to DOM
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