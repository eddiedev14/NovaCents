export function generateID(){
    return Date.now() + Math.random().toString(36).substring(2, 8);
}