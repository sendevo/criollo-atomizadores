import { getConstantRow } from "../../utils";
import { computeQNom } from "../API";
export const initialState = {
    id: null,
    timestamp: 0,
    name: 'S/N',
    nozzleData: [],
    selection: [-1,-1,-1,-1]
};

const getNozzleSelection = data => {
    // Dada la seleccion de varios picos, devuelve los indices de seleccion
    // para el menu de picos, si todos son iguales o el menu vacio en caso contrario.
    // Indices de seleccion de modelo de pico de cada pico seleccionado en la tabla
    const nozzleIndexes = data.filter(el => el.selected).map(el => el.selection); 
    const sel = getConstantRow(nozzleIndexes); // Determinar si son todos iguales
    return sel.length === 0 ? [-1,-1,-1,-1] : sel;
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_NOZZLE_CNT": // Cambiar cantidad de picos
            const cnt = parseInt(action.payload);
            if(cnt > 0 && cnt < 100){
                const nozzleData = new Array(cnt).fill(0).map(el => ({
                    selected: false,
                    selection: [-1,-1,-1,-1],
                    id: "",
                    long_name: "Sin pico",
                    valid: false,
                    Pnom: 3,
                    Qnom: 0,
                    img: ""
                }));
                return {
                    ...state,
                    nozzleData
                };
            } else {
                return state;
            }
        case "SET_SELECTED_ALL":{ // Seleccionar/deseleccionar todos
            const selected = action.payload;
            const nozzleData = state.nozzleData.map(el => ({...el,selected}));
            const selection = getNozzleSelection(data);
            return {...state, nozzleData, selection};
        }
        case "SET_NOZZLE_SELECTED": { // Seleccionar/deseleccionar un pico
            const {index, selected} = action.payload;
            const nozzleData = state.nozzleData.map((el, i) => {
                return i === index ? {...el, selected} : el;
            });
            const selection = getNozzleSelection(nozzleData);
            return {...state, nozzleData, selection};
        }
        case "SET_NOZZLE_MENU_VALUE": { // Cambiar valor de menu de picos
            return {...state, selection: action.payload};
        }        
        case "SET_NOZZLES": { // Configurar picos seleccionados
            const nozzle = action.payload;
            if(nozzle.id !== "custom") // Si es predefinido, calcular caudal nominal
                nozzle.Qnom = computeQNom(nozzle);
            const nozzleData = state.nozzleData.map( el => {
                return el.selected ? {...el, ...nozzle} : el;
            });
            return {
                ...state,
                nozzleData
            }            
        }
        default:
            return state;
    }
};