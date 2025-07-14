import MicroModal from "micromodal";
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
            MicroModal.close(modalId)
            return true;
        } catch (error) {
            Alert.showAlert("error", "Ha ocurrido un error mientras se añadía el registro")
        }
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
}

export default new API();