import 'notyf/notyf.min.css';
import { Notyf } from "notyf";

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
}

export default new Alert();