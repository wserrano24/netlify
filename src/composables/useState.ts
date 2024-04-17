// store.js
import { ref, reactive } from 'vue';

// Un objeto simple para almacenar nuestros estados por nombre.
const stateRegistry:any = reactive({});

// La función `useState` para acceder y almacenar estados reactivos.
export function useState(key:string, initialValue:any = null) {
  // Si el estado ya existe, simplemente lo devolvemos.
  if (stateRegistry[key]) {
    return stateRegistry[key];
  }

  // Si el estado no existe, lo creamos y lo almacenamos.
  const stateValue = initialValue instanceof Function ? initialValue() : initialValue;
  const state = ref(stateValue);
  stateRegistry[key] = state;
  
  return state;
}