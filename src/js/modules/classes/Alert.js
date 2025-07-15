import 'notyf/notyf.min.css';
import { Notyf } from "notyf";
import Swal from 'sweetalert2';
import API from './API.js';

class Alert {
    constructor(){
        this.notyf = new Notyf({
            position: {x:'right',y:'top'}
        });
    }

    showAlert(type, message){
        if (type === "success") {
            this.notyf.success(message);
        }else if (type === "error") {
            this.notyf.error(message)
        }
    }

    showConfirmationAlert(resource, resourceName, id, onSuccess){
        Swal.fire({
            title: "¡Cuidado!",
            text: `¿Estás seguro de que deseas eliminar la ${resourceName} seleccionada?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: `Eliminar ${resourceName}`,
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await API.deleteResource(resource, resourceName, id)
                if (!success) return;

                onSuccess();
            }
        });
    }
}

export default new Alert();