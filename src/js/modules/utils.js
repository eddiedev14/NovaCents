export function generateID(){
    return Date.now() + Math.random().toString(36).substring(2, 8);
}

export function formatThousands(balance) {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function getCardID(element){
  return element.closest(".credit__card").dataset.id;
}

export const maskCardNumber = (number) => `**** ${number.replace(/\s+/g, '').slice(-4)}`