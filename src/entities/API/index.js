const round2 = x => Math.round(x*100)/100;
const isString = value => (typeof value === 'string' || value instanceof String) && value !== "";
// const isInteger = Number.isInteger;
//const isPositiveInteger = value => Number.isInteger(value) && value > 0;
//const isFloat = Number.isFinite;
const isPositiveFloat = value => Number.isFinite(value) && value > 0;

const schemas = { // Esquemas de validación de parametros
    computeQNom:{
        b: Number.isFinite,
        c: Number.isFinite,
        Pnom: Number.isFinite
    },
    computeAirFlow:{
        D: isPositiveFloat,
        h: isPositiveFloat,
        Vt: Number.isFinite,
        F: Number.isFinite
    },
    computeVaFromTRV:{
        D: isPositiveFloat,
        r: isString,
        h: isPositiveFloat,
        w: isPositiveFloat,
        gI: isPositiveFloat,
    },
    computeSuppliesList: {
        A: isPositiveFloat,
        T: isPositiveFloat,
        Va: isPositiveFloat,
        products: v => v?.length > 0 && v.every(x => isPositiveFloat(x.dose) && isString(x.name) && Number.isInteger(x.presentation))
    }
};

// Validación de lista de parametros 
const validate = (schema, object) => Object.keys(schema)
    .filter(key => object ? !schema[key](object[key]) : false)
    .map(key => key);

const parameterNames = { // Nombres de los parametros para mostrar en mensajes de error
    Qnom: "Caudal nominal",
    Pnom: "Presión nominal",
    Qb: "Caudal de bomba",
    D: "Distancia entre filas",
    h: "Altura de plantas",
    w: "Ancho de plantas",
    gI: "Índice verde",
    F: "Índice de expansión",
    r: "Forma de planta",
    Pt: "Presión de trabajo",
    Va: "Volumen de aplicación",
    Vt: "Velocidad de trabajo",
    c: "Volumen recolectado",
    tms: "Tiempo de muestreo",
    A: "Superficie de trabajo", 
    T: "Capacidad del tanque", 
    products: "Lista de productos"
};

const getParameterNames = paramList => paramList.map(key => parameterNames[key]).join(", ");

const checkParams = (schema, params) => { // Valida parametros y genera mensaje de error
    const wrongKeys = validate(schema, params);
    if(wrongKeys.length > 0) 
        throw new Error(`Parámetros incorrectos: ${getParameterNames(wrongKeys)}`);
};

export const presentationUnits = [
    "ml/ha", // 0
    "gr/ha", // 1
    "ml/100l", // 2
    "gr/100l" // 3
];

const plantFormIndex = {
    type_a: 735.9,
    type_b: 937,
    type_c: 468.5
};

export const computeQNom = params => {
    checkParams(schemas.computeQNom, params);
    const {b, c, Pnom} = params;
    return round2(b + c * Math.sqrt(Pnom));
};

export const computeAirFlow = params => {
    checkParams(schemas.computeAirFlow, params);
    const {D, h, Vt, F} = params;
    return round2(Vt * D * h / F * 1000);
};

export const computeVaFromTRV = params => {
    checkParams(schemas.computeVaFromTRV, params);
    const {D, r, h, w, gI} = params;
    const rk = plantFormIndex[r];
    return round2(rk * h * w * gI / D);
};

const computeProductVolume = (prod, vol, Va) => { // Cantidad de insumo (gr o ml) por volumen de agua
    return prod.presentation === 0 || prod.presentation === 1 ? vol*prod.dose/Va : vol*prod.dose/100;
};

export const computeSuppliesList = params => { // Lista de insumos y cargas para mezcla   
    checkParams(schemas.computeSuppliesList, params);
    const { A, T, Va, products } = params;
    const Nc = A*Va/T; // Cantidad de cargas
    const Ncc = Math.floor(Nc); // Cantidad de cargas completas
    const Vf = (Nc - Ncc)*T; // Volumen fraccional [L]
    const Ncb = Math.ceil(Nc); // Cantidad de cargas balanceadas
    const Vcb = A*Va/Ncb; // Volumen de cargas balanceadas
    const Vftl = Vf/T < 0.2; // Detectar volumen fraccional total menor a 20%
    // Calcular cantidades de cada producto
    const pr = products.map(p => ({
        ...p, // Por comodidad, dejar resto de los detalles en este arreglo
        cpp: computeProductVolume(p, T, Va)/1000, // Cantidad por carga completa [l o kg]
        cfc: computeProductVolume(p, Vf, Va)/1000, // Cantidad por carga fraccional [l o kg]
        ceq: computeProductVolume(p, Vcb, Va)/1000, // Cantidad por carga equilibrada [l o kg]
        total: computeProductVolume(p, T, Va)*Nc/1000, // Cantidad total de insumo [l o kg]
    }));

    return {pr, Nc, Ncc, Vf, Ncb, Vcb, Vftl};
};