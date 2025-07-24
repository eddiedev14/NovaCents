import pdfmake from 'pdfmake';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-responsive-dt';
import { formatTableTransactions } from '../../transactions.js';
 
DataTable.Buttons.pdfMake(pdfmake);

export async function initDatatable() {
    const transactions = await formatTableTransactions(); 

    const table = new DataTable("#transactions-table", {
        data: transactions,
        columns: [
            { 
                title: "Nombre",
                data: null,
                render: (row) => {
                    return `<h6 class="transaction__name">${row["transaction-name"]}</h6>
                            <span class="transaction__description">${row["transaction-description"]}</span>`
                }
            },
            { 
                title: "Medio",
                data: null,
                render: (row) => {
                    if (row["transaction-method"] === "Efectivo") {
                        return `<h6 class="transaction__method">Efectivo</h6>`   
                    }

                    return `<h6 class="transaction__entity">${row["transaction-entity"].toUpperCase()}</h6>
                            <span class="transaction__number">${row["transaction-method"]}</span>`
                }
            },
            { 
                title: "Tipo",
                data: null,
                render: (row) => {
                    return `<h6 class="transaction__type transaction__type--${row["transaction-type"]}">${row["transaction-type"] === "expense" ? "Gasto" : "Ingreso"}</h6>`
                }
            },
            { data: "transaction-categorie", title: "Categoría" },
            { data: "transaction-amount", title: "Monto" },
            { data: "transaction-date", title: "Fecha" },
            { 
                title: "Acciones",
                data: null,
                render: (row) => {
                    return `<div class="transactions__actions">
                                <button class="transaction__action transaction__action--edit"><i class="ri-pencil-fill"></i></button>
                                <button class="transaction__action transaction__action--edit"><i class="ri-delete-bin-7-fill"></i></button>
                            </div>`
                }
            }
        ],
        layout: {
            topStart: "pageLength",
            topEnd: ["search", "buttons"]
        },
        buttons: [
            {
                extend: 'pdfHtml5',
                text: '<i class="ri-file-pdf-2-fill"></i>',
                className: 'transaction__pdf'
            }
        ],
        language: {
            url: "/src/js/json/datatables-spanish.json"
        }
    })
}