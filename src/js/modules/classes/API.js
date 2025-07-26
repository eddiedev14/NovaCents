import { effectiveID } from "../variables.js";
import { closeModal } from "../components/modal.js";
import { validateAndGetBalance } from "../components/form.js";
import { addSingleTransctionToTable } from "../components/datatable.js";
import Alert from "./Alert.js";

class API{
    constructor(){
        this.resourcesURL = {
            cards: "http://localhost:3000/cards",
            effective: "http://localhost:3000/effective",
            categories: "http://localhost:3000/categories",
            transactions: "http://localhost:3000/transactions"
        }
    }

    async addResource(resource, object, { resourceName, modalId }){
        try {
            const res = await fetch(this.resourcesURL[resource], {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(object)
            });
            
            if (!res.ok) throw new Error("Petición rechazada por el servidor");

            Alert.showAlert("success", `La ${resourceName} ha sido añadida correctamente`);
            closeModal(modalId)
            return true;
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error mientras se añadía el registro")
        }
    }

    async addTransaction(object){
        //1. Validate if the balance is enough
        const { id, ["transaction-method"]: methodID, ["transaction-type"]: type, ["transaction-amount"]: amount } = object;
        const balance = await validateAndGetBalance(methodID, type, amount) 
        if (!balance) return false;

        //2. Calculate the updated balance
        const updatedBalance = type === "expense" ? balance - amount : balance + amount;
        
        //3. Add transaction to the database
        const transactionAdded = this.addResource("transactions", object, { resourceName: "transacción", modalId: "modal-transaction" });
        if (!transactionAdded) return false;

        //4. Update payment method balance
        const paymentMethodURL = methodID === effectiveID ? `${this.resourcesURL["effective"]}/${methodID}` : `${this.resourcesURL["cards"]}/${methodID}`;
        const fieldsToUpdate = {
            [methodID === effectiveID ? "effective-balance" : "card-balance"]: updatedBalance
        };

        try {
            const res = await fetch(paymentMethodURL, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fieldsToUpdate)
            });
            
            if (!res.ok) throw new Error("Petición rechazada por el servidor");
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error mientras se actualizaba el registro del método de pago. La transacción no ha sido registrada")
            this.deleteResource("transactions", "transaction", id)
            return false;
        }

        //5. Close Modal
        closeModal("modal-transaction")

        //6. Update datatable
        addSingleTransctionToTable(object)

        return true;
    }

    async getResources(resource){
        try {
            const res = await fetch(this.resourcesURL[resource]);
            if (!res.ok) throw new Error("Petición rechazada por el servidor");

            const resources = await res.json();
            return resources;
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error obteniendo los registros")
            window.location.reload()
        }
    }

    async getResourceByID(resource, id){
        try {
            const res = await fetch(`${this.resourcesURL[resource]}/${id}`);
            if (!res.ok) throw new Error("Petición rechazada por el servidor");

            const selectedResource = await res.json();
            return selectedResource;
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error obteniendo el registro seleccionado")
        }
    }

    async getResourceByFields(resource, query = {}) {
        try {
            const queryString = new URLSearchParams(query).toString();
            const res = await fetch(`${this.resourcesURL[resource]}?${queryString}`);
            if (!res.ok) throw new Error("Petición rechazada por el servidor");

            const results = await res.json();
            return results;
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error obteniendo los datos solicitados");
        }
    }

    async editResource(resource, object, { resourceName, modalId }){
        try {
            const { id } = object;

            const res = await fetch(`${this.resourcesURL[resource]}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(object)
            });
            
            if (!res.ok) throw new Error("Petición rechazada por el servidor");

            const message = resourceName !== "efectivo" ? `La ${resourceName} ha sido actualizada correctamente` : "El saldo en efectivo ha sido actualizado correctamente"
            Alert.showAlert("success", message);
            closeModal(modalId)
            return true;
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error mientras se actualizaba el registro")
        }
    }

    async deleteResource(resource, resourceName, id){
        try {
            const res = await fetch(`${this.resourcesURL[resource]}/${id}`, {
                method: "DELETE",
            });
            
            if (!res.ok) throw new Error("Petición rechazada por el servidor");

            Alert.showAlert("success", `La ${resourceName} ha sido eliminada correctamente`);
            return true;
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error mientras se eliminaba el registro")
        }
    }
}

export default new API();